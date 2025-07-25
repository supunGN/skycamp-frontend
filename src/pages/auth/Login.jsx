import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import LoginImage from "../../assets/login/login.png";
import { Link } from "react-router-dom";
import { EnvelopeIcon } from "@heroicons/react/24/outline";

import Button from "../../components/atoms/Button";
import { Input } from "../../components/molecules/Input";
import { API_BASE_URL } from "../../api";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${API_BASE_URL}login.php`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      console.log("Login Response:", data); // Debug log

      if (!response.ok || !data.success) {
        localStorage.removeItem("user");
        setError(data.message || "Login failed");
        return;
      }

      if (data.user) {
        localStorage.setItem("user", JSON.stringify(data.user));

        // Force full page reload with redirect
        window.location.href = data.redirect_url || "/";
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("An error occurred. Please try again.");
      localStorage.removeItem("user");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen h-screen w-full overflow-hidden lg:grid lg:grid-cols-2">
      {/* Left Column: Login Form */}
      <div className="flex flex-col h-screen w-full overflow-y-auto">
        <div className="flex flex-col justify-between min-h-full py-4 px-4 sm:py-6 sm:px-6 lg:py-8 lg:px-8">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link
              to="/"
              className="text-gray-700 hover:text-cyan-600 font-medium inline-block"
            >
              <img src="/logo.svg" alt="SkyCamp" className="h-6 sm:h-8" />
            </Link>
          </div>

          {/* Login Form Section */}
          <div className="flex-grow flex flex-col justify-center py-4 sm:py-8">
            <div className="mx-auto w-full max-w-sm sm:max-w-md space-y-4 sm:space-y-6">
              <div className="space-y-1 sm:space-y-2 text-center sm:text-left">
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight text-gray-900">
                  Log in
                </h1>
                <p className="text-sm sm:text-base text-gray-600">
                  Welcome back! Please enter your details.
                </p>
              </div>

              <form className="space-y-3 sm:space-y-4" onSubmit={handleSubmit}>
                <div className="space-y-1 sm:space-y-2">
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Email
                  </label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                <div className="space-y-1 sm:space-y-2">
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Password
                  </label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>

                {/* Remember & Forgot Password */}
                <div className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
                  <label className="flex items-center text-sm text-gray-900 cursor-pointer">
                    <input
                      id="remember"
                      name="remember"
                      type="checkbox"
                      className="h-4 w-4 rounded border-gray-300 text-cyan-600 focus:ring-cyan-500 flex-shrink-0"
                    />
                    <span className="ml-2">Remember me</span>
                  </label>
                  <Link
                    to="/forgot-password"
                    className="text-sm font-medium text-cyan-600 hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>

                {error && (
                  <div className="text-red-600 text-sm text-center">
                    {error}
                  </div>
                )}

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Signing in..." : "Sign in"}
                </Button>
              </form>

              <div className="text-center text-sm text-gray-600">
                Don&apos;t have an account?{" "}
                <Link
                  to="/signup"
                  className="font-medium text-cyan-600 hover:underline"
                >
                  Sign up
                </Link>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex-shrink-0 mt-4 sm:mt-6">
            <div className="flex flex-col items-center justify-between gap-2 text-xs sm:text-sm text-gray-500 sm:flex-row sm:gap-4">
              <p className="text-center sm:text-left">
                © {new Date().getFullYear()} SkyCamp. All rights reserved.
              </p>
              <a
                href="mailto:ask@skycamp.com"
                className="flex items-center gap-1 hover:underline flex-shrink-0"
              >
                <EnvelopeIcon className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="whitespace-nowrap">ask@skycamp.com</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Right Column: Cover Image */}
      <div className="hidden lg:block h-screen w-full overflow-hidden">
        <img
          src={LoginImage}
          alt="A tent illuminated under a starry sky in the mountains"
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );
}
