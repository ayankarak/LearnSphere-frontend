import { useEffect, useState } from "react";

import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import CourseCard from "../components/CourseCard";
import api from "../api/axios";

function Home() {
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
      <Hero />

      {/* Featured Courses */}
      <section className="bg-white px-6 py-20 md:px-12 lg:px-20">
        <div className="mx-auto max-w-7xl">

          <div className="mb-12 text-center">
            <span className="font-semibold uppercase tracking-wider text-blue-600">
              Popular Courses
            </span>

            <h2 className="mt-3 text-3xl font-extrabold text-gray-900 md:text-4xl">
              Explore Our Featured Courses
            </h2>

            <p className="mx-auto mt-4 max-w-2xl text-gray-500">
              Discover courses designed to help you learn new skills and
              achieve your career goals.
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

          {/* No Courses */}
          {!loading && !error && courses.length === 0 && (
            <p className="text-center text-gray-500">
              No courses available at the moment.
            </p>
          )}

          {/* Course List */}
          {!loading && !error && courses.length > 0 && (
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {courses.map((course) => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>
          )}

        </div>
      </section>
    </>
  );
}

export default Home;