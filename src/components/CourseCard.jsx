import { Link } from "react-router-dom";
import { BookOpen, UserRound } from "lucide-react";

function CourseCard({ course }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition duration-300 hover:-translate-y-2 hover:shadow-xl">

      {/* Course Image Placeholder */}
      <div className="flex h-48 items-center justify-center bg-gradient-to-br from-blue-100 to-indigo-200">
        <BookOpen size={65} className="text-blue-600" />
      </div>

      {/* Course Details */}
      <div className="p-5">

        <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
          Online Course
        </span>

        <h3 className="mt-4 text-xl font-bold text-gray-900">
          {course.title}
        </h3>

        <p className="mt-2 line-clamp-2 text-sm text-gray-500">
          {course.description}
        </p>

        <div className="mt-4 flex items-center gap-2 text-sm text-gray-500">
          <UserRound size={17} />
          <span>By {course.instructor}</span>
        </div>

        <div className="mt-5 flex items-center justify-between border-t border-gray-100 pt-4">

          <span className="text-xl font-bold text-blue-600">
            ₹{Number(course.price).toLocaleString("en-IN")}
          </span>

          <Link
            to={`/courses/${course.id}`}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            View Course
          </Link>

        </div>
      </div>
    </div>
  );
}

export default CourseCard;