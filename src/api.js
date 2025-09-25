// src/api.js
import axios from "axios";

// Base URL: use Vite proxy (/api) by default, or override via env
const baseURL = import.meta.env.VITE_API_BASE_URL || "/api";

export const http = axios.create({
  baseURL,
  withCredentials: true, // send/receive session cookies
  timeout: 15000,
});

// Optional: request interceptor (add default headers etc.)
http.interceptors.request.use((config) => {
  // Don't set Content-Type for FormData; Axios will set correct boundary.
  // For JSON data, ensure Content-Type is set
  if (config.data && !(config.data instanceof FormData)) {
    config.headers["Content-Type"] = "application/json";
  }

  // Add user ID from localStorage to headers for authentication
  const user = localStorage.getItem("user");
  if (user) {
    try {
      const userData = JSON.parse(user);
      // Use user_id if available, otherwise fall back to id
      const userId = userData.user_id || userData.id;
      if (userId) {
        config.headers["x-user-id"] = userId;
        config.headers["x-user-role"] = userData.user_role || userData.role;
      }
    } catch (e) {
      console.warn("Failed to parse user data from localStorage:", e);
    }
  }

  return config;
});

// Normalize all errors so callers can just catch {status, message, errors}
http.interceptors.response.use(
  (res) => res,
  (err) => {
    const res = err.response;
    const data = res?.data || {};
    const message = data.message || err.message || "Network error";

    return Promise.reject({
      status: res?.status ?? 0,
      message,
      errors: data.errors,
      raw: err,
    });
  }
);

// Small helper so API methods return data only
const ok = (p) => p.then((r) => r.data);

export const API = {
  // ==== ADMIN AUTH ====
  admin: {
    login({ email, password }) {
      return ok(http.post("/admin/login", { email, password }));
    },
    me() {
      return ok(http.get("/admin/me"));
    },
    logout() {
      return ok(http.post("/admin/logout"));
    },
    // User Management
    getCustomers() {
      return ok(http.get("/admin/users/customers"));
    },
    getRenters() {
      return ok(http.get("/admin/users/renters"));
    },
    getGuides() {
      return ok(http.get("/admin/users/guides"));
    },
    getSuspendedUsers() {
      return ok(http.get("/admin/users/suspended"));
    },
    getDeletedUsers() {
      return ok(http.get("/admin/users/deleted"));
    },
    suspendUser({ user_id, user_type, reason }) {
      return ok(
        http.post("/admin/users/suspend", { user_id, user_type, reason })
      );
    },
    activateUser({ user_id, user_type, reason }) {
      return ok(
        http.post("/admin/users/activate", { user_id, user_type, reason })
      );
    },
    deleteUser({ user_id, user_type, reason }) {
      return ok(
        http.post("/admin/users/delete", { user_id, user_type, reason })
      );
    },
    getActivityLog() {
      return ok(http.get("/admin/activity-log"));
    },
    // User Verification endpoints
    getPendingVerifications() {
      console.log("🔍 API: Calling getPendingVerifications...");
      return ok(http.get("/admin/verifications/pending"));
    },
    getPendingCustomerVerifications() {
      console.log("🔍 API: Calling getPendingCustomerVerifications...");
      return ok(http.get("/admin/verifications/pending/customers"));
    },
    getPendingRenterVerifications() {
      console.log("🔍 API: Calling getPendingRenterVerifications...");
      return ok(http.get("/admin/verifications/pending/renters"));
    },
    getPendingGuideVerifications() {
      console.log("🔍 API: Calling getPendingGuideVerifications...");
      return ok(http.get("/admin/verifications/pending/guides"));
    },
    getPendingVerificationCount() {
      return ok(http.get("/admin/verifications/pending-count"));
    },
    getRejectedUsers() {
      return ok(http.get("/admin/verifications/rejected"));
    },
    approveUser({ user_id, user_type, reason }) {
      return ok(
        http.post("/admin/verifications/approve", {
          user_id,
          user_type,
          reason,
        })
      );
    },
    rejectUser({ user_id, user_type, reason }) {
      return ok(
        http.post("/admin/verifications/reject", { user_id, user_type, reason })
      );
    },
    getVerificationActivityLog() {
      return ok(http.get("/admin/verifications/activity-log"));
    },
    createTestData() {
      console.log("🔍 API: Calling createTestData...");
      return ok(http.post("/admin/verifications/create-test-data"));
    },
  },
  auth: {
    // multipart: DO NOT set Content-Type manually
    register(formData) {
      return ok(http.post("/auth/register", formData));
    },
    login({ email, password }) {
      return ok(http.post("/auth/login", { email, password }));
    },
    logout() {
      return ok(http.post("/auth/logout"));
    },
    me() {
      return ok(http.get("/auth/me"));
    },
    updateProfile(data) {
      return ok(http.post("/auth/profile", data));
    },
    toggleTravelBuddy(status) {
      const body = new URLSearchParams({ status: String(status).trim() });
      return ok(http.post("/auth/travel-buddy/toggle", body));
    },
    submitVerification(formData) {
      return ok(http.post("/auth/verification/submit", formData));
    },
    getVerificationDocs() {
      return ok(http.get("/auth/verification/docs"));
    },
    // Password flows (legacy PHP endpoints)
    forgotPassword(email) {
      const body = new URLSearchParams({ email });
      return ok(http.post("/auth/password/forgot.php", body));
    },
    verifyOtp({ token, otp }) {
      const body = new URLSearchParams({ token, otp });
      return ok(http.post("/auth/password/verify-otp.php", body));
    },
    resetPassword({ token, new_password }) {
      const body = new URLSearchParams({ token, new_password });
      return ok(http.post("/auth/password/reset.php", body));
    },
  },
  // ==== NOTIFICATIONS ====
  notifications: {
    getUserNotifications(limit = 50) {
      return ok(http.get(`/notifications?limit=${limit}`));
    },
    getUnreadCount() {
      return ok(http.get("/notifications/unread-count"));
    },
    markAsRead(notificationId) {
      return ok(
        http.post("/notifications/mark-read", {
          notification_id: notificationId,
        })
      );
    },
    markAllAsRead() {
      return ok(http.post("/notifications/mark-all-read"));
    },
  },
  // ==== WISHLIST ====
  wishlist: {
    getItems() {
      return ok(http.get("/wishlist"));
    },
    addItem(itemType, itemId, itemData) {
      return ok(
        http.post("/wishlist/add", {
          item_type: itemType,
          item_id: itemId,
          item_data: itemData,
        })
      );
    },
    removeItem(itemType, itemId) {
      return ok(
        http.post("/wishlist/remove", {
          item_type: itemType,
          item_id: itemId,
        })
      );
    },
    checkItem(itemType, itemId) {
      return ok(
        http.get(`/wishlist/check?item_type=${itemType}&item_id=${itemId}`)
      );
    },
    getItemCount() {
      return ok(http.get("/wishlist/count"));
    },
    clearWishlist() {
      return ok(http.post("/wishlist/clear"));
    },
  },
  // ==== LOCATIONS ====
  locations: {
    list(params) {
      return ok(http.get("/locations", { params }));
    },
    show(id) {
      return ok(http.get(`/locations/${id}`));
    },
    search(params) {
      return ok(http.get("/location/search", { params }));
    },
    reverse(params) {
      return ok(http.get("/location/reverse", { params }));
    },
    // New endpoints for registration forms
    getCampingDestinations() {
      return ok(http.get("/locations/camping"));
    },
    getStargazingSpots() {
      return ok(http.get("/locations/stargazing"));
    },
    getAllLocations() {
      return ok(http.get("/locations/all"));
    },
    getLocationsByType(type) {
      return ok(http.get("/locations/by-type", { params: { type } }));
    },
    // Display endpoints with images
    getCampingDestinationsWithImages() {
      return ok(http.get("/locations/camping/display"));
    },
    getStargazingSpotsWithImages() {
      return ok(http.get("/locations/stargazing/display"));
    },
    // Home page endpoints (top 3 for each type)
    getTopCampingDestinationsWithImages(limit = 3) {
      return ok(http.get("/locations/camping/top", { params: { limit } }));
    },
    getTopStargazingSpotsWithImages(limit = 3) {
      return ok(http.get("/locations/stargazing/top", { params: { limit } }));
    },
    // Individual location endpoint
    getLocationWithImages(locationId) {
      return ok(http.get(`/locations/${locationId}`));
    },
    // District filtering endpoints
    getCampingDestinationsByDistrict(district) {
      return ok(
        http.get("/locations/camping/by-district", { params: { district } })
      );
    },
    getStargazingSpotsByDistrict(district) {
      return ok(
        http.get("/locations/stargazing/by-district", { params: { district } })
      );
    },
    getAllDistricts() {
      return ok(http.get("/locations/districts"));
    },
  },
  // ==== RENTERS / GUIDES ====
  renters: {
    list(params) {
      return ok(http.get("/renters", { params }));
    },
    getByDistrict(district) {
      return ok(http.get("/renters/by-district", { params: { district } }));
    },
    getByEquipment(equipmentIds) {
      // equipmentIds: array of numbers
      const q = Array.isArray(equipmentIds)
        ? equipmentIds.filter((v) => !!v).join(",")
        : String(equipmentIds || "");
      return ok(
        http.get(`/renters/by-equipment`, { params: { equipment_ids: q } })
      );
    },
    show(id) {
      return ok(http.get(`/renters/${id}`));
    },
  },

  // ==== RENTER DASHBOARD ====
  renterDashboard: {
    getStats() {
      return ok(http.get("/renter/dashboard/stats"));
    },
    getProfile() {
      return ok(http.get("/renter/profile"));
    },
    updateProfile(data) {
      return ok(http.post("/renter/profile", data));
    },
    getVerificationDocs() {
      return ok(http.get("/renter/verification/docs"));
    },
    submitVerification(formData) {
      return ok(http.post("/renter/verification/submit", formData));
    },

    // Equipment Management
    getEquipmentCatalog() {
      return ok(http.get("/renter/equipment/catalog"));
    },
    getRenterEquipment() {
      return ok(http.get("/renter/equipment/list"));
    },
    addEquipment(formData) {
      console.log(
        "📸 PHOTO UPLOAD: Starting equipment photo upload process..."
      );
      console.log("📸 PHOTO UPLOAD: FormData contents:", {
        equipment_id: formData.get("equipment_id"),
        item_condition: formData.get("item_condition"),
        price_per_day: formData.get("price_per_day"),
        stock_quantity: formData.get("stock_quantity"),
        files_count: formData.getAll("condition_photos[]").length,
      });
      return ok(http.post("/renter/equipment/add", formData));
    },
    updateEquipment(id, data) {
      return ok(http.put(`/renter/equipment/update/${id}`, data));
    },
    updateEquipmentWithPhotos(id, formData) {
      return ok(http.post(`/renter/equipment/update/${id}`, formData));
    },
    deleteEquipment(id) {
      return ok(http.put(`/renter/equipment/delete/${id}`));
    },
    restoreEquipment(id) {
      return ok(http.put(`/renter/equipment/restore/${id}`));
    },
    removeEquipmentPhoto(photoId) {
      return ok(http.delete(`/renter/equipment/photo/${photoId}`));
    },
    setPrimaryPhoto(photoId) {
      return ok(http.put(`/renter/equipment/photo/${photoId}/set-primary`));
    },

    // Location Management
    getAvailableLocations() {
      return ok(http.get("/renter/locations/available"));
    },
    getRenterLocations() {
      return ok(http.get("/renter/locations/coverage"));
    },
    updateRenterLocations(data) {
      return ok(http.put("/renter/locations/update", data));
    },
    checkLocationRemoval(locationName) {
      return ok(
        http.get(
          `/renter/locations/check-removal/${encodeURIComponent(locationName)}`
        )
      );
    },

    // Bookings Management
    getRenterBookings() {
      return ok(http.get("/renter/bookings"));
    },
    markBookingAsReceived(bookingId) {
      return ok(http.put(`/renter/bookings/${bookingId}/mark-received`));
    },
    createTestNotifications() {
      return ok(http.post("/renter/test-notifications"));
    },
  },

  // ==== GUIDE DASHBOARD ====
  guideDashboard: {
    getStats() {
      return ok(http.get("/guide/dashboard/stats"));
    },
    getProfile() {
      return ok(http.get("/guide/profile"));
    },
    updateProfile(data) {
      return ok(http.post("/guide/profile", data));
    },
    getVerificationDocs() {
      return ok(http.get("/guide/verification/docs"));
    },
    submitVerification(formData) {
      return ok(http.post("/guide/verification/submit", formData));
    },
    getAvailability() {
      return ok(http.get("/guide/availability"));
    },
    updateAvailability(data) {
      return ok(http.post("/guide/availability", data));
    },
    getImages() {
      return ok(http.get("/guide/images"));
    },
    uploadImages(formData) {
      return ok(http.post("/guide/images", formData));
    },
    deleteImage(imageId) {
      return ok(http.delete(`/guide/images/${imageId}`));
    },
    // Location Management
    getAvailableLocations() {
      return ok(http.get("/guide/locations/available"));
    },
    getGuideLocations() {
      return ok(http.get("/guide/locations/coverage"));
    },
    updateGuideLocations(data) {
      return ok(http.put("/guide/locations/update", data));
    },
    checkLocationRemoval(locationName) {
      return ok(
        http.get(
          `/guide/locations/check-removal/${encodeURIComponent(locationName)}`
        )
      );
    },
    // Booking Management
    getGuideBookings() {
      return ok(http.get("/guide/bookings"));
    },
    markBookingAsFinished(bookingId) {
      return ok(http.put(`/guide/bookings/${bookingId}/mark-finished`));
    },
    createTestNotifications() {
      return ok(http.post("/guide/test-notifications"));
    },
  },

  guides: {
    list(params) {
      return ok(http.get("/guides", { params }));
    },
    getByDistrict(district) {
      return ok(http.get("/guides/by-district", { params: { district } }));
    },
    show(id) {
      return ok(http.get(`/guides/${id}`));
    },
  },
  // ==== EQUIPMENT ====
  equipment: {
    getCategories() {
      return ok(http.get("/equipment/categories"));
    },
    getCategoriesWithEquipment() {
      return ok(http.get("/equipment/categories-with-equipment"));
    },
    getEquipmentByCategory(categoryId) {
      return ok(http.get("/equipment/by-category", { params: { categoryId } }));
    },
  },
  // ==== CART / CHECKOUT ====
  cart: {
    get() {
      return ok(http.get("/cart"));
    },
    create(cartData) {
      return ok(http.post("/cart", cartData));
    },
    updateQuantity(cartItemId, quantity) {
      return ok(http.put("/cart/item/quantity", { cartItemId, quantity }));
    },
    removeItem(cartItemId) {
      return ok(http.delete("/cart/item", { data: { cartItemId } }));
    },
    addItem(body) {
      return ok(http.post("/cart/items", body));
    },
    updateItem(id, body) {
      return ok(http.put(`/cart/items/${id}`, body));
    },
    checkout(body) {
      return ok(http.post("/cart/checkout", body));
    },
  },
  // ==== BOOKINGS / PAYMENTS ====
  bookings: {
    list(params) {
      return ok(http.get("/bookings", { params }));
    },
    show(id) {
      return ok(http.get(`/bookings/${id}`));
    },
    create(bookingData) {
      return ok(http.post("/bookings", bookingData));
    },
    confirmPayment(paymentData) {
      return ok(http.post("/bookings/confirm-payment", paymentData));
    },
    cancelPayment(paymentData) {
      return ok(http.post("/bookings/cancel-payment", paymentData));
    },
    getPaymentStatus(orderId) {
      return ok(http.get(`/bookings/payment-status/${orderId}`));
    },
    getPaymentDetails(bookingId) {
      return ok(http.get(`/bookings/payment-details/${bookingId}`));
    },
  },
  // ==== TRAVEL BUDDY ====
  travelBuddy: {
    listPlans(params) {
      return ok(http.get("/travel-plans", { params }));
    },
    createPlan(data) {
      return ok(http.post("/travel-plans", data));
    },
    getMyPlans(params) {
      return ok(http.get("/travel-plans/my", { params }));
    },
    getPlan(id) {
      return ok(http.get(`/travel-plans/${id}`));
    },
    updatePlan(id, data) {
      return ok(http.put(`/travel-plans/${id}`, data));
    },
    deletePlan(id) {
      return ok(http.delete(`/travel-plans/${id}`));
    },
    requestJoin(data) {
      return ok(http.post("/travel-requests", data));
    },
    getMyRequests(params) {
      return ok(http.get("/travel-requests/my", { params }));
    },
    acceptRequest(id) {
      return ok(http.post(`/travel-requests/${id}/accept`));
    },
    rejectRequest(id) {
      return ok(http.post(`/travel-requests/${id}/reject`));
    },
    listMessages(params) {
      return ok(http.get("/travel-messages", { params }));
    },
    sendMessage(data) {
      return ok(http.post("/travel-messages", data));
    },
    getStatus() {
      return ok(http.get("/travel-buddy/status"));
    },
    debug() {
      return ok(http.get("/travel-buddy/debug"));
    },
  },
};
