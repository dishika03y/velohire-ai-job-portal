import React, { useState, useRef, useEffect } from "react";
import { Send, MessageCircle, X, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { TypeAnimation } from "react-type-animation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      text: "Hi! I'm your Velo Assistant. Looking for a role or hiring talent today?",
      sender: "bot",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const chatWindowRef = useRef(null);

  useEffect(() => {
    if (chatWindowRef.current) {
      chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMessage = { text: input, sender: "user" };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch("http://127.0.0.1:5000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      });
      const data = await response.json();
      setMessages((prev) => [
        ...prev,
        {
          text: data.reply || "I'm processing that. One moment.",
          sender: "bot",
        },
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          text: "Connection issues. Please check your backend.",
          sender: "bot",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-8 right-8 z-50">
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            layoutId="chat-box"
            onClick={() => setIsOpen(true)}
            className="bg-slate-950 text-primary p-4 rounded-2xl shadow-2xl border border-white/10 hover:scale-110 transition-transform duration-300"
          >
            <MessageCircle size={28} />
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
            </span>
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            layoutId="chat-box"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="w-96 bg-white shadow-[0_20px_50px_rgba(0,0,0,0.15)] rounded-3xl overflow-hidden border border-slate-200"
          >
            {/* Header */}
            <div className="flex justify-between items-center bg-slate-950 p-4 text-white">
              <div className="flex items-center gap-2">
                <Sparkles className="text-primary w-4 h-4 animate-pulse" />
                <h2 className="text-xs font-bold uppercase tracking-[0.2em]">
                  Velo Assistant
                </h2>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-slate-400 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Chat Area */}
            <div
              className="h-[400px] overflow-y-auto p-4 bg-slate-50/50 flex flex-col space-y-4"
              ref={chatWindowRef}
            >
              {messages.map((msg, index) => (
                <motion.div
                  initial={{ opacity: 0, x: msg.sender === "user" ? 10 : -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  key={index}
                  className={`flex items-end gap-2 ${msg.sender === "user" ? "flex-row-reverse" : ""}`}
                >
                  <Avatar className="w-7 h-7 border border-slate-200">
                    <AvatarFallback
                      className={
                        msg.sender === "bot"
                          ? "bg-slate-900 text-primary text-[10px]"
                          : "bg-primary text-white text-[10px]"
                      }
                    >
                      {msg.sender === "bot" ? "VA" : "ME"}
                    </AvatarFallback>
                  </Avatar>
                  <div
                    className={`px-4 py-2.5 rounded-2xl text-sm max-w-[75%] shadow-sm ${
                      msg.sender === "user"
                        ? "bg-primary text-white rounded-br-none"
                        : "bg-white text-slate-700 border border-slate-100 rounded-bl-none"
                    }`}
                  >
                    {msg.text}
                  </div>
                </motion.div>
              ))}
              {loading && (
                <div className="flex items-center gap-2 opacity-50">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" />
                  <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce [animation-delay:0.2s]" />
                  <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce [animation-delay:0.4s]" />
                </div>
              )}
            </div>

            {/* Input Area */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                sendMessage();
              }}
              className="p-4 bg-white border-t border-slate-100 flex items-center gap-2"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about jobs, skills..."
                className="flex-1 text-sm outline-none bg-slate-100 px-4 py-2 rounded-xl focus:ring-1 focus:ring-primary/30 transition-all"
              />
              <Button
                type="submit"
                size="icon"
                className="rounded-xl h-9 w-9 bg-slate-950 hover:bg-slate-800 transition-all"
              >
                <Send size={14} className="text-primary" />
              </Button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Chatbot;
