import { useEffect, useState } from "react";
import { Target, CalendarDays, CheckCircle2, BookOpen, Loader2, ArrowLeft, Plus, Trash2,
    Pencil, Save,X,ChevronLeft, ChevronRight } from "lucide-react";

import { Link } from "react-router-dom";

import Navbar from "../components/Navbar";
import api from "../api/axios";


// DATE HELPERS
function getIndiaDate() {
    return new Intl.DateTimeFormat("en-CA", {
        timeZone: "Asia/Kolkata"
    }).format(new Date());
}

function getTomorrowDate(today) {
    const date = new Date(`${today}T00:00:00Z`);
    date.setUTCDate(date.getUTCDate() + 1);

    return date.toISOString().slice(0, 10);
}

function formatDate(date) {
    return new Date(`${date}T00:00:00`).toLocaleDateString(
        "en-IN",
        {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric"
        }
    );
}

function getCalendarDays(year, month) {
    const firstDay = new Date(year, month, 1).getDay();
    const totalDays = new Date(year, month + 1, 0).getDate();

    const days = [];

    for (let i = 0; i < firstDay; i++) {
        days.push(null);
    }

    for (let day = 1; day <= totalDays; day++) {
        days.push(day);
    }

    return days;
}


function GoalCalendar() {
    const today = getIndiaDate();
    const tomorrow = getTomorrowDate(today);

    const todayDate = new Date(`${today}T00:00:00`);

    const [goals, setGoals] = useState([]);

    const [selectedDate, setSelectedDate] = useState(today);

    const [calendarMonth, setCalendarMonth] = useState(
        todayDate.getMonth()
    );

    const [calendarYear, setCalendarYear] = useState(
        todayDate.getFullYear()
    );

    const [taskInputs, setTaskInputs] = useState({
        [today]: "",
        [tomorrow]: ""
    });

    const [editingTaskId, setEditingTaskId] = useState(null);
    const [editingText, setEditingText] = useState("");

    const [loading, setLoading] = useState(true);
    const [savingDate, setSavingDate] = useState(null);
    const [updatingTaskId, setUpdatingTaskId] = useState(null);
    const [deletingTaskId, setDeletingTaskId] = useState(null);

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");


    // FETCH GOALS
    const fetchGoals = async () => {
        try {
            setError("");

            const response = await api.get("/goals");

            setGoals(response.data.goals || []);
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Failed to load learning goals."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchGoals();
    }, []);


    // GET TASKS FOR A DATE
    const getTasks = (date) => {
        const goal = goals.find(
            (item) => item.goalDate === date
        );

        return goal?.tasks || [];
    };


    // CALENDAR MONTH NAVIGATION
    const handlePreviousMonth = () => {
        if (calendarMonth === 0) {
            setCalendarMonth(11);
            setCalendarYear((previous) => previous - 1);
        } else {
            setCalendarMonth((previous) => previous - 1);
        }
    };

    const handleNextMonth = () => {
        if (calendarMonth === 11) {
            setCalendarMonth(0);
            setCalendarYear((previous) => previous + 1);
        } else {
            setCalendarMonth((previous) => previous + 1);
        }
    };

    const calendarDays = getCalendarDays(
        calendarYear,
        calendarMonth
    );

    const monthName = new Date(
        calendarYear,
        calendarMonth,
        1
    ).toLocaleDateString("en-IN", {
        month: "long",
        year: "numeric"
    });


    // SELECT DATE
    const handleSelectDate = (date) => {
        if (date !== today && date !== tomorrow) return;

        setSelectedDate(date);
        setError("");
        setSuccess("");
    };

    // INPUT CHANGE
    const handleInputChange = (date, value) => {
        setTaskInputs((previous) => ({
            ...previous,
            [date]: value
        }));

        setError("");
        setSuccess("");
    };

    // ADD TASK
    const handleAddTask = async (date) => {
        const taskText = taskInputs[date]?.trim();

        if (!taskText) {
            setError("Please enter a task.");
            return;
        }

        if (taskText.length > 500) {
            setError("Task cannot exceed 500 characters.");
            return;
        }

        try {
            setSavingDate(date);
            setError("");
            setSuccess("");

            await api.post("/goals/tasks", {
                goalDate: date,
                taskText
            });

            setTaskInputs((previous) => ({
                ...previous,
                [date]: ""
            }));

            setSuccess("Task added successfully!");

            await fetchGoals();
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Failed to add task."
            );
        } finally {
            setSavingDate(null);
        }
    };

    // TOGGLE TASK
    const handleToggleTask = async (task) => {
        try {
            setUpdatingTaskId(task.id);
            setError("");
            setSuccess("");

            await api.patch(`/goals/tasks/${task.id}`, {
                isCompleted: !task.isCompleted
            });

            await fetchGoals();
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Failed to update task."
            );
        } finally {
            setUpdatingTaskId(null);
        }
    };


    // START EDIT
    const handleStartEdit = (task) => {
        setEditingTaskId(task.id);
        setEditingText(task.taskText);

        setError("");
        setSuccess("");
    };


    // SAVE EDIT
    const handleSaveEdit = async (taskId) => {
        const taskText = editingText.trim();

        if (!taskText) {
            setError("Task cannot be empty.");
            return;
        }

        if (taskText.length > 500) {
            setError("Task cannot exceed 500 characters.");
            return;
        }

        try {
            setUpdatingTaskId(taskId);
            setError("");
            setSuccess("");

            await api.patch(`/goals/tasks/${taskId}`, {
                taskText
            });

            setEditingTaskId(null);
            setEditingText("");

            setSuccess("Task updated successfully!");

            await fetchGoals();
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Failed to update task."
            );
        } finally {
            setUpdatingTaskId(null);
        }
    };


    // DELETE TASK
    const handleDeleteTask = async (taskId) => {
        try {
            setDeletingTaskId(taskId);
            setError("");
            setSuccess("");

            await api.delete(`/goals/tasks/${taskId}`);

            setSuccess("Task deleted successfully!");

            await fetchGoals();
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Failed to delete task."
            );
        } finally {
            setDeletingTaskId(null);
        }
    };


    // RENDER GOAL CARD
    const renderGoalCard = (date, label, description) => {
        const tasks = getTasks(date);

        const completedTasks = tasks.filter(
            (task) => task.isCompleted
        ).length;

        const totalTasks = tasks.length;

        const progress = totalTasks > 0
            ? (completedTasks / totalTasks) * 100
            : 0;

        const isSelected = selectedDate === date;
        const isSaving = savingDate === date;

        return (
            <div
                className={`rounded-2xl border bg-white p-5 shadow-sm transition md:p-6 ${
                    isSelected
                        ? "border-blue-500 ring-2 ring-blue-100"
                        : "border-gray-200 hover:border-blue-200"
                }`}
            >

                {/* CARD HEADER */}
                <button
                    type="button"
                    onClick={() => handleSelectDate(date)}
                    className="flex w-full items-start justify-between gap-3 text-left"
                >
                    <div>
                        <span className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-600">
                            <CalendarDays size={14} />
                            {label}
                        </span>

                        <h2 className="mt-4 text-lg font-bold text-gray-900 md:text-xl">
                            {formatDate(date)}
                        </h2>

                        <p className="mt-1 text-sm text-gray-500">
                            {description}
                        </p>
                    </div>

                    <div className="rounded-xl bg-indigo-50 p-3 text-indigo-600">
                        <Target size={24} />
                    </div>
                </button>


                {/* PROGRESS */}
                <div className="mt-5 rounded-xl bg-blue-50 p-4">
                    <div className="flex items-center justify-between gap-2">
                        <span className="text-sm font-medium text-gray-600">
                            Task Progress
                        </span>

                        <span className="text-sm font-bold text-blue-600">
                            {completedTasks} / {totalTasks}
                        </span>
                    </div>

                    <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-white">
                        <div
                            className="h-full rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 transition-all duration-500"
                            style={{
                                width: `${progress}%`
                            }}
                        />
                    </div>

                    <p className="mt-2 text-xs text-gray-500">
                        {Math.round(progress)}% completed
                    </p>

                    {totalTasks > 0 &&
                        completedTasks === totalTasks && (
                            <div className="mt-3 flex items-center gap-2 text-sm font-semibold text-green-700">
                                <CheckCircle2 size={17} />
                                All tasks completed!
                            </div>
                        )}
                </div>


                {/* ADD TASK */}
                <div className="mt-6">
                    <label
                        htmlFor={`task-${date}`}
                        className="mb-2 block text-sm font-semibold text-gray-700"
                    >
                        Add a New Task
                    </label>

                    <div className="flex gap-2">
                        <input
                            id={`task-${date}`}
                            type="text"
                            maxLength={500}
                            value={taskInputs[date] || ""}
                            onChange={(e) =>
                                handleInputChange(date, e.target.value)
                            }
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    handleAddTask(date);
                                }
                            }}
                            placeholder="e.g. DSA 1 question"
                            className="min-w-0 flex-1 rounded-xl border border-gray-300 px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                        />

                        <button
                            type="button"
                            onClick={() => handleAddTask(date)}
                            disabled={isSaving}
                            className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {isSaving ? (
                                <Loader2
                                    size={19}
                                    className="animate-spin"
                                />
                            ) : (
                                <Plus size={19} />
                            )}

                            <span className="hidden sm:inline">
                                Add
                            </span>
                        </button>
                    </div>

                    <p className="mt-2 text-xs text-gray-400">
                        Maximum 500 characters per task.
                    </p>
                </div>


                {/* TASK LIST */}
                <div className="mt-6">
                    <div className="mb-3 flex items-center justify-between">
                        <h3 className="font-bold text-gray-800">
                            Your Tasks
                        </h3>

                        <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-600">
                            {totalTasks} Tasks
                        </span>
                    </div>

                    {tasks.length === 0 ? (
                        <div className="rounded-xl border border-dashed border-gray-300 px-4 py-8 text-center">
                            <BookOpen
                                size={30}
                                className="mx-auto text-gray-300"
                            />

                            <p className="mt-2 text-sm font-medium text-gray-500">
                                No tasks added yet.
                            </p>

                            <p className="mt-1 text-xs text-gray-400">
                                Add your first learning task above.
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {tasks.map((task) => {
                                const isEditing =
                                    editingTaskId === task.id;

                                const isUpdating =
                                    updatingTaskId === task.id;

                                const isDeleting =
                                    deletingTaskId === task.id;

                                return (
                                    <div
                                        key={task.id}
                                        className={`rounded-xl border p-3 transition ${
                                            task.isCompleted
                                                ? "border-green-100 bg-green-50/50"
                                                : "border-gray-200 bg-white"
                                        }`}
                                    >
                                        <div className="flex items-start gap-3">

                                            {/* CHECKBOX */}
                                            <input
                                                type="checkbox"
                                                checked={task.isCompleted}
                                                disabled={isUpdating || isEditing}
                                                onChange={() =>
                                                    handleToggleTask(task)
                                                }
                                                className="mt-1 h-4 w-4 cursor-pointer accent-blue-600"
                                            />

                                            {/* TASK TEXT */}
                                            <div className="min-w-0 flex-1">
                                                {isEditing ? (
                                                    <input
                                                        type="text"
                                                        maxLength={500}
                                                        autoFocus
                                                        value={editingText}
                                                        onChange={(e) =>
                                                            setEditingText(e.target.value)
                                                        }
                                                        onKeyDown={(e) => {
                                                            if (e.key === "Enter") {
                                                                handleSaveEdit(task.id);
                                                            }
                                                        }}
                                                        className="w-full rounded-lg border border-blue-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-100"
                                                    />
                                                ) : (
                                                    <p
                                                        className={`break-words text-sm font-medium ${
                                                            task.isCompleted
                                                                ? "text-gray-400 line-through"
                                                                : "text-gray-800"
                                                        }`}
                                                    >
                                                        {task.taskText}
                                                    </p>
                                                )}

                                                {task.isCompleted && !isEditing && (
                                                    <span className="mt-1 inline-block text-xs font-medium text-green-600">
                                                        Completed
                                                    </span>
                                                )}
                                            </div>


                                            {/* ACTION BUTTONS */}
                                            <div className="flex shrink-0 items-center gap-1">
                                                {isEditing ? (
                                                    <>
                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                handleSaveEdit(task.id)
                                                            }
                                                            disabled={isUpdating}
                                                            title="Save"
                                                            className="rounded-lg p-2 text-green-600 transition hover:bg-green-50 disabled:opacity-50"
                                                        >
                                                            <Save size={17} />
                                                        </button>

                                                        <button
                                                            type="button"
                                                            onClick={() => {
                                                                setEditingTaskId(null);
                                                                setEditingText("");
                                                            }}
                                                            title="Cancel"
                                                            className="rounded-lg p-2 text-gray-500 transition hover:bg-gray-100"
                                                        >
                                                            <X size={17} />
                                                        </button>
                                                    </>
                                                ) : (
                                                    <>
                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                handleStartEdit(task)
                                                            }
                                                            disabled={isUpdating || isDeleting}
                                                            title="Edit task"
                                                            className="rounded-lg p-2 text-blue-600 transition hover:bg-blue-50 disabled:opacity-50"
                                                        >
                                                            <Pencil size={17} />
                                                        </button>

                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                handleDeleteTask(task.id)
                                                            }
                                                            disabled={isDeleting || isUpdating}
                                                            title="Delete task"
                                                            className="rounded-lg p-2 text-red-500 transition hover:bg-red-50 disabled:opacity-50"
                                                        >
                                                            {isDeleting ? (
                                                                <Loader2
                                                                    size={17}
                                                                    className="animate-spin"
                                                                />
                                                            ) : (
                                                                <Trash2 size={17} />
                                                            )}
                                                        </button>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        );
    };


    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            <main className="mx-auto max-w-7xl px-5 py-8 md:px-8">

                {/* PAGE HEADING */}
                <div className="mb-8">
                    <Link
                        to="/"
                        className="mb-5 inline-flex items-center gap-2 text-sm font-medium text-gray-500 transition hover:text-blue-600"
                    >
                        <ArrowLeft size={17} />
                        Back to Home
                    </Link>

                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <div className="flex items-center gap-2 text-blue-600">
                                <Target size={23} />

                                <span className="text-sm font-semibold">
                                    Personal Learning Planner
                                </span>
                            </div>

                            <h1 className="mt-2 text-3xl font-extrabold text-gray-900 md:text-4xl">
                                Goal Calendar
                            </h1>

                            <p className="mt-2 text-gray-500">
                                Plan your study tasks and stay consistent every day.
                            </p>
                        </div>

                        <div className="flex items-center gap-2 rounded-xl border border-blue-100 bg-white px-4 py-3 text-sm font-medium text-gray-600 shadow-sm">
                            <BookOpen
                                size={19}
                                className="text-blue-600"
                            />
                            Today & Tomorrow
                        </div>
                    </div>
                </div>


                {/* ERROR MESSAGE */}
                {error && (
                    <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                        {error}
                    </div>
                )}

                {/* SUCCESS MESSAGE */}
                {success && (
                    <div className="mb-6 flex items-center gap-2 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
                        <CheckCircle2 size={18} />
                        {success}
                    </div>
                )}


                {/* LOADING */}
                {loading ? (
                    <div className="flex min-h-64 items-center justify-center">
                        <Loader2
                            size={35}
                            className="animate-spin text-blue-600"
                        />
                    </div>
                ) : (

                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">

                        {/* LEFT SIDE: CALENDAR */}
                        <div className="lg:col-span-4">
                            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm lg:sticky lg:top-24">

                                {/* CALENDAR HEADER */}
                                <div className="mb-6 flex items-center justify-between">
                                    <div>
                                        <h2 className="text-xl font-bold text-gray-900">
                                            Calendar
                                        </h2>

                                        <p className="mt-1 text-sm text-gray-500">
                                            Select your study day
                                        </p>
                                    </div>

                                    <div className="rounded-xl bg-blue-50 p-3 text-blue-600">
                                        <CalendarDays size={23} />
                                    </div>
                                </div>


                                {/* MONTH NAVIGATION */}
                                <div className="mb-5 flex items-center justify-between">
                                    <h3 className="font-bold text-gray-800">
                                        {monthName}
                                    </h3>

                                    <div className="flex items-center gap-1">
                                        <button
                                            type="button"
                                            onClick={handlePreviousMonth}
                                            className="rounded-lg p-2 text-gray-500 transition hover:bg-gray-100 hover:text-blue-600"
                                            title="Previous month"
                                        >
                                            <ChevronLeft size={19} />
                                        </button>

                                        <button
                                            type="button"
                                            onClick={handleNextMonth}
                                            className="rounded-lg p-2 text-gray-500 transition hover:bg-gray-100 hover:text-blue-600"
                                            title="Next month"
                                        >
                                            <ChevronRight size={19} />
                                        </button>
                                    </div>
                                </div>


                                {/* CALENDAR GRID */}
                                <div className="grid grid-cols-7 gap-1 text-center">

                                    {[
                                        "Sun",
                                        "Mon",
                                        "Tue",
                                        "Wed",
                                        "Thu",
                                        "Fri",
                                        "Sat"
                                    ].map((day) => (
                                        <div
                                            key={day}
                                            className="py-2 text-xs font-semibold text-gray-400"
                                        >
                                            {day}
                                        </div>
                                    ))}

                                    {calendarDays.map((day, index) => {
                                        if (!day) {
                                            return (
                                                <div
                                                    key={`empty-${index}`}
                                                    className="aspect-square"
                                                />
                                            );
                                        }

                                        const date = [
                                            calendarYear,
                                            String(calendarMonth + 1).padStart(2, "0"),
                                            String(day).padStart(2, "0")
                                        ].join("-");

                                        const isAllowed =
                                            date === today ||
                                            date === tomorrow;

                                        const isSelected =
                                            date === selectedDate;

                                        return (
                                            <button
                                                key={date}
                                                type="button"
                                                disabled={!isAllowed}
                                                onClick={() =>
                                                    handleSelectDate(date)
                                                }
                                                className={`aspect-square rounded-xl text-sm font-semibold transition ${
                                                    isSelected
                                                        ? "bg-blue-600 text-white shadow-md"
                                                        : isAllowed
                                                        ? "bg-blue-50 text-blue-700 hover:bg-blue-100"
                                                        : "cursor-not-allowed text-gray-300"
                                                }`}
                                            >
                                                {day}
                                            </button>
                                        );
                                    })}
                                </div>


                                {/* CALENDAR LEGEND */}
                                <div className="mt-6 space-y-3 border-t border-gray-100 pt-5">
                                    <div className="flex items-center gap-2 text-xs text-gray-500">
                                        <span className="h-3 w-3 rounded-full bg-blue-600" />
                                        Selected date
                                    </div>

                                    <div className="flex items-center gap-2 text-xs text-gray-500">
                                        <span className="h-3 w-3 rounded-full bg-blue-100" />
                                        Available goal dates
                                    </div>
                                </div>


                                {/* SELECTED DATE */}
                                <div className="mt-5 rounded-xl bg-blue-50 p-4">
                                    <p className="text-xs font-bold uppercase tracking-wide text-blue-600">
                                        Selected Date
                                    </p>

                                    <p className="mt-2 font-bold text-gray-900">
                                        {formatDate(selectedDate)}
                                    </p>
                                </div>

                            </div>
                        </div>


                        {/* RIGHT SIDE: GOAL CARDS */}
                        <div className="space-y-6 lg:col-span-8">

                            <div>
                                <h2 className="text-xl font-bold text-gray-900">
                                    Your Study Goals
                                </h2>

                                <p className="mt-1 text-sm text-gray-500">
                                    Select a day and manage your learning tasks.
                                </p>
                            </div>


                            {/* TODAY CARD */}
                            {renderGoalCard(
                                today,
                                "TODAY",
                                "Focus on the tasks you want to complete today."
                            )}


                            {/* TOMORROW CARD */}
                            {renderGoalCard(
                                tomorrow,
                                "TOMORROW",
                                "Prepare your learning tasks for tomorrow."
                            )}

                        </div>
                    </div>
                )}


                {/* BOTTOM INFORMATION */}
                {!loading && (
                    <div className="mt-8 rounded-2xl border border-blue-100 bg-blue-50 p-5">
                        <div className="flex items-start gap-3">
                            <div className="rounded-lg bg-white p-2 text-blue-600">
                                <CheckCircle2 size={21} />
                            </div>

                            <div>
                                <h3 className="font-bold text-gray-900">
                                    Stay Consistent!
                                </h3>

                                <p className="mt-1 text-sm leading-6 text-gray-600">
                                    Add your daily study tasks, complete them
                                    one by one, and track your progress.
                                    Your tasks will be saved to your account.
                                </p>
                            </div>
                        </div>
                    </div>
                )}

            </main>
        </div>
    );
}

export default GoalCalendar;
