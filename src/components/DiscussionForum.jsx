
import { useEffect, useState } from "react";
import { MessageSquare, Send, Trash2, Reply, X } from "lucide-react";

import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

function DiscussionForum({ courseId }) {
    const { user } = useAuth();

    const [discussions, setDiscussions] = useState([]);
    const [content, setContent] = useState("");
    const [replyContent, setReplyContent] = useState("");
    const [replyingTo, setReplyingTo] = useState(null);

    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");

    // FETCH DISCUSSIONS
    const fetchDiscussions = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await api.get(
                `/discussions/courses/${courseId}`
            );

            setDiscussions(response.data.data || []);
        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Failed to load discussions."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDiscussions();
    }, [courseId]);

    // CREATE DISCUSSION OR REPLY
    const handleSubmit = async (parentId = null) => {
        const message = parentId ? replyContent : content;

        if (!message.trim()) return;

        try {
            setSubmitting(true);
            setError("");

            await api.post(
                `/discussions/courses/${courseId}`,
                {
                    content: message.trim(),
                    ...(parentId && { parentId })
                }
            );

            setContent("");
            setReplyContent("");
            setReplyingTo(null);

            await fetchDiscussions();
        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Failed to send message."
            );
        } finally {
            setSubmitting(false);
        }
    };

    // DELETE DISCUSSION
    const handleDelete = async (postId) => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this post?"
        );

        if (!confirmed) return;

        try {
            await api.delete(`/discussions/${postId}`);
            await fetchDiscussions();
        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Failed to delete post."
            );
        }
    };

    if (loading) {
        return (
            <div className="flex flex-1 items-center justify-center text-sm text-gray-500">
                Loading discussions...
            </div>
        );
    }

    return (
        <div className="flex min-h-0 flex-1 flex-col overflow-y-auto p-4">

            {/* HEADER */}
            <div className="mb-5 flex items-center gap-3">
                <div className="rounded-xl bg-indigo-100 p-3 text-indigo-600">
                    <MessageSquare size={22} />
                </div>

                <div>
                    <h2 className="font-bold text-gray-900">
                        Course Discussion
                    </h2>
                    <p className="text-xs text-gray-500">
                        Ask questions and learn together
                    </p>
                </div>
            </div>

            {/* NEW DISCUSSION */}
            <div className="rounded-xl border border-gray-200 p-3">
                <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Ask a question or share something..."
                    rows={3}
                    className="w-full resize-none bg-transparent text-sm outline-none"
                />

                <div className="mt-2 flex justify-end">
                    <button
                        onClick={() => handleSubmit()}
                        disabled={submitting || !content.trim()}
                        className="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-xs font-semibold text-white hover:bg-indigo-700 disabled:opacity-50"
                    >
                        <Send size={14} />
                        Post
                    </button>
                </div>
            </div>

            {/* ERROR */}
            {error && (
                <p className="mt-3 rounded-lg bg-red-50 p-3 text-xs text-red-600">
                    {error}
                </p>
            )}

            {/* DISCUSSION LIST */}
            <div className="mt-5 space-y-4">
                {discussions.length === 0 ? (
                    <div className="py-10 text-center">
                        <MessageSquare
                            size={30}
                            className="mx-auto text-gray-300"
                        />
                        <p className="mt-3 text-sm font-semibold text-gray-700">
                            No discussions yet
                        </p>
                        <p className="mt-1 text-xs text-gray-500">
                            Start the conversation!
                        </p>
                    </div>
                ) : (
                    discussions.map((post) => (
                        <div
                            key={post.id}
                            className="rounded-xl border border-gray-200 p-3"
                        >
                            {/* MAIN POST */}
                            <div className="flex items-start justify-between gap-2">
                                <div>
                                    <p className="text-sm font-semibold text-gray-900">
                                        {post.author?.name || "Student"}
                                    </p>
                                    <p className="mt-1 whitespace-pre-wrap text-sm leading-6 text-gray-700">
                                        {post.content}
                                    </p>
                                    <p className="mt-2 text-[11px] text-gray-400">
                                        {new Date(post.createdAt).toLocaleString()}
                                    </p>
                                </div>

                                {post.userId === user?.id && (
                                    <button
                                        onClick={() => handleDelete(post.id)}
                                        className="rounded-lg p-2 text-gray-400 hover:bg-red-50 hover:text-red-600"
                                        title="Delete post"
                                    >
                                        <Trash2 size={15} />
                                    </button>
                                )}
                            </div>

                            {/* REPLY BUTTON */}
                            <button
                                onClick={() => {
                                    setReplyingTo(
                                        replyingTo === post.id ? null : post.id
                                    );
                                    setReplyContent("");
                                }}
                                className="mt-3 flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-700"
                            >
                                {replyingTo === post.id ? (
                                    <X size={14} />
                                ) : (
                                    <Reply size={14} />
                                )}
                                {replyingTo === post.id ? "Cancel" : "Reply"}
                            </button>

                            {/* REPLY INPUT */}
                            {replyingTo === post.id && (
                                <div className="mt-3">
                                    <textarea
                                        value={replyContent}
                                        onChange={(e) =>
                                            setReplyContent(e.target.value)
                                        }
                                        placeholder="Write your reply..."
                                        rows={2}
                                        className="w-full resize-none rounded-lg border border-gray-200 p-2 text-sm outline-none focus:border-indigo-400"
                                    />

                                    <button
                                        onClick={() => handleSubmit(post.id)}
                                        disabled={
                                            submitting ||
                                            !replyContent.trim()
                                        }
                                        className="mt-2 flex items-center gap-2 rounded-lg bg-indigo-600 px-3 py-2 text-xs font-semibold text-white hover:bg-indigo-700 disabled:opacity-50"
                                    >
                                        <Send size={13} />
                                        Send Reply
                                    </button>
                                </div>
                            )}

                            {/* REPLIES */}
                            {post.replies?.length > 0 && (
                                <div className="mt-4 space-y-3 border-l-2 border-indigo-100 pl-3">
                                    {post.replies.map((reply) => (
                                        <div key={reply.id}>
                                            <div className="flex items-start justify-between gap-2">
                                                <div>
                                                    <p className="text-xs font-semibold text-gray-800">
                                                        {reply.author?.name || "Student"}
                                                    </p>
                                                    <p className="mt-1 whitespace-pre-wrap text-xs leading-5 text-gray-600">
                                                        {reply.content}
                                                    </p>
                                                </div>

                                                {reply.userId === user?.id && (
                                                    <button
                                                        onClick={() => handleDelete(reply.id)}
                                                        className="text-gray-400 hover:text-red-600"
                                                        title="Delete reply"
                                                    >
                                                        <Trash2 size={13} />
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

export default DiscussionForum;
