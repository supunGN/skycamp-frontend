import React, { useState, useEffect } from "react";
import { API } from "../../api";
import {
  DataTable,
  StatusBadge,
  ActionButtons,
  HorizontalTabs,
  SectionHeader,
  SearchFilters,
  NicDocumentViewer,
  VerificationActionModal,
  VerificationActivityLog,
} from "../../components/dashboard";
import {
  CheckBadgeIcon,
  ExclamationTriangleIcon,
  DocumentTextIcon,
} from "@heroicons/react/24/outline";
import { getVerificationImageUrls } from "../../utils/cacheBusting";

export default function UserVerification({ onVerificationAction }) {
  const [activeTab, setActiveTab] = useState("pending");
  const [searchTerm, setSearchTerm] = useState("");
  const [pendingVerifications, setPendingVerifications] = useState([]);
  const [rejectedUsers, setRejectedUsers] = useState([]);
  const [activityLog, setActivityLog] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [actionModal, setActionModal] = useState({
    isOpen: false,
    action: "",
    user: null,
    userType: "",
  });

  // Tab counts
  const tabCounts = {
    pending: pendingVerifications.length,
    rejected: rejectedUsers.length,
  };

  // Verification tabs configuration
  const verificationTabs = [
    {
      key: "pending",
      label: "Pending Verifications",
      count: tabCounts.pending,
      icon: CheckBadgeIcon,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      borderColor: "border-orange-200",
      activeBg: "bg-orange-100",
      activeText: "text-orange-800",
    },
    {
      key: "rejected",
      label: "Rejected Users",
      count: tabCounts.rejected,
      icon: ExclamationTriangleIcon,
      color: "text-red-600",
      bgColor: "bg-red-50",
      borderColor: "border-red-200",
      activeBg: "bg-red-100",
      activeText: "text-red-800",
    },
  ];

  // Get table columns based on active tab
  const getColumns = () => {
    const baseColumns = [
      {
        key: "name",
        label: "Name",
        sortable: true,
        render: (value, row) => (
          <div className="flex items-center">
            <div className="flex-shrink-0 h-10 w-10">
              <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                <span className="text-sm font-medium text-gray-600">
                  {row.first_name?.charAt(0)}
                  {row.last_name?.charAt(0)}
                </span>
              </div>
            </div>
            <div className="ml-4">
              <div className="text-sm font-medium text-gray-900">
                {row.first_name} {row.last_name}
              </div>
              <div className="text-sm text-gray-500">ID: {row.user_id}</div>
            </div>
          </div>
        ),
      },
      {
        key: "email",
        label: "Email",
        sortable: true,
        render: (value) => (
          <div className="flex items-center text-sm text-gray-900">
            <span>{value}</span>
          </div>
        ),
      },
      {
        key: "nic_number",
        label: "NIC Number",
        sortable: true,
        render: (value) => (
          <div className="flex items-center text-sm text-gray-900">
            <span className="font-mono">{value}</span>
          </div>
        ),
      },
      {
        key: "role",
        label: "Role",
        sortable: true,
        render: (value) => (
          <StatusBadge status={value?.toLowerCase()} size="sm" />
        ),
      },
    ];

    // Add NIC document viewer for pending verifications
    if (activeTab === "pending") {
      baseColumns.push({
        key: "nic_documents",
        label: "NIC Documents",
        sortable: false,
        render: (value, row) => {
          // Build public URLs from relative paths
          const buildImageUrl = (imagePath) => {
            if (!imagePath) return null;

            // Handle different path formats
            let relativePath = imagePath;

            // If it's already a full path, extract the relative part
            if (imagePath.includes("storage/uploads/")) {
              const idx = imagePath.indexOf("storage/uploads/");
              relativePath = imagePath.substring(
                idx + "storage/uploads/".length
              );
            } else if (imagePath.includes("\\")) {
              // Handle Windows paths
              relativePath = imagePath.replace(/\\/g, "/");
            }

            // Clean up the path
            relativePath = relativePath.replace(/^\/+/, ""); // Remove leading slashes

            // Build the full URL with cache-busting (pointing to storage directory)
            const timestamp = new Date(
              row.updated_at || row.created_at || Date.now()
            ).getTime();
            const finalUrl = `http://localhost/skycamp/skycamp-backend/storage/uploads/${relativePath}?ts=${timestamp}`;
            return finalUrl;
          };

          return (
            <NicDocumentViewer
              frontImage={buildImageUrl(row.nic_front_image)}
              backImage={buildImageUrl(row.nic_back_image)}
              userName={`${row.first_name} ${row.last_name}`}
              nicNumber={row.nic_number}
            />
          );
        },
      });
    }

    // Add status column
    baseColumns.push({
      key: "status",
      label: "Status",
      sortable: true,
      render: (value, row) => {
        const status = activeTab === "pending" ? "pending" : "rejected";
        return <StatusBadge status={status} />;
      },
    });

    // Add date columns
    if (activeTab === "pending") {
      baseColumns.push({
        key: "verification_requested_at",
        label: "Submitted At",
        sortable: true,
        render: (value) => (
          <div className="flex items-center text-sm text-gray-900">
            <span>{value ? new Date(value).toLocaleDateString() : "-"}</span>
          </div>
        ),
      });
    }

    if (activeTab === "rejected") {
      baseColumns.push({
        key: "reason",
        label: "Rejection Reason",
        sortable: true,
        render: (value) => (
          <div className="flex items-center text-sm text-gray-900">
            <span className="max-w-xs truncate" title={value}>
              {value || "No reason provided"}
            </span>
          </div>
        ),
      });
      baseColumns.push({
        key: "rejected_at",
        label: "Rejected At",
        sortable: true,
        render: (value) => (
          <div className="flex items-center text-sm text-gray-900">
            <span>{value ? new Date(value).toLocaleDateString() : "-"}</span>
          </div>
        ),
      });
    }

    // Add actions column
    baseColumns.push({
      key: "actions",
      label: "Actions",
      sortable: false,
      render: (value, row) => {
        const actions = getAvailableActions(row);
        return (
          <ActionButtons
            actions={actions}
            onAction={(action) => handleVerificationAction(action, row)}
            loading={loading}
          />
        );
      },
    });

    return baseColumns;
  };

  // Get available actions based on tab
  const getAvailableActions = (user) => {
    switch (activeTab) {
      case "pending":
        return ["approve", "reject"];
      case "rejected":
        return []; // No actions for rejected users
      default:
        return [];
    }
  };

  // Fetch verification data
  const fetchVerificationData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch all verification data in parallel
      const [pendingRes, rejectedRes, activityRes] = await Promise.all([
        API.admin.getPendingVerifications(),
        API.admin.getRejectedUsers(),
        API.admin.getVerificationActivityLog(),
      ]);

      setPendingVerifications(pendingRes.success ? pendingRes.data : []);
      setRejectedUsers(rejectedRes.success ? rejectedRes.data : []);
      setActivityLog(activityRes.success ? activityRes.data : []);
    } catch (err) {
      setError("Failed to fetch verification data");
      console.error("Error fetching verification data:", err);
    } finally {
      setLoading(false);
    }
  };

  // Handle verification actions
  const handleVerificationAction = (action, user) => {
    // Determine userType based on user role from database
    const userType = user.role ? user.role.toLowerCase() : "customer";

    setActionModal({
      isOpen: true,
      action,
      user,
      userType,
    });
  };

  // Confirm verification action
  const confirmAction = async (reason) => {
    try {
      setLoading(true);

      const { action, user, userType } = actionModal;

      let apiCall;
      switch (action) {
        case "approve":
          apiCall = API.admin.approveUser({
            user_id: user.user_id,
            user_type: userType,
            reason: reason,
          });
          break;
        case "reject":
          apiCall = API.admin.rejectUser({
            user_id: user.user_id,
            user_type: userType,
            reason: reason,
          });
          break;
        default:
          throw new Error("Unknown action");
      }

      const result = await apiCall;

      if (result.success) {
        // Close modal and refresh data
        setActionModal({ isOpen: false, action: "", user: null, userType: "" });
        await fetchVerificationData();

        // Trigger refresh of pending verification count in sidebar
        if (onVerificationAction) {
          onVerificationAction();
        }
      } else {
        setError(
          `Failed to ${action.toLowerCase()} verification: ${result.message}`
        );
      }
    } catch (err) {
      setError(`Failed to ${actionModal.action.toLowerCase()} verification`);
      console.error("Error performing verification action:", err);
    } finally {
      setLoading(false);
    }
  };

  // Filter data based on search term
  const getFilteredData = (dataList) => {
    if (!searchTerm.trim()) return dataList;

    const term = searchTerm.toLowerCase();
    return dataList.filter(
      (item) =>
        item.first_name?.toLowerCase().includes(term) ||
        item.last_name?.toLowerCase().includes(term) ||
        item.email?.toLowerCase().includes(term) ||
        item.nic_number?.toLowerCase().includes(term) ||
        `${item.first_name} ${item.last_name}`.toLowerCase().includes(term)
    );
  };

  // Reset search
  const resetSearch = () => {
    setSearchTerm("");
  };

  useEffect(() => {
    fetchVerificationData();
  }, []);

  const currentData =
    activeTab === "pending" ? pendingVerifications : rejectedUsers;

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <SectionHeader
        title="User Verification"
        subtitle="Review and manage user NIC document verifications"
      />

      {/* Verification Tabs */}
      <HorizontalTabs
        tabs={verificationTabs}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      {/* Search Filters */}
      <SearchFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onReset={resetSearch}
        activeTab={activeTab}
        loading={loading}
      />

      {/* Verification Table */}
      <DataTable
        columns={getColumns()}
        data={getFilteredData(currentData)}
        loading={loading}
        emptyMessage={
          activeTab === "pending"
            ? "No pending verifications found."
            : "No rejected users found."
        }
        onSort={(column, direction) => {
          // TODO: Implement sorting logic
        }}
      />

      {/* Verification Activity Log */}
      <VerificationActivityLog activityLog={activityLog} />

      {/* Verification Action Modal */}
      <VerificationActionModal
        isOpen={actionModal.isOpen}
        onClose={() =>
          setActionModal({
            isOpen: false,
            action: "",
            user: null,
            userType: "",
          })
        }
        onConfirm={confirmAction}
        action={actionModal.action}
        user={actionModal.user}
        userType={actionModal.userType}
        loading={loading}
      />
    </div>
  );
}
