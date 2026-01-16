import React, { useState, useRef, useEffect } from 'react';
import { X, Send, Bot, User, Loader2 } from 'lucide-react';
import { generateERPInsight } from '../services/geminiService';

interface AIAssistantProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Message {
  id: string;
  role: 'user' | 'assistant';
  text: string;
}

export const AIAssistant: React.FC<AIAssistantProps> = ({ isOpen, onClose }) => {
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', role: 'assistant', text: 'Hello, I am Nexus AI. I have full access to your ERP database. How can I help you optimize your operations today?' }
  ]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg: Message = { id: Date.now().toString(), role: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    const response = await generateERPInsight(input);
    
    setIsLoading(false);
    const aiMsg: Message = { id: (Date.now() + 1).toString(), role: 'assistant', text: response };
    setMessages(prev => [...prev, aiMsg]);
  };

  return (
    <div className={`
      fixed inset-y-0 right-0 w-96 bg-white shadow-2xl transform transition-transform duration-300 z-[60] flex flex-col
      ${isOpen ? 'translate-x-0' : 'translate-x-full'}
    `}>
      <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-indigo-600 text-white">
        <div className="flex items-center space-x-2">
          <Bot size={20} />
          <h2 className="font-semibold">Nexus Intelligence</h2>
        </div>
        <button onClick={onClose} className="hover:bg-indigo-700 p-1 rounded">
          <X size={20} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`
              max-w-[85%] rounded-2xl px-4 py-3 text-sm
              ${msg.role === 'user' 
                ? 'bg-indigo-600 text-white rounded-br-none' 
                : 'bg-white border border-slate-200 text-slate-800 rounded-bl-none shadow-sm'}
            `}>
              <div className="flex items-center space-x-2 mb-1 opacity-70 text-xs">
                 {msg.role === 'user' ? <User size={10} /> : <Bot size={10} />}
                 <span>{msg.role === 'user' ? 'You' : 'Nexus AI'}</span>
              </div>
              <p className="leading-relaxed whitespace-pre-wrap">{msg.text}</p>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
             <div className="bg-white border border-slate-200 rounded-2xl rounded-bl-none px-4 py-3 shadow-sm flex items-center space-x-2">
                <Loader2 size={16} className="animate-spin text-indigo-600" />
                <span className="text-sm text-slate-500">Analyzing ERP data...</span>
             </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 border-t border-slate-200 bg-white">
        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask about sales, stock, or risk..."
            className="flex-1 border border-slate-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
          />
          <button 
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            className="bg-indigo-600 text-white p-2 rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors"
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};