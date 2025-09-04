import React, { useState } from "react";
import Navbar from "../components/organisms/Navbar";
import Footer from "../components/organisms/Footer";
import Button from "../components/atoms/Button";
import Calendar from "../components/calendar/Calendar";
import RatingReviewSection from "../components/sections/RatingReviewSection";
import GearItemCard from "../components/molecules/GearItemCard";
import mapImg from "../assets/individual_destination/map.png";
import UpulImg from "../assets/rentals/Upul.png";
import tentImg from "../assets/cart_images/tent.png";
import sleepingBagImg from "../assets/cart_images/sleeping_bag.png";
import gasImg from "../assets/cart_images/gas.png";
import chairImg from "../assets/cart_images/chair.png";
import tableImg from "../assets/other_items/Table.png";
import lampImg from "../assets/other_items/Lamp.png";
import walkieTalkiesImg from "../assets/other_items/Walkie-talkies.png";
import { useNavigate } from "react-router-dom";

const initialSelectedItems = [
  {
    id: 1,
    image: tentImg,
    name: "2-person tent",
    description:
      "A durable and waterproof tent that comfortably fits two people, perfect for a cozy camping shelter.",
    price: 1200,
    quantity: 1,
    selected: true,
  },
  {
    id: 2,
    image: sleepingBagImg,
    name: "Sleeping bags",
    description:
      "Soft, insulated sleeping bags designed to keep you warm and comfortable during chilly nights outdoors.",
    price: 1000,
    quantity: 1,
    selected: true,
  },
  {
    id: 3,
    image: gasImg,
    name: "Double gas stove",
    description:
      "A compact and portable double-burner gas stove, ideal for cooking meals easily at your campsite.",
    price: 1500,
    quantity: 1,
    selected: true,
  },
  {
    id: 4,
    image: chairImg,
    name: "Camping chair",
    description:
      "Lightweight yet sturdy chairs that offer back support and comfort while relaxing around the campsite.",
    price: 500,
    quantity: 1,
    selected: true,
  },
];

const initialOtherItems = [
  {
    id: 5,
    image: tableImg,
    name: "Folding table",
    description:
      "A collapsible table that's easy to set up and provides a stable surface for cooking, eating, or organizing gear.",
    price: 500,
    quantity: 1,
    selected: false,
  },
  {
    id: 6,
    image: lampImg,
    name: "Camping lanterns",
    description:
      "Bright, battery-powered lanterns that provide reliable lighting for your tent and nighttime activities.",
    price: 400,
    quantity: 1,
    selected: false,
  },
  {
    id: 7,
    image: walkieTalkiesImg,
    name: "Walkie-talkies",
    description:
      "Easy-to-use walkie-talkies for clear communication across distances, perfect for staying in touch while exploring.",
    price: 400,
    quantity: 1,
    selected: false,
  },
];

const SelectedIndividualRenter = () => {
  // Profile and reviews data
  const profile = {
    image: UpulImg,
    name: "Upul Fernando",
    location: "Bandarawela",
    rating: 4.8,
    reviewCount: 12,
    description: "Providing trusted gear since 2020.",
  };
  const [selectedItems, setSelectedItems] = useState(initialSelectedItems);
  const [otherItems, setOtherItems] = useState(initialOtherItems);
  const [startDate, setStartDate] = useState("June 20, 2025");
  const [endDate, setEndDate] = useState("June 26, 2025");
  const navigate = useNavigate();

  // Handle quantity change
  const handleQuantityChange = (id, newQty, isSelected) => {
    if (isSelected) {
      setSelectedItems((items) =>
        items.map((item) =>
          item.id === id ? { ...item, quantity: newQty } : item
        )
      );
    } else {
      setOtherItems((items) =>
        items.map((item) =>
          item.id === id ? { ...item, quantity: newQty } : item
        )
      );
    }
  };

  // Handle select/deselect item
  const handleSelect = (id, checked) => {
    if (checked) {
      // Move from otherItems to selectedItems
      const item = otherItems.find((i) => i.id === id);
      setOtherItems((items) => items.filter((i) => i.id !== id));
      setSelectedItems((items) => [...items, { ...item, selected: true }]);
    } else {
      // Move from selectedItems to otherItems
      const item = selectedItems.find((i) => i.id === id);
      setSelectedItems((items) => items.filter((i) => i.id !== id));
      setOtherItems((items) => [...items, { ...item, selected: false }]);
    }
  };

  // Calculate total price
  const totalPrice = selectedItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  // Reviews data
  const reviews = [
    {
      rating: 5,
      text: "The tent and sleeping bags were super clean and easy to set up. Great quality gear",
      name: "Mihil Layanaya",
      date: "12 May 2025",
    },
    {
      rating: 5,
      text: "All items were in excellent condition. The stove worked perfectly. Highly recommended.",
      name: "Danushka Priyadas",
      date: "19 May 2025",
    },
    {
      rating: 5,
      text: "Very organized renter. Got everything neatly packed and ready to go. Loved the folding table.",
      name: "Hashini Rangana",
      date: "26 May 2025",
    },
    {
      rating: 4,
      text: "Reliable and responsive. The lanterns were bright, and the chairs were really comfy.",
      name: "Kalana Jayathilake",
      date: "2 Jun 2025",
    },
    {
      rating: 4,
      text: "Walkie-talkies were a lifesaver during our trip. Everything worked as expected.",
      name: "Nuwani Taranga",
      date: "6 May 2025",
    },
    {
      rating: 5,
      text: "Best rental experience I've had. The gear was top-notch and well-maintained.",
      name: "Sahan Madushanka",
      date: "1 May 2025",
    },
  ];
  const averageRating = profile.rating;
  const reviewText =
    "His average rating reflects the overall satisfaction of customers based on the quality, cleanliness, and reliability of the rental equipment and service provided";

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Navbar />
      <main className="max-w-7xl mx-auto w-full px-4 pt-32 pb-16">
        {/* Two-column layout: Left = profile, items, rental period, reviews; Right = sticky map */}
        <div className="flex flex-col lg:flex-row gap-8 mb-10">
          <div className="mt-8" />
          {/* Left: Profile, Items */}
          <div className="flex-1">
            {/* Profile Section */}
            <div className="flex items-center gap-8 mb-8">
              <img
                src={profile.image}
                alt={profile.name}
                className="w-32 h-32 rounded-full object-cover border-4 border-cyan-100"
              />
              <div>
                <h2 className="text-4xl font-bold text-gray-900 mb-1">
                  {profile.name}
                </h2>
                <div className="flex gap-6 mb-2">
                  <div className="flex flex-col items-center">
                    <span className="text-lg font-bold text-gray-900">
                      {profile.reviewCount}
                    </span>
                    <span className="text-xs text-gray-500">Reviews</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="text-lg font-bold text-gray-900">
                      {profile.rating} ★
                    </span>
                    <span className="text-xs text-gray-500">Reviews</span>
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
                      {profile.location}
                    </span>
                  </div>
                </div>
                <div className="text-gray-600 text-base mt-2">
                  {profile.description}
                </div>
              </div>
            </div>
            {/* Items Section */}
            <div className="">
              <h3 className="text-lg font-bold mb-4 text-gray-900 mt-8">
                Items that you selected
              </h3>
              <div className="flex flex-col items-start w-full">
                {selectedItems.map((item) => (
                  <GearItemCard
                    key={item.id}
                    {...item}
                    onSelect={() => handleSelect(item.id, false)}
                    onQuantityChange={(qty) =>
                      handleQuantityChange(item.id, qty, true)
                    }
                    className="max-w-xl w-full"
                  />
                ))}
              </div>
            </div>
            <h3 className="text-lg font-bold mb-4 text-gray-900">
              Other Items
            </h3>
            <div className="flex flex-col items-start">
              {otherItems.map((item) => (
                <GearItemCard
                  key={item.id}
                  {...item}
                  onSelect={() => handleSelect(item.id, true)}
                  onQuantityChange={(qty) =>
                    handleQuantityChange(item.id, qty, false)
                  }
                  className="max-w-xl"
                />
              ))}
            </div>
            {/* Divider below gear list */}
            {/* <hr className="mt-8 mb-0 border-gray-200 max-w-7xl w-full" /> */}
          </div>
          {/* Right: Sticky Google Map (desktop) */}
          <div className="w-full lg:w-[400px] flex-shrink-0">
            <div className="sticky top-32 h-[500px] w-full rounded-2xl overflow-hidden shadow">
              <iframe
                title="Bandarawela, Sri Lanka"
                src="https://www.google.com/maps?q=Bandarawela,+Sri+Lanka&output=embed"
                width="100%"
                height="100%"
                style={{ border: 0, width: "100%", height: "100%" }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
            {/* Divider below map */}
            {/* <hr className="mt-8 mb-0 border-gray-200 max-w-7xl w-full" /> */}
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
                  <Calendar value={startDate} onChange={setStartDate} />
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
                  <Calendar value={endDate} onChange={setEndDate} />
                </div>
              </div>
            </div>
            <div className="bg-white rounded-2xl shadow p-6 h-max">
              <h3 className="text-lg font-bold mb-4 text-gray-900">
                Your Gear List
              </h3>
              <ul className="mb-4">
                {selectedItems.map((item) => (
                  <li
                    key={item.id}
                    className="flex justify-between items-center py-1"
                  >
                    <span>{item.name}</span>
                    <span className="font-semibold">
                      {item.price.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                      })}
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
              <Button
                size="md"
                variant="primary"
                className="w-full mt-4"
                onClick={() => navigate("/cart")}
              >
                Add To Cart
              </Button>
            </div>
          </div>
        </div>
        {/* Full-width Reviews Section */}
        <div className="max-w-7xl mx-auto w-full px-6" id="reviews">
          <RatingReviewSection
            averageRating={averageRating}
            reviewText={reviewText}
            reviews={reviews}
          />
        </div>
      </main>
      {/* Divider above footer */}
      <hr className="mt-8 mb-0 border-gray-200 max-w-7xl mx-auto w-full" />
      <Footer />
    </div>
  );
};

export default SelectedIndividualRenter;
