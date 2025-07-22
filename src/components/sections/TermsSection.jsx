export default function TermsSection() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32">
      <div className="container max-w-4xl px-4 md:px-6 mx-auto space-y-8 text-[#535862]">
        {" "}
        {/* Changed color here */}
        <p className="text-base leading-relaxed">
          SkyCamp is a web platform that connects campers and stargazers with local service providers across Sri Lanka.
          By using this site, users agree to the Terms and Conditions listed below.
        </p>
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-foreground">User Accounts and Responsibilities</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>Users must register with accurate and complete information.</li>
            <li>Passwords and login credentials are the user&apos;s responsibility.</li>
            <li>Users must not misuse or attempt to disrupt the platform.</li>
            <li>Service providers must submit valid ID for verification during registration.</li>
            <li>Verified providers are allowed to offer rentals or guide services.</li>
          </ul>
        </div>
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-foreground">Travel Buddy Option (User&apos;s Choice & Security)</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>The Travel Buddy feature is completely optional.</li>
            <li>During registration, we ask whether the user wants to use this feature.</li>
            <li>If the answer is yes, the user must upload a scanned copy of their national ID.</li>
            <li>
              SkyCamp securely stores these IDs only for security purposes, especially if a police inquiry arises due to
              any serious incident. This is the only support SkyCamp can provide in such cases.
            </li>
            <li>Users must agree to these terms before activating Travel Buddy.</li>
          </ul>
        </div>
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-foreground">Chat Behavior and Reporting</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>Chat between Travel Buddy users must be respectful.</li>
            <li>Misleading, harmful, sexual, or abusive content is strictly prohibited.</li>
            <li>
              If a user receives such messages, they may report the incident by emailing ask@skycamp.com with
              screenshots or proof.
            </li>
            <li>Verified complaints will result in permanent removal of the offender from the platform.</li>
          </ul>
        </div>
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-foreground">ID Verification for Service Providers</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>All equipment renters and guides must upload their scanned ID at registration.</li>
            <li>Our team will verify these IDs within 2 business days.</li>
            <li>
              Only after verification will the service provider be able to fully use the platform and accept bookings.
            </li>
          </ul>
        </div>
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-foreground">Booking and Payments</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              Customers can:
              <ul className="list-[lower-alpha] pl-6 space-y-1 mt-1">
                <li>Book a full rental package.</li>
                <li>Customize item selection within a package.</li>
              </ul>
            </li>
            <li>A 50% advance payment must be made online through the SkyCamp system.</li>
            <li>
              The remaining 50% must be paid directly to the provider, and SkyCamp does not handle or guarantee this
              payment.
            </li>
          </ul>
        </div>
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-foreground">Delivery Disclaimer</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>SkyCamp does not offer item delivery services.</li>
            <li>
              After booking, customers must contact the service provider directly to discuss:
              <ul className="list-[lower-alpha] pl-6 space-y-1 mt-1">
                <li>Delivery</li>
                <li>Pickup arrangements</li>
              </ul>
            </li>
            <li>
              Delivery is handled solely by the service provider, and SkyCamp is not responsible for any issues related
              to it.
            </li>
          </ul>
        </div>
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-foreground">Cancellations and Refunds</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>Customers can cancel their booking using the cancellation option available on the SkyCamp platform.</li>
            <li>However, SkyCamp does not handle or process any refunds.</li>
            <li>
              If a refund is expected, the customer must directly discuss and come to an agreement with the service
              provider.
            </li>
            <li>
              The platform only facilitates the cancellation request; all refund-related decisions are made between the
              customer and the provider.
            </li>
            <li>SkyCamp is not responsible for refund amounts, methods, or timing.</li>
          </ul>
        </div>
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-foreground">Reviews and Ratings</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>Only verified customers can leave reviews.</li>
            <li>Reviews must be respectful, based on actual experience, and limited to one per booking.</li>
            <li>
              Customers can view service providers&apos; ratings, item photos, and other users&apos; feedback before
              selecting a provider.
            </li>
          </ul>
        </div>
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-foreground">Privacy</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>ID uploads and user data are stored securely.</li>
            <li>We only share ID details if required for legal inquiries.</li>
            <li>Please review our [Privacy and Cookies Policy] for full information.</li>
          </ul>
        </div>
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-foreground">Account Violations and Removal</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              Accounts can be suspended for:
              <ul className="list-[lower-alpha] pl-6 space-y-1 mt-1">
                <li>Repeated policy violations</li>
                <li>Misuse of the chat feature</li>
                <li>Submitting fake or misleading content.</li>
              </ul>
            </li>
            <li>
              Admins may issue warnings or remove accounts without prior notice based on the severity of the issue.
            </li>
          </ul>
        </div>
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-foreground">Limitation of Liability</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              SkyCamp is not liable for:
              <ul className="list-[lower-alpha] pl-6 space-y-1 mt-1">
                <li>Any physical, financial, or emotional harm caused by users or providers.</li>
                <li>Misuse of personal information during Travel Buddy meetings.</li>
                <li>Failed or unsatisfactory services offered by third-party providers.</li>
              </ul>
            </li>
          </ul>
        </div>
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-foreground">Terms Updates</h2>
          <p className="text-base leading-relaxed">
            SkyCamp may revise these Terms from time to time. Continued use of the site indicates your acceptance of any
            updates.
          </p>
        </div>
      </div>
    </section>
  )
}
