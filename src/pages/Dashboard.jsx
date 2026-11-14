
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
    ArrowRight,
    BookOpen,
    CheckCircle2,
    Clock3,
    GraduationCap,
    Library,
    Mail,
    ShieldCheck,
    TrendingUp,
    UserRound,
} from "lucide-react";

import Navbar from "../components/Navbar";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

function Dashboard() {
    const { user } = useAuth();

    const [enrollments, setEnrollments] = useState([]);
    const [progressData, setProgressData] = useState({});
    const [completedActivity, setCompletedActivity] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // FETCH DASHBOARD DATA
    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                setLoading(true);
                setError("");

                const response = await api.get("/enrollments/my-courses");
                const enrolledCourses = response.data.enrollments || [];

                setEnrollments(enrolledCourses);

                const results = await Promise.all(
                    enrolledCourses.map(async (enrollment) => {
                        const courseId =
                            enrollment.course?.id || enrollment.courseId;

                        if (!courseId) return null;

                        let progress = {
                            totalLessons: 0,
                            completedLessons: 0,
                            percentage: 0,
                        };

                        let completedLessons = [];

                        try {
                            const progressResponse = await api.get(
                                `/progress/course/${courseId}`
                            );

                            progress = progressResponse.data.progress;
                        } catch (err) {
                            console.error("Progress fetch failed:", err);
                        }

                        try {
                            const activityResponse = await api.get(
                                `/progress/course/${courseId}/completed-lessons`
                            );

                            completedLessons =
                                activityResponse.data.completedLessons || [];
                        } catch (err) {
                            console.error("Activity fetch failed:", err);
                        }

                        return {
                            courseId,
                            progress,
                            completedLessons,
                        };
                    })
                );

                const progressMap = {};
                const allCompletedLessons = [];

                results.forEach((item) => {
                    if (!item) return;

                    progressMap[item.courseId] = item.progress;

                    allCompletedLessons.push(...item.completedLessons);
                });

                setProgressData(progressMap);
                setCompletedActivity(allCompletedLessons);
            } catch (err) {
                setError(
                    err.response?.data?.message ||
                    "Failed to load dashboard data."
                );
            } finally {
                setLoading(false);
            }
        };

        if (user) {
            fetchDashboardData();
        } else {
            setLoading(false);
        }
    }, [user]);

    // STATISTICS
    const totalCourses = enrollments.length;

    const totalLessons = Object.values(progressData).reduce(
        (sum, item) => sum + (item.totalLessons || 0),
        0
    );

    const completedLessons = Object.values(progressData).reduce(
        (sum, item) => sum + (item.completedLessons || 0),
        0
    );

    const remainingLessons = Math.max(
        totalLessons - completedLessons,
        0
    );

    const completedCourses = Object.values(progressData).filter(
        (item) => item.totalLessons > 0 && item.percentage === 100
    ).length;

    const overallProgress = totalLessons > 0
        ? Math.round((completedLessons / totalLessons) * 100)
        : 0;

    // INITIALS
    const getInitials = (name) => {
        if (!name) return "S";

        return name
            .split(" ")
            .map((part) => part[0])
            .join("")
            .slice(0, 2)
            .toUpperCase();
    };

    // LAST 7 DAYS ACTIVITY
    const activityData = [];

    for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setHours(0, 0, 0, 0);
        date.setDate(date.getDate() - i);

        const dateKey = [
            date.getFullYear(),
            String(date.getMonth() + 1).padStart(2, "0"),
            String(date.getDate()).padStart(2, "0"),
        ].join("-");

        const count = completedActivity.filter((lesson) => {
            if (!lesson.completedAt) return false;

            const completedDate = new Date(lesson.completedAt);

            if (Number.isNaN(completedDate.getTime())) return false;

            const completedKey = [
                completedDate.getFullYear(),
                String(completedDate.getMonth() + 1).padStart(2, "0"),
                String(completedDate.getDate()).padStart(2, "0"),
            ].join("-");

            return completedKey === dateKey;
        }).length;

        activityData.push({
            date: dateKey,
            label: date.toLocaleDateString("en-US", {
                weekday: "short",
            }),
            completed: count,
        });
    }

    // CUMULATIVE PERFORMANCE
    let cumulative = 0;

    const performanceData = activityData.map((day) => {
        cumulative += day.completed;

        return {
            ...day,
            total: cumulative,
        };
    });

    const maxActivity = Math.max(
        ...activityData.map((day) => day.completed),
        1
    );

    const maxPerformance = Math.max(
        ...performanceData.map((day) => day.total),
        1
    );

    const performancePoints = performanceData
        .map((day, index) => {
            const x = 30 + index * (440 / 6);
            const y = 145 - (day.total / maxPerformance) * 115;

            return `${x},${y}`;
        })
        .join(" ");

    const weeklyCompleted = activityData.reduce(
        (sum, day) => sum + day.completed,
        0
    );

    return (
        <div className="min-h-screen bg-[#f5f7fb]">
            <Navbar />

            <main className="mx-auto max-w-[1500px] px-4 py-8 md:px-6 lg:px-8">

                {/* HEADER */}
                <div className="mb-7">
                    <p className="text-sm font-medium text-blue-600">
                        Dashboard / Student
                    </p>

                    <h1 className="mt-2 text-3xl font-bold text-gray-900">
                        Welcome back, {user?.name || "Student"}!
                    </h1>

                    <p className="mt-2 text-sm text-gray-500">
                        Keep learning and track your progress.
                    </p>
                </div>

                {error && (
                    <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
                        {error}
                    </div>
                )}

                {/* MAIN DASHBOARD GRID */}
                <div className="grid items-start gap-6 xl:grid-cols-12">

                    {/* PROFILE SIDEBAR */}
                    <aside className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm xl:col-span-3">

                        <div className="h-28 bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-500" />

                        <div className="px-5 pb-6">

                            <div className="-mt-12 flex justify-center">
                                <div className="flex h-24 w-24 items-center justify-center rounded-full border-4 border-white bg-blue-100 text-3xl font-bold text-blue-700 shadow-sm">
                                    {getInitials(user?.name)}
                                </div>
                            </div>

                            <div className="mt-4 text-center">
                                <h2 className="text-xl font-bold text-gray-900">
                                    {user?.name || "Student"}
                                </h2>

                                <p className="mt-1 text-sm text-gray-500">
                                    LearnSphere Student
                                </p>

                                <span className="mt-3 inline-flex items-center gap-1 rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                                    <CheckCircle2 size={13} />
                                    Account Active
                                </span>
                            </div>

                            <div className="my-6 border-t border-gray-100" />

                            <h3 className="mb-5 font-bold text-gray-900">
                                Personal Information
                            </h3>

                            <div className="space-y-5">

                                <div className="flex items-start gap-3">
                                    <div className="rounded-lg bg-blue-50 p-2 text-blue-600">
                                        <UserRound size={18} />
                                    </div>

                                    <div className="min-w-0">
                                        <p className="text-xs text-gray-400">
                                            Full Name
                                        </p>

                                        <p className="mt-1 break-words text-sm font-medium text-gray-800">
                                            {user?.name || "Not available"}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <div className="rounded-lg bg-purple-50 p-2 text-purple-600">
                                        <Mail size={18} />
                                    </div>

                                    <div className="min-w-0">
                                        <p className="text-xs text-gray-400">
                                            Email Address
                                        </p>

                                        <p className="mt-1 break-all text-sm font-medium text-gray-800">
                                            {user?.email || "Not available"}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <div className="rounded-lg bg-green-50 p-2 text-green-600">
                                        <ShieldCheck size={18} />
                                    </div>

                                    <div>
                                        <p className="text-xs text-gray-400">
                                            Account Role
                                        </p>

                                        <p className="mt-1 text-sm font-semibold capitalize text-gray-800">
                                            {user?.role || "Student"}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="my-6 border-t border-gray-100" />

                            <h3 className="mb-4 font-bold text-gray-900">
                                Quick Access
                            </h3>

                            <div className="space-y-3">
                                <Link
                                    to="/courses"
                                    className="flex items-center justify-between rounded-xl bg-blue-50 p-3 text-sm font-medium text-blue-700 transition hover:bg-blue-100"
                                >
                                    Explore Courses
                                    <ArrowRight size={17} />
                                </Link>

                                <Link
                                    to="/my-courses"
                                    className="flex items-center justify-between rounded-xl bg-indigo-50 p-3 text-sm font-medium text-indigo-700 transition hover:bg-indigo-100"
                                >
                                    My Courses
                                    <ArrowRight size={17} />
                                </Link>
                            </div>
                        </div>
                    </aside>

                    {/* RIGHT CONTENT */}
                    <section className="space-y-6 xl:col-span-9">

                        {/* STATISTICS */}
                        <div className="grid gap-4 sm:grid-cols-2 2xl:grid-cols-4">

                            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                                <div className="flex items-center justify-between">
                                    <p className="text-sm font-medium text-gray-500">
                                        Enrolled Courses
                                    </p>
                                    <BookOpen className="text-blue-600" size={21} />
                                </div>

                                <h3 className="mt-3 text-3xl font-bold text-gray-900">
                                    {loading ? "—" : totalCourses}
                                </h3>
                            </div>

                            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                                <div className="flex items-center justify-between">
                                    <p className="text-sm font-medium text-gray-500">
                                        Total Lessons
                                    </p>
                                    <Library className="text-purple-600" size={21} />
                                </div>

                                <h3 className="mt-3 text-3xl font-bold text-gray-900">
                                    {loading ? "—" : totalLessons}
                                </h3>
                            </div>

                            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                                <div className="flex items-center justify-between">
                                    <p className="text-sm font-medium text-gray-500">
                                        Completed Lessons
                                    </p>
                                    <CheckCircle2 className="text-green-600" size={21} />
                                </div>

                                <h3 className="mt-3 text-3xl font-bold text-gray-900">
                                    {loading ? "—" : completedLessons}
                                </h3>
                            </div>

                            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                                <div className="flex items-center justify-between">
                                    <p className="text-sm font-medium text-gray-500">
                                        Completed Courses
                                    </p>
                                    <GraduationCap className="text-orange-500" size={21} />
                                </div>

                                <h3 className="mt-3 text-3xl font-bold text-gray-900">
                                    {loading ? "—" : completedCourses}
                                </h3>
                            </div>
                        </div>

                        {/* ACTIVITY AND PERFORMANCE */}
                        <div className="grid gap-6 lg:grid-cols-2">

                            {/* DAILY ACTIVITY */}
                            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">

                                <div className="flex items-start justify-between">
                                    <div>
                                        <h2 className="text-lg font-bold text-gray-900">
                                            Daily Learning Activity
                                        </h2>

                                        <p className="mt-1 text-sm text-gray-500">
                                            Last 7 days
                                        </p>
                                    </div>

                                    <div className="rounded-xl bg-blue-50 p-3 text-blue-600">
                                        <BookOpen size={21} />
                                    </div>
                                </div>

                                <div className="mt-6">
                                    <h3 className="text-3xl font-bold text-gray-900">
                                        {loading ? "—" : weeklyCompleted}
                                    </h3>

                                    <p className="mt-1 text-xs text-gray-500">
                                        Lessons completed this week
                                    </p>
                                </div>

                                {loading ? (
                                    <p className="py-12 text-center text-sm text-gray-500">
                                        Loading activity...
                                    </p>
                                ) : (
                                    <div className="mt-7 flex h-44 items-end justify-between gap-2 border-b border-gray-100 pb-2">
                                        {activityData.map((day) => (
                                            <div
                                                key={day.date}
                                                className="flex h-full flex-1 flex-col items-center justify-end gap-2"
                                            >
                                                <span className="text-xs font-semibold text-gray-600">
                                                    {day.completed}
                                                </span>

                                                <div className="flex h-32 w-full items-end justify-center">
                                                    <div
                                                        title={`${day.date}: ${day.completed} lessons`}
                                                        className="w-full max-w-10 rounded-t-lg bg-gradient-to-t from-blue-600 to-indigo-400 transition-all duration-500"
                                                        style={{
                                                            height: `${
                                                                day.completed > 0
                                                                    ? Math.max(
                                                                        (day.completed / maxActivity) * 100,
                                                                        8
                                                                    )
                                                                    : 3
                                                            }%`,
                                                            opacity: day.completed > 0 ? 1 : 0.2,
                                                        }}
                                                    />
                                                </div>

                                                <span className="text-xs font-medium text-gray-500">
                                                    {day.label}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* PERFORMANCE */}
                            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">

                                <div className="flex items-start justify-between">
                                    <div>
                                        <h2 className="text-lg font-bold text-gray-900">
                                            Learning Performance
                                        </h2>

                                        <p className="mt-1 text-sm text-gray-500">
                                            Your overall progress
                                        </p>
                                    </div>

                                    <div className="rounded-xl bg-purple-50 p-3 text-purple-600">
                                        <TrendingUp size={21} />
                                    </div>
                                </div>

                                <div className="mt-6 flex items-center gap-6">

                                    <div
                                        className="relative flex h-28 w-28 shrink-0 items-center justify-center rounded-full"
                                        style={{
                                            background: `conic-gradient(#4f46e5 ${overallProgress}%, #e5e7eb ${overallProgress}% 100%)`,
                                        }}
                                    >
                                        <div className="flex h-20 w-20 flex-col items-center justify-center rounded-full bg-white">
                                            <span className="text-2xl font-extrabold text-gray-900">
                                                {loading ? "—" : `${overallProgress}%`}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <div>
                                            <p className="text-sm font-semibold text-gray-900">
                                                {loading ? "—" : completedLessons} Completed
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                Lessons finished
                                            </p>
                                        </div>

                                        <div>
                                            <p className="text-sm font-semibold text-gray-900">
                                                {loading ? "—" : remainingLessons} Remaining
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                Lessons left
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-7 border-t border-gray-100 pt-5">
                                    <div className="mb-4 flex items-center justify-between">
                                        <h3 className="text-sm font-semibold text-gray-800">
                                            7-Day Performance
                                        </h3>

                                        <span className="text-xs text-gray-400">
                                            Cumulative lessons
                                        </span>
                                    </div>

                                    {loading ? (
                                        <p className="py-8 text-center text-sm text-gray-500">
                                            Loading graph...
                                        </p>
                                    ) : (
                                        <>
                                            <svg
                                                viewBox="0 0 500 175"
                                                className="h-32 w-full overflow-visible"
                                                preserveAspectRatio="none"
                                            >
                                                {[30, 70, 110, 150].map((y) => (
                                                    <line
                                                        key={y}
                                                        x1="30"
                                                        y1={y}
                                                        x2="470"
                                                        y2={y}
                                                        stroke="#e5e7eb"
                                                        strokeDasharray="4 5"
                                                    />
                                                ))}

                                                <polyline
                                                    points={performancePoints}
                                                    fill="none"
                                                    stroke="#4f46e5"
                                                    strokeWidth="4"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                />

                                                {performanceData.map((day, index) => {
                                                    const x = 30 + index * (440 / 6);
                                                    const y =
                                                        145 - (day.total / maxPerformance) * 115;

                                                    return (
                                                        <circle
                                                            key={day.date}
                                                            cx={x}
                                                            cy={y}
                                                            r="5"
                                                            fill="#4f46e5"
                                                            stroke="white"
                                                            strokeWidth="2"
                                                        >
                                                            <title>
                                                                {day.date}: {day.total} lessons
                                                            </title>
                                                        </circle>
                                                    );
                                                })}
                                            </svg>

                                            <div className="mt-2 flex justify-between">
                                                {performanceData.map((day) => (
                                                    <span
                                                        key={day.date}
                                                        className="text-[11px] text-gray-500"
                                                    >
                                                        {day.label}
                                                    </span>
                                                ))}
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    </section>
                </div>

                {/* ENROLLED COURSES - FULL WIDTH */}
                <section className="mt-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">

                    <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
                        <div>
                            <h2 className="text-xl font-bold text-gray-900">
                                My Enrolled Courses
                            </h2>

                            <p className="mt-1 text-sm text-gray-500">
                                Track your progress and continue learning.
                            </p>
                        </div>

                        <Link
                            to="/my-courses"
                            className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-700"
                        >
                            View All
                            <ArrowRight size={17} />
                        </Link>
                    </div>

                    {loading ? (
                        <p className="py-10 text-center text-gray-500">
                            Loading your courses...
                        </p>
                    ) : enrollments.length === 0 ? (
                        <div className="rounded-xl bg-gray-50 py-12 text-center">
                            <Library
                                size={42}
                                className="mx-auto text-gray-300"
                            />

                            <h3 className="mt-4 font-semibold text-gray-800">
                                No enrolled courses yet
                            </h3>

                            <p className="mt-2 text-sm text-gray-500">
                                Explore courses and start your learning journey.
                            </p>

                            <Link
                                to="/courses"
                                className="mt-5 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
                            >
                                Explore Courses
                                <ArrowRight size={16} />
                            </Link>
                        </div>
                    ) : (
                        <div className="grid gap-4 lg:grid-cols-2">
                            {enrollments.map((enrollment) => {
                                const course = enrollment.course;

                                if (!course) return null;

                                const courseId = course.id || enrollment.courseId;

                                const progress = progressData[courseId] || {
                                    totalLessons: 0,
                                    completedLessons: 0,
                                    percentage: 0,
                                };

                                const isCompleted =
                                    progress.totalLessons > 0 &&
                                    progress.percentage === 100;

                                return (
                                    <div
                                        key={enrollment.id}
                                        className="rounded-xl border border-gray-200 p-4 transition hover:border-blue-200 hover:shadow-sm"
                                    >
                                        <div className="flex items-start gap-4">

                                            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-100 to-indigo-200 text-blue-600">
                                                <BookOpen size={27} />
                                            </div>

                                            <div className="min-w-0 flex-1">
                                                <div className="flex flex-wrap items-start justify-between gap-2">
                                                    <h3 className="font-bold text-gray-900">
                                                        {course.title}
                                                    </h3>

                                                    <span
                                                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                                                            isCompleted
                                                                ? "bg-green-100 text-green-700"
                                                                : "bg-yellow-100 text-yellow-700"
                                                        }`}
                                                    >
                                                        {isCompleted ? "Completed" : "Ongoing"}
                                                    </span>
                                                </div>

                                                <p className="mt-1 text-sm text-gray-500">
                                                    {course.category?.name || "Course"} · {course.instructor}
                                                </p>

                                                <div className="mt-4 flex items-center gap-3">
                                                    <div className="h-2 flex-1 overflow-hidden rounded-full bg-gray-100">
                                                        <div
                                                            className="h-full rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 transition-all duration-500"
                                                            style={{
                                                                width: `${progress.percentage}%`,
                                                            }}
                                                        />
                                                    </div>

                                                    <span className="text-sm font-bold text-blue-600">
                                                        {progress.percentage}%
                                                    </span>
                                                </div>

                                                <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
                                                    <p className="text-xs text-gray-500">
                                                        {progress.completedLessons} of {progress.totalLessons} lessons completed
                                                    </p>

                                                    <Link
                                                        to={`/learn/${courseId}`}
                                                        className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-blue-700"
                                                    >
                                                        {isCompleted ? "Review Course" : "Continue Learning"}
                                                        <ArrowRight size={14} />
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </section>
            </main>
        </div>
    );
}

export default Dashboard;
