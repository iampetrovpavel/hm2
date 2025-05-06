interface AIMessageRequest {
  message: string;
}

export interface AIMessageResponse {
  message: string;
  data?: any; // JSON data parsed from the AI response
  conversationId?: string;
}

interface SpeechToTextResponse {
  text: string;
}

const SERVER_URL = (import.meta as any).env.VITE_SERVER_URL || 'http://localhost:3000';

/**
 * Service for interacting with the AI API
 */
export const apiService = {
  /**
   * Send a prompt to the AI service
   * @param message The user message to send
   * @returns The AI response
   */
  async sendPrompt(message: string): Promise<AIMessageResponse> {
    try {
      // Prepare the request payload
      const payload: AIMessageRequest = {
        message
      };

      // Send the request to the server
      const response = await fetch(`${SERVER_URL}/api/ai`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      // Handle non-200 responses
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to get AI response');
      }

      // Parse and return the successful response
      return await response.json();
    } catch (error) {
      console.error('Error sending prompt to AI:', error);
      throw error;
    }
  },

  /**
   * Convert speech to text using the server API
   * @param audioBlob The audio data as a Blob
   * @returns The transcribed text
   */
  async speechToText(audioBlob: Blob): Promise<string | null> {
    try {
      // Log audio blob info for debugging
      console.log('Sending audio blob:', audioBlob.type, audioBlob.size);
      
      // Create a FormData object to send the audio file
      const formData = new FormData();
      
      // Make sure we're setting proper filename with extension
      const file = new File([audioBlob], 'audio.webm', { 
        type: 'audio/webm',
        lastModified: Date.now()
      });
      
      formData.append('file', file);

      // Send the request to the server
      const response = await fetch(`${SERVER_URL}/api/speech-to-text`, {
        method: 'POST',
        body: formData,
      });

      // Handle non-200 responses
      if (!response.ok) {
        let errorMessage = 'Failed to convert speech to text';
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorMessage;
          console.log('Server error details:', errorData);
        } catch (e) {
          console.error('Error parsing error response:', e);
        } finally {
          // throw new Error(errorMessage);
          return null
        }
      }

      // Parse and return the transcribed text
      const data: SpeechToTextResponse = await response.json();
      
      if (!data.text) {
        // throw new Error('No transcription received from server');
        return null
      }
      
      return data.text;
    } catch (error) {
      console.error('Error converting speech to text:', error);
      throw error;
    }
  },

  /**
   * Convert text to speech using the server API
   * @param text The text to convert to speech
   * @returns The audio data as a Blob
   */
  async textToSpeech(text: string): Promise<Blob> {
    try {
      // Send the request to the server
      const response = await fetch(`${SERVER_URL}/api/text-to-speech`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text }),
      });

      // Handle non-200 responses
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to convert text to speech');
      }

      // Return the audio blob
      return await response.blob();
    } catch (error) {
      console.error('Error converting text to speech:', error);
      throw error;
    }
  },
};