export default function StaticSection() {
  return (
    <section
      className="relative w-full h-72 overflow-hidden opacity-100"
      style={{
        background: "linear-gradient(90deg, #66C4D0 0%, #DAFFFC 50%, #66C4D0 100%)",
        paddingTop: "96px",
        paddingBottom: "96px",
      }}
    >
      {/* Content */}
      <div className="relative z-10 container mx-auto text-center flex flex-col items-center justify-center h-full gap-0">
        <p className="text-cyan-700 text-lg font-medium">About SkyCamp</p>
        <h1 className="text-gray-900 text-[48px] font-bold">About Us</h1>
      </div>
    </section>
  )
}
