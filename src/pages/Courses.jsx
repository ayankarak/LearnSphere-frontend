import { useEffect, useState } from "react";

import Navbar from "../components/Navbar";
import CourseCard from "../components/CourseCard";
import api from "../api/axios";

function Courses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await api.get("/courses");
        setCourses(response.data.courses || []);
      } catch (error) {
        setError(
          error.response?.data?.message || "Failed to fetch courses."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  return (
    <>
      <Navbar />

      <section className="min-h-screen bg-gray-50 px-6 py-16 md:px-12 lg:px-20">
        <div className="mx-auto max-w-7xl">

          {/* Page Heading */}
          <div className="mb-12 text-center">
            <span className="font-semibold uppercase tracking-wider text-blue-600">
              Our Courses
            </span>

            <h1 className="mt-3 text-3xl font-extrabold text-gray-900 md:text-4xl">
              Explore All Courses
            </h1>

            <p className="mx-auto mt-4 max-w-2xl text-gray-500">
              Discover the right courses to develop your skills and
              achieve your learning goals.
            </p>
          </div>

          {/* Loading */}
          {loading && (
            <p className="text-center text-gray-500">
              Loading courses...
            </p>
          )}

          {/* Error */}
          {!loading && error && (
            <p className="text-center text-red-500">
              {error}
            </p>
          )}

          {/* Empty State */}
          {!loading && !error && courses.length === 0 && (
            <p className="text-center text-gray-500">
              No courses available at the moment.
            </p>
          )}

          {/* Course Grid */}
          {!loading && !error && courses.length > 0 && (
            <>
              <p className="mb-6 text-sm text-gray-500">
                Showing {courses.length} courses
              </p>

              <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {courses.map((course) => (
                  <CourseCard key={course.id} course={course} />
                ))}
              </div>
            </>
          )}

        </div>
      </section>
    </>
  );
}

export default Courses;