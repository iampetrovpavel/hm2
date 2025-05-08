import { create } from 'zustand'
import { VoiceTranscription } from '../types'

interface ChatState {
  messages: VoiceTranscription[]
  isConnected: boolean
  isListening: boolean
  addMessage: (message: VoiceTranscription) => void
  setIsConnected: (isConnected: boolean) => void
  setIsListening: (isListening: boolean) => void
  clearMessages: () => void
}

export const useChatStore = create<ChatState>((set) => ({
  messages: [],
  isConnected: false,
  isListening: false,
  addMessage: (message) => set((state) => ({ 
    messages: [...state.messages, message] 
  })),
  setIsConnected: (isConnected) => set({ isConnected }),
  setIsListening: (isListening) => set({ isListening }),
  clearMessages: () => set({ messages: [] })
}))