import React, { useState, useEffect, useRef } from "react";
import client from "../api/client";
import Button from "./ui/Button";

export default function AIChatbot() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        {
            role: "model",
            content: "Hello! I am your MediLink AI Assistant. How can I help you navigate the portal or answer general healthcare questions today?"
        }
    ]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        if (isOpen) {
            scrollToBottom();
        }
    }, [messages, isOpen]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim() || loading) return;

        const userMessage = { role: "user", content: input };
        setMessages(prev => [...prev, userMessage]);
        setInput("");
        setLoading(true);

        try {
            // Map messages history to shape backend expects: { role, content }
            const history = messages.map(m => ({
                role: m.role,
                content: m.content
            }));

            const response = await client.post("/api/ai/chat", {
                message: userMessage.content,
                history: history
            });

            setMessages(prev => [...prev, {
                role: "model",
                content: response.data.response || "I'm sorry, I encountered an error. Please try again."
            }]);
        } catch (err) {
            console.error("AI response error:", err);
            setMessages(prev => [...prev, {
                role: "model",
                content: "System connection issues. Please try again later."
            }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed bottom-6 right-6 z-50 font-sans">
            {/* Toggle Button */}
            {!isOpen && (
                <button
                    onClick={() => setIsOpen(true)}
                    className="w-14 h-14 bg-teal-600 hover:bg-teal-700 text-white rounded-full flex items-center justify-center shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
                    title="Talk to MediLink AI"
                >
                    <span className="text-2xl">🤖</span>
                </button>
            )}

            {/* Chat Window */}
            {isOpen && (
                <div className="w-80 sm:w-96 h-[500px] bg-white rounded-3xl shadow-2xl border border-slate-100 flex flex-col overflow-hidden animate-in slide-in-from-bottom-6 fade-in duration-300">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-teal-600 to-teal-800 p-4 text-white flex items-center justify-between shadow-md">
                        <div className="flex items-center gap-2.5">
                            <div className="w-9 h-9 bg-white/10 rounded-xl flex items-center justify-center text-xl">
                                🤖
                            </div>
                            <div>
                                <h4 className="font-extrabold text-sm tracking-wide leading-tight">MediLink AI Assistant</h4>
                                <span className="text-[10px] text-teal-100 font-bold uppercase tracking-wider flex items-center gap-1.5 mt-0.5">
                                    <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></span>
                                    Online Helper
                                </span>
                            </div>
                        </div>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="text-white/80 hover:text-white text-lg font-bold w-8 h-8 rounded-lg hover:bg-white/10 flex items-center justify-center transition-all"
                        >
                            ✕
                        </button>
                    </div>

                    {/* Disclaimer banner */}
                    <div className="bg-amber-50 border-b border-amber-100/50 px-4 py-2 text-[10px] font-bold text-amber-700 leading-normal flex items-start gap-1.5">
                        <span className="text-xs">⚠️</span>
                        <span>
                            Not a substitute for professional medical advice. Consult doctors for diagnoses.
                        </span>
                    </div>

                    {/* Messages list */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50">
                        {messages.map((m, idx) => (
                            <div
                                key={idx}
                                className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
                            >
                                <div
                                    className={`max-w-[80%] rounded-2xl p-3 text-xs font-semibold leading-relaxed shadow-sm
                                      ${m.role === "user"
                                        ? "bg-teal-600 text-white rounded-tr-none"
                                        : "bg-white text-slate-800 border border-slate-100 rounded-tl-none"
                                      }`}
                                >
                                    {m.content}
                                </div>
                            </div>
                        ))}
                        {loading && (
                            <div className="flex justify-start">
                                <div className="bg-white text-slate-500 border border-slate-100 rounded-2xl rounded-tl-none p-3 text-xs font-semibold flex items-center gap-1.5">
                                    <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"></span>
                                    <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                                    <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Footer Input */}
                    <form onSubmit={handleSend} className="p-3 border-t border-slate-50 bg-white flex gap-2">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Type a message or ask a question..."
                            className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 focus:border-teal-500 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-teal-500/10 transition-all placeholder:text-slate-400 text-slate-800"
                        />
                        <Button type="submit" size="sm" className="!py-2" disabled={loading}>
                            Send
                        </Button>
                    </form>
                </div>
            )}
        </div>
    );
}
