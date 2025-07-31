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
  Smile,
  ArrowRight,
  Menu,
  X,
  LogOut,
  Plus,
  Phone,
} from "lucide-react";

import {
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Link } from "@remix-run/react";

type Emotion = "Sangat Baik" | "Baik" | "Biasa" | "Sedih" | "Cemas" | "Marah";

const emotionToScore: Record<Emotion, number> = {
  "Sangat Baik": 5,
  Baik: 4,
  Biasa: 3,
  Sedih: 2,
  Cemas: 1,
  Marah: 0,
};

interface DashboardProps {
  userName: string;
  userId: string;
  userEmail: string;
}

interface EmologItem {
  id: string;
  interaction_with?: string;
  activity?: string;
  date?: string;
  emotion?: string;
}

const Dashboard = ({ userName, userId }: DashboardProps) => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [animateStats, setAnimateStats] = useState(false);
  const [emologData, setEmologData] = useState<EmologItem[]>([]);
  const [emotionStats, setEmotionStats] = useState<Record<string, number>>({});
  const [recentInteractions, setRecentInteractions] = useState<
    {
      id: string;
      type: string;
      activity: string;
      time: string;
      sentiment: Emotion;
      avatar: string;
    }[]
  >([]);
  useEffect(() => {
    const fetchEmologData = async () => {
      try {
        const res = await fetch(
          `http://localhost:5000/api/emolog?user_id=${userId}&period=7`
        );
        const data = await res.json();
        const emotionCount: Record<string, number> = {};
        const interactions: EmologItem[] = [];

        data.forEach((entry: EmologItem) => {
          emotionCount[entry.emotion] = (emotionCount[entry.emotion] || 0) + 1;
          if (entry.interaction_with) interactions.push(entry);
        });

        setEmotionStats(emotionCount);
        setEmologData(data);
        setRecentInteractions(
          interactions.slice(0, 3).map((item) => ({
            id: item.id,
            type: item.interaction_with,
            activity: item.activity,
            time: item.date,
            sentiment: item.emotion as Emotion,
            avatar: item.interaction_with?.slice(0, 2).toUpperCase() || "??",
          }))
        );
      } catch (error) {
        console.error("Gagal ambil emolog:", error);
        setEmologData([]);
        setRecentInteractions([]);
      }
    };

    fetchEmologData();
  }, [userId]);

  const chartData = emologData.map((item) => ({
    date: item.date,
    score: emotionToScore[item.emotion as Emotion] ?? 0,
  }));

  const calculateAverageEmotion = () => {
    const skor = {
      "Sangat Baik": 5,
      Baik: 4,
      Biasa: 3,
      Sedih: 2,
      Cemas: 1,
      Marah: 0,
    };

    if (!emologData.length) return 0;

    const total = emologData.reduce(
      (sum, item) => sum + (skor[item.emotion] ?? 0),
      0
    );
    return (total / emologData.length).toFixed(1);
  };

  useEffect(() => {
    const timer = setTimeout(() => setAnimateStats(true), 300);
    return () => clearTimeout(timer);
  }, []);

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

  const sidebarItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: Home,
      href: "/dashboard",
    },
    {
      id: "emotions",
      label: "Emotion Log",
      icon: Calendar,
      href: "/emolog",
    },
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
    {
      id: "alora",
      label: "AloRa",
      icon: Heart,
      href: "/alora",
    },
    {
      id: "forum",
      label: "Forum",
      icon: FileText,
      href: "/forum",
    },
  ];

  const statsCards = [
    {
      title: "Emotion Stats",
      value: String(calculateAverageEmotion()),
      description: "Skor Rata-rata",
      change: "+2.5 dari minggu lalu",
      changeType: "positive" as const,
      icon: Smile,
      bgColor: "bg-sky-100",
    },
    {
      title: "Social Journey",
      value: String(emologData.length),
      description: "Mingguan",
      change: "+3 dari minggu lalu",
      changeType: "positive" as const,
      icon: Users,
      bgColor: "bg-blue-200",
    },
    {
      title: "Consultation Time",
      value: "2",
      description: "Bulan ini",
      change: "Jadwal berikutnya: 15 Mei",
      changeType: "neutral" as const,
      icon: MessageCircle,
      bgColor: "bg-violet-200",
    },
    {
      title: "AloRa Time",
      value: "8",
      description: "Minggu ini",
      change: "+5 dari minggu lalu",
      changeType: "positive" as const,
      icon: Heart,
      bgColor: "bg-sky-100",
    },
  ];

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

  const SidebarItem = ({ item }: { item: typeof sidebarItems[0] }) => (
    <Link
      to={item.href}
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
    </Link>
  );

  const StatsCard = ({ card, index }: { card: typeof statsCards[0], index: number }) => (
    <div
      className={`bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-500 hover:scale-105 transform border border-gray-100 ${
        animateStats ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
      }`}
      style={{ transitionDelay: `${index * 100}ms` }}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-bold text-gray-800">{card.title}</h3>
        <div
          className={`w-12 h-12 rounded-xl ${card.bgColor} flex items-center justify-center shadow-md`}
        >
          <card.icon className="w-6 h-6 text-violet-700" />
        </div>
      </div>
      <div className="flex items-end justify-between">
        <div>
          <div className="text-3xl font-black text-gray-800 mb-1">
            {card.value}
          </div>
          <div className="text-sm font-medium text-gray-600">
            {card.description}
          </div>
        </div>
        <div className="text-right">
          <div
            className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
              card.changeType === "positive"
                ? "text-green-700 bg-green-100"
                : card.changeType === "negative"
                ? "text-red-700 bg-red-100"
                : "text-gray-700 bg-gray-100"
            }`}
          >
            {card.change}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-white">
      {/* Mobile Sidebar */}
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
            {/* Logout Button */}
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
                    Dashboard
                  </h1>
                  <p className="text-gray-600 mt-1 font-medium text-sm">
                    Selamat datang kembali, {getFirstName(userName)}! ✨
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
          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
            {statsCards.map((card, index) => (
              <StatsCard key={index} card={card} index={index} />
            ))}
          </div>

          {/* Content Sections */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 sm:gap-8 mb-6 sm:mb-8">
            {/* Mood Graph */}
            <div className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-lg border border-gray-100">
              <div className="flex items-center justify-between mb-6 sm:mb-8">
                <h3 className="text-xl sm:text-2xl font-bold text-gray-800">
                  Grafik Emosi 7 Hari
                </h3>
                <button className="flex items-center px-3 py-2 sm:px-4 sm:py-2 bg-sky-100 text-violet-700 rounded-xl hover:bg-blue-200 transition-all duration-300 shadow-md text-sm">
                  7 Hari
                  <ChevronDown className="w-4 h-4 ml-2" />
                </button>
              </div>
              <div className="h-48 sm:h-72 bg-sky-100 rounded-2xl border border-blue-200 shadow-md p-4">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#C8DEFF" />
                    <XAxis dataKey="date" stroke="#7c3aed" />
                    <YAxis domain={[0, 5]} stroke="#7c3aed" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#E6FAFE",
                        borderColor: "#C8DEFF",
                        color: "#7c3aed",
                      }}
                    />
                    <Bar dataKey="score" fill="#7c3aed" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Social Interaction Tracker */}
            <div className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-lg border border-gray-100">
              <div className="flex items-center justify-between mb-6 sm:mb-8">
                <h3 className="text-xl sm:text-2xl font-bold text-gray-800">
                  Interaksi Sosial Terbaru
                </h3>
                <a
                  href="/emolog"
                  className="px-3 py-2 sm:px-5 sm:py-3 bg-violet-600 text-white rounded-xl hover:bg-violet-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 font-semibold text-sm flex items-center"
                >
                  <Plus className="w-4 h-4 mr-1 sm:mr-2" />
                  <span className="hidden sm:inline">Tambah Baru</span>
                  <span className="sm:hidden">Tambah</span>
                </a>
              </div>
              <div className="space-y-4">
                {recentInteractions.map((interaction, index) => (
                  <div
                    key={interaction.id}
                    className={`p-4 sm:p-5 border border-gray-100 rounded-2xl bg-sky-50 hover:shadow-lg transition-all duration-300 transform hover:scale-102 ${
                      animateStats
                        ? "translate-x-0 opacity-100"
                        : "translate-x-4 opacity-0"
                    }`}
                    style={{ transitionDelay: `${(index + 4) * 100}ms` }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-violet-600 rounded-2xl flex items-center justify-center mr-3 sm:mr-4 shadow-md">
                          <span className="text-white font-bold text-xs sm:text-sm">
                            {interaction.avatar}
                          </span>
                        </div>
                        <div>
                          <h4 className="font-bold text-gray-800 text-sm sm:text-base">
                            {interaction.type}
                          </h4>
                          <p className="text-xs sm:text-sm text-gray-600 font-medium">
                            {interaction.activity}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-xs sm:text-sm text-gray-500 block mb-1 sm:mb-2 font-medium">
                          {interaction.time}
                        </span>
                        <span
                          className={`inline-flex items-center px-2 py-1 sm:px-3 sm:py-1 rounded-full text-xs font-bold shadow-sm ${
                            interaction.sentiment === "Sangat Baik"
                              ? "bg-green-100 text-green-800"
                              : interaction.sentiment === "Baik"
                              ? "bg-blue-200 text-blue-800"
                              : interaction.sentiment === "Biasa"
                              ? "bg-gray-100 text-gray-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {interaction.sentiment}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6 sm:mt-8 text-center">
                <a
                  href="/emolog"
                  className="flex items-center justify-center mx-auto text-violet-600 hover:text-violet-800 font-bold transition-colors group text-sm"
                >
                  Lihat semua interaksi
                  <ArrowRight className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform" />
                </a>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-lg border border-gray-100 mb-6 sm:mb-8">
            <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-6 sm:mb-8">
              Quick Buttons
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              <a
                href="/emolog"
                className="flex flex-col items-center justify-center p-6 sm:p-8 bg-sky-100 text-violet-700 rounded-2xl hover:bg-blue-200 transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl group"
              >
                <Calendar className="w-6 h-6 sm:w-8 sm:h-8 mb-3 sm:mb-4 group-hover:scale-110 transition-transform" />
                <span className="font-bold text-base sm:text-lg">
                  Write your diary here!
                </span>
                <span className="text-xs sm:text-sm text-violet-600 mt-2">
                  Yuk Kenali dirimu lewat emolog!
                </span>
              </a>
              <a
                href="/alora"
                className="flex flex-col items-center justify-center p-6 sm:p-8 bg-violet-200 text-violet-800 rounded-2xl hover:bg-violet-300 transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl group"
              >
                <MessageCircle className="w-6 h-6 sm:w-8 sm:h-8 mb-3 sm:mb-4 group-hover:scale-110 transition-transform" />
                <span className="font-bold text-base sm:text-lg">
                  Greetings with AloRa!
                </span>
                <span className="text-xs sm:text-sm text-violet-700 mt-2">
                  Butuh teman bicara? AloRa ada 24/7 buat kamu!
                </span>
              </a>
              <button
                onClick={() => alert("Emergency Call, coming soon dlu bang!")}
                className="flex flex-col items-center justify-center p-6 sm:p-8 bg-red-600 text-white rounded-2xl hover:bg-red-700 transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl group sm:col-span-2 lg:col-span-1"
              >
                <Phone className="w-6 h-6 sm:w-8 sm:h-8 mb-3 sm:mb-4 group-hover:scale-110 transition-transform" />
                <span className="font-bold text-base sm:text-lg">
                  Emergency Call
                </span>
              </button>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-8 sm:mt-12 pt-6 sm:pt-8 border-t border-gray-200">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="text-xs sm:text-sm text-gray-600 mb-4 md:mb-0 font-medium text-center md:text-left">
                © 2025{" "}
                <span className="font-bold text-violet-700">Mentora</span>. Hak
                Cipta Dilindungi.
              </div>
              <div className="flex items-center space-x-6 sm:space-x-8">
                <button
                  onClick={() => alert("About Us, coming soon dlu bang!")}
                  className="text-xs sm:text-sm text-violet-600 hover:text-violet-800 transition-colors font-semibold"
                >
                  About-Us
                </button>
                <button
                  onClick={() => alert("Call center, coming soon dlu bang!")}
                  className="text-xs sm:text-sm text-violet-600 hover:text-violet-800 transition-colors font-semibold"
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

export default Dashboard;