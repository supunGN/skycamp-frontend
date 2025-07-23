import { Shield, Heart, Lightbulb, Users, Zap, Leaf } from "lucide-react"

export default function CoreValuesSection() {
  const values = [
    {
      icon: Shield,
      title: "Integrity",
      description:
        "We always strive to do the right thing, even when no one is watching. Honesty, accountability, and transparency are at the heart of our actions. We believe that trust is built through consistency and staying true to our promises, whether working with our team or supporting our community.",
    },
    {
      icon: Heart,
      title: "Empathy",
      description:
        "We value human connection and understanding. Listening to others, respecting different perspectives, and showing kindness are all part of who we are. Empathy helps us build stronger relationships, support those in need, and create a community where everyone feels heard and appreciated.",
    },
    {
      icon: Lightbulb,
      title: "Innovation",
      description:
        "We embrace creativity and are always open to new ideas. Whether we're solving problems or improving our work, we aim to think outside the box and bring fresh perspectives. We believe that innovation drives growth and helps us stay relevant in an ever-changing world.",
    },
    {
      icon: Users,
      title: "Teamwork",
      description:
        "Together, we can achieve more. We believe in the power of collaboration, mutual support, and shared success. Every voice matters in our team, and we work together to inspire one another, overcome challenges, and celebrate our achievements as a group.",
    },
    {
      icon: Zap,
      title: "Empowerment",
      description:
        "SkyCamp empowers small and emerging service providers by offering a digital space to promote their services and reach new customers. We aim to nurture local talent, helping them grow, connect, and thrive in the outdoor adventure community across Sri Lanka.",
    },
    {
      icon: Leaf,
      title: "Sustainability",
      description:
        "At SkyCamp, we value nature and are committed to protecting it. We promote eco-friendly choices and encourage responsible camping. For us, sustainability means we don't just take a day—it's a lifestyle that ensures future generations can enjoy the beauty of Sri Lanka.",
    },
  ]

  return (
    <section className="py-16 px-4 bg-white">
      <div className="container mx-auto max-w-7xl">
        <div className="mb-12">
          <p className="text-teal-600 text-sm font-medium mb-2">Guiding Principles That Shape Who We Are</p>
          <h2 className="text-3xl font-bold text-gray-900">Our Core Values</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {values.map((value, index) => {
            const IconComponent = value.icon
            return (
              <div key={index} className="space-y-4">
                <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center">
                  <IconComponent className="text-teal-600" size={32} />
                </div>
                <h3 className="text-xl font-semibold text-gray-900">{value.title}</h3>
                <p className="text-gray-600 leading-relaxed text-sm text-left">{value.description}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
