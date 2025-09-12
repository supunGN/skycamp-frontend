import React, { useState } from "react";
import { API } from "../../api";
import { useNavigate } from "react-router-dom";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Email and password are required");
      return;
    }

    try {
      setLoading(true);
      console.log("🔍 Admin Login Attempt:", { email, password: "***" });
      const result = await API.admin.login({ email, password });
      console.log("✅ Admin Login Response:", result);

      if (result.success) {
        console.log("🎉 Admin Login Success - User:", result.user);
        localStorage.setItem("admin", JSON.stringify(result.user));
        const redirectUrl = result.redirect_url || "/admin";
        window.location.replace(redirectUrl);
      } else {
        console.log("❌ Admin Login Failed:", result.message);
        setError(result.message || "Invalid credentials");
      }
    } catch (err) {
      console.log("💥 Admin Login Error:", err);
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-md p-6">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold text-gray-900">Admin Login</h1>
          <p className="text-sm text-gray-500 mt-1">
            Sign in to manage SkyCamp
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full rounded-md border-gray-300 focus:border-cyan-600 focus:ring-cyan-600"
              placeholder="admin@example.com"
              required
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full rounded-md border-gray-300 focus:border-cyan-600 focus:ring-cyan-600"
              placeholder="Your password"
              required
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-md p-3">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full inline-flex justify-center items-center rounded-md bg-cyan-600 px-4 py-2 text-white font-semibold hover:bg-cyan-700 disabled:opacity-60"
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  );
}
