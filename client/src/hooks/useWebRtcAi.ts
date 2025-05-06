import { useRef, useCallback, useState, useEffect } from 'react';

// OpenAI WebRTC API endpoint with authentication in URL
// const DEFAULT_MODEL = 'pt-4o-realtime-preview-2024-12-17';

// const SERVER_URL = (import.meta as any).env.VITE_SERVER_URL || 'http://localhost:3000';


const useWebRtcAi = () => {
    const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
    const mediaStreamRef = useRef<MediaStream | null>(null);
    const dataChannelRef = useRef<RTCDataChannel | null>(null);
    const audioElementRef = useRef<HTMLAudioElement | null>(null);

    async function init() {
        // Get an ephemeral key from your server - see server code below
        const tokenResponse = await fetch("http://localhost:3000/session");
        const { result } = await tokenResponse.json();
        const EPHEMERAL_KEY = result?.client_secret.value;

        // Create a peer connection
        const pc = new RTCPeerConnection();
        peerConnectionRef.current = pc;

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

        // Set up data channel for sending and receiving events
        const dc = pc.createDataChannel("oai-events");
        dataChannelRef.current = dc;
        dc.addEventListener("message", (e) => {
            // Realtime server events appear here!
            const msg = JSON.parse(e.data);
            console.log(msg);
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

        const answer: RTCSessionDescriptionInit = {
            type: "answer",
            sdp: await sdpResponse.text(),
        };
        await pc.setRemoteDescription(answer);
    }

    const disconnect = useCallback(() => {
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

    return { init, disconnect };
};

export default useWebRtcAi;