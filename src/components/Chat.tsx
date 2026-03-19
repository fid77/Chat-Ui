import React, { useState, useEffect, useRef } from 'react';
import { Send, Smile, MoreVertical, Phone, Video, Check, CheckCheck, Paperclip } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import EmojiPicker, { Theme } from 'emoji-picker-react';
import { format } from 'date-fns';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  status: 'sent' | 'delivered' | 'read';
}

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Salut ! Comment ça va ? 👋',
      sender: 'bot',
      timestamp: new Date(Date.now() - 1000 * 60 * 5),
      status: 'read',
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = () => {
    if (!inputValue.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: 'user',
      timestamp: new Date(),
      status: 'sent',
    };

    setMessages((prev) => [...prev, newMessage]);
    setInputValue('');
    setShowEmojiPicker(false);

    // Simulate bot response
    setTimeout(() => {
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: "C'est super ! Je suis une interface de chat construite avec React et Tailwind CSS. ✨",
        sender: 'bot',
        timestamp: new Date(),
        status: 'read',
      };
      setMessages((prev) => [...prev, botResponse]);
    }, 1000);
  };

  const onEmojiClick = (emojiData: any) => {
    setInputValue((prev) => prev + emojiData.emoji);
  };

  return (
    <div className="flex flex-col h-screen bg-[#f0f2f5] font-sans text-[#111b21]">
      {/* Header */}
      <header className="bg-[#f0f2f5] px-4 py-2 flex items-center justify-between border-b border-gray-300 shadow-sm z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center text-white font-bold shadow-inner">
            VC
          </div>
          <div>
            <h1 className="font-semibold text-base leading-tight">VibeChat Bot</h1>
            <p className="text-xs text-emerald-600 font-medium">En ligne</p>
          </div>
        </div>
        <div className="flex items-center gap-5 text-gray-600">
          <Video className="w-5 h-5 cursor-pointer hover:text-gray-900 transition-colors" />
          <Phone className="w-5 h-5 cursor-pointer hover:text-gray-900 transition-colors" />
          <MoreVertical className="w-5 h-5 cursor-pointer hover:text-gray-900 transition-colors" />
        </div>
      </header>

      {/* Chat Area */}
      <main className="flex-1 overflow-y-auto p-4 space-y-3 bg-[url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png')] bg-repeat">
        <AnimatePresence initial={false}>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[75%] px-3 py-2 rounded-lg shadow-sm relative group ${
                  msg.sender === 'user'
                    ? 'bg-[#dcf8c6] rounded-tr-none'
                    : 'bg-white rounded-tl-none'
                }`}
              >
                <p className="text-[14.2px] leading-relaxed pr-12 whitespace-pre-wrap break-words">
                  {msg.text}
                </p>
                <div className="absolute bottom-1 right-2 flex items-center gap-1">
                  <span className="text-[10px] text-gray-500">
                    {format(msg.timestamp, 'HH:mm')}
                  </span>
                  {msg.sender === 'user' && (
                    <span className="text-emerald-500">
                      {msg.status === 'read' ? (
                        <CheckCheck className="w-3 h-3" />
                      ) : (
                        <Check className="w-3 h-3" />
                      )}
                    </span>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </main>

      {/* Input Area */}
      <footer className="bg-[#f0f2f5] p-2 relative">
        {showEmojiPicker && (
          <div className="absolute bottom-full left-0 w-full z-20">
            <EmojiPicker
              onEmojiClick={onEmojiClick}
              width="100%"
              height={350}
              theme={Theme.LIGHT}
              searchDisabled
              skinTonesDisabled
            />
          </div>
        )}
        <div className="flex items-center gap-2 bg-white rounded-full px-4 py-1 shadow-sm border border-gray-200">
          <button
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <Smile className="w-6 h-6" />
          </button>
          <button className="text-gray-500 hover:text-gray-700 transition-colors">
            <Paperclip className="w-5 h-5" />
          </button>
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Tapez un message"
            className="flex-1 py-2 outline-none text-sm placeholder:text-gray-400"
          />
          <button
            onClick={handleSend}
            disabled={!inputValue.trim()}
            className={`transition-all duration-200 ${
              inputValue.trim() ? 'text-emerald-600 scale-110' : 'text-gray-400'
            }`}
          >
            <Send className="w-6 h-6" />
          </button>
        </div>
      </footer>
    </div>
  );
}
