"use client"

import { useState, useEffect, useRef } from "react"
import { Bot, Send, Mic, MicOff, Volume2 } from "lucide-react"
import { FloatingActionButton } from "@/components/floating-action-button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useStore } from "@/lib/store"
import { useAIPrompt, useVoiceAI } from "@/hooks/use-ai-prompt"
import { apiService } from "@/lib/api-service"

interface AIChatButtonProps {
  onUpdateRequest?: (data: any) => void
  requestData?: any
}

export function AIChatButton({ onUpdateRequest, requestData }: AIChatButtonProps) {
  const [open, setOpen] = useState(false)
  const { addRequest } = useStore()
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  
  // Standard text chat
  const { sendPrompt, isLoading: isPromptLoading } = useAIPrompt()
  const [messages, setMessages] = useState<{ role: "user" | "assistant"; content: string }[]>([
    { role: "assistant", content: "Hello! I'm your AI assistant. How can I help you with your request today?" },
  ])
  const [input, setInput] = useState("")

  // Voice chat functionality
  const { 
    isRecording, 
    isProcessing, 
    isPlaying,
    error: voiceError,
    startVoiceConversation,
    stopVoiceConversation,
    audioUrl
  } = useVoiceAI({ setMessages })

  // Scroll to bottom when messages change
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }, [messages])

  // Handle text message sending
  const handleSendMessage = async () => {
    if (!input.trim()) return

    // Add user message to chat
    const userMessage = input.trim()
    const newMessages = [...messages, { role: "user", content: userMessage }]
    setMessages(newMessages)
    setInput("")

    try {
      // Send to AI API
      const response = await sendPrompt(userMessage)
      
      if (response?.message) {
        // Add AI response to chat
        setMessages(prev => [...prev, { role: "assistant", content: response.message }])
      }
    } catch (error) {
      console.error("Error sending message:", error)
    }
  }

  // Handle voice recording toggling
  const handleVoiceButton = async () => {
    if (isRecording) {
      stopVoiceConversation()
    } else {
      // Add a loading message
      setMessages(prev => [...prev, { role: "user", content: "🎤 Recording..." }])
      
      // Start recording
      await startVoiceConversation()
    }
  }

  // Handle transcription and AI response when voice recording stops
  useEffect(() => {
    if (!isRecording && isProcessing) {
      // Update the "Recording..." message to show we're processing
      setMessages(prev => {
        const newMessages = [...prev]
        const lastMessage = newMessages[newMessages.length - 1]
        if (lastMessage && lastMessage.content === "🎤 Recording...") {
          lastMessage.content = "🔄 Processing..."
        }
        return newMessages
      })
    }
  }, [isRecording, isProcessing])

  // Handle voice recording error
  useEffect(() => {
    if (voiceError) {
      // Show error message
      setMessages(prev => [...prev, { role: "assistant", content: `Error: ${voiceError.message}` }])
    }
  }, [voiceError])

  return (
    <>
      <FloatingActionButton icon={Bot} onClick={() => setOpen(true)} className="bg-primary hover:bg-primary/90" />

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md h-[80vh] flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex justify-between items-center">
              <span>AI Assistant</span>
              {(isRecording || isProcessing || isPlaying) && (
                <Badge variant={isRecording ? "destructive" : isProcessing ? "outline" : "default"}>
                  {isRecording ? "Recording..." : isProcessing ? "Processing..." : "Playing..."}
                </Badge>
              )}
            </DialogTitle>
          </DialogHeader>

          <ScrollArea className="flex-1 pr-4" ref={scrollAreaRef}>
            <div className="space-y-4 mb-4">
              {messages.map((message, index) => (
                <div key={index} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`rounded-lg px-4 py-2 max-w-[80%] ${
                      message.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted"
                    }`}
                  >
                    {message.content}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>

          <div className="flex gap-2 mt-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              onKeyDown={(e) => e.key === "Enter" && !isPromptLoading && handleSendMessage()}
              disabled={isRecording || isProcessing}
            />
            <Button
              onClick={handleVoiceButton}
              size="icon"
              variant={isRecording ? "destructive" : "outline"}
              className="w-12"
              disabled={isProcessing || isPlaying}
            >
              {isRecording ? <MicOff className="h-4 w-5" /> : <Mic className="h-4 w-5" />}
            </Button>
            <Button
              onClick={handleSendMessage}
              size="icon"
              className="w-12"
              disabled={isPromptLoading || !input.trim() || isRecording || isProcessing}
            >
              <Send className="h-4 w-5" />
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default AIChatButton
