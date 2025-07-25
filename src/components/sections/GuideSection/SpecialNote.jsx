import React from "react";

const SpecialNote = ({ note }) => (
  <section className="bg-gray-100 rounded-xl p-6 mt-6">
    <div className="font-bold text-lg mb-2">Special note</div>
    <div className="text-gray-700 text-base leading-relaxed">{note || "Special note goes here."}</div>
  </section>
);

export default SpecialNote; 