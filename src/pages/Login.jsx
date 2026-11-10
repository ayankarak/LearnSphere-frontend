import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { GraduationCap } from "lucide-react";
import api from "../api/axios";

import { useAuth } from "../context/AuthContext";

function Login() {
    const navigate = useNavigate();
    const { login } = useAuth();

    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");
        setLoading(true);

        try {
            const response = await api.post("/auth/login", formData);

            await login(response.data.token);

            alert("Login successful!");
            navigate("/");
        } catch (err) {
            setError(
                err.response?.data?.message || "Login failed. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
            <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg">
                <Link to="/" className="flex items-center justify-center gap-2 mb-6">
                    <GraduationCap size={32} className="text-indigo-600" />
                    <span className="text-2xl font-bold text-gray-900">
                        LearnSphere
                    </span>
                </Link>

                <h2 className="text-2xl font-bold text-center mb-2">
                    Welcome Back!
                </h2>

                <p className="text-gray-500 text-center mb-6">
                    Login to continue learning.
                </p>

                {error && (
                    <p className="bg-red-100 text-red-600 p-3 rounded-lg mb-4 text-sm">
                        {error}
                    </p>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="email"
                        name="email"
                        placeholder="Email Address"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500"
                    />

                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500"
                    />

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 disabled:opacity-60"
                    >
                        {loading ? "Logging in..." : "Login"}
                    </button>
                </form>

                <p className="text-center text-gray-600 mt-6">
                    Don't have an account?{" "}
                    <Link to="/register" className="text-indigo-600 font-semibold">
                        Sign Up
                    </Link>
                </p>

                <Link
                    to="/"
                    className="block text-center text-gray-500 text-sm mt-4 hover:text-indigo-600"
                >
                    Back to Home
                </Link>
            </div>
        </div>
    );
}

export default Login;