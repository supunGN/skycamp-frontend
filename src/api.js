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
      return ok(http.get("/admin/verifications/pending"));
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
    show(id) {
      return ok(http.get(`/renters/${id}`));
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
    addItem(body) {
      return ok(http.post("/cart/items", body));
    },
    updateItem(id, body) {
      return ok(http.put(`/cart/items/${id}`, body));
    },
    removeItem(id) {
      return ok(http.delete(`/cart/items/${id}`));
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
  },
  // ==== TRAVEL BUDDY ====
  travelBuddy: {
    listPlans(params) {
      return ok(http.get("/travel-plans", { params }));
    },
    createPlan(data) {
      return ok(http.post("/travel-plans", data));
    },
    requestJoin(data) {
      return ok(http.post("/travel-requests", data));
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
  },
};