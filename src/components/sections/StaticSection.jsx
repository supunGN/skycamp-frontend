import React from "react";

export default function StaticSection({ heading, paragraph }) {
  return (
    <section className="w-full overflow-hidden bg-gradient-to-r from-[#66C4D0] via-[#DAFFFC] to-[#66C4D0] pt-32 pb-24 px-4 sm:px-8 md:px-12">
      <div className="max-w-6xl mx-auto text-center flex flex-col items-center">
        {paragraph && (
          <p className="text-cyan-700 text-base sm:text-lg font-medium">
            {paragraph}
          </p>
        )}
        {heading && (
          <h1 className="text-gray-900 text-3xl sm:text-4xl md:text-5xl font-bold leading-tight">
            {heading}
          </h1>
        )}
      </div>
    </section>
  );
}
