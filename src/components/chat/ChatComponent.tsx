'use client';

import { useChat } from '@ai-sdk/react';
import { useRef, useEffect } from 'react';
import { Send, Bot } from 'lucide-react';

export default function ChatComponent() {
  // Inicializamos o useChat
  const { messages, input, handleInputChange, handleSubmit, isLoading, error } = useChat({
    api: '/api/chat',
  });

  const scrollRef = useRef<HTMLDivElement>(null);

  // Faz o chat rolar para baixo automaticamente
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="flex flex-col w-[350px] h-[500px] bg-card dark:bg-card-dark border border-border shadow-2xl rounded-2xl overflow-hidden">
      {/* Cabeçalho */}
      <div className="bg-primary p-4 text-primary-foreground flex items-center gap-2">
        <Bot size={20} className="text-white" />
        <h3 className="font-bold text-sm text-white">Assistente de Perfumes</h3>
      </div>

      {/* Área das Mensagens */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50 dark:bg-zinc-950">
        {messages.map((m) => (
          <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] p-3 rounded-2xl text-sm ${
              m.role === 'user' 
                ? 'bg-primary text-primary-foreground rounded-tr-none' 
                : 'bg-white dark:bg-zinc-800 border border-border rounded-tl-none text-foreground'
            }`}>
              {m.content}
            </div>
          </div>
        ))}
        {isLoading && <div className="text-xs text-muted-foreground animate-pulse">Digitando...</div>}
        {error && <div className="text-xs text-red-500">Erro ao enviar mensagem.</div>}
      </div>

      {/* --- O CÓDIGO QUE VOCÊ PERGUNTOU ENTRA AQUI (Formulário) --- */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (!input?.trim()) return; 
          handleSubmit(e);
        }}
        className="p-3 border-t border-border bg-white dark:bg-zinc-900"
      >
        <div className="flex gap-2">
          <input
            className="flex-1 p-2 border rounded-md outline-none text-sm text-black border-gray-200 focus:border-primary"
            value={input ?? ''} 
            placeholder="Tire sua dúvida..."
            onChange={handleInputChange}
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !input?.trim()} 
            className="bg-primary text-white p-2 rounded-md hover:opacity-90 disabled:bg-gray-300 transition-all"
          >
            <Send size={18} />
          </button>
        </div>
      </form>
    </div>
  );
}
