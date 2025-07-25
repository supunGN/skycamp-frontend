import React from "react";
import { MdLocationOn, MdPhone, MdEmail, MdLanguage, MdAttachMoney } from "react-icons/md";

const GuideBioSection = ({ guide }) => (
  <section className="w-full">
    <p className="text-gray-700 text-base mb-5 leading-relaxed">{guide?.bio || "Guide bio goes here."}</p>
    <ul className="space-y-2">
      <li className="flex items-center text-gray-800"><MdLocationOn className="w-5 h-5 mr-2" />{guide?.address || "Address"}</li>
      <li className="flex items-center text-gray-800"><MdPhone className="w-5 h-5 mr-2" />{guide?.phone || "Phone"}</li>
      <li className="flex items-center text-gray-800"><MdEmail className="w-5 h-5 mr-2" />{guide?.email || "Email"}</li>
      <li className="flex items-center text-gray-800"><MdLanguage className="w-5 h-5 mr-2" />{(guide?.languages || []).join(", ") || "Languages"}</li>
      <li className="flex items-center text-gray-800"><MdAttachMoney className="w-5 h-5 mr-2" />Accepted Currency: {guide?.currency || "Currency"}</li>
    </ul>
  </section>
);

export default GuideBioSection; 