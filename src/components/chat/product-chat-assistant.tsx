'use client';

import { useChat } from '@ai-sdk/react';

export default function ProductChatAssistant() {
  const { messages, input, handleInputChange, handleSubmit } = useChat({
    api: '/api/chat',
    // Adicione isso para monitorar erros se o servidor cair
    onError: (error) => {
      console.error("Erro no chat:", error);
      alert("Ocorreu um erro ao enviar a mensagem. Verifique o console.");
    }
  });

  return (
    <div className="flex flex-col h-screen p-4">
      <div className="flex-1 overflow-y-auto mb-4">
        {messages.map(m => (
          <div key={m.id} className={`mb-4 ${m.role === 'user' ? 'text-right' : 'text-left'}`}>
            <span className={`inline-block p-2 rounded ${m.role === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black'}`}>
              {m.content}
            </span>
          </div>
        ))}
      </div>

      {/* O onSubmit PRECISA ser o handleSubmit do useChat */}
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          className="flex-1 p-2 border border-gray-300 rounded text-black"
          value={input}
          onChange={handleInputChange}
          placeholder="Digite sua mensagem..."
        />
        <button 
          type="submit" 
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Enviar
        </button>
      </form>
    </div>
  );
}