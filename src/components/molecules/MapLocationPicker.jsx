import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  MapPinIcon,
  MagnifyingGlassIcon,
  ExclamationTriangleIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import Button from "../atoms/Button";
import { Input } from "./Input";

// ---------------------------
// MapLocationPicker Component
// ---------------------------
export default function MapLocationPicker({
  location,
  setLocation,
  coordinates,
  setCoordinates,
  error = null,
  placeholder = "Type your location or city name",
  label = "Location",
  required = false,
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isMapVisible, setIsMapVisible] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [searchError, setSearchError] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [mapLoadError, setMapLoadError] = useState(false);

  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markerRef = useRef(null);
  const searchTimeoutRef = useRef(null);
  const leafletLoadingRef = useRef(false);

  // Initialize map when component mounts or visibility changes
  useEffect(() => {
    if (isMapVisible && !mapInstanceRef.current && !leafletLoadingRef.current) {
      loadMapLibraries();
    }
  }, [isMapVisible]);

  // Effect to handle map size invalidation when visibility changes
  useEffect(() => {
    if (isMapVisible && mapInstanceRef.current && mapLoaded) {
      const timer = setTimeout(() => {
        try {
          mapInstanceRef.current.invalidateSize();
        } catch (e) {
          console.warn("Error invalidating map size:", e);
        }
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isMapVisible, mapLoaded]);

  const loadMapLibraries = async () => {
    if (leafletLoadingRef.current) return;
    leafletLoadingRef.current = true;

    try {
      // Check if Leaflet is already loaded and functional
      if (window.L && window.L.map && typeof window.L.map === "function") {
        await initializeMap();
        return;
      }

      // Check if scripts are already being loaded
      const existingScript = document.querySelector('script[src*="leaflet"]');
      if (existingScript) {
        await waitForLeafletLoad();
        return;
      }

      // Load Leaflet CSS first
      await loadLeafletCSS();

      // Then load Leaflet JS
      await loadLeafletJS();

      // Initialize map after both are loaded
      await initializeMap();
    } catch (error) {
      console.error("Failed to load map libraries:", error);
      setMapLoadError(true);
      setMapLoaded(false);
    } finally {
      leafletLoadingRef.current = false;
    }
  };

  const loadLeafletCSS = () => {
    return new Promise((resolve) => {
      const existingLink = document.querySelector('link[href*="leaflet"]');
      if (existingLink) {
        resolve();
        return;
      }

      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
      link.onload = () => resolve();
      link.onerror = () => resolve(); // Don't fail on CSS load error
      document.head.appendChild(link);
    });
  };

  const loadLeafletJS = () => {
    return new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
      script.async = false;
      script.onload = () => {
        // Wait a bit for Leaflet to be fully ready
        setTimeout(() => {
          if (window.L && window.L.map) {
            resolve();
          } else {
            reject(new Error("Leaflet not properly initialized"));
          }
        }, 100);
      };
      script.onerror = () => reject(new Error("Failed to load Leaflet script"));
      document.head.appendChild(script);
    });
  };

  const waitForLeafletLoad = () => {
    return new Promise((resolve, reject) => {
      const maxWait = 10000; // 10 seconds
      const interval = 100;
      let waited = 0;

      const checkLoaded = setInterval(() => {
        if (window.L && window.L.map) {
          clearInterval(checkLoaded);
          resolve();
        } else if (waited >= maxWait) {
          clearInterval(checkLoaded);
          reject(new Error("Timeout waiting for Leaflet to load"));
        }
        waited += interval;
      }, interval);
    });
  };

  const initializeMap = async () => {
    if (!window.L || !mapRef.current || mapInstanceRef.current) return;

    const L = window.L;

    try {
      // Sri Lanka bounds for restriction
      const sriLankaBounds = [
        [5.916, 79.652], // Southwest
        [9.835, 81.881], // Northeast
      ];

      // Initialize map with proper options
      const map = L.map(mapRef.current, {
        center: [7.8731, 80.7718], // Center of Sri Lanka
        zoom: 8,
        minZoom: 7,
        maxZoom: 18,
        maxBounds: sriLankaBounds,
        maxBoundsViscosity: 1.0,
        zoomControl: true,
        attributionControl: true,
        preferCanvas: false,
        renderer: L.svg(),
        zoomSnap: 1,
        zoomDelta: 1,
      });

      // Override Leaflet's default z-index for map panes
      if (map.getContainer()) {
        const container = map.getContainer();
        container.style.zIndex = "0";

        // Set z-index for all map panes to ensure they stay below other elements
        const panes = container.querySelectorAll(".leaflet-pane");
        panes.forEach((pane) => {
          pane.style.zIndex = "0";
        });
      }

      mapInstanceRef.current = map;

      // Add tile layer
      const tileLayer = L.tileLayer(
        "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
        {
          attribution:
            '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
          maxZoom: 18,
          subdomains: ["a", "b", "c"],
          errorTileUrl:
            "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==",
        }
      );

      tileLayer.addTo(map);

      // Add click event with bounds checking
      map.on("click", (e) => {
        const { lat, lng } = e.latlng;
        // Ensure click is within Sri Lanka bounds
        if (lat >= 5.916 && lat <= 9.835 && lng >= 79.652 && lng <= 81.881) {
          handleMapClick(lat, lng);
        }
      });

      // Handle existing coordinates
      if (coordinates && coordinates.lat && coordinates.lng) {
        addMarker(coordinates.lat, coordinates.lng);
        map.setView([coordinates.lat, coordinates.lng], 13);
      }

      // Wait for map to be ready then mark as loaded
      map.whenReady(() => {
        setTimeout(() => {
          try {
            map.invalidateSize();

            // Ensure z-index is properly set after map is fully loaded
            const container = map.getContainer();
            if (container) {
              container.style.zIndex = "1";
              container.style.position = "relative";

              // Override any Leaflet z-index styles
              const style = document.createElement("style");
              style.textContent = `
                .leaflet-container {
                  z-index: 1 !important;
                  position: relative !important;
                }
                .leaflet-pane {
                  z-index: auto !important;
                }
                .leaflet-control-container {
                  z-index: 10 !important;
                }
                .leaflet-popup {
                  z-index: 20 !important;
                }
              `;
              document.head.appendChild(style);
            }

            setMapLoaded(true);
            setMapLoadError(false);
          } catch (e) {
            console.warn("Error in map ready callback:", e);
            setMapLoaded(true); // Still mark as loaded
          }
        }, 200);
      });
    } catch (error) {
      console.error("Error initializing map:", error);
      setMapLoadError(true);
      setMapLoaded(false);
    }
  };

  const addMarker = (lat, lng) => {
    if (!mapInstanceRef.current || !window.L) return;

    try {
      // Remove existing marker
      if (markerRef.current) {
        mapInstanceRef.current.removeLayer(markerRef.current);
      }

      // Create new marker with popup
      markerRef.current = window.L.marker([lat, lng])
        .addTo(mapInstanceRef.current)
        .bindPopup(
          `📍 Location: ${lat.toFixed(4)}, ${lng.toFixed(
            4
          )}<br/>Click and drag to adjust position`
        )
        .openPopup();

      // Make marker draggable for position adjustment
      markerRef.current.dragging.enable();

      // Update coordinates when marker is dragged
      markerRef.current.on("dragend", async (e) => {
        const newLat = e.target.getLatLng().lat;
        const newLng = e.target.getLatLng().lng;

        // Check bounds
        if (
          newLat >= 5.916 &&
          newLat <= 9.835 &&
          newLng >= 79.652 &&
          newLng <= 81.881
        ) {
          setIsGettingLocation(true);
          try {
            await reverseGeocode(newLat, newLng);
          } finally {
            setIsGettingLocation(false);
          }
        } else {
          // Reset marker to previous position if dragged outside bounds
          markerRef.current.setLatLng([
            coordinates?.lat || lat,
            coordinates?.lng || lng,
          ]);
        }
      });
    } catch (error) {
      console.error("Error adding marker:", error);
    }
  };

  const handleMapClick = async (lat, lng) => {
    addMarker(lat, lng);
    setIsGettingLocation(true);

    try {
      await reverseGeocode(lat, lng);
    } finally {
      setIsGettingLocation(false);
    }
  };

  const reverseGeocode = async (lat, lng) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=14&addressdetails=1`,
        {
          headers: {
            Accept: "application/json",
            "User-Agent": "MapLocationPicker/1.0",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data && data.display_name) {
        const addressParts = data.display_name.split(",");
        const shortAddress = addressParts.slice(0, 3).join(",").trim();

        setCoordinates({ lat: parseFloat(lat), lng: parseFloat(lng) });
        setLocation(shortAddress);
        setSearchError(null);
      } else {
        throw new Error("No address found");
      }
    } catch (error) {
      console.error("Reverse geocoding failed:", error);
      // Fallback to coordinates
      setCoordinates({ lat: parseFloat(lat), lng: parseFloat(lng) });
      setLocation(`Location at ${lat.toFixed(4)}, ${lng.toFixed(4)}`);
      setSearchError(
        "Could not get address for this location, but coordinates were saved."
      );
    }
  };

  const performSearch = async (query) => {
    if (!query.trim()) return;

    setIsSearching(true);
    setSearchError(null);
    setHasSearched(true);

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          query
        )}&countrycodes=lk&limit=8&addressdetails=1&bounded=1&viewbox=79.652,9.835,81.881,5.916`,
        {
          headers: {
            Accept: "application/json",
            "User-Agent": "MapLocationPicker/1.0",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data && data.length > 0) {
        const results = data.map((item) => {
          const addressParts = item.display_name.split(",");
          const shortName = addressParts.slice(0, 2).join(",").trim();
          const area = addressParts.slice(2, 4).join(",").trim();

          return {
            name: shortName,
            area: area,
            lat: parseFloat(item.lat),
            lng: parseFloat(item.lon),
            type: item.type || item.class || "Location",
            importance: item.importance || 0,
          };
        });

        // Sort by importance
        results.sort((a, b) => b.importance - a.importance);
        setSearchResults(results);
        setSearchError(null);
      } else {
        setSearchResults([]);
        setSearchError(
          "No locations found in Sri Lanka matching your search. Please try different keywords or use the map to pin your location manually."
        );
      }
    } catch (error) {
      console.error("Search failed:", error);
      setSearchResults([]);
      setSearchError(
        "Search failed. Please check your internet connection and try again, or use the map to select your location manually."
      );
    } finally {
      setIsSearching(false);
    }
  };

  const handleLocationSelect = (lat, lng, address) => {
    setCoordinates({ lat, lng });
    setLocation(address);
    setSearchResults([]);
    setSearchQuery("");
    setSearchError(null);
    setHasSearched(false);

    // Show map if not visible
    if (!isMapVisible) {
      setIsMapVisible(true);
    }

    // Update map view and marker after a short delay
    setTimeout(() => {
      if (mapInstanceRef.current) {
        try {
          mapInstanceRef.current.setView([lat, lng], 15);
          addMarker(lat, lng);
          mapInstanceRef.current.invalidateSize();
        } catch (error) {
          console.error("Error updating map view:", error);
        }
      }
    }, 300);
  };

  const handleCurrentLocation = () => {
    if (!navigator.geolocation) {
      setSearchError("Geolocation is not supported by your browser.");
      return;
    }

    setIsGettingLocation(true);
    setSearchError(null);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        // Check if current location is within Sri Lanka bounds
        if (
          latitude < 5.916 ||
          latitude > 9.835 ||
          longitude < 79.652 ||
          longitude > 81.881
        ) {
          setSearchError(
            "Your current location appears to be outside Sri Lanka. Please use the map to select a location within Sri Lanka."
          );
          setIsGettingLocation(false);
          return;
        }

        try {
          // Show map first
          if (!isMapVisible) {
            setIsMapVisible(true);
          }

          // Update map view and add marker
          setTimeout(() => {
            if (mapInstanceRef.current) {
              mapInstanceRef.current.setView([latitude, longitude], 16);
              addMarker(latitude, longitude);
              mapInstanceRef.current.invalidateSize();
            }
          }, 300);

          // Get address for current location
          await reverseGeocode(latitude, longitude);
        } catch (error) {
          setSearchError("Failed to get address for current location.");
          setCoordinates({ lat: latitude, lng: longitude });
          setLocation(
            `Current location: ${latitude.toFixed(4)}, ${longitude.toFixed(4)}`
          );
        } finally {
          setIsGettingLocation(false);
        }
      },
      (error) => {
        setIsGettingLocation(false);
        let errorMessage = "Unable to get your current location. ";

        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage +=
              "Location access was denied. Please enable location permissions and try again.";
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage += "Location information is unavailable.";
            break;
          case error.TIMEOUT:
            errorMessage += "Location request timed out. Please try again.";
            break;
          default:
            errorMessage += "An unknown error occurred.";
            break;
        }
        setSearchError(errorMessage);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000, // 1 minute
      }
    );
  };

  const handleClearLocation = () => {
    setLocation("");
    setCoordinates(null);
    setSearchResults([]);
    setSearchQuery("");
    setSearchError(null);
    setHasSearched(false);

    // Remove marker from map if exists
    if (markerRef.current && mapInstanceRef.current) {
      try {
        mapInstanceRef.current.removeLayer(markerRef.current);
        markerRef.current = null;
      } catch (error) {
        console.warn("Error removing marker:", error);
      }
    }
  };

  const handleSearchInputChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);

    // Clear previous results when user types
    if (value !== searchQuery) {
      setSearchResults([]);
      setSearchError(null);
      setHasSearched(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleManualSearch();
    }
  };

  const handleManualSearch = () => {
    if (searchQuery.trim()) {
      setHasSearched(true);
      performSearch(searchQuery.trim());
    }
  };

  const handleToggleMap = () => {
    setIsMapVisible(!isMapVisible);
    setMapLoadError(false); // Reset error when toggling
  };

  // Cleanup effect
  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
      if (mapInstanceRef.current) {
        try {
          mapInstanceRef.current.remove();
        } catch (e) {
          console.warn("Error cleaning up map:", e);
        }
        mapInstanceRef.current = null;
      }
      leafletLoadingRef.current = false;
    };
  }, []);

  return (
    <div className="space-y-4">
      {/* Label */}
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      {/* Location Input with Search Results */}
      <div className="space-y-3">
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <Input
              placeholder={placeholder}
              value={searchQuery}
              onChange={handleSearchInputChange}
              onKeyPress={handleKeyPress}
              disabled={isSearching}
            />
            {isSearching && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <div className="w-4 h-4 border-2 border-gray-300 border-t-cyan-500 rounded-full animate-spin"></div>
              </div>
            )}
          </div>
          <Button
            onClick={handleManualSearch}
            className="px-4 py-2"
            size="sm"
            disabled={isSearching || !searchQuery.trim()}
          >
            <MagnifyingGlassIcon className="w-4 h-4" />
          </Button>
        </div>

        {/* Search Results */}
        {searchResults.length > 0 && (
          <div className="bg-white border border-gray-200 rounded-lg shadow-lg max-h-64 overflow-y-auto">
            {searchResults.map((result, index) => (
              <button
                key={`${result.lat}-${result.lng}-${index}`}
                type="button"
                onClick={() =>
                  handleLocationSelect(result.lat, result.lng, result.name)
                }
                className="w-full text-left px-4 py-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0 transition-colors focus:outline-none focus:bg-gray-50"
              >
                <div className="flex items-center gap-3">
                  <MapPinIcon className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 truncate">
                      {result.name}
                    </p>
                    {result.area && (
                      <p className="text-sm text-gray-500 truncate">
                        {result.area}
                      </p>
                    )}
                    <p className="text-xs text-gray-400 capitalize">
                      {result.type}
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}

        {/* Search Error - Only show after user has searched */}
        {searchError && hasSearched && (
          <div className="text-sm text-amber-600 bg-amber-50 border border-amber-200 rounded p-3">
            <div className="flex items-center gap-2">
              <ExclamationTriangleIcon className="w-4 h-4 flex-shrink-0" />
              {searchError}
            </div>
          </div>
        )}

        <p className="text-xs text-gray-500">
          Enter a location name and click Search or press Enter to find
          locations in Sri Lanka
        </p>
      </div>

      {/* Map Options */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={handleToggleMap}
          className="flex items-center gap-2 text-sm font-medium text-cyan-600 hover:text-cyan-700 transition-colors"
          disabled={isGettingLocation}
        >
          <MapPinIcon className="w-4 h-4" />
          {isMapVisible ? "Hide Map" : "Show Map to Pin Location"}
        </button>
        <span className="text-gray-300">|</span>
        <button
          type="button"
          onClick={handleCurrentLocation}
          disabled={isGettingLocation}
          className="flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors disabled:text-gray-400"
        >
          {isGettingLocation ? (
            <>
              <div className="w-4 h-4 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
              Getting Location...
            </>
          ) : (
            <>
              <MapPinIcon className="w-4 h-4" />
              Use Current Location
            </>
          )}
        </button>
      </div>

      {/* Interactive Map */}
      {isMapVisible && (
        <div
          className="border border-gray-300 rounded-lg overflow-hidden shadow-sm relative"
          style={{ zIndex: 1 }}
        >
          <div
            ref={mapRef}
            className="w-full h-80 relative"
            style={{
              minHeight: "320px",
              zIndex: 1,
              position: "relative",
            }}
          >
            {/* Map Loading Overlay */}
            {!mapLoaded && !mapLoadError && (
              <div className="absolute inset-0 bg-gray-100 flex items-center justify-center z-10">
                <div className="text-center">
                  <div className="w-8 h-8 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin mx-auto mb-2"></div>
                  <p className="text-sm text-gray-600">
                    Loading Sri Lanka map...
                  </p>
                </div>
              </div>
            )}

            {/* Map Load Error */}
            {mapLoadError && (
              <div className="absolute inset-0 bg-gray-100 flex items-center justify-center z-10">
                <div className="text-center p-4">
                  <ExclamationTriangleIcon className="w-8 h-8 text-red-500 mx-auto mb-2" />
                  <p className="text-sm text-gray-600 mb-3">
                    Failed to load map
                  </p>
                  <button
                    onClick={() => {
                      setMapLoadError(false);
                      setMapLoaded(false);
                      loadMapLibraries();
                    }}
                    className="text-sm text-blue-600 hover:text-blue-700 underline"
                  >
                    Try Again
                  </button>
                </div>
              </div>
            )}
          </div>
          <div className="bg-gray-50 px-4 py-3 border-t border-gray-300">
            <p className="text-sm text-gray-600 text-center">
              🗺️ Click anywhere on the map to pin your location • Drag the
              marker to adjust position
            </p>
          </div>
        </div>
      )}

      {/* Selected Location Display */}
      {location && (
        <div className="bg-cyan-50 border border-cyan-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <MapPinIcon className="w-5 h-5 text-cyan-600 mt-0.5 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-cyan-900">
                Selected Location
              </p>
              <p className="text-sm text-cyan-700 break-words">{location}</p>
              {coordinates && (
                <p className="text-xs text-cyan-600 mt-1">
                  📍 {coordinates.lat.toFixed(6)}, {coordinates.lng.toFixed(6)}
                </p>
              )}
            </div>
            <button
              type="button"
              onClick={handleClearLocation}
              className="text-cyan-500 hover:text-cyan-700 transition-colors p-1"
              title="Clear location"
            >
              <XMarkIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Validation Error */}
      {error && (
        <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded p-3">
          <div className="flex items-center gap-2">
            <ExclamationTriangleIcon className="w-4 h-4 flex-shrink-0" />
            {error}
          </div>
        </div>
      )}
    </div>
  );
}
