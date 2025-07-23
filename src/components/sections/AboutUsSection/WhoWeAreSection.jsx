export default function WhoWeAreSection() {
  return (
    <section className="py-16 px-4 bg-white">
      <div className="container mx-auto max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-4">
            <p className="text-teal-600 text-sm font-medium">Get to know us</p>
            <h2 className="text-3xl font-bold text-gray-900 leading-tight">Wondering Who We Are?</h2>
            <p className="text-gray-600 text-base leading-relaxed">
              SkyCamp is a web-based platform that connects campers and stargazers with trusted local service providers
              across Sri Lanka. We make outdoor adventures easier by offering gear rentals, guide bookings, and a unique
              Travel Buddy system , all in one place. Our goal is to create safe, enjoyable, and memorable camping
              experiences for everyone.
            </p>
          </div>

          {/* Right Single Image */}
          <div className="relative">
            <img
              src="src/assets/about_us/Contents.png"
              alt="Camping and outdoor activities collage"
              className="w-full h-96 object-cover rounded-lg"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
