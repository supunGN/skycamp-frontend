import { useState } from "react";
import { API } from "../../api";
import Button from "../atoms/Button";
import {
  MapPin as MapPinIcon,
  Calendar as CalendarIcon,
  Users as UsersIcon,
  MessageCircle as MessageCircleIcon,
  User as UserIcon,
  Loader2 as LoaderIcon,
  CheckCircle as CheckCircleIcon,
  Clock as ClockIcon,
} from "lucide-react";

export default function TravelPlanCard({ plan, currentUserId, onRequestSent }) {
  const [isRequesting, setIsRequesting] = useState(false);
  const [requestStatus, setRequestStatus] = useState(null); // 'sent', 'joined', 'full'

  const handleRequestJoin = async () => {
    try {
      setIsRequesting(true);
      await API.travelBuddy.requestJoin({ plan_id: plan.plan.plan_id });
      setRequestStatus("sent");
      onRequestSent && onRequestSent(plan);
    } catch (error) {
      console.error("Error requesting to join:", error);
      if (error.message?.includes("already requested")) {
        setRequestStatus("sent");
      } else if (error.message?.includes("full")) {
        setRequestStatus("full");
      } else {
        alert("Failed to send join request. Please try again.");
      }
    } finally {
      setIsRequesting(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatTimeAgo = (dateString) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInSeconds = Math.floor((now - date) / 1000);

    if (diffInSeconds < 60) {
      return "Just now";
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes} minute${minutes !== 1 ? "s" : ""} ago`;
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours} hour${hours !== 1 ? "s" : ""} ago`;
    } else {
      const days = Math.floor(diffInSeconds / 86400);
      return `${days} day${days !== 1 ? "s" : ""} ago`;
    }
  };

  const isOwnPlan = plan.plan.customer_id === currentUserId;
  const isFull = plan.plan.companions_joined >= plan.plan.companions_needed;
  const availableSpots =
    plan.plan.companions_needed - plan.plan.companions_joined;

  const getButtonContent = () => {
    if (isOwnPlan) {
      return (
        <>
          <MessageCircleIcon className="w-4 h-4 mr-1" />
          My Plan
        </>
      );
    }

    if (isRequesting) {
      return (
        <>
          <LoaderIcon className="w-4 h-4 animate-spin mr-1" />
          Sending...
        </>
      );
    }

    if (requestStatus === "sent") {
      return (
        <>
          <ClockIcon className="w-4 h-4 mr-1" />
          Request Sent
        </>
      );
    }

    if (isFull) {
      return (
        <>
          <UsersIcon className="w-4 h-4 mr-1" />
          Full
        </>
      );
    }

    return (
      <>
        <UsersIcon className="w-4 h-4 mr-1" />
        Request to Join
      </>
    );
  };

  const getButtonVariant = () => {
    if (isOwnPlan || requestStatus === "sent") {
      return "outline";
    }
    if (isFull) {
      return "outline";
    }
    return "primary";
  };

  const getButtonClassName = () => {
    if (isOwnPlan) {
      return "bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100";
    }
    if (requestStatus === "sent") {
      return "bg-yellow-50 border-yellow-200 text-yellow-700 hover:bg-yellow-100";
    }
    if (isFull) {
      return "bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100";
    }
    return "";
  };

  return (
    <article className="border rounded-lg shadow-sm p-5 max-w-2xl mx-auto bg-white hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-cyan-100 rounded-full flex items-center justify-center">
            <UserIcon className="w-5 h-5 text-cyan-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              {plan.creator.first_name} {plan.creator.last_name}
            </h3>
            <p className="text-sm text-gray-500">
              {formatTimeAgo(plan.plan.created_at)}
            </p>
          </div>
        </div>
      </div>

      {/* Plan Details */}
      <div className="grid grid-cols-2 gap-x-8 gap-y-3 mb-4">
        <div className="flex items-center gap-2">
          <MapPinIcon className="w-5 h-5 text-cyan-600" />
          <span className="text-cyan-600 font-medium">
            {plan.plan.destination}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <UsersIcon className="w-5 h-5 text-cyan-600" />
          <span className="text-cyan-600 font-medium">
            {availableSpots} of {plan.plan.companions_needed} spots available
          </span>
        </div>
        <div className="flex items-center gap-2">
          <CalendarIcon className="w-5 h-5 text-cyan-600" />
          <span className="text-cyan-600 font-medium">
            {formatDate(plan.plan.travel_date)}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <MessageCircleIcon className="w-5 h-5 text-cyan-600" />
          <span className="text-cyan-600 font-medium">
            {plan.request_count} pending request
            {plan.request_count !== 1 ? "s" : ""}
          </span>
        </div>
      </div>

      {/* Description */}
      {plan.plan.notes && (
        <p className="text-gray-700 mb-4 leading-relaxed">{plan.plan.notes}</p>
      )}

      {/* Placeholder for image */}
      <div className="mt-4 bg-gray-200 rounded-md h-56 sm:h-72 w-full flex items-center justify-center text-gray-500">
        <div className="text-center">
          <MapPinIcon className="w-12 h-12 mx-auto mb-2 opacity-50" />
          <p className="text-sm">Travel destination image</p>
        </div>
      </div>

      {/* Action Button */}
      <div className="mt-4 flex justify-end">
        <Button
          onClick={handleRequestJoin}
          disabled={
            isRequesting || isOwnPlan || requestStatus === "sent" || isFull
          }
          variant={getButtonVariant()}
          className={getButtonClassName()}
        >
          {getButtonContent()}
        </Button>
      </div>
    </article>
  );
}
