import React, { useEffect, useRef, useState } from 'react';
import { Mic, MicOff, Power, PowerOff, Loader2, FileText, AudioLines, VolumeX, Volume2, ArrowRight } from 'lucide-react';
import { Button } from './ui/button';
import useWebRtcAi from '../hooks/useWebRtcAi';
import { useChatStore } from '../store/chat-store';
import { useRequestStore } from '../store/request-store';
import { Header } from './header';
import ReactMarkdown from 'react-markdown'
import { VoiceTranscription } from '../types';
import { useNavigate } from 'react-router-dom';

const ButtonText = ({ children }: { children: React.ReactNode }) => (
  <span className="hidden sm:inline">
    {children}
  </span>
);

export function ChatInterface() {
  const webRtc = useWebRtcAi();
  const { messages, addMessage, setIsConnected, setIsListening, clearMessages } = useChatStore();
  const { setProjectData } = useRequestStore();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [textMessage, setTextMessage] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    webRtc.setTranscriptionCallback((message) => {
      addMessage(message);
    });
  }, [webRtc, addMessage]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleConnect = async () => {
    clearMessages();
    await webRtc.init();
    setIsConnected(true);
  };

  const handleDisconnect = () => {
    webRtc.disconnect();
    setIsConnected(false);
    setIsListening(false);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!textMessage.trim()) return;

    const message: VoiceTranscription = {
      role: 'user',
      content: textMessage,
      timestamp: new Date()
    };
    addMessage(message);
    webRtc.sendTextMessage(textMessage);
    setTextMessage('');
    inputRef.current?.focus();
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <Header />

      <div className="flex-1 overflow-hidden flex flex-col">
        <div className="flex-1 overflow-auto p-4">
          <div className="max-w-3xl mx-auto space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'
                  }`}
              >
                <div
                  className={`rounded-lg px-4 py-2 max-w-sm ${message.role === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-900'
                    }`}
                >
                  <div><ReactMarkdown>{message.content}</ReactMarkdown></div>
                  <span className="text-xs opacity-75">
                    {new Date(message.timestamp).toLocaleTimeString()}
                  </span>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </div>

        <div className="p-4 bg-white border-t border-gray-200">
          <div className="max-w-3xl mx-auto space-y-4">
            <div className="flex justify-center gap-2">
              <Button
                onClick={webRtc.isConnected ? handleDisconnect : handleConnect}
                variant={webRtc.isConnected ? "destructive" : "default"}
                disabled={webRtc.isConnecting}
                className="min-w-[40px]"
              >
                {webRtc.isConnecting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Connecting...
                  </>
                ) : webRtc.isConnected ? (
                  <>
                    <PowerOff className="mr-2 h-4 w-4" />
                    <ButtonText>Disconnect</ButtonText>
                  </>
                ) : (
                  <>
                    <AudioLines className="mr-2 h-4 w-4" />
                    Start dialog
                  </>
                )}
              </Button>
              {webRtc.isConnected && (
                <>
                  <Button
                    onClick={webRtc.toggleListening}
                    variant={webRtc.isListening ? "destructive" : "default"}
                    className="min-w-[40px]"
                  >
                    {webRtc.isListening ? (
                      <>
                        <MicOff className="mr-2 h-4" />
                        <ButtonText>Stop Listening</ButtonText>
                      </>
                    ) : (
                      <>
                        <Mic className="mr-2 h-4 w-4" />
                        <ButtonText>Start Listening</ButtonText>
                      </>
                    )}
                  </Button>
                  <Button
                    onClick={webRtc.toggleAssistantMute}
                    variant={webRtc.isAssistantMuted ? "destructive" : "default"}
                    className="min-w-[40px]"
                  >
                    {webRtc.isAssistantMuted ? (
                      <>
                        <VolumeX className="mr-2 h-4 w-4" />
                        <ButtonText>Unmute Assistant</ButtonText>
                      </>
                    ) : (
                      <>
                        <Volume2 className="mr-2 h-4 w-4" />
                        <ButtonText>Mute Assistant</ButtonText>
                      </>
                    )}
                  </Button>
                </>
              )}
              {webRtc.projectData?.completed === true && (
                <Button
                  onClick={() => {
                    setProjectData(webRtc.projectData!)
                    navigate('/request')
                  }}
                  variant="secondary"
                  className="min-w-[40px]"
                >
                  <FileText className="mr-2 h-4 w-4" />
                  <ButtonText>View request</ButtonText>
                </Button>
              )}
            </div>

            {webRtc.isConnected && (
              <form onSubmit={handleSendMessage} className="flex gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={textMessage}
                  onChange={(e) => setTextMessage(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1 px-4 py-2 bg-white text-black border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
                />
                <Button
                  type="submit"
                  disabled={!textMessage.trim()}
                  variant="default"
                  className="bg-blue-600 hover:bg-blue-700 text-white h-10 w-20 p-0"
                >
                  Send
                  <ArrowRight className="h-4 w-4 ml-1" />
                </Button>
              </form>
            )}
          </div>
        </div>
      </div>

      {webRtc.error && (
        <div className="fixed bottom-4 right-4 bg-red-500 text-white px-4 py-2 rounded-md">
          {webRtc.error}
        </div>
      )}
    </div>
  );
}