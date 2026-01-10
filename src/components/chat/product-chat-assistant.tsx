'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Bot,
  Send,
  X,
  Loader2,
  Sparkles,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useChat } from 'ai/react';
import ReactMarkdown from 'react-markdown';
import { productChat } from '@/app/actions';

export default function ProductChatAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
      api: '/api/chat', // We will use a route handler for this
  });

  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <>
      <div
        className={cn(
          'fixed bottom-6 right-6 z-50 transition-transform duration-300 ease-in-out',
          isOpen
            ? 'translate-y-24 opacity-0'
            : 'translate-y-0 opacity-100'
        )}
      >
        <Button
          size="lg"
          className="group h-16 w-16 rounded-full bg-primary shadow-2xl shadow-primary/40 transition-all hover:scale-110 hover:shadow-primary/60"
          onClick={() => setIsOpen(true)}
        >
          <Bot className="h-8 w-8 text-primary-foreground transition-transform group-hover:scale-110" />
        </Button>
      </div>

      <div
        className={cn(
          'fixed bottom-6 right-6 z-50 flex h-[85vh] max-h-[700px] w-[90vw] max-w-sm flex-col overflow-hidden rounded-2xl border bg-card shadow-2xl transition-all duration-300 ease-in-out',
          isOpen
            ? 'translate-y-0 opacity-100'
            : 'translate-y-0 opacity-0 pointer-events-none'
        )}
      >
        <header className="flex items-center justify-between border-b bg-primary px-4 py-3 text-primary-foreground">
          <div className="flex items-center gap-3">
            <Sparkles className="h-6 w-6" />
            <h3 className="font-bold">Assistente Virtual</h3>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-full text-primary-foreground hover:bg-white/20"
            onClick={() => setIsOpen(false)}
          >
            <X className="h-5 w-5" />
          </Button>
        </header>

        <div
          ref={chatContainerRef}
          className="flex-1 overflow-y-auto p-4"
        >
          <div className="flex flex-col gap-4">
            {messages.map((m) => (
              <div
                key={m.id}
                className={cn(
                  'flex gap-3 text-sm',
                  m.role === 'user' ? 'justify-end' : 'justify-start'
                )}
              >
                {m.role === 'assistant' && (
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                    <Bot className="h-5 w-5" />
                  </div>
                )}
                <div
                  className={cn(
                    'max-w-[80%] rounded-2xl px-4 py-2.5',
                    m.role === 'user'
                      ? 'rounded-br-none bg-primary text-primary-foreground'
                      : 'rounded-bl-none bg-muted'
                  )}
                >
                  <ReactMarkdown
                     components={{
                        p: ({ node, ...props }) => <p {...props} className="text-foreground" />,
                      }}
                  >{m.content}</ReactMarkdown>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                 <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                    <Bot className="h-5 w-5" />
                  </div>
                <div className="rounded-2xl rounded-bl-none bg-muted px-4 py-3">
                  <Loader2 className="h-5 w-5 animate-spin text-primary" />
                </div>
              </div>
            )}
          </div>
        </div>

        <footer className="border-t p-4">
          <form onSubmit={handleSubmit} className="relative">
            <Input
              value={input}
              onChange={handleInputChange}
              placeholder="Pergunte sobre um perfume..."
              className="h-12 rounded-full border-border bg-muted pr-12 text-base focus:bg-background"
            />
            <Button
              type="submit"
              size="icon"
              className="absolute right-1.5 top-1/2 h-9 w-9 -translate-y-1/2 rounded-full bg-primary text-primary-foreground"
              disabled={isLoading}
            >
              <Send className="h-5 w-5" />
            </Button>
          </form>
        </footer>
      </div>
    </>
  );
