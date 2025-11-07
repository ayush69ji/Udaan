import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { Briefcase, UserCircle, LogOut } from "lucide-react";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import toast from "react-hot-toast";

const StudentDashboard = () => {
  const [student, setStudent] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [profile, setProfile] = useState({
    name: "",
    branch: "",
    year: "",
    resume: "",
  });

  const branchOptions = [
    "Computer Science",
    "Information Technology",
    "Electronics and Telecommunication",
    "Electronics and Instrumentation",
    "Civil",
    "Mechanical",
  ];

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
        setProfile({
          name: data.student.name || "",
          branch: data.student.profile?.branch || "",
          year: data.student.profile?.year || "",
          resume: data.student.profile?.resume || "",
        });
      } catch (error) {
        console.error("Error fetching dashboard:", error);
        localStorage.removeItem("token");
        window.location.href = "/student/login";
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/student/login";
  };

  const handleProfileChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleResumeUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setProfile((prev) => ({ ...prev, resume: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  const handleProfileSave = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        "http://localhost:5000/api/student/profile",
        { profile },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Profile updated successfully!");
      setShowProfileModal(false);
    } catch (error) {
      console.error("Profile update failed:", error);
      toast.error("Failed to update profile");
    }
  };

  const handleApply = async (jobId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `http://localhost:5000/api/student/apply/${jobId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("✅ Applied successfully!");
    } catch (err) {
      toast.error("⚠️ Failed to apply or already applied.");
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100 text-2xl font-semibold text-blue-700">
        Loading Dashboard...
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100 p-6">
      {/* Header */}
      <header className="flex justify-between items-center bg-white shadow-md rounded-2xl px-6 py-4 mb-8">
        <h1 className="text-2xl font-bold text-blue-700">🎓 UDAAN Student Dashboard</h1>
        <Menu as="div" className="relative">
          <MenuButton className="flex items-center gap-2 hover:bg-gray-50 px-3 py-2 rounded-lg">
            <UserCircle className="w-8 h-8 text-blue-600" />
            <span className="font-medium">{student.name}</span>
          </MenuButton>
          <MenuItems className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border p-2 z-50">
            <MenuItem>
              {({ active }) => (
                <button
                  onClick={() => setShowProfileModal(true)}
                  className={`w-full text-left px-4 py-2 rounded-lg ${
                    active ? "bg-blue-50" : ""
                  }`}
                >
                  My Profile
                </button>
              )}
            </MenuItem>
            <MenuItem>
              {({ active }) => (
                <button
                  onClick={handleLogout}
                  className={`w-full text-left px-4 py-2 rounded-lg flex items-center gap-2 ${
                    active ? "bg-red-50 text-red-600" : "text-red-500"
                  }`}
                >
                  <LogOut size={16} /> Logout
                </button>
              )}
            </MenuItem>
          </MenuItems>
        </Menu>
      </header>

      {/* Job Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {jobs.length > 0 ? (
          jobs.map((job) => (
            <motion.div
              key={job._id}
              whileHover={{ scale: 1.02 }}
              className="bg-white p-6 rounded-2xl shadow-md border border-gray-100 transition-all"
            >
              <div className="flex items-center gap-3 mb-2">
                <Briefcase className="text-indigo-600 w-6 h-6" />
                <h2 className="text-lg font-semibold">{job.title}</h2>
              </div>
              <p className="text-blue-700 font-medium mb-1">{job.company}</p>
              <p className="text-gray-700 text-sm mb-2">{job.description}</p>
              <p className="text-sm text-gray-500">
                <strong>Eligibility:</strong> {job.eligibility}
              </p>
              <p className="text-sm text-gray-500 mb-3">
                <strong>Last Date:</strong> {job.lastDate}
              </p>
              <button
                onClick={() => handleApply(job._id)}
                className="bg-blue-600 hover:bg-blue-700 text-white w-full py-2 rounded-lg transition font-medium"
              >
                Apply Now
              </button>
            </motion.div>
          ))
        ) : (
          <p className="text-center text-gray-600 col-span-full">
            No active job listings available.
          </p>
        )}
      </motion.div>

      {/* Profile Modal */}
      <AnimatePresence>
        {showProfileModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50"
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-lg"
            >
              <h2 className="text-2xl font-semibold text-center text-blue-700 mb-5">
                🧑‍🎓 My Profile
              </h2>

              <div className="space-y-4">
                <input
                  type="text"
                  name="name"
                  value={profile.name}
                  onChange={handleProfileChange}
                  className="w-full border p-2 rounded-lg"
                  placeholder="Full Name"
                />

                <input
                  type="text"
                  value="Institute of Engineering & Technology, DAVV"
                  disabled
                  className="w-full border p-2 rounded-lg bg-gray-100 text-gray-600"
                />

                <select
                  name="branch"
                  value={profile.branch}
                  onChange={handleProfileChange}
                  className="w-full border p-2 rounded-lg"
                >
                  <option value="">Select Branch</option>
                  {branchOptions.map((b) => (
                    <option key={b} value={b}>
                      {b}
                    </option>
                  ))}
                </select>

                <input
                  type="number"
                  name="year"
                  value={profile.year}
                  onChange={handleProfileChange}
                  className="w-full border p-2 rounded-lg"
                  placeholder="Current Year of Study"
                />

                <div>
                  <label className="block font-medium mb-1 text-gray-700">
                    Upload Resume (PDF)
                  </label>
                  <input type="file" onChange={handleResumeUpload} />
                </div>

                <div className="flex justify-end gap-3 pt-3">
                  <button
                    onClick={() => setShowProfileModal(false)}
                    className="px-4 py-2 rounded-lg border hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleProfileSave}
                    className="px-4 py-2 rounded-lg bg-blue-600 text-white"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default StudentDashboard;
