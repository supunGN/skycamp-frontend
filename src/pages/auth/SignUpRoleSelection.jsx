import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  UserIcon,
  CurrencyDollarIcon,
  MapPinIcon,
  EnvelopeIcon,
} from "@heroicons/react/24/outline";
import Button from "../../components/atoms/Button";
import SignUpRoleImage from "../../assets/signup_role_selection/signup-role.png";

export default function SignUpRoleSelection() {
  const [selectedRole, setSelectedRole] = useState("");
  const navigate = useNavigate();

  const roles = [
    {
      id: "customer",
      title: "Customer",
      description:
        "Book camping equipment, hire guides, and connect with fellow campers",
      icon: <UserIcon className="w-6 h-6 text-cyan-600" />,
    },
    {
      id: "service-provider",
      title: "Service Provider",
      description:
        "Rent out your camping equipment and earn income and Share your local knowledge and guide camping enthusiasts",
      icon: <CurrencyDollarIcon className="w-6 h-6 text-cyan-600" />,
    },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedRole) {
      alert("Please select a role.");
      return;
    }

    if (selectedRole === "customer") {
      navigate("/customer-registration");
    }
    if (selectedRole === "service-provider") {
      navigate("/service-provider-registration");
    }
  };

  return (
    <div className="min-h-screen h-screen w-full overflow-hidden lg:grid lg:grid-cols-2">
      {/* Left Column */}
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

          {/* Role Selection Section */}
          <div className="flex-grow flex flex-col justify-center py-4 sm:py-8">
            <div className="mx-auto w-full max-w-sm sm:max-w-md space-y-4 sm:space-y-6">
              <div className="space-y-1 sm:space-y-2 text-center sm:text-left">
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight text-gray-900">
                  Join SkyCamp Community
                </h1>
                <p className="text-sm sm:text-base text-gray-600">
                  Choose your role to get started with your camping adventure.
                </p>
              </div>

              {/* Roles */}
              <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
                {roles.map((role) => (
                  <div
                    key={role.id}
                    className={`p-4 border-2 rounded-lg transition-all duration-200 cursor-pointer ${
                      selectedRole === role.id
                        ? "border-cyan-500 bg-cyan-50"
                        : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                    }`}
                    onClick={() => setSelectedRole(role.id)}
                  >
                    <div className="flex items-start space-x-3">
                      {role.icon}
                      <div>
                        <h3 className="text-sm font-medium">{role.title}</h3>
                        <p className="text-xs text-gray-500 mt-1">
                          {role.description}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Next Button */}
                <Button type="submit" className="w-full">
                  Next
                </Button>
              </form>

              <div className="text-center text-sm text-gray-600">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="font-medium text-cyan-600 hover:underline"
                >
                  Log in
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
          src={SignUpRoleImage}
          alt="Sign Up Illustration"
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );
}
