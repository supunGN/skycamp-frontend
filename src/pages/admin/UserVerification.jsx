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
  const [activeTab, setActiveTab] = useState("renters");
  const [searchTerm, setSearchTerm] = useState("");
  const [pendingCustomers, setPendingCustomers] = useState([]);
  const [pendingRenters, setPendingRenters] = useState([]);
  const [pendingGuides, setPendingGuides] = useState([]);
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
    customers: pendingCustomers.length,
    renters: pendingRenters.length,
    guides: pendingGuides.length,
    rejected: rejectedUsers.length,
  };

  // Verification tabs configuration
  const verificationTabs = [
    {
      key: "customers",
      label: "Customers",
      count: tabCounts.customers,
      icon: CheckBadgeIcon,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
      activeBg: "bg-blue-100",
      activeText: "text-blue-800",
    },
    {
      key: "renters",
      label: "Renters",
      count: tabCounts.renters,
      icon: CheckBadgeIcon,
      color: "text-green-600",
      bgColor: "bg-green-50",
      borderColor: "border-green-200",
      activeBg: "bg-green-100",
      activeText: "text-green-800",
    },
    {
      key: "guides",
      label: "Guides",
      count: tabCounts.guides,
      icon: CheckBadgeIcon,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      borderColor: "border-purple-200",
      activeBg: "bg-purple-100",
      activeText: "text-purple-800",
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
    ];

    // Add role column only for pending tabs (not for rejected users since we have separate tabs)
    if (
      activeTab === "customers" ||
      activeTab === "renters" ||
      activeTab === "guides"
    ) {
      baseColumns.push({
        key: "role",
        label: "Role",
        sortable: true,
        render: (value) => (
          <StatusBadge status={value?.toLowerCase()} size="sm" />
        ),
      });
    }

    // Add NIC document viewer for pending verifications (customers, renters, guides)
    if (
      activeTab === "customers" ||
      activeTab === "renters" ||
      activeTab === "guides"
    ) {
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
        // Use the actual verification_status from the data, not hardcoded logic
        const status =
          row.verification_status?.toLowerCase() ||
          (activeTab === "rejected" ? "rejected" : "pending");
        return <StatusBadge status={status} />;
      },
    });

    // Add date columns for pending tabs (customers, renters, guides)
    if (
      activeTab === "customers" ||
      activeTab === "renters" ||
      activeTab === "guides"
    ) {
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

    // Add actions column only for pending tabs (not for rejected users)
    if (activeTab !== "rejected") {
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
    }

    return baseColumns;
  };

  // Get available actions based on tab
  const getAvailableActions = (user) => {
    switch (activeTab) {
      case "customers":
      case "renters":
      case "guides":
        return ["approve", "reject"];
      case "rejected":
        return []; // No actions for rejected users
      default:
        return [];
    }
  };

  // Create test data
  const createTestData = async () => {
    try {
      setLoading(true);
      console.log("🧪 Creating test data...");
      const result = await API.admin.createTestData();
      console.log("🧪 Test data result:", result);

      if (result.success) {
        alert("Test data created successfully!");
        console.log("✅ Test data created, refreshing verification data...");
        await fetchVerificationData();
      } else {
        console.error("❌ Test data creation failed:", result);
        alert("Failed to create test data: " + result.message);
      }
    } catch (err) {
      console.error("❌ Error creating test data:", err);
      alert("Error creating test data: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch verification data
  const fetchVerificationData = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log("🚀 Starting fetchVerificationData...");

      // Fetch all verification data in parallel
      const [customersRes, rentersRes, guidesRes, rejectedRes, activityRes] =
        await Promise.all([
          API.admin.getPendingCustomerVerifications(),
          API.admin.getPendingRenterVerifications(),
          API.admin.getPendingGuideVerifications(),
          API.admin.getRejectedUsers(),
          API.admin.getVerificationActivityLog(),
        ]);

      console.log("📊 API Responses:", {
        customers: customersRes,
        renters: rentersRes,
        guides: guidesRes,
        rejected: rejectedRes,
        activity: activityRes,
      });

      setPendingCustomers(customersRes.success ? customersRes.data : []);
      setPendingRenters(rentersRes.success ? rentersRes.data : []);
      setPendingGuides(guidesRes.success ? guidesRes.data : []);
      setRejectedUsers(rejectedRes.success ? rejectedRes.data : []);
      setActivityLog(activityRes.success ? activityRes.data : []);

      console.log("✅ Data set successfully:", {
        customersCount: customersRes.success ? customersRes.data.length : 0,
        rentersCount: rentersRes.success ? rentersRes.data.length : 0,
        guidesCount: guidesRes.success ? guidesRes.data.length : 0,
      });
    } catch (err) {
      setError("Failed to fetch verification data");
      console.error("❌ Error fetching verification data:", err);
      console.error("❌ Error details:", {
        message: err.message,
        status: err.status,
        data: err.data,
        response: err.response,
      });
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

  const getCurrentData = () => {
    switch (activeTab) {
      case "customers":
        return pendingCustomers;
      case "renters":
        return pendingRenters;
      case "guides":
        return pendingGuides;
      case "rejected":
        return rejectedUsers;
      default:
        return [];
    }
  };

  const currentData = getCurrentData();

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

      {/* Test Data Button */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-medium text-yellow-800">Testing</h3>
            <p className="text-sm text-yellow-700">
              Create test data to verify the system is working
            </p>
          </div>
          <button
            onClick={createTestData}
            disabled={loading}
            className="px-4 py-2 bg-yellow-600 text-white text-sm font-medium rounded-lg hover:bg-yellow-700 disabled:opacity-50"
          >
            {loading ? "Creating..." : "Create Test Data"}
          </button>
        </div>
      </div>

      {/* Verification Table */}
      <DataTable
        columns={getColumns()}
        data={getFilteredData(currentData)}
        loading={loading}
        emptyMessage={
          activeTab === "customers"
            ? "No pending customer verifications found."
            : activeTab === "renters"
            ? "No pending renter verifications found."
            : activeTab === "guides"
            ? "No pending guide verifications found."
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
