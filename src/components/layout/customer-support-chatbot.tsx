'use client';

import { useState, useRef, useEffect, type FormEvent } from 'react';
import { Bot, Send, X, MessageSquare, Loader } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { customerSupportChat } from '@/ai/flows/ai-customer-support-chatbot';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';

type Message = {
  text: string;
  sender: 'user' | 'bot';
};

export function CustomerSupportChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollAreaViewport = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([{ sender: 'bot', text: '¡Hola! Soy Omni, tu asistente virtual. ¿En qué puedo ayudarte hoy?' }]);
    }
  }, [isOpen, messages.length]);

  useEffect(() => {
    // Scroll to bottom when new messages are added
    if (scrollAreaViewport.current) {
        scrollAreaViewport.current.scrollTo({ top: scrollAreaViewport.current.scrollHeight, behavior: 'smooth' });
    }
  }, [messages]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage: Message = { text: input, sender: 'user' };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const botResponse = await customerSupportChat(input);
      const botMessage: Message = { text: botResponse, sender: 'bot' };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error('Chatbot error:', error);
      const errorMessage: Message = { text: 'Lo siento, tuve un problema para procesar tu solicitud. Inténtalo de nuevo.', sender: 'bot' };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="fixed bottom-6 right-6 z-50">
        <Button onClick={() => setIsOpen(!isOpen)} size="icon" className="rounded-full w-14 h-14 shadow-lg bg-secondary hover:bg-secondary/90">
          {isOpen ? <X className="h-7 w-7" /> : <MessageSquare className="h-7 w-7" />}
        </Button>
      </div>

      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-full max-w-sm rounded-lg border bg-card shadow-xl flex flex-col animate-in slide-in-from-bottom-10 fade-in-50 duration-300">
          <header className="flex items-center justify-between p-4 border-b">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-full">
                <Bot className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold text-lg text-foreground">Asistente OmniShop</h3>
            </div>
            <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
              <X className="h-5 w-5 text-muted-foreground" />
            </Button>
          </header>
          
          <ScrollArea className="h-96" viewportRef={scrollAreaViewport}>
            <div className="p-4 space-y-4">
              {messages.map((msg, index) => (
                <div key={index} className={cn('flex items-end gap-2', msg.sender === 'user' ? 'justify-end' : 'justify-start')}>
                  <div className={cn(
                    'max-w-[75%] rounded-2xl px-4 py-2 text-sm',
                    msg.sender === 'user'
                      ? 'bg-primary text-primary-foreground rounded-br-none'
                      : 'bg-muted text-muted-foreground rounded-bl-none'
                  )}>
                    <p className="whitespace-pre-wrap">{msg.text}</p>
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex items-end gap-2 justify-start">
                    <div className="max-w-[75%] rounded-2xl px-4 py-2 text-sm bg-muted text-muted-foreground rounded-bl-none flex items-center">
                        <Loader className="h-4 w-4 animate-spin mr-2" />
                        <span>Pensando...</span>
                    </div>
                </div>
              )}
            </div>
          </ScrollArea>

          <footer className="p-4 border-t bg-background">
            <form onSubmit={handleSubmit} className="flex items-center gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Escribe tu pregunta..."
                autoComplete="off"
                disabled={loading}
                className="flex-1"
              />
              <Button type="submit" size="icon" disabled={loading || !input.trim()}>
                <Send className="h-5 w-5" />
              </Button>
            </form>
          </footer>
        </div>
      )}
    </>
  );
}
