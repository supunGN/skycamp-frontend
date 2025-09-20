/**
 * Cache-busting utility for image URLs
 * Adds timestamp query parameter to prevent browser caching of updated images
 */

/**
 * Add cache-busting parameter to an image URL
 * @param {string} imagePath - The relative path to the image or full URL
 * @param {string|number} timestamp - The timestamp to use for cache-busting
 * @returns {string} The URL with cache-busting parameter
 */
export const addCacheBusting = (imagePath, timestamp) => {
  if (!imagePath) return null;

  // Convert timestamp to Unix timestamp if it's a string
  const ts =
    typeof timestamp === "string" ? new Date(timestamp).getTime() : timestamp;

  // If it's already a full URL, just add/update the timestamp parameter
  if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
    // Remove existing timestamp parameter if present
    const urlWithoutTs = imagePath.replace(/[?&]ts=\d+/g, "");
    const separator = urlWithoutTs.includes("?") ? "&" : "?";
    return `${urlWithoutTs}${separator}ts=${ts}`;
  }

  // Build the full URL with cache-busting parameter for relative paths
  const baseUrl = "http://localhost/skycamp/skycamp-backend/storage/uploads/";
  const cleanPath = imagePath.startsWith("/") ? imagePath.slice(1) : imagePath;

  return `${baseUrl}${cleanPath}?ts=${ts}`;
};

/**
 * Get cache-busted profile picture URL
 * @param {object} user - User object with profile_picture and updated_at
 * @returns {string|null} Cache-busted profile picture URL
 */
export const getProfilePictureUrl = (user) => {
  if (!user) return null;

  // If profile_picture_url is provided (from backend with cache-busting), use it
  if (user.profile_picture_url) {
    return user.profile_picture_url;
  }

  // If profile_picture is already a full URL with cache-busting, return as-is
  if (
    user.profile_picture &&
    (user.profile_picture.startsWith("http://") ||
      user.profile_picture.startsWith("https://"))
  ) {
    return user.profile_picture;
  }

  // Use updated_at if available, otherwise fall back to created_at or current time
  const timestamp = user.updated_at || user.created_at || Date.now();
  return addCacheBusting(user.profile_picture, timestamp);
};

/**
 * Get cache-busted NIC document URLs
 * @param {object} user - User object with NIC images and updated_at
 * @returns {object} Object with cache-busted NIC URLs
 */
export const getNicDocumentUrls = (user) => {
  const timestamp = user.updated_at || user.created_at || Date.now();

  return {
    nicFront: user.nic_front_image
      ? addCacheBusting(user.nic_front_image, timestamp)
      : null,
    nicBack: user.nic_back_image
      ? addCacheBusting(user.nic_back_image, timestamp)
      : null,
  };
};

/**
 * Get cache-busted image URL from verification data
 * @param {object} verificationData - Verification data with image URLs and timestamps
 * @returns {object} Object with cache-busted verification image URLs
 */
export const getVerificationImageUrls = (verificationData) => {
  const timestamp =
    verificationData.updated_at || verificationData.created_at || Date.now();

  return {
    nicFront: verificationData.nic_front_image_url
      ? addCacheBusting(verificationData.nic_front_image_url, timestamp)
      : null,
    nicBack: verificationData.nic_back_image_url
      ? addCacheBusting(verificationData.nic_back_image_url, timestamp)
      : null,
  };
};

/**
 * Extract timestamp from a cache-busted URL
 * @param {string} url - URL with cache-busting parameter
 * @returns {number|null} The timestamp or null if not found
 */
export const extractTimestamp = (url) => {
  if (!url) return null;

  const match = url.match(/[?&]ts=(\d+)/);
  return match ? parseInt(match[1], 10) : null;
};

/**
 * Check if an image URL needs cache-busting update
 * @param {string} currentUrl - Current image URL
 * @param {string|number} newTimestamp - New timestamp to compare against
 * @returns {boolean} True if the URL needs updating
 */
export const needsCacheUpdate = (currentUrl, newTimestamp) => {
  if (!currentUrl) return true;

  const currentTimestamp = extractTimestamp(currentUrl);
  const newTs =
    typeof newTimestamp === "string"
      ? new Date(newTimestamp).getTime()
      : newTimestamp;

  return !currentTimestamp || currentTimestamp !== newTs;
};
