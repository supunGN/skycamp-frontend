import React, { useState } from "react";
import Navbar from "../components/organisms/Navbar";
import Footer from "../components/organisms/Footer";
import { Input } from "../components/molecules/Input";
import Button from "../components/atoms/Button";
import { EnvelopeIcon, PhoneIcon } from "@heroicons/react/24/outline";

export default function ContactUs() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: handle form submission (API call or email)
    alert("Message sent! (Demo only)");
    setForm({ name: "", email: "", phone: "", message: "" });
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      <main className="flex-1 flex w-full h-full min-h-screen">
        {/* Left: Form */}
        <div className="flex flex-col justify-center w-full lg:w-1/2 mt-24 mx-auto max-w-sm sm:max-w-md px-4 md:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Get in Touch
          </h2>
          <p className="text-gray-600 mb-8 max-w-md">
            We’d love to hear from you, whether it’s a question, idea, or a
            little hello! Reach out anytime.
          </p>
          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Name
              </label>
              <Input
                id="name"
                name="name"
                type="text"
                placeholder="Enter your full name"
                value={form.name}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Email
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="Enter your mail"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label
                htmlFor="phone"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Phone Number
              </label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                placeholder="Enter your phone number"
                value={form.phone}
                onChange={handleChange}
              />
            </div>
            <div>
              <label
                htmlFor="message"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Message
              </label>
              <textarea
                id="message"
                name="message"
                rows={5}
                placeholder="Type your message..."
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-600 focus-visible:ring-offset-2 resize-none"
                value={form.message}
                onChange={handleChange}
                required
              />
            </div>
            <Button type="submit" size="md" className="w-full mt-2">
              Send message
            </Button>
          </form>
          {/* Info Section (below form on mobile, right on desktop) */}
          <div className="block lg:hidden mt-10">
            <ContactInfo />
          </div>
        </div>
        {/* Right: Image and Info */}
        <div className="hidden lg:flex flex-col w-1/2 h-screen overflow-hidden relative">
          <img
            src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=900&q=80"
            alt="Night landscape"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-black bg-opacity-70" />
          <div className="absolute inset-0 z-10 flex flex-col justify-center h-full px-8 py-12 text-white">
            <ContactInfo />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

function ContactInfo() {
  return (
    <>
      <h3 className="text-lg font-semibold mb-4">Response Time</h3>
      <p className="text-sm mb-6">
        We respond to submissions between 10:00 a.m. and 4:00 p.m. daily.
        <br />
        Our team will reply via email within a few hours during this time.
        Messages sent outside these hours may be answered the next day.
      </p>
      <h3 className="text-lg font-semibold mb-2">Email</h3>
      <p className="text-sm mb-2 flex items-center gap-2">
        <EnvelopeIcon className="w-5 h-5 text-cyan-400 inline-block" />
        <a
          href="mailto:ask@skycamp.com"
          className="text-cyan-300 underline hover:text-cyan-200"
        >
          ask@skycamp.com
        </a>
        <EnvelopeIcon className="w-5 h-5 text-cyan-400 inline-block ml-4" />
        <a
          href="mailto:info@skycamp.com"
          className="text-cyan-300 underline hover:text-cyan-200"
        >
          info@skycamp.com
        </a>
      </p>
      <h3 className="text-lg font-semibold mt-6 mb-2">Phone</h3>
      <p className="text-sm mb-1">(For urgent inquiries only)</p>
      <p className="text-sm mb-2">
        Please use this number only for time-sensitive or emergency situations
        related to your booking.
        <br />
        <span className="flex items-center gap-2 mt-1">
          <PhoneIcon className="w-5 h-5 text-cyan-400 inline-block" />
          <a
            href="tel:+94761234567"
            className="text-cyan-300 underline hover:text-cyan-200 font-semibold"
          >
            +94 76 123 4567
          </a>
        </span>
      </p>
    </>
  );
}
