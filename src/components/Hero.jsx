import { Link } from "react-router-dom";
import {ArrowRight,BookOpen,GraduationCap,PlayCircle,Users} from "lucide-react";

function Hero() {
  return (
    <section className="bg-gradient-to-br from-blue-50 via-white to-indigo-50 px-6 py-20 md:px-12 lg:px-20">
      <div className="mx-auto grid max-w-7xl items-center gap-14 lg:grid-cols-2">

        {/* Left Content */}
        <div>
          <span className="mb-6 inline-flex items-center gap-2 rounded-full bg-blue-100 px-4 py-2 text-sm font-semibold text-blue-700">
            <GraduationCap size={18} />
            Your Learning Journey Starts Here
          </span>

          <h1 className="text-4xl font-extrabold leading-tight text-gray-900 sm:text-5xl lg:text-6xl">
            Learn New Skills.
            <span className="mt-2 block text-blue-600">
              Build Your Future.
            </span>
          </h1>

          <p className="mt-6 max-w-xl text-base leading-8 text-gray-600 md:text-lg">
            Explore high-quality courses, learn from experienced instructors,
            and develop the skills you need to achieve your career goals.
          </p>

          {/* Buttons */}
          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              to="/courses"
              className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3.5 font-semibold text-white shadow-lg shadow-blue-200 transition hover:bg-blue-700"
            >
              Explore Courses
              <ArrowRight size={19} />
            </Link>

            <Link
              to="/register"
              className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-6 py-3.5 font-semibold text-gray-700 transition hover:border-blue-600 hover:text-blue-600"
            >
              <PlayCircle size={19} />
              Get Started
            </Link>
          </div>

          {/* Statistics */}
          <div className="mt-12 flex flex-wrap gap-8">
            <div>
              <div className="flex items-center gap-2 text-2xl font-bold text-gray-900">
                <Users className="text-blue-600" size={23} />
                10K+
              </div>
              <p className="mt-1 text-sm text-gray-500">Active Students</p>
            </div>

            <div>
              <div className="flex items-center gap-2 text-2xl font-bold text-gray-900">
                <BookOpen className="text-blue-600" size={23} />
                500+
              </div>
              <p className="mt-1 text-sm text-gray-500">Online Courses</p>
            </div>

            <div>
              <div className="flex items-center gap-2 text-2xl font-bold text-gray-900">
                <GraduationCap className="text-blue-600" size={23} />
                50+
              </div>
              <p className="mt-1 text-sm text-gray-500">Expert Instructors</p>
            </div>
          </div>
        </div>

        {/* Right Illustration */}
        <div className="relative flex justify-center">
          <div className="absolute -left-5 top-10 h-32 w-32 rounded-full bg-blue-200/50 blur-3xl"></div>
          <div className="absolute -bottom-5 right-5 h-40 w-40 rounded-full bg-indigo-200/60 blur-3xl"></div>

          <div className="relative w-full max-w-lg rounded-3xl border border-blue-100 bg-white p-5 shadow-2xl shadow-blue-100">
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
              <p className="text-sm text-blue-100">Featured Course</p>
              <h3 className="mt-2 text-2xl font-bold">
                Full Stack Web Development
              </h3>
              <p className="mt-2 text-sm text-blue-100">
                Learn HTML, CSS, JavaScript, React and Node.js.
              </p>

              <div className="mt-5 flex items-center justify-between">
                <span className="text-sm font-medium">Beginner Friendly</span>
                <PlayCircle size={32} />
              </div>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-4">
              <div className="rounded-xl bg-blue-50 p-4">
                <BookOpen className="text-blue-600" size={24} />
                <h4 className="mt-3 font-bold text-gray-900">Learn Anytime</h4>
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
        </div>

      </div>
    </section>
  );
}

export default Hero;