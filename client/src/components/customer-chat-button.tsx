"use client"

import { useState } from "react"
import { MessageCircle } from "lucide-react"
import { FloatingActionButton } from "@/components/floating-action-button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export function CustomerChatButton() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<{ role: "customer" | "sales"; content: string }[]>([
    { role: "sales", content: "Hello! I'm your sales representative. How can I help you with your quote today?" },
  ])
  const [input, setInput] = useState("")

  const handleSendMessage = () => {
    if (!input.trim()) return

    // Add customer message
    const newMessages = [...messages, { role: "customer", content: input }]
    setMessages(newMessages)
    setInput("")

    // Simulate sales rep response
    setTimeout(() => {
      setMessages([
        ...newMessages,
        {
          role: "sales",
          content: "Thank you for your message. I'll check on that and get back to you shortly.",
        },
      ])
    }, 1000)
  }

  return (
    <>
      <FloatingActionButton
        icon={MessageCircle}
        onClick={() => setOpen(true)}
        className="bg-primary hover:bg-primary/90"
      />

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md h-[80vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>Chat with Sales Representative</DialogTitle>
          </DialogHeader>

          <ScrollArea className="flex-1 pr-4">
            <div className="space-y-4 mb-4">
              {messages.map((message, index) => (
                <div key={index} className={`flex ${message.role === "customer" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`rounded-lg px-4 py-2 max-w-[80%] ${
                      message.role === "customer" ? "bg-primary text-primary-foreground" : "bg-muted"
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
              onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
            />
            <Button onClick={handleSendMessage}>Send</Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default CustomerChatButton
