'use client';

import { useState, useRef, useEffect } from 'react';
import { Bot, X, Send, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import ReactMarkdown from 'react-markdown';

type Message = {
  text: string;
  type: 'user' | 'ai';
};

export function ChatComponent() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatMessagesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatMessagesRef.current) {
      chatMessagesRef.current.scrollTop = chatMessagesRef.current.scrollHeight;
    }
  }, [messages]);

  const toggleChat = () => {
    setIsOpen(!isOpen);
    if (!isOpen && messages.length === 0) {
        // Add initial greeting when chat is opened for the first time
        setMessages([{ text: 'Olá! 👋 Sou seu assistente de fragrâncias. Como posso ajudar a encontrar seu perfume ideal hoje?', type: 'ai' }]);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    const messageText = input.trim();
    if (!messageText) return;

    // Add user message to chat
    setMessages(prev => [...prev, { text: messageText, type: 'user' }]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: messageText }),
      });

      if (!response.ok) {
        throw new Error('A resposta da rede não foi boa.');
      }

      const data = await response.json();
      setMessages(prev => [...prev, { text: data.reply, type: 'ai' }]);

    } catch (err) {
      setMessages(prev => [...prev, { text: 'Desculpe, estou com problemas para me conectar. Tente novamente mais tarde.', type: 'ai' }]);
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <>
      {/* Botão flutuante */}
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={toggleChat}
          size="icon"
          className="rounded-full w-16 h-16 bg-primary text-primary-foreground shadow-lg hover:bg-primary/90"
        >
          {isOpen ? <X className="w-8 h-8" /> : <Bot className="w-8 h-8" />}
        </Button>
      </div>

      {/* Janela do Chat */}
      <div
        className={cn(
          'fixed bottom-24 right-6 z-50 w-[350px] h-[500px] bg-card border border-border rounded-2xl shadow-2xl flex flex-col transition-all duration-300',
          isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
        )}
      >
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="font-bold text-lg">Assistente Virtual</h3>
        </div>
        <div ref={chatMessagesRef} className="flex-1 p-4 overflow-y-auto space-y-4">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={cn(
                'p-3 rounded-lg max-w-[85%] prose prose-sm',
                msg.type === 'user' ? 'bg-primary text-primary-foreground self-end rounded-br-none ml-auto' : 'bg-muted text-foreground self-start rounded-bl-none'
              )}
            >
              <ReactMarkdown
                components={{
                  p: ({node, ...props}) => <p className="mb-2 last:mb-0" {...props} />,
                  ol: ({node, ...props}) => <ol className="list-decimal list-inside" {...props} />,
                  ul: ({node, ...props}) => <ul className="list-disc list-inside" {...props} />,
                  li: ({node, ...props}) => <li className="mb-1" {...props} />,
                }}
              >
                {msg.text}
              </ReactMarkdown>
            </div>
          ))}
           {isLoading && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground self-start">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Digitando...</span>
            </div>
          )}
        </div>
        <form onSubmit={handleSendMessage} className="p-4 border-t flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Digite sua mensagem..."
            className="flex-1 p-2 border rounded-full outline-none text-sm text-foreground bg-muted focus:ring-2 focus:ring-primary"
            disabled={isLoading}
          />
          <Button type="submit" size="icon" className="rounded-full w-10 h-10" disabled={isLoading}>
            <Send className="w-5 h-5" />
          </Button>
        </form>
      </div>
    </>
  );
}
