import LoginImage from "../../assets/login/login.png";
import { Link } from "react-router-dom";
import { EnvelopeIcon } from "@heroicons/react/24/outline";

import Button from "../../components/atoms/Button";
import { Input } from "../../components/molecules/Input";

export default function LoginPage() {
  return (
    <div className="h-screen lg:grid lg:grid-cols-2">
      {/* Left Column: Login Form */}
      <div className="flex flex-col justify-between h-full p-6 sm:p-8 lg:p-12 overflow-auto">
        {/* Logo */}
        <Link to="/" className="text-gray-700 hover:text-cyan-600 font-medium">
          <img src="/logo.svg" alt="SkyCamp" className="h-8 mr-2" />
        </Link>

        {/* Login Form Section */}
        <div className="mx-auto w-full max-w-md space-y-6 py-8 sm:py-12 md:py-0 flex-1 flex flex-col justify-center">
          <div className="space-y-2">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-gray-900">
              Log in
            </h1>
            <p className="text-gray-600">
              Welcome back! Please enter your details.
            </p>
          </div>
          <form className="space-y-4">
            <div className="space-y-2">
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
              />
            </div>
            <div className="space-y-2">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <Input id="password" type="password" required />
              <p className="text-xs text-gray-500 mt-1">
                Your password must be at least 8 characters long and include a
                number and a special character.
              </p>

              {/* Remember & Forgot Password */}
            </div>
            <div className="space-y-2 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0 mt-2">
              <label className="flex items-center text-sm text-gray-900 cursor-pointer">
                <input
                  id="remember"
                  name="remember"
                  type="checkbox"
                  className="h-4 w-4 rounded border-gray-300 text-cyan-600 focus:ring-cyan-500"
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
            <Button type="submit" className="w-full">
              Sign in
            </Button>
          </form>
          <div className="text-center text-sm text-gray-600">
            Don&apos;t have an account?{" "}
            <Link
              to="/register"
              className="font-medium text-cyan-600 hover:underline"
            >
              Sign up
            </Link>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 flex flex-col items-center justify-between gap-4 text-sm text-gray-500 md:flex-row lg:mt-0">
          <p>© {new Date().getFullYear()} SkyCamp. All rights reserved.</p>
          <a
            href="mailto:ask@skycamp.com"
            className="flex items-center gap-1 hover:underline"
          >
            <EnvelopeIcon className="h-4 w-4" />
            ask@skycamp.com
          </a>
        </div>
      </div>

      {/* Right Column: Cover Image */}
      <div className="hidden lg:block h-full">
        <img
          src={LoginImage}
          alt="A tent illuminated under a starry sky in the mountains"
          className="h-full w-full object-cover"
        />
      </div>
    </div>
  );
}
