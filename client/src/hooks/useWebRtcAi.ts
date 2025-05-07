import { useRef, useCallback, useState, useEffect } from 'react';

export interface VoiceTranscription {
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
}

interface DataChannelMessage {
    type: string;
    content?: string;
    role?: string;
    [key: string]: any;
}

const useWebRtcAi = () => {
    const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
    const mediaStreamRef = useRef<MediaStream | null>(null);
    const dataChannelRef = useRef<RTCDataChannel | null>(null);
    const audioElementRef = useRef<HTMLAudioElement | null>(null);

    const [isConnecting, setIsConnecting] = useState(false);
    const [isConnected, setIsConnected] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isListening, setIsListening] = useState(false);
    const [transcription, setTranscription] = useState<VoiceTranscription[]>([]);

    const onNewTranscription = useRef<(message: VoiceTranscription) => void>(() => { });

    const setTranscriptionCallback = useCallback((callback: (message: VoiceTranscription) => void) => {
        onNewTranscription.current = callback;
    }, []);

    // Send text message to be spoken by AI
    const sendTextMessage = useCallback((text: string) => {
        if (!dataChannelRef.current || dataChannelRef.current.readyState !== 'open') {
            console.error("Data channel not available or not open");
            return false;
        }

        try {
            const message = {
                type: "text",
                text: text
            };
            dataChannelRef.current.send(JSON.stringify(message));
            return true;
        } catch (error) {
            console.error("Error sending message via data channel:", error);
            return false;
        }
    }, []);

    async function init() {
        try {
            setIsConnecting(true);
            setError(null);

            // Get an ephemeral key from your server - see server code below
            //@ts-ignore
            const tokenResponse = await fetch(`${import.meta.env.VITE_SERVER_URL}/session`);
            const { result } = await tokenResponse.json();
            const EPHEMERAL_KEY = result?.client_secret.value;

            // Create a peer connection
            const pc = new RTCPeerConnection({
                iceServers: [
                    { urls: 'stun:stun.l.google.com:19302' }
                ]
            });
            peerConnectionRef.current = pc;

            // Connection state monitoring
            pc.onconnectionstatechange = () => {
                console.log("Connection state:", pc.connectionState);
                if (pc.connectionState === 'connected') {
                    setIsConnected(true);
                    setIsConnecting(false);
                } else if (pc.connectionState === 'disconnected' || pc.connectionState === 'failed' || pc.connectionState === 'closed') {
                    setIsConnected(false);
                    setIsListening(false);
                }
            };

            // Set up to play remote audio from the model
            const audioEl = document.createElement("audio");
            audioEl.autoplay = true;
            audioElementRef.current = audioEl;
            pc.ontrack = e => audioEl.srcObject = e.streams[0];

            // Add local audio track for microphone input in the browser
            const ms = await navigator.mediaDevices.getUserMedia({
                audio: true
            });
            mediaStreamRef.current = ms;
            pc.addTrack(ms.getTracks()[0]);
            setIsListening(true);

            // Set up data channel for sending and receiving events
            const dc = pc.createDataChannel("oai-events");
            dataChannelRef.current = dc;

            dc.onopen = () => {
                console.log("Data channel is open");
                const event = {
                    type: 'session.update',
                    session: {
                        modalities: ['text', 'audio'],
                        input_audio_transcription: {
                            model: 'whisper-1',
                        },
                    },
                }
                dc.send(JSON.stringify(event));
                const msg = {
                    type: 'response.create',
                    "response": {
                        "modalities": ["text", "audio"],
                        "instructions": "Start with a friendly greeting and ask about the **materials** they need. If they don't know, ask about their **project** or **use case** so you can suggest the right materials.",
                    }
                }
                dc.send(JSON.stringify(msg));
                console.log('Session update sent.');
            };

            dc.addEventListener("message", (e) => {
                // Realtime server events appear here!
                try {
                    const msg: DataChannelMessage = JSON.parse(e.data);
                    console.log(msg);

                    if (msg.type === 'response.audio_transcript.done' && msg.transcript) {
                        const newTranscription: VoiceTranscription = {
                            role: 'assistant',
                            content: msg.transcript,
                            timestamp: new Date()
                        };

                        setTranscription(prev => [...prev, newTranscription]);
                        onNewTranscription.current(newTranscription);
                    }
                    if (msg.type === 'conversation.item.input_audio_transcription.completed') {
                        const newTranscription: VoiceTranscription = {
                            role: 'user',
                            content: msg.transcript,
                            timestamp: new Date()
                        };

                        setTranscription(prev => [...prev, newTranscription]);
                        onNewTranscription.current(newTranscription);
                    }
                } catch (error) {
                    console.error("Error parsing data channel message:", error);
                }
            });

            // Start the session using the Session Description Protocol (SDP)
            const offer = await pc.createOffer();
            await pc.setLocalDescription(offer);

            const baseUrl = "https://api.openai.com/v1/realtime";
            const model = "gpt-4o-mini-realtime-preview";
            const sdpResponse = await fetch(`${baseUrl}?model=${model}`, {
                method: "POST",
                body: offer.sdp,
                headers: {
                    Authorization: `Bearer ${EPHEMERAL_KEY}`,
                    "Content-Type": "application/sdp"
                },
            });

            if (!sdpResponse.ok) {
                const errorText = await sdpResponse.text();
                throw new Error(`Failed to connect: ${errorText}`);
            }

            const answer: RTCSessionDescriptionInit = {
                type: "answer",
                sdp: await sdpResponse.text(),
            };
            await pc.setRemoteDescription(answer);
        } catch (err) {
            console.error("WebRTC initialization error:", err);
            setError(err instanceof Error ? err.message : "Failed to initialize WebRTC connection");
            setIsConnecting(false);
            setIsConnected(false);
            setIsListening(false);
        }
    }

    const toggleListening = useCallback(() => {
        if (!mediaStreamRef.current || !isConnected) return;

        if (isListening) {
            // Mute the microphone
            mediaStreamRef.current.getTracks().forEach(track => {
                track.enabled = false;
            });
            setIsListening(false);
        } else {
            // Unmute the microphone
            mediaStreamRef.current.getTracks().forEach(track => {
                track.enabled = true;
            });
            setIsListening(true);
        }
    }, [isConnected, isListening]);

    const disconnect = useCallback(() => {
        setIsConnected(false);
        setIsListening(false);
        setIsConnecting(false);

        // Close the data channel
        if (dataChannelRef.current) {
            dataChannelRef.current.close();
            dataChannelRef.current = null;
        }

        // Stop all media tracks
        if (mediaStreamRef.current) {
            mediaStreamRef.current.getTracks().forEach(track => {
                track.stop();
            });
            mediaStreamRef.current = null;
        }

        // Close the peer connection
        if (peerConnectionRef.current) {
            peerConnectionRef.current.close();
            peerConnectionRef.current = null;
        }

        // Remove audio element reference
        if (audioElementRef.current) {
            audioElementRef.current.srcObject = null;
            audioElementRef.current = null;
        }
    }, []);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            disconnect();
        };
    }, [disconnect]);

    return {
        init,
        disconnect,
        toggleListening,
        setTranscriptionCallback,
        sendTextMessage,
        transcription,
        isConnecting,
        isConnected,
        isListening,
        error
    };
};

export default useWebRtcAi;