
import { useEffect, useState } from "react";
import {
    Link,
    useParams,
    useSearchParams,
} from "react-router-dom";

import {
    ArrowLeft,
    ArrowRight,
    BookOpen,
    CheckCircle,
    Clock,
    PlayCircle,
    UserRound,
    Check,
} from "lucide-react";

import Navbar from "../components/Navbar";
import api from "../api/axios";

function CourseLearning() {
    const { courseId } = useParams();

    const [searchParams, setSearchParams] = useSearchParams();

    const selectedLessonId = Number(searchParams.get("lessonId"));

    const [course, setCourse] = useState(null);
    const [activeLessonId, setActiveLessonId] = useState(null);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [activeTab, setActiveTab] = useState("Overview");

    // PROGRESS STATES
    const [completedLessons, setCompletedLessons] = useState([]);
    const [progress, setProgress] = useState({
        totalLessons: 0,
        completedLessons: 0,
        percentage: 0,
    });

    const [completing, setCompleting] = useState(false);
    const [progressError, setProgressError] = useState("");

    // FETCH COURSE
    useEffect(() => {
        const fetchCourse = async () => {
            try {
                setLoading(true);
                setError("");

                const response = await api.get(`/courses/${courseId}`);

                setCourse(response.data.course);
            } catch (error) {
                setError(
                    error.response?.data?.message ||
                    "Failed to load course."
                );
            } finally {
                setLoading(false);
            }
        };

        fetchCourse();
    }, [courseId]);

    // SORT LESSONS
    const lessons = [...(course?.lessons || [])].sort(
        (a, b) => a.position - b.position
    );

    // FETCH COURSE PROGRESS
    const fetchProgress = async () => {
        try {
            const [progressResponse, completedResponse] =
                await Promise.all([
                    api.get(`/progress/course/${courseId}`),
                    api.get(
                        `/progress/course/${courseId}/completed-lessons`
                    ),
                ]);

            setProgress(progressResponse.data.progress);

            const completedIds =
                completedResponse.data.completedLessons.map(
                    (item) => Number(item.lessonId)
                );

            setCompletedLessons(completedIds);
        } catch (error) {
            console.error("Failed to fetch progress:", error);
        }
    };

    useEffect(() => {
        fetchProgress();
    }, [courseId]);

    // SELECT LESSON FROM URL
    useEffect(() => {
        if (!course || lessons.length === 0) return;

        const selectedLesson = lessons.find(
            (lesson) => Number(lesson.id) === selectedLessonId
        );

        const initialLesson = selectedLesson || lessons[0];

        setActiveLessonId(initialLesson.id);

        if (Number(initialLesson.id) !== selectedLessonId) {
            setSearchParams(
                { lessonId: String(initialLesson.id) },
                { replace: true }
            );
        }
    }, [course, selectedLessonId]);

    // ACTIVE LESSON
    const activeLesson = lessons.find(
        (lesson) => Number(lesson.id) === Number(activeLessonId)
    );

    const isCurrentLessonCompleted = completedLessons.includes(
        Number(activeLessonId)
    );

    // MARK LESSON AS COMPLETED
    const handleCompleteLesson = async () => {
        if (!activeLesson || completing) return;

        try {
            setCompleting(true);
            setProgressError("");

            await api.patch(
                `/progress/lesson/${activeLesson.id}/complete`
            );

            await fetchProgress();

        } catch (error) {
            setProgressError(
                error.response?.data?.message ||
                "Failed to update lesson progress."
            );
        } finally {
            setCompleting(false);
        }
    };

    // CONVERT YOUTUBE URL TO EMBED URL
    const getYoutubeEmbedUrl = (url) => {
        if (!url) return null;

        try {
            const parsedUrl = new URL(url);

            let videoId = "";

            if (parsedUrl.hostname.includes("youtu.be")) {
                videoId = parsedUrl.pathname.slice(1);
            } else if (
                parsedUrl.hostname.includes("youtube.com") ||
                parsedUrl.hostname.includes("youtube-nocookie.com")
            ) {
                videoId =
                    parsedUrl.searchParams.get("v") ||
                    parsedUrl.pathname.split("/").filter(Boolean).pop();
            }

            if (!videoId || !/^[a-zA-Z0-9_-]{11}$/.test(videoId)) {
                return null;
            }

            return `https://www.youtube-nocookie.com/embed/${videoId}`;
        } catch {
            return null;
        }
    };

    const videoUrl = getYoutubeEmbedUrl(activeLesson?.videoUrl);

    // CHANGE LESSON
    const goToLesson = (index) => {
        if (index < 0 || index >= lessons.length) return;

        const selectedLesson = lessons[index];

        setActiveLessonId(selectedLesson.id);

        setSearchParams({
            lessonId: String(selectedLesson.id),
        });

        setActiveTab("Overview");
        setProgressError("");
    };

    const currentIndex = lessons.findIndex(
        (lesson) => Number(lesson.id) === Number(activeLessonId)
    );

    const totalDuration = lessons.reduce(
        (total, lesson) => total + (Number(lesson.duration) || 0),
        0
    );

    return (
        <>
            <Navbar />

            {loading && (
                <div className="flex min-h-[70vh] items-center justify-center">
                    <p className="text-gray-500">
                        Loading your learning page...
                    </p>
                </div>
            )}

            {!loading && error && (
                <div className="flex min-h-[70vh] items-center justify-center">
                    <p className="text-red-500">{error}</p>
                </div>
            )}

            {!loading && !error && course && (
                <>
                    {/* COURSE HEADER */}
                    <section className="border-b border-gray-200 bg-white px-6 py-5 md:px-12">

                        <div className="mx-auto max-w-7xl">

                            <Link
                                to="/my-courses"
                                className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-gray-500 transition hover:text-blue-600"
                            >
                                <ArrowLeft size={17} />
                                Back to My Courses
                            </Link>

                            <div className="flex flex-wrap items-center justify-between gap-4">

                                <div>
                                    <h1 className="text-2xl font-bold text-gray-900">
                                        {course.title}
                                    </h1>

                                    <p className="mt-2 flex items-center gap-2 text-sm text-gray-500">
                                        <UserRound size={16} />
                                        {course.instructor}
                                    </p>
                                </div>

                                <div className="flex items-center gap-2 text-sm font-medium text-gray-500">
                                    <BookOpen size={19} />
                                    {lessons.length} Lessons
                                </div>

                            </div>
                        </div>
                    </section>

                    {/* LEARNING SECTION */}
                    <section className="min-h-screen bg-gray-50 px-4 py-8 md:px-8">

                        <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-3">

                            {/* VIDEO AND LESSON DETAILS */}
                            <div className="space-y-6 lg:col-span-2">

                                {/* VIDEO PLAYER */}
                                <div className="overflow-hidden rounded-2xl bg-black shadow-lg">

                                    <div className="relative aspect-video">

                                        {videoUrl ? (
                                            <iframe
                                                key={activeLesson?.id}
                                                src={videoUrl}
                                                title={activeLesson?.title || "Course Video"}
                                                className="absolute inset-0 h-full w-full"
                                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                                referrerPolicy="strict-origin-when-cross-origin"
                                                allowFullScreen
                                            />
                                        ) : (
                                            <div className="flex h-full flex-col items-center justify-center px-4 text-center text-white">

                                                <PlayCircle
                                                    size={55}
                                                    className="mb-5 text-gray-400"
                                                />

                                                <h2 className="text-xl font-bold">
                                                    Video Not Available
                                                </h2>

                                                <p className="mt-3 text-sm text-gray-400">
                                                    No valid YouTube video URL is available for this lesson.
                                                </p>

                                            </div>
                                        )}

                                    </div>
                                </div>

                                {/* LESSON INFORMATION */}
                                {activeLesson && (
                                    <div className="rounded-2xl border border-gray-200 bg-white p-6">

                                        <div className="flex flex-wrap items-start justify-between gap-4">

                                            <div>
                                                <p className="text-sm font-medium text-blue-600">
                                                    Lesson {currentIndex + 1} of {lessons.length}
                                                </p>

                                                <h2 className="mt-2 text-2xl font-bold text-gray-900">
                                                    {activeLesson.title}
                                                </h2>

                                                <p className="mt-3 flex items-center gap-2 text-sm text-gray-500">
                                                    <Clock size={16} />
                                                    {activeLesson.duration
                                                        ? `${activeLesson.duration} minutes`
                                                        : "Duration unavailable"}
                                                </p>
                                            </div>

                                            {activeLesson.isPreview && (
                                                <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                                                    Preview Lesson
                                                </span>
                                            )}

                                        </div>

                                        {/* MARK AS COMPLETE */}
                                        <div className="mt-6">

                                            {isCurrentLessonCompleted ? (
                                                <div className="flex items-center gap-2 rounded-xl bg-green-50 px-4 py-3 font-semibold text-green-700">
                                                    <CheckCircle size={20} />
                                                    Lesson Completed
                                                </div>
                                            ) : (
                                                <button
                                                    onClick={handleCompleteLesson}
                                                    disabled={completing}
                                                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-green-600 px-5 py-3 font-semibold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
                                                >
                                                    <Check size={19} />
                                                    {completing
                                                        ? "Updating Progress..."
                                                        : "Mark as Complete"}
                                                </button>
                                            )}

                                            {progressError && (
                                                <p className="mt-3 text-sm text-red-500">
                                                    {progressError}
                                                </p>
                                            )}

                                        </div>

                                        {/* PREVIOUS / NEXT */}
                                        <div className="mt-7 flex items-center justify-between border-t border-gray-100 pt-5">

                                            <button
                                                onClick={() => goToLesson(currentIndex - 1)}
                                                disabled={currentIndex <= 0}
                                                className="flex items-center gap-2 rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
                                            >
                                                <ArrowLeft size={17} />
                                                Previous
                                            </button>

                                            <button
                                                onClick={() => goToLesson(currentIndex + 1)}
                                                disabled={currentIndex === lessons.length - 1}
                                                className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-40"
                                            >
                                                Next Lesson
                                                <ArrowRight size={17} />
                                            </button>

                                        </div>
                                    </div>
                                )}

                                {/* TABS */}
                                <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white">

                                    <div className="flex flex-wrap border-b border-gray-200">

                                        {["Overview", "Resources", "Notes"].map((tab) => (
                                            <button
                                                key={tab}
                                                onClick={() => setActiveTab(tab)}
                                                className={`px-6 py-4 text-sm font-semibold transition ${
                                                    activeTab === tab
                                                        ? "border-b-2 border-blue-600 text-blue-600"
                                                        : "text-gray-500 hover:text-gray-900"
                                                }`}
                                            >
                                                {tab}
                                            </button>
                                        ))}

                                    </div>

                                    <div className="min-h-36 p-6">

                                        {activeTab === "Overview" && (
                                            <div>
                                                <h3 className="text-lg font-bold text-gray-900">
                                                    About this lesson
                                                </h3>

                                                <p className="mt-3 leading-7 text-gray-600">
                                                    {activeLesson?.description ||
                                                        "No description available for this lesson."}
                                                </p>
                                            </div>
                                        )}

                                        {activeTab === "Resources" && (
                                            <div>
                                                <h3 className="text-lg font-bold text-gray-900">
                                                    Learning Resources
                                                </h3>

                                                <p className="mt-3 text-sm text-gray-500">
                                                    No resources available for this lesson yet.
                                                </p>
                                            </div>
                                        )}

                                        {activeTab === "Notes" && (
                                            <NotesSection lessonId={activeLesson?.id} />
                                        )}

                                    </div>
                                </div>

                            </div>

                            {/* COURSE SIDEBAR */}
                            <div className="h-fit overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">

                                {/* SIDEBAR HEADER */}
                                <div className="border-b border-gray-200 p-5">

                                    <h2 className="text-xl font-bold text-gray-900">
                                        Course Content
                                    </h2>

                                    <p className="mt-2 text-sm text-gray-500">
                                        {lessons.length} lessons in this course
                                    </p>

                                    {/* REAL PROGRESS */}
                                    <div className="mt-5 h-2 overflow-hidden rounded-full bg-gray-100">
                                        <div
                                            className="h-full rounded-full bg-green-600 transition-all duration-500"
                                            style={{
                                                width: `${progress.percentage}%`,
                                            }}
                                        />
                                    </div>

                                    <div className="mt-2 flex items-center justify-between text-xs text-gray-500">
                                        <span>
                                            {progress.completedLessons} of {progress.totalLessons} completed
                                        </span>

                                        <span className="font-bold text-green-600">
                                            {progress.percentage}%
                                        </span>
                                    </div>

                                    <p className="mt-2 text-xs text-gray-500">
                                        Total duration: {totalDuration} minutes
                                    </p>

                                </div>

                                {/* LESSON LIST */}
                                <div className="max-h-[650px] space-y-2 overflow-y-auto p-3">

                                    {lessons.map((lesson, index) => {

                                        const isActive =
                                            Number(activeLessonId) === Number(lesson.id);

                                        const isCompleted =
                                            completedLessons.includes(Number(lesson.id));

                                        return (
                                            <button
                                                key={lesson.id}
                                                onClick={() => goToLesson(index)}
                                                className={`flex w-full items-start gap-3 rounded-xl border p-4 text-left transition ${
                                                    isActive
                                                        ? "border-blue-200 bg-blue-50"
                                                        : "border-transparent hover:bg-gray-50"
                                                }`}
                                            >

                                                <div
                                                    className={`mt-0.5 rounded-lg p-2 ${
                                                        isCompleted
                                                            ? "bg-green-100 text-green-600"
                                                            : isActive
                                                                ? "bg-blue-600 text-white"
                                                                : "bg-gray-100 text-gray-500"
                                                    }`}
                                                >
                                                    {isCompleted ? (
                                                        <CheckCircle size={22} />
                                                    ) : (
                                                        <PlayCircle size={22} />
                                                    )}
                                                </div>

                                                <div className="min-w-0 flex-1">

                                                    <h3
                                                        className={`text-sm font-semibold ${
                                                            isActive
                                                                ? "text-blue-700"
                                                                : "text-gray-800"
                                                        }`}
                                                    >
                                                        {index + 1}. {lesson.title}
                                                    </h3>

                                                    <p className="mt-2 flex items-center gap-1 text-xs text-gray-500">
                                                        <Clock size={13} />
                                                        {lesson.duration
                                                            ? `${lesson.duration} min`
                                                            : "N/A"}
                                                    </p>

                                                    {isCompleted && (
                                                        <p className="mt-2 text-xs font-semibold text-green-600">
                                                            Completed
                                                        </p>
                                                    )}

                                                </div>

                                                {isActive && (
                                                    <CheckCircle
                                                        size={18}
                                                        className="shrink-0 text-blue-600"
                                                    />
                                                )}

                                            </button>
                                        );
                                    })}

                                    {lessons.length === 0 && (
                                        <p className="py-10 text-center text-sm text-gray-500">
                                            No lessons available for this course.
                                        </p>
                                    )}

                                </div>

                            </div>

                        </div>
                    </section>
                </>
            )}
        </>
    );
}

// NOTES SECTION
function NotesSection({ lessonId }) {
    const [note, setNote] = useState("");

    useEffect(() => {
        setNote("");
    }, [lessonId]);

    return (
        <div>
            <h3 className="text-lg font-bold text-gray-900">
                My Notes
            </h3>

            <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Write your notes for this lesson..."
                rows={5}
                className="mt-4 w-full resize-y rounded-xl border border-gray-200 p-4 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />

            <p className="mt-2 text-xs text-gray-400">
                Notes are temporary and will reset when you change lessons or leave this page.
            </p>
        </div>
    );
}

export default CourseLearning;
