import React, { useState } from "react";

const faqData = [
  {
    section: "General Questions",
    items: [
      {
        question: "What is SkyCamp?",
        answer:
          "SkyCamp is a web-based platform designed to connect outdoor explorers with skilled service providers and locations. Users can discover destinations, rent camping equipment, hire local guides, and connect with like-minded campers through our Travel Buddy system.",
      },
      {
        question: "Who can use SkyCamp?",
        answer:
          "Anyone interested in camping or stargazing—whether you're booking, local service provider, or outdoor enthusiast, everyone is empowered on SkyCamp to join and start their outdoor journey.",
      },
      {
        question: "Is SkyCamp available only in Sri Lanka?",
        answer:
          "SkyCamp is focused exclusively on locations and service providers within Sri Lanka to provide tailored support to our island's best sites.",
      },
    ],
  },
  {
    section: "User Account & Registration",
    items: [
      {
        question: "Do I need an account to register on SkyCamp?",
        answer:
          "Yes, an account is required for features like booking equipment, leaving reviews and using the Travel Buddy system.",
      },
      {
        question: "How can I register on SkyCamp?",
        answer:
          "You can register as a customer or Service Provider by clicking on the 'Sign Up' button and filling out the required details.",
      },
      {
        question: "Is there any fee to create an account?",
        answer:
          "No, creating a SkyCamp account is completely free for both customers and service providers.",
      },
    ],
  },
  {
    section: "Service & Booking",
    items: [
      {
        question: "What services can I book through SkyCamp?",
        answer:
          "You can book: 1. Camping gear rentals 2. Local guides 3. Stargazing packages 4. Travel Buddy connections",
      },
      {
        question: "How do I book a service?",
        answer:
          "Once you log in, browse the available services and destinations. Choose your preferred service, check availability, and confirm your booking. With a single online payment, you're all set!",
      },
      {
        question: "Can I cancel or reschedule a booking?",
        answer:
          "You can cancel or reschedule a booking. Cancellation policies may vary based on the provider.",
      },
    ],
  },
  {
    section: "Payments & Security",
    items: [
      {
        question: "What payment methods are accepted?",
        answer:
          "SkyCamp accepts payments via Credit/Debit cards.",
      },
      {
        question: "Is my payment information safe?",
        answer:
          "Absolutely. SkyCamp uses SSL encryption and trusted third-party gateways to ensure all payment details are secure.",
      },
      {
        question: "Do I need to pay the full amount at the time of booking?",
        answer:
          "No. Only 50% of the total fee is paid during booking. The remaining amount can be settled upon the collection/service.",
      },
    ],
  },
  {
    section: "Travel Buddy System",
    items: [
      {
        question: "What is the Travel Buddy feature?",
        answer:
          "The Travel Buddy system allows campers to connect with others planning trips to the same destination at similar times. You can look for safe travelers seeking companionship, safety, and shared experiences.",
      },
      {
        question: "Is it safe to meet a Travel Buddy?",
        answer:
          "We recommend reviewing profiles, chatting through the platform, and taking necessary precautions. SkyCamp will introduce user ratings and verification badges to improve safety.",
      },
    ],
  },
  {
    section: "For Service Providers",
    items: [
      {
        question: "How can I offer my service on SkyCamp?",
        answer:
          "Register as a Service Provider, complete your profile, and start listing your gear, guide services, or packages. Each provider has access to custom dashboards for managing listings and bookings.",
      },
      {
        question: "Are there any fees for listing services?",
        answer:
          "Currently, listing is free.",
      },
      {
        question: "How do I get paid?",
        answer:
          "You’ll receive your earnings via bank transfer once the service is completed and confirmed by the customer.",
      },
    ],
  },
  {
    section: "Support",
    items: [
      {
        question: "How can I contact SkyCamp support?",
        answer:
          "You can reach us through by email ask@skycamp.com",
      },
      {
        question: "What if I face issues while booking a service?",
        answer:
          "Please report the issue through your account dashboard or to our email. We are committed to resolving disputes fairly and quickly.",
      },
    ],
  },
  {
    section: "Other Questions",
    items: [
      {
        question: "Can I suggest new destinations or features?",
        answer:
          "Absolutely! We love feedback. You can email us at ask@skycamp.com.",
      },
    ],
  },
];

export default function FAQSection() {
  const [open, setOpen] = useState({});

  const handleToggle = (sectionIdx, itemIdx) => {
    setOpen((prev) => ({
      ...prev,
      [`${sectionIdx}-${itemIdx}`]: !prev[`${sectionIdx}-${itemIdx}`],
    }));
  };

  return (
    <section className="w-full bg-white py-0 px-4 sm:px-8 md:px-16">
      <div className="max-w-3xl mx-auto">
        {faqData.map((section, sectionIdx) => (
          <div key={section.section} className="mb-12">
            <h2 className="text-center text-2xl md:text-3xl font-bold text-gray-900 mb-8">
              {section.section}
            </h2>
            <div className="space-y-4">
              {section.items.map((item, itemIdx) => (
                <div key={item.question}>
                  <button
                    className="w-full flex items-center justify-between py-4 px-6 bg-gray-50 rounded-lg shadow-sm hover:bg-gray-100 focus:outline-none transition-all"
                    onClick={() => handleToggle(sectionIdx, itemIdx)}
                    aria-expanded={!!open[`${sectionIdx}-${itemIdx}`]}
                  >
                    <span className="text-left text-base md:text-lg font-semibold text-gray-800">
                      {item.question}
                    </span>
                    <span className="ml-4 text-cyan-600 text-2xl font-bold">
                      {open[`${sectionIdx}-${itemIdx}`] ? "−" : "+"}
                    </span>
                  </button>
                  {open[`${sectionIdx}-${itemIdx}`] && (
                    <div className="pl-6 pr-2 pb-4 pt-2 text-gray-700 text-base md:text-lg animate-fade-in">
                      {item.answer}
                    </div>
                  )}
                </div>
              ))}
            </div>
            {sectionIdx !== faqData.length - 1 && (
              <hr className="my-12 border-gray-200" />
            )}
          </div>
        ))}
      </div>
    </section>
  );
} 