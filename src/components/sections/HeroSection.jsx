"use client";

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import Button from "../atoms/Button";

import slide1 from "../../assets/hero/slide1.png";
import slide2 from "../../assets/hero/slide2.png";
import slide3 from "../../assets/hero/slide3.png";
import slide4 from "../../assets/hero/slide4.png";
import slide5 from "../../assets/hero/slide5.png";

const heroSlides = [
  {
    id: 1,
    title: "Connecting Campers, Stargazers, and Service Providers",
    subtitle: "About SkyCamp",
    description:
      "SkyCamp is your one-stop platform to discover destinations, rent gear, hire guides, and connect with fellow explorers",
    buttonText: "Explore SkyCamp",
    backgroundImage: slide1,
    link: "/about",
  },
  {
    id: 2,
    title: "Camping Destinations & Stargazing Spots",
    subtitle: "Discover Hidden Nature & Starry Skies",
    description:
      "Explore top camping and stargazing locations in Sri Lanka for unforgettable nights and peaceful outdoor experiences.",
    buttonText: "Browse Destinations",
    backgroundImage: slide2,
    link: "/destinations",
  },
  {
    id: 3,
    title: "Find Equipments",
    subtitle: "Rent Camping Gear Easily",
    description:
      "Browse trusted service providers and rent high-quality tents, lights, cooking gear, and more. No need to own everything",
    buttonText: "View Rentals",
    backgroundImage: slide3,
    link: "/rentals",
  },
  {
    id: 4,
    title: "Hire a Guide",
    subtitle: "Explore Safely with Local Experts",
    description:
      "Connect with experienced local guides who know the best trails, hidden spots, and safety tips for your adventure.",
    buttonText: "Find Guides",
    backgroundImage: slide4,
    link: "/guides",
  },
  {
    id: 5,
    title: "Travel Buddy",
    subtitle: "Find a Buddy to Camp With",
    description:
      "Don’t travel alone. Match with like-minded campers heading to similar destinations on the same dates",
    buttonText: "Find Travel Buddy",
    backgroundImage: slide5,
    link: "/travel-buddy",
  },
];

export default function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const goToSlide = (index) => setCurrentSlide(index);
  const goToPrevious = () =>
    setCurrentSlide(
      (prev) => (prev - 1 + heroSlides.length) % heroSlides.length
    );
  const goToNext = () =>
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);

  return (
    <section className="relative h-screen overflow-hidden">
      {/* Background */}
      {heroSlides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === currentSlide ? "opacity-100 z-10" : "opacity-0 z-0"
          }`}
        >
          <img
            src={slide.backgroundImage}
            alt={slide.title}
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-black bg-opacity-50" />
        </div>
      ))}

      {/* Text Content */}
      <div className="relative z-20 h-full flex flex-col justify-center max-w-7xl mx-auto w-full">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="mb-4">
              <span className="text-white text-md font-semibold opacity-90">
                {heroSlides[currentSlide].subtitle}
              </span>
            </div>
            <h1 className="text-white text-4xl sm:text-5xl md:text-6xl font-semibold leading-tight mb-6">
              {heroSlides[currentSlide].title}
            </h1>
            <p className="text-white text-lg sm:text-xl leading-relaxed mb-8 opacity-90 max-w-2xl">
              {heroSlides[currentSlide].description}
            </p>
            <Link
              to={heroSlides[currentSlide].link}
              className="w-full lg:w-auto"
            >
              <Button
                size="lg"
                variant="primary"
                className="text-lg w-full lg:w-auto"
              >
                {heroSlides[currentSlide].buttonText}
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Arrows and Dots */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-30 flex items-center space-x-4">
        <button
          onClick={goToPrevious}
          className="bg-black/30 hover:bg-black/50 text-white p-3 rounded-full transition"
          aria-label="Previous"
        >
          <ChevronLeftIcon className="w-6 h-6" />
        </button>
        <div className="flex space-x-2">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-2 h-2 rounded-full transition ${
                currentSlide === index
                  ? "bg-white"
                  : "bg-white/40 hover:bg-white/70"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
        <button
          onClick={goToNext}
          className="bg-black/30 hover:bg-black/50 text-white p-3 rounded-full transition"
          aria-label="Next"
        >
          <ChevronRightIcon className="w-6 h-6" />
        </button>
      </div>

      {/* Progress Bar */}
      <div className="absolute bottom-0 left-0 w-full h-1 bg-black/20 z-30">
        <div
          className="h-full bg-cyan-600 transition-all duration-500"
          style={{
            width: `${((currentSlide + 1) / heroSlides.length) * 100}%`,
          }}
        />
      </div>
    </section>
  );
}
