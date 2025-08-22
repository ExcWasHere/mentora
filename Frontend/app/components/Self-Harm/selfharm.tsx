import { useState, useEffect } from "react";
import {
  Home,
  Calendar,
  Users,
  MessageCircle,
  Heart,
  FileText,
  Bell,
  ChevronDown,
  Menu,
  X,
  LogOut,
  Shield,
  Trophy,
  Star,
  Target,
  Sparkles,
  CheckCircle,
  AlertCircle,
  Clock,
  Award,
} from "lucide-react";
import { useLoaderData } from "@remix-run/react";

type LoaderData = {
  userId: string;
  userName?: string;
  userEmail?: string;
  token: string;
};

const SelfHarmTracker = () => {
  const [activeTab, setActiveTab] = useState("self-harm");
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [streakData, setStreakData] = useState({ days: 0, message: "" });
  const [loading, setLoading] = useState(false);
  const [hasStreak, setHasStreak] = useState(false);
  const [animateStreak, setAnimateStreak] = useState(false);
  const { userId, userName = "Pengguna", token } = useLoaderData<LoaderData>();

  useEffect(() => {
    fetchStreakData();
  }, [userId]);

  useEffect(() => {
    const timer = setTimeout(() => setAnimateStreak(true), 500);
    return () => clearTimeout(timer);
  }, []);

  const fetchStreakData = async () => {
    try {
      setLoading(true);
      const res = await fetch("https://mentora-977901323224.asia-southeast2.run.app/api/streak", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      setStreakData(data);
      setHasStreak(data.days > 0 || data.message !== "Belum ada streak");
    } catch (error) {
      console.error("Gagal mengambil data streak:", error);
      setStreakData({ days: 0, message: "Belum ada streak" });
    } finally {
      setLoading(false);
    }
  };

  const startCommitment = async () => {
    try {
      setLoading(true);
      const res = await fetch("https://mentora-977901323224.asia-southeast2.run.app/api/streak/start", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (res.ok) {
        await fetchStreakData();
        alert(
          "Komitmen berhasil dimulai! Semangat untuk perjalanan recovery-mu! 💪"
        );
      } else {
        const errorData = await res.json();
        alert(errorData.message || "Gagal memulai komitmen");
      }
    } catch (error) {
      console.error("Error starting commitment:", error);
      alert("Terjadi kesalahan saat memulai komitmen");
    } finally {
      setLoading(false);
    }
  };

  const resetStreak = async () => {
    const confirmed = confirm(
      "Apakah kamu yakin ingin mereset streak? Ingat, ini bukan kegagalan tapi bagian dari proses recovery. Kamu tetap hebat! ❤️"
    );
    if (!confirmed) return;

    try {
      setLoading(true);
      const res = await fetch("https://mentora-977901323224.asia-southeast2.run.app/api/streak/reset", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (res.ok) {
        await fetchStreakData();
        alert(
          "Streak telah direset. Kamu bisa memulai lagi kapan saja. Recovery adalah perjalanan, bukan tujuan. 🌱"
        );
      } else {
        const errorData = await res.json();
        alert(errorData.message || "Gagal mereset streak");
      }
    } catch (error) {
      console.error("Error resetting streak:", error);
      alert("Terjadi kesalahan saat mereset streak");
    } finally {
      setLoading(false);
    }
  };

  const getStreakLevel = (days: number) => {
    if (days >= 365)
      return {
        level: "Recovery Champion",
        icon: Award,
        color: "text-purple-600",
        bg: "bg-purple-100",
      };
    if (days >= 180)
      return {
        level: "Recovery Master",
        icon: Trophy,
        color: "text-yellow-600",
        bg: "bg-yellow-100",
      };
    if (days >= 90)
      return {
        level: "Recovery Hero",
        icon: Star,
        color: "text-blue-600",
        bg: "bg-blue-100",
      };
    if (days >= 30)
      return {
        level: "Recovery Warrior",
        icon: Shield,
        color: "text-green-600",
        bg: "bg-green-100",
      };
    if (days >= 7)
      return {
        level: "Recovery Fighter",
        icon: Target,
        color: "text-orange-600",
        bg: "bg-orange-100",
      };
    return {
      level: "Recovery Starter",
      icon: Sparkles,
      color: "text-pink-600",
      bg: "bg-pink-100",
    };
  };

  const getMotivationalMessage = (days: number) => {
    if (days >= 365)
      return "Luar biasa! Satu tahun penuh komitmen! Kamu adalah inspirasi bagi banyak orang! 🏆";
    if (days >= 180)
      return "Hebat sekali! Sudah setengah tahun! Perjalanan recovery-mu sungguh menginspirasi! 🌟";
    if (days >= 90)
      return "Amazing! 3 bulan adalah pencapaian yang luar biasa! Keep going! 💪";
    if (days >= 30)
      return "Sebulan penuh! Kamu sudah membuktikan kekuatan dalam dirimu! 🎉";
    if (days >= 7)
      return "Seminggu streak! Langkah kecil tapi bermakna besar! 🌱";
    if (days >= 1) return "Setiap hari adalah kemenangan! Kamu hebat! ✨";
    return "Siap memulai perjalanan recovery yang amazing? 🚀";
  };

  const getMilestones = () => {
    const milestones = [
      { days: 1, label: "Hari Pertama", achieved: streakData.days >= 1 },
      { days: 7, label: "1 Minggu", achieved: streakData.days >= 7 },
      { days: 30, label: "1 Bulan", achieved: streakData.days >= 30 },
      { days: 90, label: "3 Bulan", achieved: streakData.days >= 90 },
      { days: 180, label: "6 Bulan", achieved: streakData.days >= 180 },
      { days: 365, label: "1 Tahun", achieved: streakData.days >= 365 },
    ];
    return milestones;
  };

  const getFirstName = (fullName: string): string => {
    if (!fullName || typeof fullName !== "string") return "Pengguna";
    return fullName.trim().split(" ")[0];
  };

  const getInitials = (fullName: string): string => {
    if (!fullName || typeof fullName !== "string") return "P";
    return fullName
      .trim()
      .split(" ")
      .map((name) => name[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const handleLogout = () => {
    if (confirm("Apakah kamu yakin mau pergi:( ?")) {
      window.location.href = "/logout";
    }
  };

  const Logo = () => (
    <div className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg overflow-hidden bg-white">
      <img
        src="/favicon.ico"
        alt="Mentora Logo"
        className="w-full h-full object-cover"
      />
    </div>
  );

  const sidebarItems = [
    { id: "dashboard", label: "Dashboard", icon: Home, href: "/dashboard" },
    { id: "emotions", label: "Emotion Log", icon: Calendar, href: "/emolog" },
    {
      id: "self-harm",
      label: "Self-Harm Tracker",
      icon: Users,
      href: "/self-harm",
    },
    {
      id: "consultation",
      label: "Consultation",
      icon: MessageCircle,
      href: "/consultation",
    },
    { id: "alora", label: "AloRa", icon: Heart, href: "/alora" },
    { id: "forum", label: "Forum", icon: FileText, href: "/forum" },
  ];

  const SidebarItem = ({ item }: { item: (typeof sidebarItems)[0] }) => (
    <a
      href={item.href}
      onClick={() => {
        setActiveTab(item.id);
        setSidebarOpen(false);
      }}
      className={`group relative w-full flex items-center px-4 py-3.5 text-left rounded-xl transition-all duration-300 ${
        item.id === activeTab
          ? "bg-white text-violet-800 shadow-lg transform translate-x-2 scale-105"
          : "text-white hover:bg-white/20 hover:transform hover:translate-x-1"
      }`}
    >
      <div
        className={`w-9 h-9 rounded-lg flex items-center justify-center mr-3 shadow-md transition-all duration-300 ${
          item.id === activeTab
            ? "bg-violet-600"
            : "bg-white/20 group-hover:bg-white/30 group-hover:scale-110"
        }`}
      >
        <item.icon
          className={`w-4 h-4 ${
            item.id === activeTab ? "text-white" : "text-white"
          }`}
        />
      </div>
      <span className="font-medium text-sm">{item.label}</span>
      {item.id === activeTab && (
        <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-8 bg-violet-600 rounded-r-full"></div>
      )}
    </a>
  );

  const streakLevel = getStreakLevel(streakData.days);

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 to-blue-50">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <button
          type="button"
          aria-label="Tutup sidebar"
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              setSidebarOpen(false);
            }
          }}
          style={{ cursor: "pointer" }}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 w-64 bg-violet-600 shadow-2xl transform transition-transform duration-300 z-50 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
      >
        {/* Logo Header */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-white/20 bg-violet-700">
          <div className="flex items-center space-x-3">
            <Logo />
            <h2 className="text-2xl font-black text-white">
              Men<span className="text-violet-200">Tora</span>
            </h2>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={handleLogout}
              className="lg:flex hidden items-center justify-center w-8 h-8 text-white hover:bg-white/20 rounded-lg transition-all duration-300 group"
              title="Logout"
            >
              <LogOut className="w-4 h-4 group-hover:scale-110 transition-transform" />
            </button>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden text-white hover:bg-white/20 p-1.5 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="mt-6 px-3 pb-20">
          <div className="space-y-2">
            {sidebarItems.map((item) => (
              <SidebarItem key={item.id} item={item} />
            ))}
          </div>
        </nav>

        {/* Mobile Logout Button */}
        <div className="absolute bottom-4 left-3 right-3 lg:hidden">
          <button
            onClick={handleLogout}
            className="w-full flex items-center px-4 py-3 text-white hover:bg-white/20 rounded-xl transition-all duration-300 group"
          >
            <div className="w-9 h-9 rounded-lg flex items-center justify-center mr-3 bg-white/20 group-hover:bg-white/30 transition-all duration-300 group-hover:scale-110">
              <LogOut className="w-4 h-4 text-white" />
            </div>
            <span className="font-medium text-sm">Logout</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="lg:ml-64 min-h-screen">
        {/* Header */}
        <div className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-30">
          <div className="px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="lg:hidden bg-sky-100 text-violet-700 p-2 rounded-xl hover:bg-blue-200 transition-colors"
                >
                  <Menu className="w-5 h-5" />
                </button>
                <div>
                  <h1 className="text-2xl sm:text-3xl font-black text-violet-700">
                    Self-Harm Tracker
                  </h1>
                  <p className="text-gray-600 mt-1 font-medium text-sm">
                    Perjalanan recovery-mu sangat berharga,{" "}
                    {getFirstName(userName)}! 💙
                  </p>
                </div>
              </div>

              {/* Header Actions */}
              <div className="flex items-center space-x-2 sm:space-x-4">
                <div className="relative">
                  <button
                    onClick={() => setShowNotifications(!showNotifications)}
                    className="flex items-center px-3 py-2 sm:px-4 sm:py-3 bg-violet-600 text-white rounded-xl hover:bg-violet-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    <Bell className="w-4 h-4 sm:w-5 sm:h-5 sm:mr-2" />
                    <span className="hidden sm:inline font-medium">
                      Notifikasi
                    </span>
                  </button>
                </div>

                <div className="relative">
                  <button
                    onClick={() => setShowProfile(!showProfile)}
                    className="flex items-center px-2 py-2 sm:px-4 sm:py-3 bg-blue-200 text-violet-700 rounded-xl hover:bg-violet-200 transition-all duration-300 shadow-lg hover:shadow-xl"
                  >
                    <div className="w-6 h-6 sm:w-8 sm:h-8 bg-violet-600 rounded-full mr-0 sm:mr-3 flex items-center justify-center">
                      <span className="text-white font-bold text-xs sm:text-sm">
                        {getInitials(userName ?? "")}
                      </span>
                    </div>
                    <span className="hidden sm:inline mr-2 font-semibold">
                      {getFirstName(userName ?? "")}
                    </span>
                    <ChevronDown className="w-3 h-3 sm:w-4 sm:h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="p-4 sm:p-6 lg:p-8">
          {/* Main Streak Display */}
          <div className="bg-white rounded-3xl p-8 sm:p-12 shadow-2xl border border-gray-100 mb-8 relative overflow-hidden">
            <div className="text-center relative z-10">
              <div
                className={`mb-8 transition-all duration-1000 ${
                  animateStreak ? "scale-100 opacity-100" : "scale-75 opacity-0"
                }`}
              >
                <div
                  className={`inline-flex items-center px-6 py-3 rounded-2xl ${streakLevel.bg} ${streakLevel.color} font-bold text-lg mb-6 shadow-lg`}
                >
                  <streakLevel.icon className="w-6 h-6 mr-2" />
                  {streakLevel.level}
                </div>

                <div className="relative">
                  <div className="text-8xl sm:text-9xl font-black text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-blue-600 mb-4">
                    {loading ? "..." : streakData.days}
                  </div>
                  <div className="text-2xl sm:text-3xl font-bold text-gray-600 mb-6">
                    {streakData.days === 1 ? "HARI" : "HARI"}
                  </div>
                </div>

                <div className="max-w-2xl mx-auto">
                  <p className="text-lg sm:text-xl text-gray-700 font-medium mb-8">
                    {getMotivationalMessage(streakData.days)}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                {!hasStreak || streakData.days === 0 ? (
                  <button
                    onClick={startCommitment}
                    disabled={loading}
                    className="flex items-center px-8 py-4 bg-gradient-to-r from-violet-600 to-blue-600 text-white rounded-2xl hover:from-violet-700 hover:to-blue-700 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105 font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <CheckCircle className="w-6 h-6 mr-3" />
                    {loading ? "Memproses..." : "Mulai Komitmen Saya"}
                  </button>
                ) : (
                  <button
                    onClick={resetStreak}
                    disabled={loading}
                    className="flex items-center px-8 py-4 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-2xl hover:from-orange-600 hover:to-red-600 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105 font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <AlertCircle className="w-6 h-6 mr-3" />
                    {loading ? "Memproses..." : "Maaf, Aku Gagal"}
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Milestones */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-lg border border-gray-100 mb-8">
            <h3 className="text-2xl font-bold text-gray-800 mb-8 text-center">
              Pencapaian Recovery
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6">
              {getMilestones().map((milestone, index) => (
                <div
                  key={milestone.days}
                  className={`flex flex-col items-center p-4 sm:p-6 rounded-2xl transition-all duration-500 transform hover:scale-105 ${
                    milestone.achieved
                      ? "bg-gradient-to-br from-green-100 to-emerald-100 shadow-lg"
                      : "bg-gray-50 shadow-sm"
                  } ${
                    animateStreak
                      ? "translate-y-0 opacity-100"
                      : "translate-y-4 opacity-0"
                  }`}
                  style={{ transitionDelay: `${index * 100}ms` }}
                >
                  <div
                    className={`w-12 h-12 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center mb-3 sm:mb-4 shadow-md transition-all duration-300 ${
                      milestone.achieved
                        ? "bg-gradient-to-br from-green-500 to-emerald-500 text-white"
                        : "bg-gray-200 text-gray-500"
                    }`}
                  >
                    {milestone.achieved ? (
                      <Trophy className="w-6 h-6 sm:w-8 sm:h-8" />
                    ) : (
                      <Clock className="w-6 h-6 sm:w-8 sm:h-8" />
                    )}
                  </div>
                  <div className="text-center">
                    <div
                      className={`font-bold text-sm sm:text-base mb-1 ${
                        milestone.achieved ? "text-green-800" : "text-gray-600"
                      }`}
                    >
                      {milestone.days} Hari
                    </div>
                    <div
                      className={`text-xs font-medium ${
                        milestone.achieved ? "text-green-700" : "text-gray-500"
                      }`}
                    >
                      {milestone.label}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="mt-12 pt-8 border-t border-gray-200">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="text-sm text-gray-600 mb-4 md:mb-0 font-medium text-center md:text-left">
                © 2025{" "}
                <span className="font-bold text-violet-700">Mentora</span>. Hak
                Cipta Dilindungi.
              </div>
              <div className="flex items-center space-x-8">
                <button
                  onClick={() => alert("About Us, coming soon dlu bang!")}
                  className="text-sm text-violet-600 hover:text-violet-800 transition-colors font-semibold"
                >
                  About-Us
                </button>
                <button
                  onClick={() => alert("Call center, coming soon dlu bang!")}
                  className="text-sm text-violet-600 hover:text-violet-800 transition-colors font-semibold"
                >
                  Help
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SelfHarmTracker;