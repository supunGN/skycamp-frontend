import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { API } from "../../api";
import TravelBuddyNavbar from "../../components/organisms/TravelBuddyNavbar";
import Footer from "../../components/organisms/Footer";
import TravelRequestCard from "../../components/molecules/TravelRequestCard";
import TravelChat from "../../components/molecules/TravelChat";
import Button from "../../components/atoms/Button";
import {
  Plus as PlusIcon,
  Edit as EditIcon,
  Trash2 as TrashIcon,
  MessageCircle as MessageCircleIcon,
  Users as UsersIcon,
  Calendar as CalendarIcon,
  MapPin as MapPinIcon,
  Loader2 as LoaderIcon,
  Eye as EyeIcon,
} from "lucide-react";

export default function MyTravelPlans() {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [showChat, setShowChat] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadMyPlans();
    getCurrentUserId();
  }, []);

  const getCurrentUserId = () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      if (user && user.id) {
        setCurrentUserId(user.id);
      }
    } catch (error) {
      console.error("Error getting current user ID:", error);
    }
  };

  const loadMyPlans = async () => {
    try {
      setLoading(true);
      const response = await API.travelBuddy.getMyPlans();
      setPlans(response.data.plans || []);
      setError(null);
    } catch (err) {
      console.error("Error loading my travel plans:", err);
      setError("Failed to load your travel plans");
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePlan = async (planId) => {
    if (!window.confirm("Are you sure you want to delete this travel plan? This action cannot be undone.")) {
      return;
    }

    try {
      await API.travelBuddy.deletePlan(planId);
      alert("Travel plan deleted successfully!");
      loadMyPlans();
    } catch (error) {
      console.error("Error deleting plan:", error);
      alert("Failed to delete travel plan. Please try again.");
    }
  };

  const handleRequestUpdate = (action, request) => {
    // Refresh plans to update request counts and status
    loadMyPlans();
  };

  const handleOpenChat = (plan) => {
    setSelectedPlan(plan);
    setShowChat(true);
  };

  const handleCloseChat = () => {
    setShowChat(false);
    setSelectedPlan(null);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTimeAgo = (dateString) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInSeconds = Math.floor((now - date) / 1000);

    if (diffInSeconds < 60) {
      return 'Just now';
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes} minute${minutes !== 1 ? 's' : ''} ago`;
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
    } else {
      const days = Math.floor(diffInSeconds / 86400);
      return `${days} day${days !== 1 ? 's' : ''} ago`;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <LoaderIcon className="w-8 h-8 animate-spin mx-auto mb-2 text-cyan-600" />
            <p className="text-gray-600">Loading your travel plans...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <TravelBuddyNavbar
        onChatToggle={() => navigate("/travel-buddy")}
        onRefresh={loadMyPlans}
      />
      
      <main className="bg-white pt-24 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">My Travel Plans</h1>
                <p className="text-gray-600 mt-2">Manage your travel plans and requests</p>
              </div>
              <Button onClick={() => navigate("/travel-buddy")}>
                <PlusIcon className="w-4 h-4 mr-2" />
                Create New Plan
              </Button>
            </div>
          </div>

          {error ? (
            <div className="text-center py-8">
              <p className="text-red-600 mb-4">{error}</p>
              <Button onClick={loadMyPlans} variant="outline">
                Try Again
              </Button>
            </div>
          ) : plans.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CalendarIcon className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No travel plans yet</h3>
              <p className="text-gray-600 mb-6">Create your first travel plan to start connecting with fellow travelers!</p>
              <Button onClick={() => navigate("/travel-buddy")}>
                <PlusIcon className="w-4 h-4 mr-2" />
                Create Travel Plan
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              {plans.map((planData) => (
                <div key={planData.plan.plan_id} className="bg-white border border-gray-200 rounded-lg shadow-sm">
                  {/* Plan Header */}
                  <div className="p-6 border-b border-gray-200">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-3">
                          <div className="w-10 h-10 bg-cyan-100 rounded-full flex items-center justify-center">
                            <MapPinIcon className="w-5 h-5 text-cyan-600" />
                          </div>
                          <div>
                            <h3 className="text-xl font-semibold text-gray-900">
                              {planData.plan.destination}
                            </h3>
                            <p className="text-sm text-gray-500">
                              Created {formatTimeAgo(planData.plan.created_at)}
                            </p>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                          <div className="flex items-center space-x-2 text-sm">
                            <CalendarIcon className="w-4 h-4 text-cyan-600" />
                            <span className="text-gray-700">{formatDate(planData.plan.travel_date)}</span>
                          </div>
                          <div className="flex items-center space-x-2 text-sm">
                            <UsersIcon className="w-4 h-4 text-cyan-600" />
                            <span className="text-gray-700">
                              {planData.plan.companions_joined} of {planData.plan.companions_needed} companions joined
                            </span>
                          </div>
                          <div className="flex items-center space-x-2 text-sm">
                            <MessageCircleIcon className="w-4 h-4 text-cyan-600" />
                            <span className="text-gray-700">
                              {planData.request_count} pending request{planData.request_count !== 1 ? 's' : ''}
                            </span>
                          </div>
                        </div>

                        {planData.plan.notes && (
                          <p className="text-gray-700 text-sm">{planData.plan.notes}</p>
                        )}
                      </div>

                      <div className="flex items-center space-x-2 ml-4">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleOpenChat(planData)}
                        >
                          <MessageCircleIcon className="w-4 h-4 mr-1" />
                          Chat
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => navigate(`/travel-buddy/plans/${planData.plan.plan_id}/edit`)}
                        >
                          <EditIcon className="w-4 h-4 mr-1" />
                          Edit
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeletePlan(planData.plan.plan_id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <TrashIcon className="w-4 h-4 mr-1" />
                          Delete
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Pending Requests */}
                  {planData.request_count > 0 && (
                    <div className="p-6">
                      <h4 className="text-lg font-medium text-gray-900 mb-4">Pending Requests</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {planData.pending_requests?.map((request) => (
                          <TravelRequestCard
                            key={request.request.request_id}
                            request={request}
                            onRequestUpdate={handleRequestUpdate}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />

      {/* Chat Modal */}
      {showChat && selectedPlan && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl h-[80vh] flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">
                Chat - {selectedPlan.plan.destination}
              </h3>
              <Button
                variant="outline"
                size="sm"
                onClick={handleCloseChat}
              >
                Close
              </Button>
            </div>
            <div className="flex-1 p-4">
              <TravelChat
                planId={selectedPlan.plan.plan_id}
                currentUserId={currentUserId}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
