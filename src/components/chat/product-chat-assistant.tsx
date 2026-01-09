'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { MessageSquare, Send, X, Bot, Loader2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import ReactMarkdown from 'react-markdown';
import { productChatAction } from '@/app/actions';
import { useAuth, useUser } from '@/firebase';

interface Message {
  role: 'user' | 'model';
  content: string;
}

export default function ProductChatAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isPending, setIsPending] = useState(false);

  const { user } = useUser();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: Message = { role: 'user', content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsPending(true);

    const history = messages.map((msg) => ({
      role: msg.role,
      content: [{ text: msg.content }],
    }));

    try {
      const stream = await productChatAction(history, input);
      let modelResponse = '';
      
      setMessages((prev) => [...prev, { role: 'model', content: '' }]);

      for await (const chunk of stream) {
        modelResponse += chunk.content?.[0]?.text || '';
        setMessages((prev) =>
          prev.map((msg, index) =>
            index === prev.length - 1
              ? { ...msg, content: modelResponse }
              : msg
          )
        );
      }
    } catch (error) {
      console.error('Error streaming response:', error);
      const errorMessage: Message = {
        role: 'model',
        content: 'Desculpe, ocorreu um erro ao tentar me comunicar. Tente novamente.',
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsPending(false);
    }
  };
  
  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 h-16 w-16 rounded-full bg-primary shadow-2xl shadow-primary/40 transition-transform hover:scale-110"
      >
        <Bot className="h-8 w-8 text-primary-foreground" />
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="flex h-[80vh] max-h-[800px] w-[90vw] max-w-lg flex-col p-0">
          <DialogHeader className="border-b p-4">
            <DialogTitle className="flex items-center gap-2">
              <Bot />
              Especialista em Perfumes
            </DialogTitle>
          </DialogHeader>
          <div className="flex-1 overflow-y-auto p-6">
            <div className="flex flex-col gap-4">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={cn(
                    'flex items-start gap-3',
                    message.role === 'user' ? 'justify-end' : 'justify-start'
                  )}
                >
                  {message.role === 'model' && (
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-primary text-primary-foreground"><Bot size={20}/></AvatarFallback>
                    </Avatar>
                  )}
                  <div
                    className={cn(
                      'max-w-[80%] rounded-2xl px-4 py-3 text-sm',
                      message.role === 'user'
                        ? 'rounded-br-none bg-primary text-primary-foreground'
                        : 'rounded-bl-none bg-muted'
                    )}
                  >
                     {message.content ? (
                        <ReactMarkdown
                            className="prose prose-sm dark:prose-invert"
                            components={{
                                p: ({node, ...props}) => <p className="mb-0" {...props} />,
                            }}
                        >
                            {message.content}
                        </ReactMarkdown>
                        ) : (
                        <div className="flex items-center gap-2">
                            <Loader2 className="h-4 w-4 animate-spin" />
                            <span>Pensando...</span>
                        </div>
                    )}
                  </div>
                  {message.role === 'user' && user && (
                     <Avatar className="h-8 w-8">
                      <AvatarImage src={user.photoURL || undefined} alt="User" />
                      <AvatarFallback>{user.displayName?.charAt(0) || user.email?.charAt(0)}</AvatarFallback>
                    </Avatar>
                  )}
                </div>
              ))}
               <div ref={messagesEndRef} />
            </div>
          </div>
          <DialogFooter className="border-t p-4">
            <form onSubmit={handleSendMessage} className="flex w-full items-center gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Qual perfume você procura?"
                className="flex-1 rounded-full"
                disabled={isPending}
              />
              <Button type="submit" size="icon" className="rounded-full" disabled={isPending}>
                 {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              </Button>
            </form>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
