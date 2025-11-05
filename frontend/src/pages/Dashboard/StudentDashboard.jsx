import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { BookOpen, Briefcase } from "lucide-react";

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
        setJobs(data.courses || []); // backend sends "courses" = jobs
        setLoading(false);
      } catch (error) {
        console.error("Error fetching student dashboard:", error);
        localStorage.removeItem("token");
        window.location.href = "/student/login";
      }
    };

    fetchDashboardData();
  }, []);

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
    <div className="min-h-screen from-blue-50 to-indigo-100 p-8">
      <motion.div
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-5xl mx-auto bg-white rounded-2xl shadow-lg p-6"
      >
        <div className="flex items-center space-x-4 mb-8">
          <BookOpen className="text-blue-600 w-8 h-8" />
          <h1 className="text-3xl font-bold text-gray-800">
            Welcome, {student.name} 👋
          </h1>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {jobs.length > 0 ? (
            jobs.map((job, index) => (
              <motion.div
                key={job._id || index}
                whileHover={{ scale: 1.03 }}
                className="bg-gradient from-indigo-50 to-blue-50 border border-gray-200 rounded-xl shadow p-5"
              >
                <div className="flex items-center mb-3 space-x-3">
                  <Briefcase className="text-indigo-500 w-6 h-6" />
                  <h2 className="text-xl font-semibold text-gray-800">{job.title}</h2>
                </div>
                <p className="text-gray-600 mb-2"><strong>Company:</strong> {job.company}</p>
                <p className="text-gray-700 mb-3">{job.description}</p>
                <p className="text-gray-500 text-sm"><strong>Eligibility:</strong> {job.eligibility}</p>
                <p className="text-gray-500 text-sm"><strong>Last Date:</strong> {job.lastDate}</p>
              </motion.div>
            ))
          ) : (
            <p className="text-gray-500 text-lg text-center col-span-2">
              No active job listings found.
            </p>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default StudentDashboard;
