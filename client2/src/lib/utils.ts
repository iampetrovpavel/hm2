import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { VoiceTranscription } from "../hooks/useWebRtcAi"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const collectService = {
  sendMessagesToBackend: async (messages: VoiceTranscription[]) => {
    try {
      //@ts-ignore
      const serverUrl = import.meta.env.VITE_SERVER_URL;
      if (!serverUrl) {
        console.error("Server URL not configured. Please check your environment variables.");
        return;
      }

      const response = await fetch(`${serverUrl}/collect`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ messages }),
      });

      if (!response.ok) {
        console.error(`Failed to send messages to backend: ${response.status}`);
      }
      const data = await response.json();
      if (data.error) {
        console.error(`Error from backend: ${data.error}`);
      }
      return data;
    } catch (error) {
      console.error("Error sending messages to backend:", error);
    }
  }
}