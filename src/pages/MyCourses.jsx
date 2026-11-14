
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { BookOpen, UserRound, ArrowRight } from "lucide-react";

import Navbar from "../components/Navbar";
import api from "../api/axios";

function MyCourses() {
    const [enrollments, setEnrollments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchMyCourses = async () => {
            try {
                setLoading(true);
                setError("");

                const response = await api.get("/enrollments/my-courses");

                setEnrollments(response.data.enrollments || []);
            } catch (error) {
                setError(
                    error.response?.data?.message ||
                    "Failed to fetch your courses."
                );
            } finally {
                setLoading(false);
            }
        };

        fetchMyCourses();
    }, []);

    return (
        <>
            <Navbar />

            <section className="min-h-screen bg-gray-50 px-6 py-12 md:px-12 lg:px-20">
                <div className="mx-auto max-w-6xl">

                    {/* Header */}
                    <div className="mb-10">
                        <h1 className="text-3xl font-extrabold text-gray-900 md:text-4xl">
                            My Courses
                        </h1>

                        <p className="mt-3 text-gray-500">
                            Continue learning and explore your enrolled courses.
                        </p>
                    </div>

                    {/* Loading */}
                    {loading && (
                        <p className="py-20 text-center text-gray-500">
                            Loading your courses...
                        </p>
                    )}

                    {/* Error */}
                    {!loading && error && (
                        <p className="py-20 text-center text-red-500">
                            {error}
                        </p>
                    )}

                    {/* Empty State */}
                    {!loading && !error && enrollments.length === 0 && (
                        <div className="rounded-2xl border border-gray-200 bg-white px-6 py-16 text-center">
                            <BookOpen
                                size={55}
                                className="mx-auto text-gray-400"
                            />

                            <h2 className="mt-5 text-xl font-bold text-gray-900">
                                No Courses Yet
                            </h2>

                            <p className="mt-2 text-gray-500">
                                You haven't enrolled in any courses yet.
                            </p>

                            <Link
                                to="/courses"
                                className="mt-6 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700"
                            >
                                Explore Courses
                                <ArrowRight size={18} />
                            </Link>
                        </div>
                    )}

                    {/* Enrolled Courses */}
                    {!loading && !error && enrollments.length > 0 && (
                        <>
                            <p className="mb-6 font-medium text-gray-600">
                                {enrollments.length} Enrolled Courses
                            </p>

                            <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
                                {enrollments.map((enrollment) => {
                                    const course = enrollment.course;

                                    if (!course) return null;

                                    return (
                                        <div
                                            key={enrollment.id}
                                            className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                                        >
                                            {/* Course Image Placeholder */}
                                            <div className="flex h-44 items-center justify-center bg-gradient-to-br from-blue-100 to-indigo-200">
                                                <BookOpen
                                                    size={60}
                                                    className="text-blue-600"
                                                />
                                            </div>

                                            <div className="p-5">
                                                <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
                                                    {course.category?.name || "Online Course"}
                                                </span>

                                                <h2 className="mt-4 text-xl font-bold text-gray-900">
                                                    {course.title}
                                                </h2>

                                                <p className="mt-2 line-clamp-2 text-sm leading-6 text-gray-500">
                                                    {course.description}
                                                </p>

                                                <div className="mt-4 flex items-center gap-2 text-sm text-gray-600">
                                                    <UserRound size={17} />
                                                    {course.instructor}
                                                </div>

                                                <div className="mt-5 border-t border-gray-100 pt-4">
                                                    <Link
                                                        to={`/courses/${course.id}`}
                                                        className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white transition hover:bg-blue-700"
                                                    >
                                                        View Course
                                                        <ArrowRight size={18} />
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </>
                    )}

                </div>
            </section>
        </>
    );
}

export default MyCourses;
