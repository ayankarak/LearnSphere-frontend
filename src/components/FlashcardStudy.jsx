
import { useEffect, useState } from "react";
import {
    Sparkles,
    RotateCw,
    ChevronLeft,
    ChevronRight,
    Layers,
    RefreshCw
} from "lucide-react";

import api from "../api/axios";

function FlashcardStudy({ lessonId }) {
    const [flashcards, setFlashcards] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);

    const [flipped, setFlipped] = useState(false);
    const [loading, setLoading] = useState(true);
    const [generating, setGenerating] = useState(false);
    const [error, setError] = useState("");

    // FETCH EXISTING FLASHCARDS
    const fetchFlashcards = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await api.get(
                `/flashcards/lessons/${lessonId}`
            );

            const cards = response.data.data?.flashcards || [];

            setFlashcards(cards);
            setCurrentIndex(0);
            setFlipped(false);
        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Failed to load flashcards."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFlashcards();
    }, [lessonId]);

    // GENERATE FLASHCARDS
    const handleGenerate = async () => {
        try {
            setGenerating(true);
            setError("");

            const response = await api.post(
                `/flashcards/lessons/${lessonId}/generate`
            );

            const cards = response.data.data?.flashcards || [];

            setFlashcards(cards);
            setCurrentIndex(0);
            setFlipped(false);
        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Failed to generate flashcards."
            );
        } finally {
            setGenerating(false);
        }
    };

    // NAVIGATION
    const handlePrevious = () => {
        if (currentIndex > 0) {
            setCurrentIndex((prev) => prev - 1);
            setFlipped(false);
        }
    };

    const handleNext = () => {
        if (currentIndex < flashcards.length - 1) {
            setCurrentIndex((prev) => prev + 1);
            setFlipped(false);
        }
    };

    if (loading) {
        return (
            <div className="flex flex-1 items-center justify-center text-sm text-gray-500">
                Loading flashcards...
            </div>
        );
    }

    return (
        <div className="flex min-h-0 flex-1 flex-col overflow-y-auto p-5">

            {/* HEADER */}
            <div className="flex items-center gap-3">
                <div className="rounded-xl bg-purple-100 p-3 text-purple-600">
                    <Layers size={22} />
                </div>

                <div>
                    <h2 className="font-bold text-gray-900">
                        AI Flashcards
                    </h2>

                    <p className="text-xs text-gray-500">
                        Improve your learning
                    </p>
                </div>
            </div>

            {/* ERROR */}
            {error && (
                <p className="mt-4 rounded-xl bg-red-50 p-3 text-sm text-red-600">
                    {error}
                </p>
            )}

            {/* EMPTY STATE */}
            {flashcards.length === 0 && (
                <div className="flex flex-1 flex-col items-center justify-center py-10 text-center">

                    <div className="rounded-2xl bg-purple-100 p-5 text-purple-600">
                        <Sparkles size={35} />
                    </div>

                    <h3 className="mt-5 text-lg font-bold text-gray-900">
                        Ready to Practice?
                    </h3>

                    <p className="mt-2 text-sm leading-6 text-gray-500">
                        Generate AI-powered flashcards
                        to remember important lesson concepts.
                    </p>

                    <button
                        onClick={handleGenerate}
                        disabled={generating}
                        className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-purple-600 px-5 py-3 font-semibold text-white transition hover:bg-purple-700 disabled:opacity-60"
                    >
                        <Sparkles size={18} />

                        {generating
                            ? "Generating..."
                            : "Generate Flashcards"}
                    </button>
                </div>
            )}

            {/* FLASHCARD STUDY */}
            {flashcards.length > 0 && (
                <div className="flex flex-1 flex-col">

                    {/* PROGRESS */}
                    <div className="mt-7 flex items-center justify-between text-sm">
                        <span className="font-semibold text-gray-700">
                            Card {currentIndex + 1} of {flashcards.length}
                        </span>

                        <span className="text-gray-500">
                            {Math.round(
                                ((currentIndex + 1) / flashcards.length) * 100
                            )}%
                        </span>
                    </div>

                    <div className="mt-3 h-2 overflow-hidden rounded-full bg-gray-100">
                        <div
                            className="h-full rounded-full bg-purple-600 transition-all duration-300"
                            style={{
                                width: `${((currentIndex + 1) / flashcards.length) * 100}%`
                            }}
                        />
                    </div>

                    {/* FLIP CARD */}
                    <div
                        className="mt-7 cursor-pointer"
                        style={{ perspective: "1000px" }}
                        onClick={() => setFlipped((prev) => !prev)}
                    >
                        <div
                            className="relative h-64 w-full transition-transform duration-500"
                            style={{
                                transformStyle: "preserve-3d",
                                transform: flipped
                                    ? "rotateY(180deg)"
                                    : "rotateY(0deg)"
                            }}
                        >

                            {/* FRONT */}
                            <div
                                className="absolute inset-0 flex flex-col items-center justify-center rounded-2xl border border-purple-200 bg-purple-50 p-5 text-center"
                                style={{ backfaceVisibility: "hidden" }}
                            >
                                <span className="text-xs font-bold uppercase tracking-wider text-purple-600">
                                    Question
                                </span>

                                <h3 className="mt-5 text-lg font-bold leading-7 text-gray-900">
                                    {flashcards[currentIndex].question}
                                </h3>

                                <p className="mt-5 flex items-center gap-2 text-xs text-purple-500">
                                    <RotateCw size={14} />
                                    Tap to reveal answer
                                </p>
                            </div>

                            {/* BACK */}
                            <div
                                className="absolute inset-0 flex flex-col items-center justify-center rounded-2xl border border-green-200 bg-green-50 p-5 text-center"
                                style={{
                                    backfaceVisibility: "hidden",
                                    transform: "rotateY(180deg)"
                                }}
                            >
                                <span className="text-xs font-bold uppercase tracking-wider text-green-600">
                                    Answer
                                </span>

                                <p className="mt-5 text-base leading-7 text-gray-800">
                                    {flashcards[currentIndex].answer}
                                </p>

                                <p className="mt-5 flex items-center gap-2 text-xs text-green-600">
                                    <RotateCw size={14} />
                                    Tap to see question
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* NAVIGATION */}
                    <div className="mt-6 flex items-center justify-between gap-3">

                        <button
                            onClick={handlePrevious}
                            disabled={currentIndex === 0}
                            className="flex items-center gap-1 rounded-xl border border-gray-200 px-4 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-40"
                        >
                            <ChevronLeft size={17} />
                            Previous
                        </button>

                        <button
                            onClick={handleNext}
                            disabled={currentIndex === flashcards.length - 1}
                            className="flex items-center gap-1 rounded-xl bg-purple-600 px-4 py-3 text-sm font-semibold text-white hover:bg-purple-700 disabled:opacity-40"
                        >
                            Next
                            <ChevronRight size={17} />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default FlashcardStudy;
