import React from "react";
import hosp1 from "../assets/Hospital/hos1.jpg";
import hosp2 from "../assets/Hospital/hos2.jpg";
import hosp3 from "../assets/Hospital/hos3.jpg";
import hosp4 from "../assets/Hospital/hos4.jpg";

export default function Hospitals() {
  const hospitals = [
    { img: hosp1, name: "City Care Hospital", location: "Islamabad" },
    { img: hosp2, name: "Green Valley Hospital", location: "Lahore" },
    { img: hosp3, name: "MediHealth Center", location: "Karachi" },
    { img: hosp4, name: "Royal Hospital", location: "Peshawar" },
    // Add more hospitals if needed
  ];

  return (
    <div className="w-full flex flex-col items-center bg-slate-50 text-slate-800 min-h-screen">

      {/* Page Header */}
      <section className="w-full bg-white py-16 shadow-sm">
        <h1 className="text-4xl md:text-5xl font-bold text-blue-700 text-center">
          Our Hospitals
        </h1>
        <p className="text-slate-600 mt-4 text-center max-w-2xl mx-auto text-lg">
          Explore our verified hospitals across Pakistan. Access departments, facilities, and book appointments easily.
        </p>
      </section>

      {/* Search / Filter */}
      <section className="w-full max-w-6xl px-6 mt-12">
        <div className="flex flex-col md:flex-row items-center gap-4">
          <input
            type="text"
            placeholder="Search by hospital name or location"
            className="w-full md:w-1/2 px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button className="bg-blue-600 text-white px-6 py-3 rounded-xl shadow hover:bg-blue-700 transition">
            Search
          </button>
        </div>
      </section>

      {/* Hospitals Grid */}
      <section className="w-full max-w-6xl px-6 py-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {hospitals.map((hosp, index) => (
          <div
            key={index}
            className="bg-white rounded-2xl shadow-md hover:shadow-xl transition overflow-hidden border border-slate-200"
          >
            <img
              src={hosp.img}
              alt={hosp.name}
              className="w-full h-64 object-cover"
            />
            <div className="p-6 text-center">
              <h3 className="text-xl font-semibold text-blue-700">{hosp.name}</h3>
              <p className="text-slate-600 mt-1">{hosp.location}</p>
              <button className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-xl shadow hover:bg-blue-700 transition">
                View Details
              </button>
            </div>
          </div>
        ))}
      </section>

      {/* CTA Section */}
      <section className="w-full bg-blue-700 py-16 text-white text-center">
        <h2 className="text-3xl font-bold mb-4">Need Healthcare Assistance?</h2>
        <p className="text-white mb-6 max-w-2xl mx-auto text-lg">
          Connect with top hospitals and medical facilities across Pakistan for quick and reliable healthcare services.
        </p>
        <button className="bg-white text-blue-700 font-bold px-10 py-4 rounded-xl shadow hover:bg-gray-100 transition">
          Find Hospitals
        </button>
      </section>

    </div>
  );
}
