import { Link } from "react-router-dom";
import { GraduationCap, BookOpen, User, Mail, ShieldCheck, ArrowRight, } from "lucide-react";

import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";

function Dashboard() {
    const { user } = useAuth();

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            <main className="mx-auto max-w-7xl px-5 py-10 lg:px-8">

                {/* Welcome Section */}
                <section className="mb-10 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 p-8 text-white">
                    <div className="flex items-center gap-3 mb-4">
                        <GraduationCap size={35} />
                        <span className="text-lg font-semibold">LearnSphere</span>
                    </div>

                    <h1 className="text-3xl font-bold mb-3">
                        Welcome back, {user?.name}!
                    </h1>

                    <p className="text-blue-100">
                        Continue your learning journey and build new skills.
                    </p>

                    <Link
                        to="/courses"
                        className="mt-6 inline-flex items-center gap-2 rounded-lg bg-white px-5 py-3 font-semibold text-blue-600 transition hover:bg-blue-50"
                    >
                        Explore Courses
                        <ArrowRight size={18} />
                    </Link>
                </section>

                {/* Dashboard Heading */}
                <div className="mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">
                        Your Dashboard
                    </h2>

                    <p className="mt-1 text-gray-500">
                        Manage your account and learning activities.
                    </p>
                </div>

                {/* Profile Information */}
                <div className="grid gap-6 md:grid-cols-2">

                    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                        <div className="mb-5 flex items-center gap-3">
                            <div className="rounded-lg bg-blue-100 p-3 text-blue-600">
                                <User size={22} />
                            </div>

                            <h3 className="text-lg font-semibold text-gray-900">
                                Personal Information
                            </h3>
                        </div>

                        <div className="space-y-5">

                            <div>
                                <p className="mb-1 text-sm text-gray-500">Full Name</p>
                                <p className="font-semibold text-gray-800">
                                    {user?.name}
                                </p>
                            </div>

                            <div>
                                <p className="mb-1 text-sm text-gray-500">Email Address</p>
                                <div className="flex items-center gap-2 text-gray-800">
                                    <Mail size={17} className="text-gray-400" />
                                    <span className="font-medium">{user?.email}</span>
                                </div>
                            </div>

                            <div>
                                <p className="mb-1 text-sm text-gray-500">Account Role</p>
                                <div className="flex items-center gap-2">
                                    <ShieldCheck size={17} className="text-green-600" />
                                    <span className="font-semibold capitalize text-gray-800">
                                        {user?.role}
                                    </span>
                                </div>
                            </div>

                        </div>
                    </div>

                    {/* Learning Section */}
                    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                        <div className="mb-5 flex items-center gap-3">
                            <div className="rounded-lg bg-indigo-100 p-3 text-indigo-600">
                                <BookOpen size={22} />
                            </div>

                            <h3 className="text-lg font-semibold text-gray-900">
                                Learning
                            </h3>
                        </div>

                        <p className="mb-5 text-gray-600">
                            Discover courses, learn new technologies and improve your skills.
                        </p>

                        <Link
                            to="/courses"
                            className="inline-flex items-center gap-2 font-semibold text-blue-600 hover:text-blue-700"
                        >
                            Browse All Courses
                            <ArrowRight size={18} />
                        </Link>
                    </div>

                </div>
            </main>
        </div>
    );
}

export default Dashboard;