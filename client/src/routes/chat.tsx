import { useState, useEffect, useRef } from "react";
import PageContainer from "@/components/layout/page-container";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import useWebRtcAi from "@/hooks/useWebRtcAi";
import { AlertCircle, Mic, MicOff, Phone, Send } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export default function ChatPage() {
  const {init} = useWebRtcAi();

  // Ensure we disconnect when component unmounts
  useEffect(() => {
    init();
  }, []);

  return (
    <div></div>
  );
}