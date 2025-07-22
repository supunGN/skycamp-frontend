export default function AimSection() {
  return (
    <section className="py-16 px-4 bg-gray-50">
      <div className="container mx-auto max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Image */}
          <div className="relative">
            <img
              src="src\assets\about_us\people_camping.png"
              alt="Campers by lake"
              className="w-full h-96 object-cover rounded-lg"
            />
          </div>

          {/* Right Content */}
          <div className="space-y-8">
            <div>
              <h3 className="text-teal-600 text-lg font-semibold mb-4">Our Aim</h3>
              <div className="flex items-start space-x-3">
                <img src="src/assets/about_us/Check icon.png" alt="Check" className="w-5 h-5 mt-1 flex-shrink-0" />
                <p className="text-gray-700 text-base leading-relaxed">
                  To design and develop a user-friendly, responsive web platform that connects camping and stargazing
                  enthusiasts with reliable local service providers across Sri Lanka.
                </p>
              </div>
            </div>

            <div>
              <h3 className="text-teal-600 text-lg font-semibold mb-4">Our Objectives</h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <img src="src/assets/about_us/Check icon.png" alt="Check" className="w-5 h-5 mt-1 flex-shrink-0" />
                  <p className="text-gray-700 text-base leading-relaxed">
                    To empower campers by enabling them to find camping gear and guides either from their hometown or
                    near the chosen destination based on preference.
                  </p>
                </div>
                <div className="flex items-start space-x-3">
                  <img src="src/assets/about_us/Check icon.png" alt="Check" className="w-5 h-5 mt-1 flex-shrink-0" />
                  <p className="text-gray-700 text-base leading-relaxed">
                    To provide a sustainable digital marketplace for service providers to earn an income by renting
                    equipment or offering guide services.
                  </p>
                </div>
                <div className="flex items-start space-x-3">
                  <img src="src/assets/about_us/Check icon.png" alt="Check" className="w-5 h-5 mt-1 flex-shrink-0" />
                  <p className="text-gray-700 text-base leading-relaxed">
                    To introduce a Travel Buddy system that helps solo campers connect with fellow campers.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
