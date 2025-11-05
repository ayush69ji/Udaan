import { useNavigate } from "react-router-dom";
import { BookOpen, Briefcase, Users, LogIn } from "lucide-react";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="w-full flex flex-col bg-gradient-to-bottom-right from-blue-50 via-white to-blue-100 overflow-x-hidden overflow-y-auto">

      {/* Navbar */}
      <nav className="flex justify-between items-center px-8 py-4 bg-white shadow-md border-b border-blue-100 w-full">
        <h1 className="text-2xl font-bold text-blue-700">Udaan Portal</h1>
        <div className="space-x-3">
          <button
            onClick={() => navigate("/student/login")}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition shadow-sm"
          >
            Student Login
          </button>
          <button
            onClick={() => navigate("/admin/login")}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition shadow-sm"
          >
            Admin Login
          </button>
          <button
            onClick={() => navigate("/recruiter/login")}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition shadow-sm"
          >
            Recruiter Login
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center grow text-center px-6 md:px-10">
        <h2 className="text-4xl md:text-5xl font-extrabold text-gray-800 leading-snug">
          Empowering Students, <br /> Connecting Recruiters, <br /> Managed by Admins.
        </h2>
        <p className="mt-4 text-lg text-gray-600 max-w-2xl">
          Udaan is your one-stop platform for learning, hiring, and management — all in one place.
        </p>

        <div className="mt-8 flex flex-wrap gap-4 justify-center">
          <button
            onClick={() => navigate("/student/login")}
            className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg text-lg hover:bg-blue-700 transition transform hover:scale-105 shadow-md"
          >
            <LogIn size={20} /> Student Portal
          </button>
          <button
            onClick={() => navigate("/admin/login")}
            className="flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg text-lg hover:bg-green-700 transition transform hover:scale-105 shadow-md"
          >
            <LogIn size={20} /> Admin Panel
          </button>
          <button
            onClick={() => navigate("/recruiter/login")}
            className="flex items-center gap-2 bg-purple-600 text-white px-6 py-3 rounded-lg text-lg hover:bg-purple-700 transition transform hover:scale-105 shadow-md"
          >
            <LogIn size={20} /> Recruiter Hub
          </button>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-white shadow-inner border-t border-gray-100 w-full">
        <h3 className="text-3xl font-bold text-center text-gray-800 mb-10">
          Why Choose Udaan?
        </h3>
        <div className="grid md:grid-cols-3 gap-8 px-6 sm:px-10 max-w-6xl mx-auto">
          <div className="bg-blue-50 p-6 rounded-2xl text-center shadow hover:shadow-xl transition transform hover:-translate-y-1">
            <BookOpen className="w-12 h-12 text-blue-600 mx-auto mb-4" />
            <h4 className="text-xl font-semibold mb-2 text-gray-800">Learn & Grow</h4>
            <p className="text-gray-600">
              Access study materials, track your progress, and build new skills seamlessly.
            </p>
          </div>
          <div className="bg-green-50 p-6 rounded-2xl text-center shadow hover:shadow-xl transition transform hover:-translate-y-1">
            <Briefcase className="w-12 h-12 text-green-600 mx-auto mb-4" />
            <h4 className="text-xl font-semibold mb-2 text-gray-800">Get Hired</h4>
            <p className="text-gray-600">
              Recruiters can find top-performing students and post great opportunities easily.
            </p>
          </div>
          <div className="bg-purple-50 p-6 rounded-2xl text-center shadow hover:shadow-xl transition transform hover:-translate-y-1">
            <Users className="w-12 h-12 text-purple-600 mx-auto mb-4" />
            <h4 className="text-xl font-semibold mb-2 text-gray-800">Manage Efficiently</h4>
            <p className="text-gray-600">
              Admins can oversee users, courses, and placements from one sleek dashboard.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-6 bg-blue-900 text-white text-center text-sm mt-auto w-full">
        © {new Date().getFullYear()} <span className="font-semibold">Udaan Portal</span> — All rights reserved.
      </footer>
    </div>
  );
};

export default Home;
