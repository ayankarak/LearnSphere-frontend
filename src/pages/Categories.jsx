
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { BookOpen, ArrowRight, RefreshCw } from "lucide-react";

import Navbar from "../components/Navbar";
import api from "../api/axios";

function Categories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch categories from backend
  const fetchCategories = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/categories");

      setCategories(response.data.categories || []);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to load categories. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="mx-auto max-w-7xl px-5 py-12 lg:px-8">
        {/* Page Heading */}
        <div className="mb-12 text-center">
          <p className="mb-3 font-semibold tracking-wider text-blue-600">
            EXPLORE LEARNSPHERE
          </p>

          <h1 className="mb-3 text-3xl font-bold text-gray-900 md:text-4xl">
            Explore Categories
          </h1>

          <p className="mx-auto max-w-2xl leading-7 text-gray-500">
            Discover courses across different categories and find
            the perfect learning path for your goals.
          </p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="py-16 text-center">
            <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-blue-100 border-t-blue-600" />

            <p className="text-gray-500">
              Loading categories...
            </p>
          </div>
        )}

        {/* Error State */}
        {!loading && error && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center">
            <p className="mb-4 text-red-600">{error}</p>

            <button
              onClick={fetchCategories}
              className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-5 py-2.5 font-semibold text-white transition hover:bg-red-700"
            >
              <RefreshCw size={17} />
              Try Again
            </button>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && categories.length === 0 && (
          <div className="py-16 text-center">
            <BookOpen
              className="mx-auto mb-4 text-gray-400"
              size={48}
            />

            <h2 className="text-xl font-semibold text-gray-800">
              No Categories Available
            </h2>

            <p className="mt-2 text-gray-500">
              Categories will appear here once they are added.
            </p>
          </div>
        )}

        {/* Category Cards */}
        {!loading && !error && categories.length > 0 && (
          <>
            <p className="mb-6 text-sm font-medium text-gray-500">
              Showing {categories.length} categories
            </p>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {categories.map((category) => (
                <div
                  key={category.id}
                  className="group rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-blue-300 hover:shadow-lg"
                >
                  <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-xl bg-blue-100 text-blue-600 transition group-hover:bg-blue-600 group-hover:text-white">
                    <BookOpen size={27} />
                  </div>

                  <h2 className="mb-2 text-xl font-bold text-gray-900">
                    {category.name}
                  </h2>

                  <p className="mb-5 min-h-12 text-sm leading-6 text-gray-500">
                    {category.description ||
                      "Explore courses in this category."}
                  </p>

                  <div className="mb-5 text-sm font-medium text-gray-600">
                    {category.courses?.length || 0} Courses Available
                  </div>

                  <Link
                    to={`/courses?categoryId=${category.id}`}
                    className="inline-flex items-center gap-2 font-semibold text-blue-600 transition hover:gap-3 hover:text-blue-800"
                  >
                    Explore Courses
                    <ArrowRight size={18} />
                  </Link>
                </div>
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
}

export default Categories;
