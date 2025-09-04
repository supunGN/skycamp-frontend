import React, { useState, useEffect, useRef } from "react";
import { ArrowLeftIcon, ShieldCheckIcon } from "@heroicons/react/24/outline";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Button from "../../components/atoms/Button";

export default function OTPVerification() {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [isLoading, setIsLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes in seconds
  const [canResend, setCanResend] = useState(false);
  const [error, setError] = useState("");

  const location = useLocation();
  const navigate = useNavigate();
  const inputRefs = useRef([]);

  const { email, token } = location.state || {};

  useEffect(() => {
    if (!email || !token) {
      navigate("/forgot-password");
      return;
    }

    // Start countdown timer
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setCanResend(true);
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [email, token, navigate]);

  // Auto-focus first input
  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  const handleOtpChange = (index, value) => {
    if (!/^\d*$/.test(value)) return; // Only allow digits

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setError("");

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    // Handle backspace
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }

    // Handle paste
    if (e.key === "v" && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      navigator.clipboard.readText().then((text) => {
        const digits = text.replace(/\D/g, "").slice(0, 6);
        const newOtp = [...otp];
        for (let i = 0; i < 6; i++) {
          newOtp[i] = digits[i] || "";
        }
        setOtp(newOtp);
        if (digits.length === 6) {
          inputRefs.current[5]?.focus();
        }
      });
    }
  };

  const handleVerifyOTP = async () => {
    const otpCode = otp.join("");

    if (otpCode.length !== 6) {
      setError("Please enter the complete 6-digit code");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const response = await fetch(
        "http://localhost/skycamp/skycamp-backend/api/auth/password/verify-otp.php",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: new URLSearchParams({
            token: token,
            otp: otpCode,
          }),
        }
      );

      const data = await response.json();

      if (data.success) {
        // Store token and verification status
        sessionStorage.setItem("resetToken", token);
        sessionStorage.setItem("otpVerified", "true");

        // Navigate to set new password with verified token
        navigate("/set-new-password", {
          state: {
            token: data.token,
            email: email,
            verified: true,
          },
        });
      } else {
        setError(
          data.message || "Invalid verification code. Please try again."
        );
        // Clear OTP inputs on error
        setOtp(["", "", "", "", "", ""]);
        inputRefs.current[0]?.focus();
      }
    } catch (error) {
      console.error("Verification error:", error);
      setError("Network error. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch(
        "http://localhost/skycamp/skycamp-backend/api/auth/password/forgot.php",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: new URLSearchParams({
            email: email,
          }),
        }
      );

      const data = await response.json();

      if (data.success) {
        // Reset timer and OTP
        setTimeLeft(300);
        setCanResend(false);
        setOtp(["", "", "", "", "", ""]);
        inputRefs.current[0]?.focus();

        // Update token if provided
        if (data.token) {
          navigate("/verify-otp", {
            state: {
              email: email,
              token: data.token,
            },
            replace: true,
          });
        }
      } else {
        setError(data.message || "Failed to resend code. Please try again.");
      }
    } catch (error) {
      console.error("Resend error:", error);
      setError("Network error. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4">
      <div className="w-full max-w-md bg-white p-6 sm:p-8 rounded-lg shadow-sm">
        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className="bg-gray-100 p-4 rounded-full">
            <ShieldCheckIcon className="w-6 h-6 text-gray-500" />
          </div>
        </div>

        {/* Title */}
        <h2 className="text-center text-2xl font-bold text-gray-900 mb-2">
          Enter Verification Code
        </h2>
        <p className="text-center text-sm text-gray-600 mb-8">
          We sent a 6-digit code to <br />
          <span className="font-semibold text-cyan-600">{email}</span>
        </p>

        {/* OTP Input Fields */}
        <div className="flex justify-center gap-3 mb-6">
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={(el) => (inputRefs.current[index] = el)}
              type="text"
              inputMode="numeric"
              maxLength="1"
              value={digit}
              onChange={(e) => handleOtpChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              className="w-12 h-12 text-center text-xl font-bold border-2 border-gray-300 rounded-lg focus:border-cyan-500 focus:outline-none transition-colors"
              disabled={isLoading}
            />
          ))}
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600 text-center">{error}</p>
          </div>
        )}

        {/* Timer */}
        <div className="text-center mb-6">
          {timeLeft > 0 ? (
            <p className="text-sm text-gray-600">
              Code expires in{" "}
              <span className="font-semibold text-gray-900">
                {formatTime(timeLeft)}
              </span>
            </p>
          ) : (
            <p className="text-sm text-red-600 font-semibold">
              Code has expired
            </p>
          )}
        </div>

        {/* Verify Button */}
        <Button
          onClick={handleVerifyOTP}
          disabled={isLoading || otp.join("").length !== 6}
          className="w-full mb-4"
        >
          {isLoading ? "Verifying..." : "Verify Code"}
        </Button>

        {/* Resend Code */}
        <div className="text-center mb-6">
          <p className="text-sm text-gray-600">
            Didn't receive the code?{" "}
            {canResend ? (
              <button
                onClick={handleResendOTP}
                disabled={isLoading}
                className="text-cyan-600 hover:underline font-semibold"
              >
                Resend Code
              </button>
            ) : (
              <span className="text-gray-400">
                Resend in {formatTime(timeLeft)}
              </span>
            )}
          </p>
        </div>

        {/* Back to login */}
        <div className="text-center">
          <Link
            to="/forgot-password"
            className="inline-flex items-center text-sm text-gray-600 hover:text-cyan-600 transition-colors"
          >
            <ArrowLeftIcon className="w-4 h-4 mr-1" />
            Back to forgot password
          </Link>
        </div>
      </div>
    </div>
  );
}
