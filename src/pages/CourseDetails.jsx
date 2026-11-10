import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { BookOpen, Clock, UserRound, PlayCircle, ArrowLeft } from "lucide-react";

import Navbar from "../components/Navbar";
import api from "../api/axios";

function CourseDetails() {
  const { id } = useParams();

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get(`/courses/${id}`);

        setCourse(response.data.course);
      } catch (error) {
        setError(
          error.response?.data?.message || "Failed to fetch course details."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [id]);

  return (
    <>
      <Navbar />

      <section className="min-h-screen bg-gray-50 px-6 py-12 md:px-12 lg:px-20">
        <div className="mx-auto max-w-6xl">

          <Link
            to="/courses"
            className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-800"
          >
            <ArrowLeft size={18} />
            Back to Courses
          </Link>

          {loading && (
            <p className="py-20 text-center text-gray-500">
              Loading course details...
            </p>
          )}

          {!loading && error && (
            <p className="py-20 text-center text-red-500">
              {error}
            </p>
          )}

          {!loading && !error && course && (
            <div className="grid gap-10 lg:grid-cols-3">

              {/* Course Information */}
              <div className="space-y-8 lg:col-span-2">

                <div className="rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 p-8 text-white">
                  <span className="rounded-full bg-white/20 px-4 py-2 text-sm">
                    {course.category?.name || "Online Course"}
                  </span>

                  <h1 className="mt-6 text-3xl font-extrabold md:text-4xl">
                    {course.title}
                  </h1>

                  <p className="mt-5 leading-7 text-blue-100">
                    {course.description}
                  </p>

                  <div className="mt-8 flex flex-wrap gap-6 text-sm">
                    <span className="flex items-center gap-2">
                      <UserRound size={18} />
                      {course.instructor}
                    </span>

                    <span className="flex items-center gap-2">
                      <BookOpen size={18} />
                      {course.lessons?.length || 0} Lessons
                    </span>
                  </div>
                </div>

                {/* Lessons */}
                <div className="rounded-2xl border border-gray-200 bg-white p-6">
                  <h2 className="mb-6 text-2xl font-bold text-gray-900">
                    Course Content
                  </h2>

                  {!course.lessons?.length ? (
                    <p className="text-gray-500">
                      No lessons available for this course yet.
                    </p>
                  ) : (
                    <div className="space-y-4">
                      {course.lessons.map((lesson, index) => (
                        <div
                          key={lesson.id}
                          className="flex items-center justify-between gap-4 rounded-xl border border-gray-100 p-4"
                        >
                          <div className="flex items-center gap-4">
                            <div className="rounded-lg bg-blue-100 p-3 text-blue-600">
                              <PlayCircle size={22} />
                            </div>

                            <div>
                              <h3 className="font-semibold text-gray-900">
                                {index + 1}. {lesson.title}
                              </h3>

                              <p className="mt-1 text-sm text-gray-500">
                                {lesson.description || "Course lesson"}
                              </p>
                            </div>
                          </div>

                          <div className="shrink-0 text-right">
                            <p className="flex items-center gap-1 text-sm text-gray-500">
                              <Clock size={14} />
                              {lesson.duration
                                ? `${lesson.duration} min`
                                : "N/A"}
                            </p>

                            {lesson.isPreview && (
                              <span className="mt-2 inline-block rounded-full bg-green-100 px-2 py-1 text-xs font-semibold text-green-700">
                                Preview
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Price Card */}
              <div>
                <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm lg:sticky lg:top-8">
                  <div className="flex h-40 items-center justify-center rounded-xl bg-gradient-to-br from-blue-100 to-indigo-200">
                    <BookOpen size={65} className="text-blue-600" />
                  </div>

                  <p className="mt-6 text-sm font-medium text-gray-500">
                    Course Price
                  </p>

                  <h2 className="mt-2 text-3xl font-extrabold text-blue-600">
                    ₹{Number(course.price).toLocaleString("en-IN")}
                  </h2>

                  <div className="my-6 border-t border-gray-100" />

                  <p className="flex items-center gap-2 text-sm text-gray-600">
                    <UserRound size={18} />
                    Instructor: {course.instructor}
                  </p>

                  <p className="mt-4 flex items-center gap-2 text-sm text-gray-600">
                    <BookOpen size={18} />
                    {course.lessons?.length || 0} Lessons
                  </p>

                  <button
                    disabled
                    className="mt-8 w-full cursor-not-allowed rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white opacity-60"
                  >
                    Enroll Now (Coming Soon)
                  </button>
                </div>
              </div>

            </div>
          )}
        </div>
      </section>
    </>
  );
}

export default CourseDetails;