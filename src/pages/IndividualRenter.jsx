import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import Navbar from "../components/organisms/Navbar";
import Footer from "../components/organisms/Footer";
import Button from "../components/atoms/Button";
import Calendar from "../components/molecules/Calendar";
import RatingReviewSection from "../components/sections/RatingReviewSection";
import GearItemCard from "../components/molecules/GearItemCard";
import { API } from "../api";
import { useCartContext } from "../contexts/CartContext";
import { useToast } from "../components/atoms/ToastProvider";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix Leaflet marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

const IndividualRenter = () => {
  const { renterId } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { showSuccess, showError } = useToast();
  const { addToCart } = useCartContext();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [renterData, setRenterData] = useState(null);
  const [selectedItems, setSelectedItems] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [selectedEquipmentIds, setSelectedEquipmentIds] = useState([]);

  useEffect(() => {
    if (renterId) {
      fetchRenterData();
    }
  }, [renterId]);

  // Parse selected equipment IDs from URL parameters
  useEffect(() => {
    const selectedParam = searchParams.get("selected");
    if (selectedParam) {
      const ids = selectedParam
        .split(",")
        .map((id) => parseInt(id.trim()))
        .filter((id) => !isNaN(id));
      setSelectedEquipmentIds(ids);
    }
  }, [searchParams]);

  const fetchRenterData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Clean the renterId to remove any extra characters
      const cleanRenterId = renterId.replace(/[^0-9]/g, "");

      const response = await API.renters.show(cleanRenterId);

      if (response.success) {
        setRenterData(response.data);
        // Initialize selected items as empty
        setSelectedItems([]);
      } else {
        setError(response.message || "Failed to fetch renter data");
      }
    } catch (err) {
      console.error("Error fetching renter data:", err);
      setError("Failed to load renter profile");
    } finally {
      setLoading(false);
    }
  };

  // Handle quantity change for selected items
  const handleQuantityChange = (itemId, newQty) => {
    setSelectedItems((items) =>
      items.map((item) =>
        item.id === itemId ? { ...item, quantity: newQty } : item
      )
    );
  };

  // Handle select/deselect item
  const handleSelect = (item, checked) => {
    if (checked) {
      // Add to selected items
      setSelectedItems((items) => [
        ...items,
        { ...item, quantity: 1, selected: true },
      ]);
    } else {
      // Remove from selected items
      setSelectedItems((items) => items.filter((i) => i.id !== item.id));
    }
  };

  // Calculate total price
  const totalPrice = selectedItems.reduce(
    (sum, item) => sum + item.pricePerDay * item.quantity,
    0
  );

  // Handle add to cart
  const handleAddToCart = async () => {
    if (selectedItems.length === 0) {
      showError("Please select at least one item");
      return;
    }

    if (!startDate || !endDate) {
      showError("Please select rental start and end dates");
      return;
    }

    // Validate that end date is after start date
    const startDateObj = new Date(startDate);
    const endDateObj = new Date(endDate);
    if (endDateObj <= startDateObj) {
      showError("End date must be after start date");
      return;
    }

    // Check if user is logged in
    const user = localStorage.getItem("user");
    if (!user) {
      showError("Please log in to add items to cart");
      return;
    }

    try {
      // Create cart data
      console.log(
        "IndividualRenter - startDate type:",
        typeof startDate,
        "value:",
        startDate
      );
      console.log(
        "IndividualRenter - endDate type:",
        typeof endDate,
        "value:",
        endDate
      );

      // Convert dates to proper format
      let formattedStartDate = startDate;
      let formattedEndDate = endDate;

      if (startDate) {
        if (startDate instanceof Date) {
          formattedStartDate = startDate.toISOString().split("T")[0];
        } else if (typeof startDate === "string" && startDate !== "") {
          // If it's already a string, try to format it
          const date = new Date(startDate);
          if (!isNaN(date.getTime())) {
            formattedStartDate = date.toISOString().split("T")[0];
          }
        }
      }

      if (endDate) {
        if (endDate instanceof Date) {
          formattedEndDate = endDate.toISOString().split("T")[0];
        } else if (typeof endDate === "string" && endDate !== "") {
          // If it's already a string, try to format it
          const date = new Date(endDate);
          if (!isNaN(date.getTime())) {
            formattedEndDate = date.toISOString().split("T")[0];
          }
        }
      }

      console.log(
        "IndividualRenter - formatted dates:",
        formattedStartDate,
        formattedEndDate
      );

      const cartData = {
        renterId: renterId,
        items: selectedItems.map((item) => ({
          renterEquipmentId: item.id,
          quantity: item.quantity,
        })),
        startDate: formattedStartDate,
        endDate: formattedEndDate,
      };

      const result = await addToCart(cartData);

      if (result.success) {
        showSuccess("Items added to cart successfully!");
        navigate("/cart");
      } else {
        showError(result.message || "Failed to add items to cart");
      }
    } catch (err) {
      console.error("Error adding to cart:", err);
      showError("Failed to add items to cart");
    }
  };

  // Check if item is selected
  const isItemSelected = (itemId) => {
    return selectedItems.some((item) => item.id === itemId);
  };

  // Get selected quantity for an item
  const getSelectedQuantity = (itemId) => {
    const item = selectedItems.find((item) => item.id === itemId);
    return item ? item.quantity : 1;
  };

  // Separate equipment into selected and remaining items
  const getEquipmentSections = () => {
    if (!renterData || !renterData.equipment) {
      return { selectedEquipment: [], remainingEquipment: [] };
    }

    // Get items that were originally selected via URL parameters
    const originallySelectedEquipment = renterData.equipment.filter((item) =>
      selectedEquipmentIds.includes(item.equipmentId)
    );

    // Get items that are currently selected by the user (in cart)
    const currentlySelectedEquipment = renterData.equipment.filter((item) =>
      isItemSelected(item.id)
    );

    // Combine originally selected and currently selected items
    const allSelectedEquipment = [...originallySelectedEquipment];
    currentlySelectedEquipment.forEach((item) => {
      if (!allSelectedEquipment.find((selected) => selected.id === item.id)) {
        allSelectedEquipment.push(item);
      }
    });

    // Remaining items are those not in the combined selected list
    const remainingEquipment = renterData.equipment.filter(
      (item) =>
        !allSelectedEquipment.find((selected) => selected.id === item.id)
    );

    return {
      selectedEquipment: allSelectedEquipment,
      remainingEquipment,
    };
  };

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-white">
        <Navbar />
        <main className="max-w-7xl mx-auto w-full px-4 pt-32 pb-16">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading renter profile...</p>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !renterData) {
    return (
      <div className="flex flex-col min-h-screen bg-white">
        <Navbar />
        <main className="max-w-7xl mx-auto w-full px-4 pt-32 pb-16">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="text-red-600 text-6xl mb-4">⚠️</div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Error Loading Profile
              </h2>
              <p className="text-gray-600 mb-4">
                {error || "Renter not found"}
              </p>
              <Button variant="primary" onClick={() => navigate("/rentals")}>
                Back to Rentals
              </Button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Navbar />
      <main className="max-w-7xl mx-auto w-full px-4 pt-32 pb-16">
        {/* Two-column layout: Left = profile, items; Right = sticky map */}
        <div className="flex flex-col lg:flex-row gap-8 mb-10">
          <div className="mt-8" />
          {/* Left: Profile, Items */}
          <div className="flex-1">
            {/* Profile Section */}
            <div className="flex items-center gap-8 mb-8">
              <img
                src={renterData.image || "/default-avatar.png"}
                alt={renterData.name}
                className="w-32 h-32 rounded-full object-cover border-4 border-cyan-100"
              />
              <div>
                <h2 className="text-4xl font-bold text-gray-900 mb-1">
                  {renterData.name}
                </h2>
                <div className="flex gap-6 mb-2">
                  <div className="flex flex-col items-center">
                    <span className="text-lg font-bold text-gray-900">
                      {renterData.reviewCount}
                    </span>
                    <span className="text-xs text-gray-500">Reviews</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="text-lg font-bold text-gray-900">
                      {renterData.rating} ★
                    </span>
                    <span className="text-xs text-gray-500">Rating</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="text-cyan-700 font-semibold text-sm flex items-center gap-1">
                      <svg
                        className="w-4 h-4 inline-block"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M10 2C6.13 2 3 5.13 3 9c0 5.25 7 9 7 9s7-3.75 7-9c0-3.87-3.13-7-7-7zm0 9.5A2.5 2.5 0 1 1 10 6a2.5 2.5 0 0 1 0 5.5z" />
                      </svg>
                      {renterData.location}
                    </span>
                  </div>
                </div>
                <div className="text-gray-600 text-base mt-2">
                  {renterData.verificationStatus === "Yes" && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 mr-2">
                      ✓ Verified
                    </span>
                  )}
                  Member since {new Date(renterData.createdAt).getFullYear()}
                </div>
              </div>
            </div>

            {/* Equipment Listings */}
            <div className="">
              {(() => {
                const { selectedEquipment, remainingEquipment } =
                  getEquipmentSections();
                const hasSelectedItems = selectedEquipment.length > 0;

                return (
                  <>
                    {/* Selected Items Section */}
                    {hasSelectedItems && (
                      <div className="mb-8">
                        <h3 className="text-lg font-bold mb-4 text-teal-600">
                          Selected Items ({selectedEquipment.length} items)
                        </h3>
                        <div className="flex flex-col items-start w-full">
                          {selectedEquipment.map((item) => (
                            <GearItemCard
                              key={item.id}
                              id={item.id}
                              image={item.image || "/default-equipment.png"}
                              name={item.name}
                              description={item.description}
                              price={item.pricePerDay}
                              quantity={getSelectedQuantity(item.id)}
                              selected={isItemSelected(item.id)}
                              onSelect={() =>
                                handleSelect(item, !isItemSelected(item.id))
                              }
                              onQuantityChange={(qty) =>
                                handleQuantityChange(item.id, qty)
                              }
                              className="max-w-xl w-full"
                              disabled={!item.isAvailable}
                              stockQuantity={item.stockQuantity}
                              condition={item.condition}
                            />
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Remaining Items Section */}
                    {remainingEquipment.length > 0 && (
                      <div className="mb-8">
                        <h3 className="text-lg font-bold mb-4 text-teal-600">
                          Remaining Items ({remainingEquipment.length} items)
                        </h3>
                        <div className="flex flex-col items-start w-full">
                          {remainingEquipment.map((item) => (
                            <GearItemCard
                              key={item.id}
                              id={item.id}
                              image={item.image || "/default-equipment.png"}
                              name={item.name}
                              description={item.description}
                              price={item.pricePerDay}
                              quantity={getSelectedQuantity(item.id)}
                              selected={isItemSelected(item.id)}
                              onSelect={() =>
                                handleSelect(item, !isItemSelected(item.id))
                              }
                              onQuantityChange={(qty) =>
                                handleQuantityChange(item.id, qty)
                              }
                              className="max-w-xl w-full"
                              disabled={!item.isAvailable}
                              stockQuantity={item.stockQuantity}
                              condition={item.condition}
                            />
                          ))}
                        </div>
                      </div>
                    )}

                    {/* No items message */}
                    {renterData.equipment.length === 0 && (
                      <div className="text-center py-8">
                        <p className="text-gray-500">
                          No equipment available at the moment.
                        </p>
                      </div>
                    )}
                  </>
                );
              })()}
            </div>
          </div>

          {/* Right: Sticky OpenStreetMap */}
          <div className="w-full lg:w-[400px] flex-shrink-0">
            <div className="sticky top-32 h-[500px] w-full rounded-2xl overflow-hidden shadow">
              {renterData.details.latitude && renterData.details.longitude ? (
                <MapContainer
                  center={[
                    parseFloat(renterData.details.latitude),
                    parseFloat(renterData.details.longitude),
                  ]}
                  zoom={15}
                  style={{ height: "100%", width: "100%" }}
                >
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  <Marker
                    position={[
                      parseFloat(renterData.details.latitude),
                      parseFloat(renterData.details.longitude),
                    ]}
                  >
                    <Popup>
                      <strong>{renterData.name}</strong>
                      <br />
                      {renterData.location}
                    </Popup>
                  </Marker>
                </MapContainer>
              ) : (
                <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                  <p className="text-gray-500">Location not available</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Divider above the rental period & gear list section */}
        <hr className="mb-8 border-gray-200 max-w-7xl mx-auto w-full" />
        <div className="mt-8" />

        {/* Full-width Rental Period and Gear List Summary */}
        <div className="max-w-7xl mx-auto w-full">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              <h3 className="text-lg font-bold mb-4 text-gray-900">
                Pick Your Rental Period
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Select your rental start and end dates. Past dates are not
                available.
              </p>
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-semibold mb-2">
                    Rental Start Date
                  </label>
                  <input
                    type="text"
                    value={startDate}
                    readOnly
                    className="w-full border rounded-lg px-3 py-2 mb-4"
                  />
                  <Calendar
                    value={startDate}
                    onChange={(date) => {
                      console.log(
                        "Calendar onChange - startDate received:",
                        date,
                        "type:",
                        typeof date
                      );
                      setStartDate(date);
                      // Reset end date if it's before the new start date
                      if (endDate && new Date(endDate) < new Date(date)) {
                        setEndDate("");
                      }
                    }}
                    minDate={new Date().toISOString()} // Prevent past dates
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-semibold mb-2">
                    Rental End Date
                  </label>
                  <input
                    type="text"
                    value={endDate}
                    readOnly
                    className="w-full border rounded-lg px-3 py-2 mb-4"
                  />
                  <Calendar
                    value={endDate}
                    onChange={(date) => {
                      console.log(
                        "Calendar onChange - endDate received:",
                        date,
                        "type:",
                        typeof date
                      );
                      setEndDate(date);
                    }}
                    minDate={startDate || new Date().toISOString()} // End date must be after start date
                  />
                </div>
              </div>
            </div>
            <div className="bg-white rounded-2xl shadow p-6 h-max">
              <h3 className="text-lg font-bold mb-4 text-gray-900">
                Your Gear List
              </h3>
              {selectedItems.length > 0 ? (
                <>
                  <ul className="mb-4">
                    {selectedItems.map((item) => (
                      <li
                        key={item.id}
                        className="flex justify-between items-center py-1"
                      >
                        <span className="text-sm">
                          {item.name} (x{item.quantity})
                        </span>
                        <span className="font-semibold">
                          {(item.pricePerDay * item.quantity).toLocaleString(
                            undefined,
                            {
                              minimumFractionDigits: 2,
                            }
                          )}
                        </span>
                      </li>
                    ))}
                  </ul>
                  <div className="flex justify-between items-center font-bold text-lg border-t pt-2">
                    <span>Total</span>
                    <span>
                      {totalPrice.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                      })}{" "}
                      LKR
                    </span>
                  </div>
                </>
              ) : (
                <p className="text-gray-500 text-sm">No items selected</p>
              )}
              <Button
                size="md"
                variant="primary"
                className="w-full mt-4"
                onClick={handleAddToCart}
                disabled={selectedItems.length === 0}
              >
                Add To Cart
              </Button>
            </div>
          </div>
        </div>

        {/* Full-width Reviews Section */}
        {renterData.reviews && renterData.reviews.length > 0 && (
          <div className="max-w-7xl mx-auto w-full px-6" id="reviews">
            <RatingReviewSection
              averageRating={renterData.rating}
              reviewText={`Customer reviews for ${renterData.name}'s equipment and service quality`}
              reviews={renterData.reviews}
            />
          </div>
        )}
      </main>
      {/* Divider above footer */}
      <hr className="mt-8 mb-0 border-gray-200 max-w-7xl mx-auto w-full" />
      <Footer />
    </div>
  );
};

export default IndividualRenter;
