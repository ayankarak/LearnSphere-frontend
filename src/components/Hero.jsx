
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
    ArrowRight,
    BookOpen,
    GraduationCap,
    PlayCircle,
    Users,
    Target,
    CheckCircle2,
    CalendarDays,
} from "lucide-react";

import { useAuth } from "../context/AuthContext";
import api from "../api/axios";

function Hero() {
    const { user, loading } = useAuth();

    const [todayGoal, setTodayGoal] = useState(null);
    const [goalLoading, setGoalLoading] = useState(true);

    // TIME-BASED GREETING
    const currentHour = Number(
        new Intl.DateTimeFormat("en-IN", {
            timeZone: "Asia/Kolkata",
            hour: "2-digit",
            hourCycle: "h23",
        }).format(new Date())
    );

    const greeting =
        currentHour >= 5 && currentHour < 12
            ? "Good Morning"
            : currentHour >= 12 && currentHour < 17
                ? "Good Afternoon"
                : currentHour >= 17 && currentHour < 20
                    ? "Good Evening"
                    : "Good Night";

    // FETCH TODAY'S GOAL
    useEffect(() => {
        const fetchTodayGoal = async () => {
            if (loading) return;

            if (!user) {
                setTodayGoal(null);
                setGoalLoading(false);
                return;
            }

            setGoalLoading(true);

            try {
                const response = await api.get("/goals");

                const today = new Intl.DateTimeFormat("en-CA", {
                    timeZone: "Asia/Kolkata",
                }).format(new Date());

                const goal = (response.data.goals || []).find(
                    (item) => item.goalDate === today
                );

                setTodayGoal(goal || null);
            } catch (error) {
                console.error(
                    "Failed to fetch today's goal:",
                    error.response?.data?.message || error.message
                );

                setTodayGoal(null);
            } finally {
                setGoalLoading(false);
            }
        };

        fetchTodayGoal();
    }, [user, loading]);

    // TASK-BASED GOAL DATA
    const todayTasks = todayGoal?.tasks || [];

    const totalTasks = todayTasks.length;

    const completedTasks = todayTasks.filter(
        (task) => task.isCompleted
    ).length;

    const progress =
        totalTasks > 0
            ? Math.min((completedTasks / totalTasks) * 100, 100)
            : 0;

    const isGoalCompleted =
        totalTasks > 0 && completedTasks === totalTasks;

    return (
        <section className="bg-gradient-to-br from-blue-50 via-white to-indigo-50 px-6 py-20 md:px-12 lg:px-20">
            <div className="mx-auto grid max-w-7xl items-center gap-14 lg:grid-cols-2">

                {/* LEFT CONTENT */}
                <div>
                    <span className="mb-6 inline-flex items-center gap-2 rounded-full bg-blue-100 px-4 py-2 text-sm font-semibold text-blue-700">
                        <GraduationCap size={18} />
                        Your Learning Journey Starts Here
                    </span>

                    {/* DYNAMIC HERO HEADING */}
                    {user ? (
                        <div>
                            <p className="mb-2 text-lg font-semibold text-blue-600 md:text-xl">
                                {greeting},
                            </p>

                            <h1 className="text-4xl font-extrabold leading-tight text-gray-900 sm:text-5xl lg:text-6xl">
                                Hello, {user.name}!
                                <span className="mt-2 block text-blue-600">
                                    Ready to Learn? 👋
                                </span>
                            </h1>
                        </div>
                    ) : (
                        <h1 className="text-4xl font-extrabold leading-tight text-gray-900 sm:text-5xl lg:text-6xl">
                            Learn New Skills.
                            <span className="mt-2 block text-blue-600">
                                Build Your Future.
                            </span>
                        </h1>
                    )}

                    <p className="mt-6 max-w-xl text-base leading-8 text-gray-600 md:text-lg">
                        Explore high-quality courses, learn from experienced instructors,
                        and develop the skills you need to achieve your career goals.
                    </p>

                    {/* BUTTONS */}
                    <div className="mt-8 flex flex-wrap gap-4">
                        <Link
                            to="/courses"
                            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3.5 font-semibold text-white shadow-lg shadow-blue-200 transition hover:bg-blue-700"
                        >
                            Explore Courses
                            <ArrowRight size={19} />
                        </Link>

                        <Link
                            to="/categories"
                            className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-6 py-3.5 font-semibold text-gray-700 transition hover:border-blue-600 hover:text-blue-600"
                        >
                            <PlayCircle size={19} />
                            Get Started
                        </Link>

                        <Link
                            to="/my-courses"
                            className="inline-flex items-center gap-2 rounded-lg border border-blue-200 bg-blue-50 px-6 py-3.5 font-semibold text-blue-700 transition hover:bg-blue-100"
                        >
                            <BookOpen size={19} />
                            My Courses
                        </Link>
                    </div>

                    {/* STATISTICS */}
                    <div className="mt-12 flex flex-wrap gap-8">
                        <div>
                            <div className="flex items-center gap-2 text-2xl font-bold text-gray-900">
                                <Users className="text-blue-600" size={23} />
                                10K+
                            </div>
                            <p className="mt-1 text-sm text-gray-500">
                                Active Students
                            </p>
                        </div>

                        <div>
                            <div className="flex items-center gap-2 text-2xl font-bold text-gray-900">
                                <BookOpen className="text-blue-600" size={23} />
                                500+
                            </div>
                            <p className="mt-1 text-sm text-gray-500">
                                Online Courses
                            </p>
                        </div>

                        <div>
                            <div className="flex items-center gap-2 text-2xl font-bold text-gray-900">
                                <GraduationCap className="text-blue-600" size={23} />
                                50+
                            </div>
                            <p className="mt-1 text-sm text-gray-500">
                                Expert Instructors
                            </p>
                        </div>
                    </div>
                </div>

                {/* RIGHT CARD */}
                <div className="relative flex justify-center">
                    <div className="absolute -left-5 top-10 h-32 w-32 rounded-full bg-blue-200/50 blur-3xl"></div>

                    <div className="absolute -bottom-5 right-5 h-40 w-40 rounded-full bg-indigo-200/60 blur-3xl"></div>

                    <div className="relative w-full max-w-lg">

                        {!loading && user ? (

                            /* LOGGED-IN USER: TODAY'S GOAL */
                            <div className="rounded-3xl border border-blue-100 bg-white p-6 shadow-2xl shadow-blue-100">

                                <div className="flex items-center justify-between border-b border-gray-100 pb-5">
                                    <div>
                                        <p className="text-sm font-medium text-gray-500">
                                            Welcome back, {user.name}
                                        </p>

                                        <h3 className="mt-1 text-xl font-bold text-gray-900">
                                            Today's Goal
                                        </h3>
                                    </div>

                                    <div className="rounded-xl bg-blue-100 p-3 text-blue-600">
                                        <Target size={27} />
                                    </div>
                                </div>

                                {goalLoading ? (
                                    <div className="py-16 text-center">
                                        <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600"></div>

                                        <p className="mt-3 text-sm text-gray-500">
                                            Loading your goal...
                                        </p>
                                    </div>
                                ) : todayGoal && totalTasks > 0 ? (

                                    /* TASK-BASED GOAL EXISTS */
                                    <div className="py-7">

                                        <div className="mb-6 text-center">
                                            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                                                <CalendarDays size={32} />
                                            </div>

                                            <h3 className="mt-4 text-2xl font-bold text-gray-900">
                                                Keep Learning!
                                            </h3>

                                            <p className="mt-2 text-sm text-gray-500">
                                                Complete your planned learning tasks today.
                                            </p>
                                        </div>

                                        {/* TASK STATISTICS */}
                                        <div className="grid grid-cols-2 gap-4">

                                            <div className="rounded-xl bg-blue-50 p-4">
                                                <p className="text-sm text-gray-500">
                                                    Total Tasks
                                                </p>

                                                <p className="mt-2 text-3xl font-bold text-blue-600">
                                                    {totalTasks}
                                                </p>
                                            </div>

                                            <div className="rounded-xl bg-indigo-50 p-4">
                                                <p className="text-sm text-gray-500">
                                                    Completed
                                                </p>

                                                <p className="mt-2 text-3xl font-bold text-indigo-600">
                                                    {completedTasks}
                                                </p>
                                            </div>

                                        </div>

                                        {/* PROGRESS BAR */}
                                        <div className="mt-6">

                                            <div className="mb-2 flex items-center justify-between text-sm">
                                                <span className="font-semibold text-gray-700">
                                                    Daily Progress
                                                </span>

                                                <span className="font-bold text-blue-600">
                                                    {Math.round(progress)}%
                                                </span>
                                            </div>

                                            <div className="h-3 overflow-hidden rounded-full bg-gray-100">
                                                <div
                                                    className="h-full rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 transition-all duration-500"
                                                    style={{
                                                        width: `${progress}%`,
                                                    }}
                                                ></div>
                                            </div>

                                            <p className="mt-3 text-sm text-gray-500">
                                                {isGoalCompleted
                                                    ? "Amazing! All your tasks are completed."
                                                    : `${totalTasks - completedTasks} more tasks to complete today's goal.`
                                                }
                                            </p>

                                        </div>

                                        {/* TODAY'S TASK LIST */}
                                        <div className="mt-6">
                                            <div className="mb-3 flex items-center justify-between">
                                                <h4 className="font-bold text-gray-800">
                                                    Today's Tasks
                                                </h4>

                                                <span className="text-xs font-semibold text-gray-500">
                                                    {completedTasks}/{totalTasks} Completed
                                                </span>
                                            </div>

                                            <div className="space-y-3">
                                                {todayTasks.map((task) => (
                                                    <div
                                                        key={task.id}
                                                        className="flex items-start gap-3 rounded-xl border border-gray-100 bg-gray-50 p-3"
                                                    >
                                                        <CheckCircle2
                                                            size={19}
                                                            className={`mt-0.5 shrink-0 ${task.isCompleted
                                                                    ? "text-green-600" : "text-gray-300" }`}
                                                        />

                                                        <p
                                                            className={`min-w-0 flex-1 break-words text-sm font-medium ${task.isCompleted
                                                                    ? "text-gray-400 line-through" : "text-gray-700" }`}
                                                        >
                                                            {task.taskText}
                                                        </p>

                                                        <span
                                                            className={`shrink-0 text-xs font-semibold ${task.isCompleted
                                                                    ? "text-green-600"
                                                                    : "text-gray-400"
                                                                }`}
                                                        >
                                                            {task.isCompleted ? "Done" : "Pending"}
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* COMPLETION MESSAGE */}
                                        {isGoalCompleted && (
                                            <div className="mt-5 flex items-center gap-2 rounded-xl bg-green-50 p-3 text-sm font-medium text-green-700">
                                                <CheckCircle2 size={19} />
                                                Daily goal achieved!
                                            </div>
                                        )}

                                    </div>

                                ) : (

                                    /* NO TASKS PLANNED */
                                    <div className="py-12 text-center">

                                        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                                            <Target size={32} />
                                        </div>

                                        <h3 className="mt-5 text-xl font-bold text-gray-900">
                                            Plan Today's Learning
                                        </h3>

                                        <p className="mx-auto mt-2 max-w-xs text-sm leading-6 text-gray-500">
                                            You haven't added any learning tasks for today.
                                            Create your tasks and track your daily progress.
                                        </p>

                                        <Link
                                            to="/goal-calendar"
                                            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700"
                                        >
                                            Add Today's Tasks
                                            <ArrowRight size={18} />
                                        </Link>

                                    </div>
                                )}

                                {/* MANAGE GOALS */}
                                <div className="border-t border-gray-100 pt-4">
                                    <Link
                                        to="/goal-calendar"
                                        className="flex items-center justify-center gap-2 text-sm font-semibold text-blue-600 transition hover:text-blue-700"
                                    >
                                        Manage Goals
                                        <ArrowRight size={16} />
                                    </Link>
                                </div>
                            </div>

                        ) : (

                            /* GUEST USER: FEATURED COURSE CARD */
                            <div className="relative w-full rounded-3xl border border-blue-100 bg-white p-5 shadow-2xl shadow-blue-100">

                                <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                                    <div>
                                        <p className="text-sm font-medium text-gray-500">
                                            Welcome to LearnSphere
                                        </p>

                                        <h3 className="mt-1 text-lg font-bold text-gray-900">
                                            Continue Learning
                                        </h3>
                                    </div>

                                    <div className="rounded-xl bg-blue-100 p-3 text-blue-600">
                                        <GraduationCap size={26} />
                                    </div>
                                </div>

                                <div className="mt-5 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white">
                                    <p className="text-sm text-blue-100">
                                        Featured Course
                                    </p>

                                    <h3 className="mt-2 text-2xl font-bold">
                                        Full Stack Web Development
                                    </h3>

                                    <p className="mt-2 text-sm text-blue-100">
                                        Learn HTML, CSS, JavaScript, React and Node.js.
                                    </p>

                                    <div className="mt-5 flex items-center justify-between">
                                        <span className="text-sm font-medium">
                                            Beginner Friendly
                                        </span>

                                        <PlayCircle size={32} />
                                    </div>
                                </div>

                                <div className="mt-5 grid grid-cols-2 gap-4">
                                    <div className="rounded-xl bg-blue-50 p-4">
                                        <BookOpen className="text-blue-600" size={24} />

                                        <h4 className="mt-3 font-bold text-gray-900">
                                            Learn Anytime
                                        </h4>

                                        <p className="mt-1 text-xs text-gray-500">
                                            Study at your own pace
                                        </p>
                                    </div>

                                    <div className="rounded-xl bg-indigo-50 p-4">
                                        <GraduationCap className="text-indigo-600" size={24} />

                                        <h4 className="mt-3 font-bold text-gray-900">
                                            Expert Guidance
                                        </h4>

                                        <p className="mt-1 text-xs text-gray-500">
                                            Learn from professionals
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

            </div>
        </section>
    );
}

export default Hero;
