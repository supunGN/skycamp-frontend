import React from "react";

export default function PrivacyPolicySection() {
  return (
    <section className="w-full py-0.5 sm:py-1 md:py-1.5 lg:py-2 flex justify-center">
      <div className="w-full max-w-[98vw] sm:max-w-2xl md:max-w-3xl lg:max-w-3xl xl:max-w-2xl 2xl:max-w-2xl px-1 sm:px-2 md:px-3 lg:px-4 xl:px-5 space-y-10 text-[#535862] text-base sm:text-lg">
        {/* Privacy Policy Content (no heading) */}
        <div className="space-y-6 pt-2">
          <p className="leading-relaxed text-left">
            Welcome to SkyCamp. Your privacy is important to us. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website [insert URL], and your rights regarding that information.
          </p>
          <div className="space-y-3">
            <h3 className="font-semibold text-gray-900 text-left">Information We Collect</h3>
            <ul className="list-disc pl-5 sm:pl-6 space-y-1">
              <li>
                <span className="font-medium">Personal Information:</span> Name, email address, phone number, etc. and scanned copy of NIC and the location information if you register on our website as a service provider or if you prefer to use our travel buddy feature. These will be collected if you provide them voluntarily.
              </li>
              <li>
                <span className="font-medium">Usage Data:</span> Pages visited, time spent, browser type, IP address.
              </li>
              <li>
                <span className="font-medium">Cookies & Tracking Technologies:</span> For analytics and site functionality.
              </li>
            </ul>
          </div>
          <div className="space-y-3">
            <h3 className="font-semibold text-gray-900 text-left">How We Use Your Information</h3>
            <ul className="list-disc pl-5 sm:pl-6 space-y-1">
              <li>To improve and personalize your experience.</li>
              <li>Respond to your inquiries.</li>
              <li>Monitor website usage and trends.</li>
              <li>Comply with legal obligations.</li>
            </ul>
          </div>
          <div className="space-y-3">
            <h3 className="font-semibold text-gray-900 text-left">Sharing of Information</h3>
            <ul className="list-disc pl-5 sm:pl-6 space-y-1">
              <li>We do NOT sell your personal information. We may share it with:</li>
              <li>Service providers who help us operate the website.</li>
              <li>Be disclosed if required by law.</li>
            </ul>
          </div>
          <div className="space-y-3">
            <h3 className="font-semibold text-gray-900 text-left">Your Rights</h3>
            <ul className="list-disc pl-5 sm:pl-6 space-y-1">
              <li>Depending on your location, you may have rights such as:</li>
              <ul className="list-[lower-alpha] pl-7 sm:pl-10 space-y-1">
                <li>Accessing the personal data we hold.</li>
                <li>Requesting correction or deletion.</li>
                <li>Opting out of data collection.</li>
              </ul>
              <li>
                To exercise your rights, contact us at <a href="mailto:ask@skycamp.com" className="text-cyan-600 hover:underline">ask@skycamp.com</a>
              </li>
            </ul>
          </div>
          <div className="space-y-3">
            <h3 className="font-semibold text-gray-900 text-left">Security</h3>
            <p className="leading-relaxed">We take reasonable steps to protect your information, but no method of transmission over the Internet is 100% secure.</p>
          </div>
          <div className="space-y-3">
            <h3 className="font-semibold text-gray-900 text-left">Changes to This Policy</h3>
            <p className="leading-relaxed">We may update this policy occasionally. Updates will be posted on this page with the updated effective date.</p>
          </div>
        </div>

        {/* Divider before Payment Policy */}
        <hr className="my-2 border-t-2 border-gray-200 w-full" />

        {/* Payment Policy */}
        <div className="space-y-6">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 text-center">Payment Policy</h2>
          <p className="leading-relaxed text-left">Safe, Simple, and Transparent Transactions</p>
          <div className="space-y-3">
            <h3 className="font-semibold text-gray-900 text-left">Accepted Payment Methods</h3>
            <p className="leading-relaxed text-left">We accept payments through a secure third-party payment processor, including but not limited to (e.g., PayPal) or Credit/Debit Cards. By making a payment, you agree to the terms and conditions of the respective payment provider.</p>
          </div>
          <div className="space-y-3">
            <h3 className="font-semibold text-gray-900 text-left">Payment Security</h3>
            <p className="leading-relaxed text-left">All transactions are encrypted using industry-standard SSL (Secure Socket Layer) technology. We do not store or have access to your full credit card details. Payment information is securely handled by our third-party providers.</p>
          </div>
          <div className="space-y-3">
            <h3 className="font-semibold text-gray-900 text-left">Pricing and Taxes</h3>
            <p className="leading-relaxed text-left">All prices are listed in LKR and are inclusive/exclusive of applicable taxes, which will be clearly indicated at checkout. You are responsible for any local taxes or fees that may apply in Sri Lanka.</p>
          </div>
          <div className="space-y-3">
            <h3 className="font-semibold text-gray-900 text-left">Refunds and Cancellations</h3>
            <p className="leading-relaxed text-left">Refund eligibility varies based on the product or service purchased. Please refer to the specific refund terms provided at the point of sale or contact us directly for clarification. Refund requests can be made by either contacting the service providers or emailing <a href="mailto:ask@skycamp.com" className="text-cyan-600 hover:underline">ask@skycamp.com</a>.</p>
          </div>
          <div className="space-y-3">
            <h3 className="font-semibold text-gray-900 text-left">Disputes and Chargebacks</h3>
            <p className="leading-relaxed text-left">If you believe there has been an error in billing or you need to dispute a charge, please contact us at <a href="mailto:ask@skycamp.com" className="text-cyan-600 hover:underline">ask@skycamp.com</a> before initiating a chargeback. We are committed to resolving issues quickly and fairly.</p>
          </div>
        </div>

        {/* Divider before Cookies Policy */}
        <hr className="my-2 border-t-2 border-gray-200 w-full" />

        {/* Cookies Policy */}
        <div className="space-y-6">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 text-center">Cookies Policy</h2>
          <p className="leading-relaxed text-left">How We Use Cookies to Improve Your Experience</p>
          <div className="space-y-3">
            <h3 className="font-semibold text-gray-900 text-left">What Are Cookies?</h3>
            <p className="leading-relaxed text-left">Cookies are small text files stored on your device by your browser. They help us understand how you interact with our site and improve your experience.</p>
          </div>
          <div className="space-y-3">
            <h3 className="font-semibold text-gray-900 text-left">Types of Cookies We Use</h3>
            <ul className="list-disc pl-7 sm:pl-10 space-y-1 text-left">
              <li><span className="font-medium">Essential Cookies:</span> Necessary for the website to function.</li>
              <li><span className="font-medium">Analytics Cookies:</span> Help us understand how visitors use the site.</li>
              <li><span className="font-medium">Functional Cookies:</span> Enable additional functionality like saving preferences.</li>
            </ul>
          </div>
          <div className="space-y-3">
            <h3 className="font-semibold text-gray-900 text-left">Managing Cookies</h3>
            <ul className="list-disc pl-7 sm:pl-10 space-y-1 text-left">
              <li>Set your browser to refuse all or some cookies.</li>
              <li>Use browser settings to delete existing cookies.</li>
              <li>However, blocking some cookies may affect site performance.</li>
            </ul>
          </div>
          <div className="space-y-3">
            <h3 className="font-semibold text-gray-900 text-left">Third-Party Cookies</h3>
            <p className="leading-relaxed text-left">We may use third-party services (e.g., Google Analytics) that set their own cookies. These are governed by their own privacy policies.</p>
          </div>
          <div className="space-y-3">
            <h3 className="font-semibold text-gray-900 text-left">More Information</h3>
            <p className="leading-relaxed text-left">For more details, please contact us at <a href="mailto:ask@skycamp.com" className="text-cyan-600 hover:underline">ask@skycamp.com</a>.</p>
          </div>
        </div>
      </div>
    </section>
  );
} 