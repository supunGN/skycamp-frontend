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
  },
  // ==== RENTERS / GUIDES ====
  renters: {
    list(params) {
      return ok(http.get("/renters", { params }));
    },
  },
  guides: {
    list(params) {
      return ok(http.get("/guides", { params }));
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
  payments: {
    mock(body) {
      return ok(http.post("/payments/mock", body));
    },
  },
  // ==== REVIEWS ====
  reviews: {
    create(body) {
      return ok(http.post("/reviews", body));
    },
    addDestinationReview(body) {
      return ok(http.post("/add_destination_review.php", body));
    },
    addServiceProviderReview(body) {
      return ok(http.post("/add_service_provider_review.php", body));
    },
  },
  // ==== DESTINATIONS ====
  destinations: {
    list() {
      return ok(http.get("/destinations.php"));
    },
    create(body) {
      return ok(http.post("/add_destination.php", body));
    },
  },
  // ==== SERVICE PROVIDERS ====
  serviceProviders: {
    list() {
      return ok(http.get("/service_providers.php"));
    },
  },
  // ==== TRAVEL BUDDY ====
  travelBuddy: {
    listPlans(params) {
      return ok(http.get("/travel-plans", { params }));
    },
    createPlan(body) {
      return ok(http.post("/travel-plans", body));
    },
    requestJoin(body) {
      return ok(http.post("/travel-requests", body));
    },
    listMessages(params) {
      return ok(http.get("/travel-messages", { params }));
    },
    sendMessage(body) {
      return ok(http.post("/travel-messages", body));
    },
  },
  // ==== PROFILE (customer) ====
  profile: {
    getCustomer(params) {
      return ok(http.get("/customer/profile.php", { params }));
    },
    updateCustomer(body) {
      return ok(http.post("/customer/update-profile.php", body));
    },
  },
};
