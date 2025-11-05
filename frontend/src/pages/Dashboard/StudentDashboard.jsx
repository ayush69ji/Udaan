import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { BookOpen, Briefcase, LogOut, User, FileText } from "lucide-react";

const StudentDashboard = () => {
  const [student, setStudent] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          window.location.href = "/student/login";
          return;
        }

        const { data } = await axios.get("http://localhost:5000/api/student/dashboard", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setStudent(data.student);
        setJobs(data.courses || []);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching student dashboard:", error);
        localStorage.removeItem("token");
        window.location.href = "/student/login";
      }
    };

    fetchDashboardData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/student/login";
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1 }}
          className="text-blue-600 text-3xl font-semibold"
        >
          Loading...
        </motion.div>
      </div>
    );
  }

  if (!student) return null;

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100 p-8">
      {/* Top Bar */}
      <div className="max-w-6xl mx-auto flex justify-between items-center mb-8">
        <div className="flex items-center space-x-3">
          <User className="text-indigo-600 w-8 h-8" />
          <h1 className="text-2xl font-semibold text-gray-800">
            Welcome, {student.name}
          </h1>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center space-x-2 bg-red-500 text-white px-4 py-2 rounded-xl hover:bg-red-600 transition"
        >
          <LogOut className="w-5 h-5" />
          <span>Logout</span>
        </button>
      </div>

      {/* Stats Section */}
      <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-6 mb-8">
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="bg-white p-5 rounded-xl shadow border-l-4 border-blue-500"
        >
          <h2 className="text-gray-600 text-sm">Total Jobs</h2>
          <p className="text-2xl font-bold text-gray-800">{jobs.length}</p>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.05 }}
          className="bg-white p-5 rounded-xl shadow border-l-4 border-green-500"
        >
          <h2 className="text-gray-600 text-sm">Applied Jobs</h2>
          <p className="text-2xl font-bold text-gray-800">2</p>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.05 }}
          className="bg-white p-5 rounded-xl shadow border-l-4 border-yellow-500"
        >
          <h2 className="text-gray-600 text-sm">Shortlisted</h2>
          <p className="text-2xl font-bold text-gray-800">1</p>
        </motion.div>
      </div>

      {/* Job Listings */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-6xl mx-auto bg-white rounded-2xl shadow-lg p-6 mb-10"
      >
        <div className="flex items-center mb-6 space-x-3">
          <Briefcase className="text-indigo-500 w-6 h-6" />
          <h2 className="text-xl font-semibold text-gray-800">Active Job Openings</h2>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {jobs.length > 0 ? (
            jobs.map((job, index) => (
              <motion.div
                key={job._id || index}
                whileHover={{ scale: 1.03 }}
                className="bg-linear-to-br from-indigo-50 to-blue-50 border border-gray-200 rounded-xl shadow p-5"
              >
                <div className="flex items-center mb-3 space-x-3">
                  <Briefcase className="text-indigo-600 w-6 h-6" />
                  <h2 className="text-lg font-semibold text-gray-800">{job.title}</h2>
                </div>
                <p className="text-gray-600 mb-2"><strong>Company:</strong> {job.company}</p>
                <p className="text-gray-700 mb-3">{job.description}</p>
                <p className="text-gray-500 text-sm"><strong>Eligibility:</strong> {job.eligibility}</p>
                <p className="text-gray-500 text-sm"><strong>Last Date:</strong> {job.lastDate}</p>
                <button className="mt-4 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition">
                  Apply Now
                </button>
              </motion.div>
            ))
          ) : (
            <p className="text-gray-500 text-lg text-center col-span-2">
              No active job listings found.
            </p>
          )}
        </div>
      </motion.div>

      {/* Applications Section */}
      <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-lg p-6">
        <div className="flex items-center mb-6 space-x-3">
          <FileText className="text-green-600 w-6 h-6" />
          <h2 className="text-xl font-semibold text-gray-800">My Applications</h2>
        </div>
        <p className="text-gray-500 text-center">You haven’t applied to any jobs yet.</p>
      </div>
    </div>
  );
};

export default StudentDashboard;
