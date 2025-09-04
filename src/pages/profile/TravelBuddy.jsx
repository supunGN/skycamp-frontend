import React, { useState } from "react";
import Button from "../../components/atoms/Button";
import {
  UserGroupIcon,
  MapPinIcon,
  CalendarDaysIcon,
  ChatBubbleLeftRightIcon,
  InformationCircleIcon,
  CheckCircleIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

const TravelBuddy = ({ user }) => {
  const [travelBuddyStatus, setTravelBuddyStatus] = useState(
    user?.travel_buddy_status || "Inactive"
  );
  const [showInfo, setShowInfo] = useState(false);

  // Mock data for travel plans and requests
  const travelPlans = [
    {
      id: "plan_001",
      destination: "Horton Plains National Park",
      date: "2024-03-15",
      companions_needed: 3,
      companions_joined: 1,
      budget: 12000,
      description: "Early morning hike to World's End for sunrise viewing",
      status: "active",
    },
    {
      id: "plan_002",
      destination: "Ella Rock",
      date: "2024-02-28",
      companions_needed: 2,
      companions_joined: 2,
      budget: 8500,
      description: "Weekend camping and hiking adventure",
      status: "full",
    },
  ];

  const buddyRequests = [
    {
      id: "req_001",
      from: "Sarah Wilson",
      plan: "Sigiriya Rock Fortress",
      date: "2024-03-20",
      message:
        "Hi! I'm planning a trip to Sigiriya and would love to have a travel companion. Interested?",
      status: "pending",
    },
  ];

  const handleStatusToggle = () => {
    const newStatus = travelBuddyStatus === "Active" ? "Inactive" : "Active";
    setTravelBuddyStatus(newStatus);
    // TODO: API call to update status
  };

  const handleRequestResponse = (requestId, response) => {
    // TODO: API call to respond to travel buddy request
    console.log(`${response} request ${requestId}`);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl border border-purple-100 p-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-purple-100 rounded-lg">
            <UserGroupIcon className="w-6 h-6 text-purple-600" />
          </div>
          <div className="flex-1">
            <h2 className="text-lg font-semibold text-gray-900">
              Travel Buddy
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Connect with fellow adventurers and explore Sri Lanka together
            </p>
          </div>
          <button
            onClick={() => setShowInfo(!showInfo)}
            className="p-2 text-purple-600 hover:bg-purple-100 rounded-lg transition-colors"
          >
            <InformationCircleIcon className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Travel Buddy Information */}
      {showInfo && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
          <h3 className="font-medium text-blue-900 mb-3">
            How Travel Buddy Works
          </h3>
          <div className="space-y-3 text-sm text-blue-800">
            <div className="flex items-start gap-3">
              <span className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                1
              </span>
              <span>
                Enable Travel Buddy status to connect with other adventurers
              </span>
            </div>
            <div className="flex items-start gap-3">
              <span className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                2
              </span>
              <span>
                Create travel plans with destination, dates, and budget details
              </span>
            </div>
            <div className="flex items-start gap-3">
              <span className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                3
              </span>
              <span>Receive and send requests to join travel adventures</span>
            </div>
            <div className="flex items-start gap-3">
              <span className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                4
              </span>
              <span>
                Chat with your travel group to plan your journey together
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Travel Buddy Status */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Travel Buddy Status
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              {travelBuddyStatus === "Active"
                ? "You're visible to other travelers looking for companions"
                : "Enable to start connecting with fellow adventurers"}
            </p>
          </div>

          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              className="sr-only peer"
              checked={travelBuddyStatus === "Active"}
              onChange={handleStatusToggle}
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
          </label>
        </div>

        {user?.verification_status !== "Yes" && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <InformationCircleIcon className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm">
                <p className="font-medium text-amber-900 mb-1">
                  Verification Required
                </p>
                <p className="text-amber-800">
                  Complete your identity verification to access full Travel
                  Buddy features and build trust with other travelers.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* My Travel Plans */}
      {travelBuddyStatus === "Active" && (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">
              My Travel Plans
            </h3>
            <Button className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm">
              Create New Plan
            </Button>
          </div>

          <div className="space-y-4">
            {travelPlans.map((plan) => (
              <div
                key={plan.id}
                className="border border-gray-200 rounded-lg p-4"
              >
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="font-medium text-gray-900">
                        {plan.destination}
                      </h4>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          plan.status === "active"
                            ? "bg-green-100 text-green-800"
                            : "bg-blue-100 text-blue-800"
                        }`}
                      >
                        {plan.status === "active" ? "Open" : "Full"}
                      </span>
                    </div>

                    <p className="text-sm text-gray-600 mb-3">
                      {plan.description}
                    </p>

                    <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <CalendarDaysIcon className="w-4 h-4" />
                        {new Date(plan.date).toLocaleDateString()}
                      </div>
                      <div className="flex items-center gap-1">
                        <UserGroupIcon className="w-4 h-4" />
                        {plan.companions_joined}/{plan.companions_needed}{" "}
                        companions
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-green-600 font-medium">
                          LKR {plan.budget.toLocaleString()}
                        </span>
                        per person
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button className="px-3 py-2 text-sm text-gray-600 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors">
                      Edit
                    </button>
                    <button className="px-3 py-2 text-sm text-purple-600 bg-purple-50 border border-purple-200 rounded-lg hover:bg-purple-100 transition-colors">
                      View Requests
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {travelPlans.length === 0 && (
              <div className="text-center py-8">
                <MapPinIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-600 mb-4">
                  You haven't created any travel plans yet
                </p>
                <Button className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg">
                  Create Your First Plan
                </Button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Travel Buddy Requests */}
      {travelBuddyStatus === "Active" && buddyRequests.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">
            Travel Buddy Requests
          </h3>

          <div className="space-y-4">
            {buddyRequests.map((request) => (
              <div
                key={request.id}
                className="border border-gray-200 rounded-lg p-4"
              >
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="font-medium text-gray-900">
                        {request.from}
                      </h4>
                      <span className="text-sm text-gray-600">
                        wants to join
                      </span>
                      <span className="font-medium text-purple-600">
                        {request.plan}
                      </span>
                    </div>

                    <div className="flex items-center gap-1 text-sm text-gray-600 mb-3">
                      <CalendarDaysIcon className="w-4 h-4" />
                      {new Date(request.date).toLocaleDateString()}
                    </div>

                    <p className="text-sm text-gray-700 bg-gray-50 rounded-lg p-3">
                      {request.message}
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() =>
                        handleRequestResponse(request.id, "accept")
                      }
                      className="flex items-center gap-1 px-3 py-2 text-sm text-green-600 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 transition-colors"
                    >
                      <CheckCircleIcon className="w-4 h-4" />
                      Accept
                    </button>
                    <button
                      onClick={() =>
                        handleRequestResponse(request.id, "decline")
                      }
                      className="flex items-center gap-1 px-3 py-2 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition-colors"
                    >
                      <XMarkIcon className="w-4 h-4" />
                      Decline
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Chat Groups */}
      {travelBuddyStatus === "Active" && (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">
            Active Travel Groups
          </h3>

          <div className="text-center py-8">
            <ChatBubbleLeftRightIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-600">No active travel groups</p>
            <p className="text-sm text-gray-500 mt-1">
              Join or create a travel plan to start chatting with your travel
              companions
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default TravelBuddy;
