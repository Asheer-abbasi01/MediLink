import { useNavigate } from "react-router-dom";

const UserHome = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-6">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-teal-700 mb-4">
          Welcome Back, {user.name || "User"}
        </h1>
        <p className="text-gray-600 text-lg">
          Manage your health journey with MediLink
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl w-full">
        {/* Book Appointment Card */}
        <div
          onClick={() => navigate("/doctors")}
          className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all cursor-pointer group border border-gray-100 hover:border-teal-100"
        >
          <div className="w-16 h-16 bg-teal-100 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
            <svg className="w-8 h-8 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <h3 className="text-2xl font-bold text-gray-800 mb-3 group-hover:text-teal-600 transition-colors">Book Appointment</h3>
          <p className="text-gray-500">Find the right doctor and schedule your visit in seconds.</p>
        </div>

        {/* My Appointments Card */}
        <div
          onClick={() => navigate("/user/appointments")}
          className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all cursor-pointer group border border-gray-100 hover:border-blue-100"
        >
          <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
            <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
            </svg>
          </div>
          <h3 className="text-2xl font-bold text-gray-800 mb-3 group-hover:text-blue-600 transition-colors">My Appointments</h3>
          <p className="text-gray-500">View upcoming visits, check history, and manage cancellations.</p>
        </div>

        {/* Buy Medicine Card */}
        <div
          onClick={() => navigate("/medicines")}
          className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all cursor-pointer group border border-gray-100 hover:border-green-100"
        >
          <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
            </svg>
          </div>
          <h3 className="text-2xl font-bold text-gray-800 mb-3 group-hover:text-green-600 transition-colors">Buy Medicine</h3>
          <p className="text-gray-500">Order your prescriptions and health products online.</p>
        </div>
      </div>
    </div>
  );
};

export default UserHome;
