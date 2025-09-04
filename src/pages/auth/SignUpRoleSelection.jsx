import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  UserIcon,
  CurrencyDollarIcon,
  EnvelopeIcon,
} from "@heroicons/react/24/outline";
import Button from "../../components/atoms/Button";
import SignUpRoleImage from "../../assets/signup_role_selection/signup-role.png";

function RoleCard({ active, icon, title, description, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "group w-full text-left rounded-xl border-2 p-5 transition-all duration-200 ease-in-out",
        "bg-white hover:border-cyan-400 hover:bg-cyan-50/50 hover:shadow-md",
        "focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 focus:border-cyan-500",
        active
          ? "border-cyan-500 bg-cyan-50 ring-4 ring-cyan-100/60 shadow-sm"
          : "border-gray-200",
      ].join(" ")}
    >
      <div className="flex items-start gap-3">
        <span
          className={[
            "inline-flex h-9 w-9 items-center justify-center rounded-lg transition-colors duration-200",
            active ? "bg-cyan-100" : "bg-gray-100",
            "group-hover:bg-cyan-100",
          ].join(" ")}
        >
          {icon}
        </span>
        <div className="mt-0.5">
          <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
          <p className="mt-1 text-xs leading-5 text-gray-500">{description}</p>
        </div>
      </div>
    </button>
  );
}

export default function SignUpRoleSelection() {
  const [selectedRole, setSelectedRole] = useState("customer"); // preselect like the mock
  const navigate = useNavigate();

  const roles = [
    {
      id: "customer",
      title: "Customer",
      description:
        "Book camping equipment, hire guides, and connect with fellow campers",
      icon: <UserIcon className="h-5 w-5 text-cyan-600" />,
    },
    {
      id: "service-provider-renter",
      title: "Equipment Renter",
      description: "Rent out your camping equipment and earn income",
      icon: <CurrencyDollarIcon className="h-5 w-5 text-cyan-600" />,
    },
    {
      id: "service-provider-guide",
      title: "Local Guide",
      description: "Share your local knowledge and guide camping enthusiasts",
      icon: <UserIcon className="h-5 w-5 text-cyan-600" />,
    },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedRole) {
      alert("Please select a role.");
      return;
    }

    // Navigate to appropriate registration form based on selected role
    if (selectedRole === "customer") {
      navigate("/customer-registration", {
        state: { role: selectedRole },
      });
    } else if (selectedRole === "service-provider-renter") {
      navigate("/renter-registration", {
        state: { role: "renter" },
      });
    } else if (selectedRole === "service-provider-guide") {
      navigate("/guide-registration", {
        state: { role: "guide" },
      });
    }
  };

  return (
    <div className="min-h-screen h-screen w-full overflow-hidden lg:grid lg:grid-cols-2">
      {/* Left column */}
      <div className="flex h-screen w-full flex-col overflow-y-auto bg-white">
        <div className="flex min-h-full flex-col justify-between px-4 py-6 sm:px-6 lg:px-10 lg:py-8">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link
              to="/"
              className="inline-block font-medium text-gray-700 hover:text-cyan-600"
            >
              <img src="/logo.svg" alt="SkyCamp" className="h-8" />
            </Link>
          </div>

          {/* Content */}
          <div className="flex grow flex-col justify-center py-6">
            <div className="mx-auto w-full max-w-md space-y-6">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tight text-gray-900">
                  Join SkyCamp Community
                </h1>
                <p className="text-sm text-gray-600">
                  Choose your role to get started with your camping adventure.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {roles.map((r) => (
                  <RoleCard
                    key={r.id}
                    active={selectedRole === r.id}
                    icon={r.icon}
                    title={r.title}
                    description={r.description}
                    onClick={() => setSelectedRole(r.id)}
                  />
                ))}

                <Button type="submit" className="mt-2 w-full rounded-lg">
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
          <div className="mt-6 flex-shrink-0">
            <div className="flex flex-col items-center justify-between gap-2 text-xs text-gray-500 sm:flex-row">
              <p className="text-center sm:text-left">
                © {new Date().getFullYear()} SkyCamp. All rights reserved.
              </p>
              <a
                href="mailto:ask@skycamp.com"
                className="flex items-center gap-1 hover:underline"
              >
                <EnvelopeIcon className="h-4 w-4" />
                <span className="whitespace-nowrap">ask@skycamp.com</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Right column: full-bleed image */}
      <div className="hidden h-screen w-full overflow-hidden lg:block">
        <img
          src={SignUpRoleImage}
          alt="Sign Up Illustration"
          className="h-full w-full object-cover"
        />
      </div>
    </div>
  );
}
