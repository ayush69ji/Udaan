import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Briefcase, UserCircle, LogOut, Bell, Search,
  TrendingUp, Calendar, CheckCircle, Award, Download, Eye, X, ChevronDown
} from "lucide-react";

const StudentDashboard = () => {
  const [student, setStudent] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showJobDetails, setShowJobDetails] = useState(null);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterBy, setFilterBy] = useState("all");
  const [profile, setProfile] = useState({
    name: "",
    branch: "",
    year: "",
    resume: "",
  });
  const [stats, setStats] = useState({
    totalJobs: 0,
    applied: 0,
    shortlisted: 0,
    profileComplete: 0
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

        const response = await fetch("http://localhost:5000/api/student/dashboard", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) throw new Error("Failed to fetch");
        
        const data = await response.json();

        setStudent(data.student);
        setJobs(data.courses || []);
        setProfile({
          name: data.student.name || "",
          branch: data.student.profile?.branch || "",
          year: data.student.profile?.year || "",
          resume: data.student.profile?.resume || "",
        });

        const totalJobs = data.courses?.length || 0;
        const profileComplete = calculateProfileCompletion(data.student);
        setStats({
          totalJobs,
          applied: 0,
          shortlisted: 0,
          profileComplete
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

  const calculateProfileCompletion = (student) => {
    let completed = 0;
    const fields = [
      student.name,
      student.email,
      student.profile?.branch,
      student.profile?.year,
      student.profile?.resume
    ];
    fields.forEach(field => {
      if (field) completed += 20;
    });
    return completed;
  };

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
      const response = await fetch("http://localhost:5000/api/student/profile", {
        method: "PUT",
        headers: { 
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ profile })
      });

      if (response.ok) {
        showToast("Profile updated successfully!", "success");
        setShowProfileModal(false);
        const profileComplete = calculateProfileCompletion({ ...student, profile });
        setStats(prev => ({ ...prev, profileComplete }));
      } else {
        showToast("Failed to update profile", "error");
      }
    } catch (error) {
      console.error("Profile update failed:", error);
      showToast("Failed to update profile", "error");
    }
  };

  const handleApply = async (jobId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:5000/api/student/apply/${jobId}`, {
        method: "POST",
        headers: { 
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
      });

      if (response.ok) {
        showToast("✅ Applied successfully!", "success");
        setStats(prev => ({ ...prev, applied: prev.applied + 1 }));
      } else {
        showToast("⚠️ Failed to apply or already applied.", "error");
      }
    } catch (err) {
      showToast("⚠️ Failed to apply or already applied.", "error");
    }
  };

  const showToast = (message, type) => {
    const toastEl = document.createElement('div');
    toastEl.textContent = message;
    toastEl.className = `fixed top-4 right-4 px-6 py-3 rounded-lg text-white z-50 ${
      type === 'success' ? 'bg-green-500' : 'bg-red-500'
    }`;
    document.body.appendChild(toastEl);
    setTimeout(() => toastEl.remove(), 3000);
  };

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.company.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  if (loading)
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
        <p className="mt-4 text-white text-xl">Loading Dashboard...</p>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Top Navigation */}
      <nav className="bg-slate-800/50 backdrop-blur-lg border-b border-slate-700 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-2 rounded-lg">
                <Briefcase className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">UDAAN</h1>
                <p className="text-xs text-slate-400">Student Portal</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <button className="relative p-2 text-slate-300 hover:text-white transition-colors">
                <Bell className="w-6 h-6" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>

              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-3 bg-slate-700/50 hover:bg-slate-700 px-4 py-2 rounded-xl transition-all"
                >
                  <UserCircle className="w-8 h-8 text-blue-400" />
                  <div className="text-left">
                    <p className="font-medium text-white text-sm">{student?.name}</p>
                    <p className="text-xs text-slate-400">{student?.email}</p>
                  </div>
                  <ChevronDown className="w-4 h-4 text-slate-400" />
                </button>

                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-56 bg-slate-800 rounded-xl shadow-xl border border-slate-700 p-2 z-50">
                    <button
                      onClick={() => {
                        setShowProfileModal(true);
                        setShowUserMenu(false);
                      }}
                      className="w-full text-left px-4 py-3 rounded-lg text-white flex items-center gap-3 hover:bg-slate-700"
                    >
                      <UserCircle size={18} />
                      My Profile
                    </button>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-3 rounded-lg flex items-center gap-3 text-red-400 hover:bg-red-500/20"
                    >
                      <LogOut size={18} /> Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h2 className="text-3xl font-bold text-white mb-2">
            Welcome back, {student?.name.split(' ')[0]}! 👋
          </h2>
          <p className="text-slate-400">Track your applications and discover new opportunities</p>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white">
            <div className="flex justify-between items-start mb-4">
              <div className="bg-white/20 p-3 rounded-xl">
                <Briefcase className="w-6 h-6" />
              </div>
              <TrendingUp className="w-5 h-5 text-blue-200" />
            </div>
            <p className="text-blue-100 text-sm mb-1">Total Opportunities</p>
            <p className="text-3xl font-bold">{stats.totalJobs}</p>
          </div>

          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 text-white">
            <div className="flex justify-between items-start mb-4">
              <div className="bg-white/20 p-3 rounded-xl">
                <CheckCircle className="w-6 h-6" />
              </div>
              <TrendingUp className="w-5 h-5 text-green-200" />
            </div>
            <p className="text-green-100 text-sm mb-1">Applications Sent</p>
            <p className="text-3xl font-bold">{stats.applied}</p>
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white">
            <div className="flex justify-between items-start mb-4">
              <div className="bg-white/20 p-3 rounded-xl">
                <Award className="w-6 h-6" />
              </div>
              <TrendingUp className="w-5 h-5 text-purple-200" />
            </div>
            <p className="text-purple-100 text-sm mb-1">Shortlisted</p>
            <p className="text-3xl font-bold">{stats.shortlisted}</p>
          </div>

          <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl p-6 text-white">
            <div className="flex justify-between items-start mb-4">
              <div className="bg-white/20 p-3 rounded-xl">
                <UserCircle className="w-6 h-6" />
              </div>
            </div>
            <p className="text-orange-100 text-sm mb-1">Profile Complete</p>
            <div className="flex items-end gap-2">
              <p className="text-3xl font-bold">{stats.profileComplete}%</p>
              <div className="flex-1 bg-white/20 h-2 rounded-full mb-2">
                <div 
                  className="bg-white h-full rounded-full transition-all duration-500"
                  style={{ width: `${stats.profileComplete}%` }}
                ></div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Search and Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-slate-800/50 backdrop-blur-lg rounded-2xl p-6 mb-8 border border-slate-700"
        >
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search jobs by title or company..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-slate-700/50 border border-slate-600 rounded-xl pl-12 pr-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <select
              value={filterBy}
              onChange={(e) => setFilterBy(e.target.value)}
              className="bg-slate-700/50 border border-slate-600 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Jobs</option>
              <option value="applied">Applied</option>
              <option value="saved">Saved</option>
            </select>
          </div>
        </motion.div>

        {/* Job Listings */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-bold text-white">Available Opportunities</h3>
            <p className="text-slate-400">{filteredJobs.length} jobs found</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredJobs.length > 0 ? (
              filteredJobs.map((job, index) => (
                <motion.div
                  key={job._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ y: -5 }}
                  className="bg-slate-800/50 backdrop-blur-lg rounded-2xl p-6 border border-slate-700 hover:border-blue-500 transition-all group"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-3 rounded-xl">
                      <Briefcase className="w-6 h-6 text-white" />
                    </div>
                    <button 
                      onClick={() => setShowJobDetails(job)}
                      className="text-slate-400 hover:text-white transition-colors"
                    >
                      <Eye className="w-5 h-5" />
                    </button>
                  </div>

                  <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-blue-400 transition-colors">
                    {job.title}
                  </h3>
                  <p className="text-blue-400 font-medium mb-3">{job.company}</p>
                  <p className="text-slate-300 text-sm mb-4 line-clamp-2">{job.description}</p>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm text-slate-400">
                      <Award className="w-4 h-4" />
                      <span>{job.eligibility}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-400">
                      <Calendar className="w-4 h-4" />
                      <span>Deadline: {job.lastDate}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleApply(job._id)}
                    className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white py-3 rounded-xl transition-all font-medium flex items-center justify-center gap-2"
                  >
                    <CheckCircle className="w-5 h-5" />
                    Apply Now
                  </button>
                </motion.div>
              ))
            ) : (
              <div className="col-span-full text-center py-20">
                <Briefcase className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                <p className="text-slate-400 text-lg">No active job listings available</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Profile Modal */}
      <AnimatePresence>
        {showProfileModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm flex justify-center items-center z-50 p-4"
            onClick={() => setShowProfileModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-slate-800 rounded-2xl shadow-2xl w-full max-w-2xl border border-slate-700 max-h-[90vh] overflow-y-auto"
            >
              <div className="sticky top-0 bg-slate-800 border-b border-slate-700 p-6 flex justify-between items-center">
                <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                  <UserCircle className="w-8 h-8 text-blue-400" />
                  My Profile
                </h2>
                <button
                  onClick={() => setShowProfileModal(false)}
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="p-6 space-y-6">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={profile.name}
                    onChange={handleProfileChange}
                    className="w-full bg-slate-700/50 border border-slate-600 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter your full name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Institute
                  </label>
                  <input
                    type="text"
                    value="Institute of Engineering & Technology, DAVV"
                    disabled
                    className="w-full bg-slate-700/30 border border-slate-600 rounded-xl px-4 py-3 text-slate-400"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Branch
                  </label>
                  <select
                    name="branch"
                    value={profile.branch}
                    onChange={handleProfileChange}
                    className="w-full bg-slate-700/50 border border-slate-600 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select your branch</option>
                    {branchOptions.map((b) => (
                      <option key={b} value={b}>
                        {b}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Current Year
                  </label>
                  <input
                    type="number"
                    name="year"
                    value={profile.year}
                    onChange={handleProfileChange}
                    className="w-full bg-slate-700/50 border border-slate-600 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., 3"
                    min="1"
                    max="4"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Resume (PDF)
                  </label>
                  <div className="flex gap-3">
                    <input
                      type="file"
                      accept=".pdf"
                      onChange={handleResumeUpload}
                      className="flex-1 bg-slate-700/50 border border-slate-600 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-blue-500 file:text-white file:cursor-pointer"
                    />
                    {profile.resume && (
                      <button className="bg-green-500/20 text-green-400 px-4 rounded-xl border border-green-500/30">
                        <Download className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-6 border-t border-slate-700">
                  <button
                    onClick={() => setShowProfileModal(false)}
                    className="px-6 py-3 rounded-xl border border-slate-600 text-slate-300 hover:bg-slate-700 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleProfileSave}
                    className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 transition-all"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Job Details Modal */}
      <AnimatePresence>
        {showJobDetails && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm flex justify-center items-center z-50 p-4"
            onClick={() => setShowJobDetails(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-slate-800 rounded-2xl shadow-2xl w-full max-w-3xl border border-slate-700 max-h-[90vh] overflow-y-auto"
            >
              <div className="sticky top-0 bg-slate-800 border-b border-slate-700 p-6 flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-3 rounded-xl">
                    <Briefcase className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">{showJobDetails.title}</h2>
                    <p className="text-blue-400">{showJobDetails.company}</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowJobDetails(null)}
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="p-6 space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">Job Description</h3>
                  <p className="text-slate-300 leading-relaxed">{showJobDetails.description}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-700/30 rounded-xl p-4">
                    <div className="flex items-center gap-2 text-slate-400 mb-2">
                      <Award className="w-5 h-5" />
                      <span className="text-sm">Eligibility</span>
                    </div>
                    <p className="text-white font-medium">{showJobDetails.eligibility}</p>
                  </div>

                  <div className="bg-slate-700/30 rounded-xl p-4">
                    <div className="flex items-center gap-2 text-slate-400 mb-2">
                      <Calendar className="w-5 h-5" />
                      <span className="text-sm">Application Deadline</span>
                    </div>
                    <p className="text-white font-medium">{showJobDetails.lastDate}</p>
                  </div>
                </div>

                <button
                  onClick={() => {
                    handleApply(showJobDetails._id);
                    setShowJobDetails(null);
                  }}
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white py-4 rounded-xl transition-all font-medium flex items-center justify-center gap-2 text-lg"
                >
                  <CheckCircle className="w-6 h-6" />
                  Apply for this Position
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default StudentDashboard;
