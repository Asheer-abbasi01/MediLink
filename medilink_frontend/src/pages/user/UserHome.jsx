import { useNavigate } from "react-router-dom";

const UserHome = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-6">
      <h1 className="text-4xl font-bold text-indigo-600 mb-4">
        Welcome to MediLink
      </h1>
      <p className="text-gray-600 text-lg mb-8">
        Manage your health easily. Choose an option below:
      </p>

      <div className="flex gap-6">
        <button
          onClick={() => navigate("/user/appointment")}
          className="px-8 py-4 bg-indigo-600 text-white rounded-xl text-lg shadow hover:bg-indigo-700 transition"
        >
          Book Appointment
        </button>

        <button
          onClick={() => navigate("/user/medicine")}
          className="px-8 py-4 bg-green-600 text-white rounded-xl text-lg shadow hover:bg-green-700 transition"
        >
          Buy Medicine
        </button>
      </div>
    </div>
  );
};

export default UserHome;
