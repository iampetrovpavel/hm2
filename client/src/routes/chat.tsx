import { useState, useEffect, useRef } from "react";
import PageContainer from "@/components/layout/page-container";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import useWebRtcAi, { VoiceTranscription } from "@/hooks/useWebRtcAi";
import { AlertCircle, Mic, MicOff, MessageSquare, Phone, Send } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { v4 as uuidv4 } from "uuid";

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export default function ChatPage() {
  const [inputMessage, setInputMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [activeTab, setActiveTab] = useState("text");
  const [processingMessage, setProcessingMessage] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const {
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
  } = useWebRtcAi();

  // Initialize WebRTC when component mounts
  useEffect(() => {
    // Optional auto-initialize
    // init();

    return () => {
      disconnect();
    };
  }, [disconnect]);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Handle new transcription messages from voice
  useEffect(() => {
    setTranscriptionCallback((newTranscription: VoiceTranscription) => {
      const newMessage: Message = {
        id: uuidv4(),
        role: newTranscription.role,
        content: newTranscription.content,
        timestamp: newTranscription.timestamp
      };
      setMessages(prev => [...prev, newMessage]);
    });
  }, [setTranscriptionCallback]);

  // Send a text message
  const handleSendMessage = () => {
    if (!inputMessage.trim() || processingMessage) return;

    const messageText = inputMessage.trim();
    const newMessage: Message = {
      id: uuidv4(),
      role: 'user',
      content: messageText,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, newMessage]);
    setInputMessage("");
    setProcessingMessage(true);

    // If WebRTC is connected, send the message to be spoken by the AI
    if (isConnected) {
      sendTextMessage(messageText);
    } else {
      // Mock AI response if WebRTC is not connected
      setTimeout(() => {
        const aiResponse: Message = {
          id: uuidv4(),
          role: 'assistant',
          content: `I received your message: "${messageText}"`,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, aiResponse]);
        setProcessingMessage(false);
      }, 1000);
    }
  };

  // Handle WebRTC connection
  const handleVoiceConnection = () => {
    if (isConnected) {
      disconnect();
    } else {
      init();
    }
  };

  // Render message bubble
  const renderMessage = (message: Message) => {
    const isUser = message.role === 'user';

    return (
      <div
        key={message.id}
        className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}
      >
        <div
          className={`max-w-[70%] rounded-lg p-3 ${isUser
              ? 'bg-primary text-primary-foreground'
              : 'bg-muted text-foreground'
            }`}
        >
          <p className="text-sm">{message.content}</p>
          <p className="text-xs opacity-70 mt-1">
            {message.timestamp.toLocaleTimeString()}
          </p>
        </div>
      </div>
    );
  };

  // Status indicator for voice connection
  const renderConnectionStatus = () => {
    let statusText = 'Not connected';
    let statusClass = 'bg-gray-500';

    if (isConnecting) {
      statusText = 'Connecting...';
      statusClass = 'bg-yellow-500';
    } else if (isConnected) {
      if (isListening) {
        statusText = 'Listening';
        statusClass = 'bg-green-500';
      } else {
        statusText = 'Connected (Muted)';
        statusClass = 'bg-blue-500';
      }
    }

    return (
      <div className="flex items-center gap-2 ml-auto mr-4">
        <div className={`w-2 h-2 rounded-full ${statusClass}`}></div>
        <span className="text-xs">{statusText}</span>
      </div>
    );
  };

  return (
    <PageContainer title="Chat with AI">
      {/* <div className="flex flex-col p-10"> */}
      {/* <div className="flex-1 overflow-hidden"> */}
      {/* <Tabs 
            defaultValue="text" 
            className="h-full flex flex-col"
            value={activeTab}
            onValueChange={setActiveTab}
          >
            <div className="border-b pb-2 flex items-center">
              <TabsList className="grid grid-cols-2 w-48">
                <TabsTrigger value="text" className="flex items-center gap-2">
                  <MessageSquare className="h-4 w-4" />
                  <span>Text</span>
                </TabsTrigger>
                <TabsTrigger value="voice" className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  <span>Voice</span>
                </TabsTrigger>
              </TabsList>
              
              {renderConnectionStatus()}
            </div> */}

      {/* <ScrollArea className="flex-1 p-4"> */}
      <div className="space-y-4 overflow-y-auto max-h-100 min-h-100 border-1 p-2 mt-6 border-gray-300 rounded-lg">
        {messages.map(renderMessage)}
        {processingMessage && (
          <div className="flex justify-start mb-4">
            <div className="bg-muted text-foreground max-w-[70%] rounded-lg p-3">
              <div className="flex space-x-2">
                <div className="w-2 h-2 rounded-full bg-gray-500 animate-bounce"></div>
                <div className="w-2 h-2 rounded-full bg-gray-500 animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-2 h-2 rounded-full bg-gray-500 animate-bounce" style={{ animationDelay: '0.4s' }}></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      {/* </ScrollArea> */}

      {/* <TabsContent value="text" className="flex-none p-4 pt-0 mt-0">
              <div className="flex gap-2">
                <Textarea
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="Type your message here..."
                  className="flex-1 resize-none"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                  disabled={processingMessage}
                />
                <Button 
                  onClick={handleSendMessage} 
                  disabled={processingMessage || !inputMessage.trim()}
                >
                  <Send />
                </Button>
              </div>
            </TabsContent> */}

      {/* <TabsContent value="voice" className="flex-none p-4 pt-0 mt-0 flex items-center justify-center">
              {error && (
                <Alert variant="destructive" className="mb-4 w-full">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )} */}

      <div className="flex flex-col items-center space-y-6 py-4">
        <div className="flex items-center gap-4">
          <Button
            size="icon"
            className={`rounded-full w-20 h-20 ${isConnecting
                ? 'bg-yellow-500 hover:bg-yellow-600'
                : isConnected
                  ? 'bg-red-500 hover:bg-red-600'
                  : 'bg-blue-500 hover:bg-blue-600'
              }`}
            onClick={handleVoiceConnection}
            disabled={isConnecting}
          >
            <Phone className="h-8 w-8" />
          </Button>

          {isConnected && (
            <Button
              size="icon"
              className={`rounded-full border-gray-200 border-1 w-20 h-20 ${isListening ? 'bg-white hover:bg-gray-100' : 'bg-green-200 hover:bg-green-300'}`}
              onClick={toggleListening}
              disabled={!isConnected}
            >
              {isListening ? (
                <MicOff className="h-8 w-8 text-gray-400" />
              ) : (
                <Mic className="h-8 w-8 text-gray-400" />
              )}
            </Button>
          )}
        </div>

        <div className="text-center mt-4">
          <p className="font-medium mb-1">
            {isConnecting ? 'Connecting...' :
              isConnected ? 'Voice Connection Active' :
                'Press to start voice chat'}
          </p>
          <p className="text-sm text-muted-foreground">
            {isConnected
              ? (isListening
                ? 'Your microphone is active - speak to chat with AI'
                : 'Your microphone is muted - click to unmute')
              : 'Enables real-time voice conversation with AI'}
          </p>
        </div>
      </div>
      {/* </TabsContent> */}
      {/* </Tabs> */}
      {/* </div> */}
      {/* </div> */}
    </PageContainer>
  );
}