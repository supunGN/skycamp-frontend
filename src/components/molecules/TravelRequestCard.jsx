import { useState } from "react";
import { API } from "../../api";
import Button from "../atoms/Button";
import {
  Check as CheckIcon,
  X as XIcon,
  User as UserIcon,
  Calendar as CalendarIcon,
  MapPin as MapPinIcon,
  Loader2 as LoaderIcon,
  Clock as ClockIcon,
  CheckCircle as CheckCircleIcon,
  XCircle as XCircleIcon,
} from "lucide-react";

export default function TravelRequestCard({ request, onRequestUpdate }) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [action, setAction] = useState(null); // 'accept' or 'reject'

  const handleAccept = async () => {
    try {
      setIsProcessing(true);
      setAction('accept');
      await API.travelBuddy.acceptRequest(request.request.request_id);
      onRequestUpdate && onRequestUpdate('accepted', request);
    } catch (error) {
      console.error("Error accepting request:", error);
      alert("Failed to accept request. Please try again.");
    } finally {
      setIsProcessing(false);
      setAction(null);
    }
  };

  const handleReject = async () => {
    try {
      setIsProcessing(true);
      setAction('reject');
      await API.travelBuddy.rejectRequest(request.request.request_id);
      onRequestUpdate && onRequestUpdate('rejected', request);
    } catch (error) {
      console.error("Error rejecting request:", error);
      alert("Failed to reject request. Please try again.");
    } finally {
      setIsProcessing(false);
      setAction(null);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Pending':
        return <ClockIcon className="w-4 h-4 text-yellow-500" />;
      case 'Accepted':
        return <CheckCircleIcon className="w-4 h-4 text-green-500" />;
      case 'Rejected':
        return <XCircleIcon className="w-4 h-4 text-red-500" />;
      default:
        return <ClockIcon className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending':
        return 'text-yellow-600 bg-yellow-50';
      case 'Accepted':
        return 'text-green-600 bg-green-50';
      case 'Rejected':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
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

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-cyan-100 rounded-full flex items-center justify-center">
            <UserIcon className="w-5 h-5 text-cyan-600" />
          </div>
          <div>
            <h3 className="font-medium text-gray-900">
              {request.requester.first_name} {request.requester.last_name}
            </h3>
            <p className="text-sm text-gray-500">
              {formatTimeAgo(request.request.created_at)}
            </p>
          </div>
        </div>
        
        <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(request.request.status)}`}>
          {getStatusIcon(request.request.status)}
          <span>{request.request.status}</span>
        </div>
      </div>

      {/* Plan Details */}
      <div className="bg-gray-50 rounded-lg p-3 mb-3">
        <div className="flex items-center space-x-2 text-sm text-gray-600 mb-2">
          <MapPinIcon className="w-4 h-4" />
          <span className="font-medium">{request.plan.destination}</span>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <CalendarIcon className="w-4 h-4" />
          <span>{formatDate(request.plan.travel_date)}</span>
        </div>
      </div>

      {/* Requester Info */}
      <div className="text-sm text-gray-600 mb-4">
        <p>
          <strong>Phone:</strong> {request.requester.phone_number || 'Not provided'}
        </p>
      </div>

      {/* Actions */}
      {request.request.status === 'Pending' && (
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleAccept}
            disabled={isProcessing}
            className="flex-1 bg-green-50 border-green-200 text-green-700 hover:bg-green-100"
          >
            {isProcessing && action === 'accept' ? (
              <>
                <LoaderIcon className="w-4 h-4 animate-spin mr-1" />
                Accepting...
              </>
            ) : (
              <>
                <CheckIcon className="w-4 h-4 mr-1" />
                Accept
              </>
            )}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleReject}
            disabled={isProcessing}
            className="flex-1 bg-red-50 border-red-200 text-red-700 hover:bg-red-100"
          >
            {isProcessing && action === 'reject' ? (
              <>
                <LoaderIcon className="w-4 h-4 animate-spin mr-1" />
                Rejecting...
              </>
            ) : (
              <>
                <XIcon className="w-4 h-4 mr-1" />
                Reject
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  );
}
