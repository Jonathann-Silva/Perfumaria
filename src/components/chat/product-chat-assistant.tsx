'use client';
import { useState, useRef, useEffect } from 'react';
import { Bot, Paperclip, Send, X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { productChat } from '@/app/actions';
import { readStreamableValue } from 'ai/rsc';
import Markdown from 'react-markdown';
import { ScrollArea } from '../ui/scroll-area';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

export function ProductChatAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    const stream = await productChat(input);

    let assistantResponse = '';
    const assistantMessageId = (Date.now() + 1).toString();

    // Set initial assistant message
    setMessages((prev) => [
        ...prev,
        { id: assistantMessageId, role: 'assistant', content: '' },
    ]);


    for await (const delta of readStreamableValue(stream)) {
        assistantResponse += delta;
        setMessages((prev) =>
            prev.map((msg) =>
                msg.id === assistantMessageId
                    ? { ...msg, content: assistantResponse }
                    : msg
            )
        );
    }

    setIsLoading(false);
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-2xl h-[70vh] flex flex-col p-0">
          <DialogHeader className="p-4 border-b">
            <DialogTitle className="flex items-center gap-2">
              <Bot />
              Assistente de Perfumes
            </DialogTitle>
          </DialogHeader>
          <ScrollArea className="flex-1 p-4">
             <div className="flex-1 space-y-4">
                {messages.map((m) => (
                <div
                    key={m.id}
                    className={`flex gap-3 text-sm ${
                    m.role === 'user' ? 'justify-end' : 'justify-start'
                    }`}
                >
                    {m.role === 'assistant' && (
                    <span className="flex-shrink-0 flex items-center justify-center size-8 rounded-full bg-primary text-primary-foreground">
                        <Bot size={20} />
                    </span>
                    )}
                    <div
                    className={`rounded-lg px-4 py-2 ${
                        m.role === 'user'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted'
                    }`}
                    >
                    <Markdown>{m.content}</Markdown>
                    </div>
                </div>
                ))}
                 {isLoading && (
                    <div className="flex justify-start">
                        <span className="flex-shrink-0 flex items-center justify-center size-8 rounded-full bg-primary text-primary-foreground">
                            <Bot size={20} />
                        </span>
                        <div className="rounded-lg px-4 py-2 bg-muted flex items-center">
                            <Loader2 className="animate-spin" />
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>
          </ScrollArea>
          <div className="p-4 border-t">
            <form onSubmit={handleSendMessage} className="flex items-center gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Pergunte sobre perfumes, marcas, preços..."
                className="flex-1"
                disabled={isLoading}
              />
              <Button type="submit" size="icon" disabled={isLoading}>
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </DialogContent>
      </Dialog>

      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 h-16 w-16 rounded-full shadow-lg z-50"
      >
        <Bot size={32} />
      </Button>
    </>
  );
}
