import { useState, useEffect } from "react";
import {
  Home,
  MapPin,
  Users,
  TrendingUp,
  AlertTriangle,
  Activity,
  Bell,
  ChevronDown,
  Menu,
  X,
  LogOut,
  Map,
  BarChart3,
  PieChart,
} from "lucide-react";

import {
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart as RechartsPieChart,
  Cell,
  LineChart,
  Line,
} from "recharts";

interface DashboardPemerintahProps {
  userName?: string;
  userId?: string;
}

const DashboardPemerintah = ({ userName = "Admin Pemerintah" }: DashboardPemerintahProps) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [animateStats, setAnimateStats] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState("7d");
  const mockStressData = [
    { area: "Lowokwaru", level: 85, population: 45000, color: "#ef4444" },
    { area: "Klojen", level: 72, population: 38000, color: "#f97316" },
    { area: "Blimbing", level: 58, population: 42000, color: "#eab308" },
    { area: "Kedungkandang", level: 45, population: 35000, color: "#22c55e" },
    { area: "Sukun", level: 39, population: 40000, color: "#22c55e" },
  ];

  const chartData = [
    { date: "2025-01-10", stress: 65 },
    { date: "2025-01-11", stress: 72 },
    { date: "2025-01-12", stress: 58 },
    { date: "2025-01-13", stress: 84 },
    { date: "2025-01-14", stress: 67 },
    { date: "2025-01-15", stress: 73 },
    { date: "2025-01-16", stress: 71 },
  ];

  const pieData = [
    { name: "Stress Tinggi", value: 25, color: "#ef4444" },
    { name: "Stress Sedang", value: 35, color: "#f97316" },
    { name: "Stress Rendah", value: 40, color: "#22c55e" },
  ];

  useEffect(() => {
    const timer = setTimeout(() => setAnimateStats(true), 300);
    return () => clearTimeout(timer);
  }, []);

  const getFirstName = (fullName: string): string => {
    if (!fullName || typeof fullName !== "string") return "Admin";
    return fullName.trim().split(" ")[0];
  };

  const getInitials = (fullName: string): string => {
    if (!fullName || typeof fullName !== "string") return "A";
    return fullName
      .trim()
      .split(" ")
      .map((name) => name[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const statsCards = [
    {
      title: "Total Penduduk",
      value: "200Rb",
      description: "Kota Malang",
      change: "+1.2% dari bulan lalu",
      changeType: "positive" as const,
      icon: Users,
      bgColor: "bg-sky-100",
    },
    {
      title: "Tingkat Stress Rata-rata",
      value: "63.5%",
      description: "Minggu ini",
      change: "+5.8% dari minggu lalu",
      changeType: "negative" as const,
      icon: Activity,
      bgColor: "bg-red-100",
    },
    {
      title: "Area Kritis",
      value: "2",
      description: "Memerlukan perhatian",
      change: "Lowokwaru, Klojen",
      changeType: "warning" as const,
      icon: AlertTriangle,
      bgColor: "bg-orange-100",
    },
    {
      title: "Trend Positif",
      value: "3",
      description: "Area membaik",
      change: "Sukun, Kedungkandang, Blimbing",
      changeType: "positive" as const,
      icon: TrendingUp,
      bgColor: "bg-green-100",
    },
  ];

  const handleLogout = () => {
    if (confirm("Apakah Anda yakin ingin keluar?")) {
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
                : card.changeType === "warning"
                ? "text-orange-700 bg-orange-100"
                : "text-gray-700 bg-gray-100"
            }`}
          >
            {card.change}
          </div>
        </div>
      </div>
    </div>
  );

  const HeatmapPlaceholder = () => (
    <div className="w-full h-96 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl border-2 border-blue-200 shadow-inner relative overflow-hidden">
      <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
        <div className="text-center p-8">
          <Map className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-600 mb-2">Heatmap Kota Malang</h3>
          <div className="text-sm text-gray-400">
            <div className="flex justify-center space-x-4 mb-2">
              <div className="flex items-center">
                <div className="w-4 h-4 bg-red-500 rounded mr-2"></div>
                <span>Stress Tinggi (70-100%)</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-orange-500 rounded mr-2"></div>
                <span>Stress Sedang (40-70%)</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-green-500 rounded mr-2"></div>
                <span>Stress Rendah (0-40%)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-white">
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
            <div className="group relative w-full flex items-center px-4 py-3.5 text-left rounded-xl bg-white text-violet-800 shadow-lg transform translate-x-2 scale-105">
              <div className="w-9 h-9 rounded-lg flex items-center justify-center mr-3 shadow-md bg-violet-600">
                <Home className="w-4 h-4 text-white" />
              </div>
              <span className="font-medium text-sm">Dashboard Pemerintah</span>
              <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-8 bg-violet-600 rounded-r-full"></div>
            </div>
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
                    Dashboard Pemerintah
                  </h1>
                  <p className="text-gray-600 mt-1 font-medium text-sm">
                    Monitoring Kesehatan Mental Masyarakat
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
                        {getInitials(userName)}
                      </span>
                    </div>
                    <span className="hidden sm:inline mr-2 font-semibold">
                      {getFirstName(userName)}
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

          {/* Main Heatmap Section */}
          <div className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-lg border border-gray-100 mb-6 sm:mb-8">
            <div className="flex items-center justify-between mb-6 sm:mb-8">
              <h3 className="text-xl sm:text-2xl font-bold text-gray-800">
                Heatmap Emotional Monitor
              </h3>
              <div className="flex items-center space-x-2">
                <button 
                  onClick={() => setSelectedPeriod("24h")}
                  className={`px-3 py-2 text-sm rounded-lg transition-all ${selectedPeriod === "24h" ? "bg-violet-600 text-white" : "bg-sky-100 text-violet-700 hover:bg-blue-200"}`}
                >
                  24 Jam
                </button>
                <button 
                  onClick={() => setSelectedPeriod("7d")}
                  className={`px-3 py-2 text-sm rounded-lg transition-all ${selectedPeriod === "7d" ? "bg-violet-600 text-white" : "bg-sky-100 text-violet-700 hover:bg-blue-200"}`}
                >
                  7 Hari
                </button>
                <button 
                  onClick={() => setSelectedPeriod("30d")}
                  className={`px-3 py-2 text-sm rounded-lg transition-all ${selectedPeriod === "30d" ? "bg-violet-600 text-white" : "bg-sky-100 text-violet-700 hover:bg-blue-200"}`}
                >
                  30 Hari
                </button>
              </div>
            </div>
            <HeatmapPlaceholder />
          </div>

          {/* Area Details */}
          <div className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-lg border border-gray-100 mb-6 sm:mb-8">
            <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-6 sm:mb-8">
              Detail per Kecamatan
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 sm:gap-6">
              {mockStressData.map((area, index) => (
                <div
                  key={area.area}
                  className={`p-4 sm:p-6 rounded-2xl shadow-lg border-l-4 transition-all duration-300 hover:scale-105 ${
                    animateStats ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
                  }`}
                  style={{ 
                    borderLeftColor: area.color,
                    transitionDelay: `${index * 100}ms`,
                    backgroundColor: area.level >= 70 ? "#fef2f2" : area.level >= 40 ? "#fffbeb" : "#f0fdf4"
                  }}
                >
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-bold text-gray-800 text-sm sm:text-base">
                      {area.area}
                    </h4>
                    <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-xs sm:text-sm text-gray-600">Tingkat Stress</span>
                      <span 
                        className="text-sm sm:text-base font-black"
                        style={{ color: area.color }}
                      >
                        {area.level}%
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs sm:text-sm text-gray-600">Populasi</span>
                      <span className="text-xs sm:text-sm font-bold text-gray-800">
                        {area.population.toLocaleString()}
                      </span>
                    </div>
                    <div 
                      className="w-full bg-gray-200 rounded-full h-2 mt-3"
                    >
                      <div
                        className="h-2 rounded-full transition-all duration-1000"
                        style={{ 
                          width: `${area.level}%`,
                          backgroundColor: area.color
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="mt-8 sm:mt-12 pt-6 sm:pt-8 border-t border-gray-200">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="text-xs sm:text-sm text-gray-600 mb-4 md:mb-0 font-medium text-center md:text-left">
                © 2025{" "}
                <span className="font-bold text-violet-700">Mentora</span> - Dashboard Pemerintah
              </div>
              <div className="flex items-center space-x-6 sm:space-x-8">
                <button
                  onClick={() => alert("Dokumentasi API akan segera tersedia!")}
                  className="text-xs sm:text-sm text-violet-600 hover:text-violet-800 transition-colors font-semibold"
                >
                  API Docs
                </button>
                <button
                  onClick={() => alert("Support akan segera tersedia!")}
                  className="text-xs sm:text-sm text-violet-600 hover:text-violet-800 transition-colors font-semibold"
                >
                  Support
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPemerintah;