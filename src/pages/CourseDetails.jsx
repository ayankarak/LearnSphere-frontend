
import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { BookOpen, Clock,UserRound, PlayCircle, ArrowLeft, Lock } from "lucide-react";

import Navbar from "../components/Navbar";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

function CourseDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { user, loading: authLoading } = useAuth();

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [isEnrolled, setIsEnrolled] = useState(false);
  const [enrolling, setEnrolling] = useState(false);
  const [enrollError, setEnrollError] = useState("");
  const [enrollSuccess, setEnrollSuccess] = useState("");

  // FETCH COURSE DETAILS
  useEffect(() => {
    const fetchCourse = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get(`/courses/${id}`);
        setCourse(response.data.course);
      } catch (error) {
        setError(
          error.response?.data?.message ||
            "Failed to fetch course details."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [id]);

  // CHECK ENROLLMENT STATUS
  useEffect(() => {
    const checkEnrollment = async () => {
      if (authLoading) return;

      if (!user) {
        setIsEnrolled(false);
        return;
      }

      try {
        const response = await api.get("/enrollments/my-courses");

        const enrollments = response.data.enrollments || [];

        const enrolled = enrollments.some(
          (item) => Number(item.courseId) === Number(id)
        );

        setIsEnrolled(enrolled);
      } catch (error) {
        console.error("Enrollment check failed:", error);
      }
    };

    checkEnrollment();
  }, [id, user, authLoading]);

  // ENROLL IN COURSE
  const handleEnroll = async () => {
    if (!user) {
      navigate("/login");
      return;
    }

    try {
      setEnrolling(true);
      setEnrollError("");
      setEnrollSuccess("");

      await api.post(`/enrollments/course/${id}`);

      setIsEnrolled(true);
      setEnrollSuccess("Successfully enrolled in this course!");
    } catch (error) {
      setEnrollError(
        error.response?.data?.message ||
          "Failed to enroll in this course."
      );
    } finally {
      setEnrolling(false);
    }
  };

  // OPEN SELECTED LESSON
  const handleLessonClick = (lesson) => {
    if (!user) {
      navigate("/login");
      return;
    }

    if (!isEnrolled && !lesson.isPreview) {
      setEnrollError("Please enroll in this course to access this lesson.");
      return;
    }

    navigate(`/learn/${id}?lessonId=${lesson.id}`);
  };

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

              {/* COURSE INFORMATION */}
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

                {/* LESSONS */}
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
                      {course.lessons.map((lesson, index) => {
                        const canAccess = isEnrolled || lesson.isPreview;

                        return (
                          <button
                            key={lesson.id}
                            type="button"
                            onClick={() => handleLessonClick(lesson)}
                            className={`flex w-full items-center justify-between gap-4 rounded-xl border p-4 text-left transition ${
                              canAccess
                                ? "border-gray-100 hover:border-blue-300 hover:bg-blue-50"
                                : "cursor-not-allowed border-gray-100 bg-gray-50"
                            }`}
                          >
                            <div className="flex min-w-0 items-center gap-4">
                              <div className="shrink-0 rounded-lg bg-blue-100 p-3 text-blue-600">
                                {canAccess ? (
                                  <PlayCircle size={22} />
                                ) : (
                                  <Lock size={22} />
                                )}
                              </div>

                              <div className="min-w-0">
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

                              {lesson.isPreview ? (
                                <span className="mt-2 inline-block rounded-full bg-green-100 px-2 py-1 text-xs font-semibold text-green-700">
                                  Preview
                                </span>
                              ) : !isEnrolled ? (
                                <span className="mt-2 inline-block rounded-full bg-gray-200 px-2 py-1 text-xs font-semibold text-gray-600">
                                  Locked
                                </span>
                              ) : null}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>

              {/* PRICE CARD */}
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

                  {enrollError && (
                    <p className="mt-4 text-sm text-red-600">
                      {enrollError}
                    </p>
                  )}

                  {enrollSuccess && (
                    <p className="mt-4 text-sm text-green-600">
                      {enrollSuccess}
                    </p>
                  )}

                  <button
                    onClick={handleEnroll}
                    disabled={enrolling || authLoading || isEnrolled}
                    className={`mt-8 w-full rounded-lg px-5 py-3 font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-70 ${
                      isEnrolled
                        ? "bg-green-600"
                        : "bg-blue-600 hover:bg-blue-700"
                    }`}
                  >
                    {enrolling
                      ? "Enrolling..."
                      : isEnrolled
                        ? "Already Enrolled"
                        : "Enroll Now"}
                  </button>

                  {isEnrolled && (
                    <p className="mt-3 text-center text-sm text-green-600">
                      Select any lesson to start learning.
                    </p>
                  )}

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
