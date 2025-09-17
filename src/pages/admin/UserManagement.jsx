import React, { useState, useEffect } from "react";
import { API } from "../../api";
import AdminActivityLog from "../../components/dashboard/AdminActivityLog";
import {
  DataTable,
  StatusBadge,
  ActionButtons,
  EmptyState,
  LoadingState,
  HorizontalTabs,
  SectionHeader,
  SearchFilters,
  ActionModal,
} from "../../components/dashboard";
import {
  UserGroupIcon,
  CubeIcon,
  CheckBadgeIcon,
  ExclamationTriangleIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";

export default function UserManagement() {
  const [activeTab, setActiveTab] = useState("customers");
  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUsers] = useState({
    customers: [],
    renters: [],
    guides: [],
    suspended: [],
    deleted: [],
  });
  const [activityLog, setActivityLog] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [actionModal, setActionModal] = useState({
    isOpen: false,
    action: "",
    user: null,
    userType: "",
  });

  // User counts for tabs
  const userCounts = {
    customers: users.customers.length,
    renters: users.renters.length,
    guides: users.guides.length,
    suspended: users.suspended.length,
    deleted: users.deleted.length,
  };

  // User tabs configuration
  const userTabs = [
    {
      key: "customers",
      label: "Customers",
      count: userCounts.customers,
      icon: UserGroupIcon,
      color: "text-green-600",
      bgColor: "bg-green-50",
      borderColor: "border-green-200",
      activeBg: "bg-green-100",
      activeText: "text-green-800",
    },
    {
      key: "renters",
      label: "Renters",
      count: userCounts.renters,
      icon: CubeIcon,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
      activeBg: "bg-blue-100",
      activeText: "text-blue-800",
    },
    {
      key: "guides",
      label: "Guides",
      count: userCounts.guides,
      icon: CheckBadgeIcon,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      borderColor: "border-purple-200",
      activeBg: "bg-purple-100",
      activeText: "text-purple-800",
    },
    {
      key: "suspended",
      label: "Suspended Users",
      count: userCounts.suspended,
      icon: ExclamationTriangleIcon,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      borderColor: "border-orange-200",
      activeBg: "bg-orange-100",
      activeText: "text-orange-800",
    },
    {
      key: "deleted",
      label: "Deleted Users",
      count: userCounts.deleted,
      icon: TrashIcon,
      color: "text-red-600",
      bgColor: "bg-red-50",
      borderColor: "border-red-200",
      activeBg: "bg-red-100",
      activeText: "text-red-800",
    },
  ];

  // Get table columns based on user type
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
              <div className="text-sm text-gray-500">
                ID: {row.user_id || row.id}
              </div>
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
        key: "phone_number",
        label: "Phone",
        sortable: false,
        render: (value) => (
          <div className="flex items-center text-sm text-gray-900">
            <span>{value}</span>
          </div>
        ),
      },
    ];

    // Add role-specific columns
    if (activeTab === "renters" || activeTab === "guides") {
      baseColumns.push({
        key: "district",
        label: "District",
        sortable: true,
        render: (value) => (
          <div className="flex items-center text-sm text-gray-900">
            <span>{value || "-"}</span>
          </div>
        ),
      });
    }

    if (activeTab === "guides") {
      baseColumns.push({
        key: "price_per_day",
        label: "Price/Day",
        sortable: true,
        render: (value) => (
          <div className="flex items-center text-sm text-gray-900">
            <span>{value ? `LKR ${value.toLocaleString()}` : "-"}</span>
          </div>
        ),
      });
    }

    // Add status column
    baseColumns.push({
      key: "status",
      label: "Status",
      sortable: true,
      render: (value, row) => {
        const status =
          activeTab === "customers" ||
          activeTab === "renters" ||
          activeTab === "guides"
            ? "active"
            : activeTab === "suspended"
            ? "suspended"
            : "deleted";
        return <StatusBadge status={status} />;
      },
    });

    // Add verification column
    baseColumns.push({
      key: "verification_status",
      label: "Verification",
      sortable: true,
      render: (value) => (
        <StatusBadge
          status={value === "Yes" ? "verified" : "pending"}
          size="sm"
        />
      ),
    });

    // Add date columns for suspended/deleted
    if (activeTab === "suspended") {
      baseColumns.push({
        key: "suspended_at",
        label: "Suspended At",
        sortable: true,
        render: (value) => (
          <div className="flex items-center text-sm text-gray-900">
            <span>{value ? new Date(value).toLocaleDateString() : "-"}</span>
          </div>
        ),
      });
      baseColumns.push({
        key: "originalRole",
        label: "Original Role",
        sortable: true,
        render: (value) => <StatusBadge status="active" size="xs" />,
      });
    }

    if (activeTab === "deleted") {
      baseColumns.push({
        key: "deleted_at",
        label: "Deleted At",
        sortable: true,
        render: (value) => (
          <div className="flex items-center text-sm text-gray-900">
            <span>{value ? new Date(value).toLocaleDateString() : "-"}</span>
          </div>
        ),
      });
      baseColumns.push({
        key: "originalRole",
        label: "Original Role",
        sortable: true,
        render: (value) => <StatusBadge status="active" size="xs" />,
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
            onAction={(action) => handleUserAction(action, row, activeTab)}
            loading={loading}
          />
        );
      },
    });

    return baseColumns;
  };

  // Get available actions based on user type
  const getAvailableActions = (user) => {
    switch (activeTab) {
      case "customers":
      case "renters":
      case "guides":
        return ["suspend", "delete"];
      case "suspended":
        return ["activate", "delete"];
      case "deleted":
        return []; // No actions for deleted users
      default:
        return [];
    }
  };

  // Fetch users data
  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch all user types in parallel
      const [
        customersRes,
        rentersRes,
        guidesRes,
        suspendedRes,
        deletedRes,
        activityRes,
      ] = await Promise.all([
        API.admin.getCustomers(),
        API.admin.getRenters(),
        API.admin.getGuides(),
        API.admin.getSuspendedUsers(),
        API.admin.getDeletedUsers(),
        API.admin.getActivityLog(),
      ]);

      setUsers({
        customers: customersRes.success ? customersRes.data : [],
        renters: rentersRes.success ? rentersRes.data : [],
        guides: guidesRes.success ? guidesRes.data : [],
        suspended: suspendedRes.success ? suspendedRes.data : [],
        deleted: deletedRes.success ? deletedRes.data : [],
      });

      setActivityLog(activityRes.success ? activityRes.data : []);
    } catch (err) {
      setError("Failed to fetch users data");
      console.error("Error fetching users:", err);
    } finally {
      setLoading(false);
    }
  };

  // Handle user actions
  const handleUserAction = (action, user, activeTab) => {
    // Determine userType based on activeTab and user data
    let userType;

    if (activeTab === "suspended" || activeTab === "deleted") {
      // For suspended/deleted users, use the role from the database
      userType = user.role ? user.role.toLowerCase() : "customer";
    } else {
      // For active users, map from activeTab
      const userTypeMap = {
        customers: "customer",
        renters: "renter",
        guides: "guide",
      };
      userType = userTypeMap[activeTab] || "customer";
    }

    setActionModal({
      isOpen: true,
      action,
      user,
      userType,
    });
  };

  // Confirm action
  const confirmAction = async () => {
    try {
      setLoading(true);

      const { action, user, userType } = actionModal;

      // Debug: Log the parameters being sent
      console.log("Action:", action);
      console.log("User:", user);
      console.log("UserType:", userType);
      console.log("User ID:", user.user_id || user.id);

      let apiCall;

      switch (action) {
        case "suspend":
          apiCall = API.admin.suspendUser({
            user_id: user.user_id || user.id,
            user_type: userType,
            reason: "Suspended by admin",
          });
          break;
        case "activate":
          apiCall = API.admin.activateUser({
            user_id: user.user_id || user.id,
            user_type: userType,
            reason: "Activated by admin",
          });
          break;
        case "delete":
          apiCall = API.admin.deleteUser({
            user_id: user.user_id || user.id,
            user_type: userType,
            reason: "Deleted by admin",
          });
          break;
        default:
          throw new Error("Unknown action");
      }

      const result = await apiCall;

      if (result.success) {
        // Close modal and refresh data
        setActionModal({ isOpen: false, action: "", user: null, userType: "" });
        await fetchUsers();
      } else {
        setError(`Failed to ${action.toLowerCase()} user: ${result.message}`);
      }
    } catch (err) {
      setError(`Failed to ${actionModal.action.toLowerCase()} user`);
      console.error("Error performing action:", err);
    } finally {
      setLoading(false);
    }
  };

  // Filter users based on search term
  const getFilteredUsers = (userList) => {
    if (!searchTerm.trim()) return userList;

    const term = searchTerm.toLowerCase();
    return userList.filter(
      (user) =>
        user.first_name.toLowerCase().includes(term) ||
        user.last_name.toLowerCase().includes(term) ||
        user.email.toLowerCase().includes(term) ||
        `${user.first_name} ${user.last_name}`.toLowerCase().includes(term)
    );
  };

  // Reset search
  const resetSearch = () => {
    setSearchTerm("");
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <SectionHeader
        title="User Management"
        subtitle="Manage users across all roles and statuses"
      />

      {/* User Tabs */}
      <HorizontalTabs
        tabs={userTabs}
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

      {/* User Table */}
      <DataTable
        columns={getColumns()}
        data={getFilteredUsers(users[activeTab])}
        loading={loading}
        emptyMessage={
          (activeTab === "customers" && "No customers registered yet.") ||
          (activeTab === "renters" && "No renters registered yet.") ||
          (activeTab === "guides" && "No guides registered yet.") ||
          (activeTab === "suspended" && "No suspended users.") ||
          (activeTab === "deleted" && "No deleted users.") ||
          "No users found."
        }
        onSort={(column, direction) => {
          // TODO: Implement sorting logic
          console.log(`Sort by ${column} ${direction}`);
        }}
      />

      {/* Admin Activity Log */}
      <AdminActivityLog activityLog={activityLog} />

      {/* Action Confirmation Modal */}
      <ActionModal
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
