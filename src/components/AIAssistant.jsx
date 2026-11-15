import { useEffect, useRef, useState } from "react";

import {
    Bot,
    UserRound,
    Send,
    Sparkles,
    Loader2,
    MessageCircle
} from "lucide-react";

import api from "../api/axios";

function AIAssistant({ courseId, lessonId, lessonTitle }) {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const chatEndRef = useRef(null);

    // AUTO SCROLL TO LATEST MESSAGE
    useEffect(() => {
        chatEndRef.current?.scrollIntoView({
            behavior: "smooth",
            block: "end"
        });
    }, [messages, loading]);

    const handleSendMessage = async (e) => {
        e.preventDefault();

        const message = input.trim();

        if (!message || loading) return;

        try {
            setLoading(true);
            setError("");
            setInput("");

            // Previous conversation history
            const history = messages
                .filter(
                    (item) =>
                        item.role === "user" ||
                        item.role === "model"
                )
                .slice(-20)
                .map((item) => ({
                    role: item.role,
                    content: item.content
                }));

            // Display user's message immediately
            setMessages((prev) => [
                ...prev,
                {
                    role: "user",
                    content: message
                }
            ]);

            // Send request to backend
            const response = await api.post("/ai/chat", {
                courseId: Number(courseId),
                lessonId: Number(lessonId),
                message,
                history
            });

            const aiAnswer = response.data.data.answer;

            // Display AI response
            setMessages((prev) => [
                ...prev,
                {
                    role: "model",
                    content: aiAnswer
                }
            ]);
        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Failed to get AI response. Please try again."
            );

            // Restore input if request fails
            setInput(message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex h-full min-h-0 flex-col">

            {/* AI HEADER */}
            <div className="flex shrink-0 items-center gap-3 border-b border-gray-200 p-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
                    <Sparkles size={21} />
                </div>

                <div className="min-w-0">
                    <h3 className="truncate text-sm font-bold text-gray-900">
                        LearnSphere AI
                    </h3>

                    <p className="mt-1 text-xs text-gray-500">
                        Your learning companion
                    </p>
                </div>

                <span className="ml-auto shrink-0 rounded-full bg-green-100 px-2.5 py-1 text-[10px] font-semibold text-green-700">
                    AI Online
                </span>
            </div>

            {/* CHAT AREA */}
            <div className="min-h-0 flex-1 space-y-4 overflow-y-auto overscroll-contain p-4">

                {/* WELCOME MESSAGE */}
                {messages.length === 0 && (
                    <div className="flex min-h-full flex-col items-center justify-center py-6 text-center">

                        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                            <Bot size={30} />
                        </div>

                        <h3 className="text-base font-bold text-gray-900">
                            Hi! How can I help?
                        </h3>

                        <p className="mt-2 text-xs leading-6 text-gray-500">
                            Ask me anything about your current lesson,
                            course concepts, or general study topics.
                        </p>

                        <div className="mt-5 w-full rounded-xl border border-blue-100 bg-blue-50 p-3 text-left">
                            <p className="text-[10px] font-semibold text-blue-600">
                                CURRENT LESSON
                            </p>

                            <p className="mt-1.5 text-xs font-semibold text-gray-800">
                                {lessonTitle || "General Study"}
                            </p>
                        </div>

                        <div className="mt-5 flex w-full flex-col gap-2">
                            {[
                                "Explain this lesson simply",
                                "Give me an example",
                                "Quiz me on this topic"
                            ].map((suggestion) => (
                                <button
                                    key={suggestion}
                                    type="button"
                                    onClick={() => setInput(suggestion)}
                                    className="rounded-xl border border-gray-200 px-3 py-2.5 text-left text-xs font-medium text-gray-600 transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-600"
                                >
                                    {suggestion}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* CHAT MESSAGES */}
                {messages.map((message, index) => (
                    <div
                        key={index}
                        className={`flex items-start gap-2 ${
                            message.role === "user"
                                ? "flex-row-reverse"
                                : ""
                        }`}
                    >
                        <div
                            className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                                message.role === "user"
                                    ? "bg-blue-600 text-white"
                                    : "bg-blue-100 text-blue-600"
                            }`}
                        >
                            {message.role === "user" ? (
                                <UserRound size={16} />
                            ) : (
                                <Bot size={17} />
                            )}
                        </div>

                        <div
                            className={`max-w-[85%] break-words rounded-2xl px-3 py-2.5 ${
                                message.role === "user"
                                    ? "rounded-tr-sm bg-blue-600 text-white"
                                    : "rounded-tl-sm border border-gray-200 bg-gray-50 text-gray-700"
                            }`}
                        >
                            <p className="whitespace-pre-wrap text-xs leading-6">
                                {message.content}
                            </p>
                        </div>
                    </div>
                ))}

                {/* LOADING INDICATOR */}
                {loading && (
                    <div className="flex items-start gap-2">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                            <Bot size={17} />
                        </div>

                        <div className="flex items-center gap-2 rounded-2xl rounded-tl-sm border border-gray-200 bg-gray-50 px-3 py-2.5">
                            <Loader2
                                size={15}
                                className="animate-spin text-blue-600"
                            />

                            <span className="text-xs text-gray-500">
                                AI is thinking...
                            </span>
                        </div>
                    </div>
                )}

                {/* ERROR MESSAGE */}
                {error && (
                    <div className="rounded-xl bg-red-50 px-3 py-2.5 text-xs text-red-600">
                        {error}
                    </div>
                )}

                <div ref={chatEndRef} />
            </div>

            {/* MESSAGE INPUT - FIXED AT BOTTOM */}
            <form
                onSubmit={handleSendMessage}
                className="shrink-0 border-t border-gray-200 bg-white p-3"
            >
                <div className="flex items-end gap-2 rounded-xl border border-gray-200 bg-gray-50 p-2 transition focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-50">

                    <textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => {
                            if (
                                e.key === "Enter" &&
                                !e.shiftKey
                            ) {
                                e.preventDefault();
                                e.currentTarget.form?.requestSubmit();
                            }
                        }}
                        placeholder="Ask anything..."
                        rows={2}
                        maxLength={2000}
                        disabled={loading}
                        className="max-h-24 min-h-10 flex-1 resize-none bg-transparent px-2 py-2 text-xs text-gray-700 outline-none placeholder:text-gray-400 disabled:opacity-60"
                    />

                    <button
                        type="submit"
                        disabled={!input.trim() || loading}
                        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-600 text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                        aria-label="Send message"
                    >
                        <Send size={17} />
                    </button>
                </div>

                <p className="mt-2 flex items-center justify-center gap-1.5 text-[10px] text-gray-400">
                    <MessageCircle size={11} />
                    AI can make mistakes. Verify important information.
                </p>
            </form>
        </div>
    );
}

export default AIAssistant;