import { useEffect, useRef, useState } from 'react';
import { AIMessageResponse, apiService } from '@/lib/api-service';
import { AudioRecorder } from '@/lib/audio-handler';

interface UseAIPromptResult {
  isLoading: boolean;
  error: Error | null;
  sendPrompt: (message: string) => Promise<AIMessageResponse | undefined>;
}

/**
 * Hook for interacting with the AI prompt service
 */
export function useAIPrompt(): UseAIPromptResult {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  /**
   * Send a message to the AI service
   */
  const sendPrompt = async (message: string) => {
    setIsLoading(true);
    setError(null);

    try {
      // Send to API
      const result = await apiService.sendPrompt(message);

      // Update state with response
      return result
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to get AI response'));
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    error,
    sendPrompt
  };
}

export interface UseVoiceAIOptions {
  setMessages?: React.Dispatch<React.SetStateAction<any[]>>;
  handleSendMessage?: (message: string) => Promise<string | undefined>;
}

export interface UseVoiceAIResult {
  isRecording: boolean;
  isProcessing: boolean;
  isPlaying: boolean;
  error: Error | null;
  startVoiceConversation: () => Promise<void>;
  stopVoiceConversation: () => void;
  audioUrl: string | null;
}

/**
 * Hook for voice-based interaction with AI
 */
export function useVoiceAI(options?: UseVoiceAIOptions): UseVoiceAIResult {
  const { setMessages, handleSendMessage } = options || {};
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [audioChunks, setAudioChunks] = useState<Blob[]>([]);
  const audioRecorder = useRef<AudioRecorder | null>(null)
  const [status, setStatus] = useState<'idle' | 'listening' | 'thinking' | 'speaking' | 'processing'>('idle');

  // Initialize the audio recorder on component mount
  useEffect(() => {
    initializeAudioRecorder()
    return () => {
      console.log(
        'SpeakButton unmounting, stopping microphone and releasing resources',
      )
      if (audioRecorder.current) {
        audioRecorder.current.stopRecording()
        audioRecorder.current.releaseResources()
        audioRecorder.current = null
      }
    }
  }, [])

  function initializeAudioRecorder() {
    audioRecorder.current = new AudioRecorder(
      (statusMessage) => {
        if (statusMessage.includes('Recording')) {
          setStatus('listening')
        } else if (statusMessage.includes('Processing')) {
          setStatus('processing')
        } else if (statusMessage === '') {
          setStatus('idle')
        }
      },
      async (text) => {
        if (text.trim()) {
          setStatus('thinking')
          console.log('Recognized text:', text)
          setIsProcessing(true)
          const message = await handleSendMessage?.(text);
          console.log('AI response:', message);

          if (message) {
            // Convert AI response to speech
            const speechBlob = await apiService.textToSpeech(message);

            // Create audio URL and play
            const url = URL.createObjectURL(speechBlob);
            setAudioUrl(url);

            // Play the audio
            const audio = new Audio(url);
            setIsPlaying(true);

            audio.onended = () => {
              setIsPlaying(false);
            };

            audio.play();
          }
          audioRecorder.current?.startRecording()

          // const response = await chatStore.sendMessage(text)

          // if (typeof response?.response === 'string') {
          //   setStatus('speaking')
          //   await handleSpeak(response?.response)
          // }

          setStatus('idle')

          // if (autoStart) {
          //   setTimeout(() => startRecording(), 500)
          // }
        } else {
          // Restart recording immediately if no text was recognized and in video mode
          // if (autoStart) {
          //   setStatus('idle')
          //   startRecording()
          // }
        }
      },
    )
  }

  const startVoiceConversation = async () => {
    // setError(null);

    try {
      if(!audioRecorder.current) initializeAudioRecorder()
      if(audioRecorder.current) audioRecorder.current.startRecording()
      setIsRecording(true);
    } catch (err) {
      console.error('Microphone access error:', err);
      setError(err instanceof Error ? err : new Error('Failed to access microphone'));
    }
  };

  /**
   * Stop the current recording
   */
  const stopVoiceConversation = () => {
    setIsRecording(false);
    if (mediaRecorder && isRecording) {
      mediaRecorder.stop();

      // Stop all media tracks
      mediaRecorder.stream.getTracks().forEach(track => track.stop());
    }
  };

  return {
    isRecording,
    isProcessing,
    isPlaying,
    error,
    startVoiceConversation,
    stopVoiceConversation,
    audioUrl
  };
}