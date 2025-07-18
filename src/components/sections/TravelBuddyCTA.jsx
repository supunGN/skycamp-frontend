"use client";

import { Link } from "react-router-dom";
import Button from "../atoms/Button";
import buddyImage from "../../assets/travelbuddy/travel-buddy-cta.png";

export default function TravelBuddyCTA() {
  return (
    <section className="bg-white pt-20">
      <div className="max-w-7xl mx-auto flex flex-col-reverse lg:flex-row items-center justify-between gap-10 px-4 sm:px-6 lg:px-8">
        {/* Left Text Section */}
        <div className="flex-1 w-full text-center lg:text-left">
          <h2 className="text-3xl sm:text-5xl font-semibold leading-tight text-gray-900 mb-4">
            Is your backpack ready?
            <br />
            But your <span className="text-cyan-700">Buddy</span> missing?
          </h2>
          <p className="text-base text-gray-600 mb-6">
            Click here to meet your travel buddy
          </p>

          <div className="w-full flex justify-center lg:justify-start">
            <Link to="/connect" className="w-full lg:w-auto">
              <Button size="lg" variant="primary" className="w-full lg:w-auto">
                Connect
              </Button>
            </Link>
          </div>
        </div>

        {/* Right Image Section */}
        <div className="flex-1 w-full flex justify-center">
          <img
            src={buddyImage}
            alt="Lonely backpacker thinking of group"
            className="rounded-xl w-full max-w-md h-auto"
          />
        </div>
      </div>
    </section>
  );
}
