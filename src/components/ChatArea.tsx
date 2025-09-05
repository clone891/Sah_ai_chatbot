import { useEffect, useRef, useState } from "react"
import { motion } from "framer-motion"
import { ChatBubble } from "./ChatBubble"
import { ChatInput } from "./ChatInput"
import { Button } from "@/components/ui/button"
import { RefreshCw, Bot } from "lucide-react"

interface Message {
  id: string
  text: string
  isBot: boolean
  timestamp: string
}

const initialMessages: Message[] = [
  {
    id: "1",
    text: "Hi! I'm Sah.ai, your mental health companion. How are you feeling today?",
    isBot: true,
    timestamp: "2:30 PM"
  }
]

export function ChatArea() {
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [isTyping, setIsTyping] = useState(false)
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = (text: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      text,
      isBot: false,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }

    setMessages(prev => [...prev, newMessage])
    setIsTyping(true)

    // Simulate bot response
    setTimeout(() => {
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: getBotResponse(text),
        isBot: true,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
      
      setMessages(prev => [...prev, botResponse])
      setIsTyping(false)
    }, 1500)
  }

  const getBotResponse = (userMessage: string): string => {
    const responses = [
      "I hear you. Thank you for sharing that with me. How does that make you feel?",
      "That sounds challenging. Would you like to explore some coping strategies together?",
      "I appreciate your openness. Let's work through this step by step.",
      "It's completely normal to feel this way. You're not alone in this journey.",
      "That's a positive step forward. How can we build on this progress?",
      "I understand this might be difficult to talk about. Take your time.",
      "Would you like to try some mindfulness exercises or breathing techniques?",
      "Thank you for trusting me with your thoughts. Your feelings are valid.",
    ]
    
    return responses[Math.floor(Math.random() * responses.length)]
  }

  const clearChat = () => {
    setMessages([initialMessages[0]])
  }

  return (
    <div className="flex flex-col h-full gradient-main">
      {/* Chat header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-4 gradient-card border-b border-border flex items-center justify-between"
      >
        <div>
          <h2 className="text-lg font-semibold text-foreground">Mental Health Bot</h2>
          <p className="text-sm text-muted-foreground">Always here to listen and support</p>
        </div>
        
        <Button
          variant="ghost"
          size="icon"
          onClick={clearChat}
          className="hover:bg-secondary rounded-xl"
        >
          <RefreshCw className="h-4 w-4" />
        </Button>
      </motion.div>

      {/* Chat messages */}
      <div 
        ref={scrollAreaRef}
        className="flex-1 overflow-y-auto p-4 space-y-1 scroll-smooth"
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          {messages.map((message, index) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: message.id === "1" ? 0.5 : index * 0.1 }}
            >
              <ChatBubble
                message={message.text}
                isBot={message.isBot}
                timestamp={message.timestamp}
                isFirstMessage={message.id === "1" && message.isBot}
              />
            </motion.div>
          ))}
          
          {isTyping && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-start gap-3 mb-4 w-full justify-start"
            >
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-chat-bot flex items-center justify-center shadow-[var(--shadow-soft)] border-2 border-primary/20">
                <Bot className="h-5 w-5 text-primary" />
              </div>
              <div className="chat-bubble-bot">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-muted-foreground/40 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-muted-foreground/40 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-muted-foreground/40 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>

      {/* Chat input */}
      <ChatInput onSendMessage={handleSendMessage} disabled={isTyping} />
    </div>
  )
}
