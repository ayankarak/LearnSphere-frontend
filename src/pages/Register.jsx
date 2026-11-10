import { Link } from "react-router-dom";
import { GraduationCap, User, Mail, Lock } from "lucide-react";

function Register() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4 py-10">

      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl">

        {/* Logo */}
        <Link to="/" className="mb-8 flex items-center justify-center gap-2">
          <div className="rounded-xl bg-blue-600 p-2 text-white">
            <GraduationCap size={25} />
          </div>
          <span className="text-2xl font-bold text-gray-900">
            Learn<span className="text-blue-600">Sphere</span>
          </span>
        </Link>

        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900">
            Create Account
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            Start your learning journey with LearnSphere.
          </p>
        </div>

        <form className="space-y-5">

          {/* Name */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700">
              Full Name
            </label>

            <div className="flex items-center rounded-lg border border-gray-300 px-4 focus-within:border-blue-600">
              <User size={19} className="text-gray-400" />
              <input
                type="text"
                placeholder="Enter your name"
                className="w-full px-3 py-3 outline-none"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700">
              Email Address
            </label>

            <div className="flex items-center rounded-lg border border-gray-300 px-4 focus-within:border-blue-600">
              <Mail size={19} className="text-gray-400" />
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full px-3 py-3 outline-none"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700">
              Password
            </label>

            <div className="flex items-center rounded-lg border border-gray-300 px-4 focus-within:border-blue-600">
              <Lock size={19} className="text-gray-400" />
              <input
                type="password"
                placeholder="Create a password"
                className="w-full px-3 py-3 outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full rounded-lg bg-blue-600 py-3 font-semibold text-white transition hover:bg-blue-700"
          >
            Create Account
          </button>

        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-semibold text-blue-600 hover:underline"
          >
            Login
          </Link>
        </p>

        <Link
          to="/"
          className="mt-5 block text-center text-sm text-gray-500 hover:text-blue-600"
        >
          Back to Home
        </Link>

      </div>
    </div>
  );
}

export default Register;