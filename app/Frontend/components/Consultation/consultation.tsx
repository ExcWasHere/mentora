import { useState } from "react";
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
  Search,
  MapPin,
  Star,
  Phone,
  Clock,
  Filter,
  BookOpen,
  Video,
  User,
  Building,
  Stethoscope,
  CheckCircle,
} from "lucide-react";
import { useLoaderData, Link } from "@remix-run/react";

interface Psychologist {
  id: string;
  name: string;
  specialty: string;
  rating: number;
  experience: number;
  location: string;
  hospital?: string;
  avatar: string;
  price: {
    online: number;
    offline: number;
  };
  available: {
    online: boolean;
    offline: boolean;
  };
  nextAvailable: string;
}

interface QueueTicket {
  id: string;
  type: "online" | "offline";
  psychologistId: string;
  psychologistName: string;
  queueNumber: number;
  estimatedTime: string;
  status: "waiting" | "active" | "completed";
  location?: string;
}

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

const ConsultationPage = () => {
  const [activeTab, setActiveTab] = useState("consultation");
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [selectedPsychologist, setSelectedPsychologist] =
    useState<Psychologist | null>(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [bookingType, setBookingType] = useState<"online" | "offline">(
    "online"
  );
  const [currentQueue, setCurrentQueue] = useState<QueueTicket | null>(null);
  const [showQueueModal, setShowQueueModal] = useState(false);

  type LoaderData = {
    userId: string;
    userName?: string;
    userEmail?: string;
  };

  const { userId, userName = "Pengguna" } = useLoaderData<LoaderData>();

  const psychologists: Psychologist[] = [
    {
      id: "1",
      name: "Dr. Sarah Wijaya, M.Psi",
      specialty: "Psikolog Klinis",
      rating: 4.9,
      experience: 8,
      location: "Jakarta Selatan",
      hospital: "RS. Mentari Sehat",
      avatar: "SW",
      price: { online: 150000, offline: 200000 },
      available: { online: true, offline: true },
      nextAvailable: "Hari ini, 14:00",
    },
    {
      id: "2",
      name: "Dr. Ahmad Rizki, S.Psi",
      specialty: "Psikolog Anak & Remaja",
      rating: 4.8,
      experience: 6,
      location: "Jakarta Pusat",
      hospital: "Klinik Jiwa Harmoni",
      avatar: "AR",
      price: { online: 120000, offline: 180000 },
      available: { online: false, offline: true },
      nextAvailable: "Besok, 10:00",
    },
    {
      id: "3",
      name: "Dr. Melati Putri, M.Psi",
      specialty: "Psikolog Keluarga",
      rating: 4.7,
      experience: 10,
      location: "Jakarta Barat",
      hospital: "RS. Harapan Keluarga",
      avatar: "MP",
      price: { online: 180000, offline: 250000 },
      available: { online: true, offline: false },
      nextAvailable: "Hari ini, 16:30",
    },
    {
      id: "4",
      name: "Dr. Budi Santoso, S.Psi",
      specialty: "Psikolog Trauma",
      rating: 4.9,
      experience: 12,
      location: "Jakarta Timur",
      hospital: "RS. Mitra Sehat",
      avatar: "BS",
      price: { online: 200000, offline: 300000 },
      available: { online: true, offline: true },
      nextAvailable: "Hari ini, 15:15",
    },
  ];

  const filteredPsychologists = psychologists.filter((psych) => {
    const matchesSearch =
      psych.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      psych.specialty.toLowerCase().includes(searchQuery.toLowerCase()) ||
      psych.location.toLowerCase().includes(searchQuery.toLowerCase());

    if (selectedFilter === "online")
      return matchesSearch && psych.available.online;
    if (selectedFilter === "offline")
      return matchesSearch && psych.available.offline;
    return matchesSearch;
  });

  const handleBooking = (type: "online" | "offline") => {
    if (!selectedPsychologist) return;

    const newTicket: QueueTicket = {
      id: Date.now().toString(),
      type,
      psychologistId: selectedPsychologist.id,
      psychologistName: selectedPsychologist.name,
      queueNumber: Math.floor(Math.random() * 20) + 1,
      estimatedTime: type === "online" ? "15 menit" : "45 menit",
      status: "waiting",
      location: type === "offline" ? selectedPsychologist.hospital : undefined,
    };

    setCurrentQueue(newTicket);
    setShowBookingModal(false);
    setShowQueueModal(true);
  };

  const handleLogout = () => {
    if (confirm("Apakah kamu yakin mau pergi:( ?")) {
      window.location.href = "/logout";
    }
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

  const Logo = () => (
    <div className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg overflow-hidden bg-white">
      <img
        src="/favicon.ico"
        alt="Mentora Logo"
        className="w-full h-full object-cover"
      />
    </div>
  );

  const SidebarItem = ({ item }: { item: (typeof sidebarItems)[0] }) => (
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
                    Consultation
                  </h1>
                  <p className="text-gray-600 mt-1 font-medium text-sm">
                    Temukan psikolog yang tepat untuk Anda,{" "}
                    {getFirstName(userName)}! 🏥
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
          {/* Search and Filter Section */}
          <div className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-lg border border-gray-100 mb-6 sm:mb-8">
            <div className="flex flex-col lg:flex-row gap-4 items-center">
              <div className="relative flex-1 w-full">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Cari psikolog, spesialisasi, atau lokasi..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none transition-all duration-300"
                />
              </div>
              <div className="flex gap-2 w-full lg:w-auto">
                <select
                  value={selectedFilter}
                  onChange={(e) => setSelectedFilter(e.target.value)}
                  className="flex-1 lg:flex-none px-4 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none transition-all duration-300"
                >
                  <option value="all">Semua</option>
                  <option value="online">Online Saja</option>
                  <option value="offline">Offline Saja</option>
                </select>
                <button className="px-6 py-4 bg-violet-600 text-white rounded-xl hover:bg-violet-700 transition-all duration-300 shadow-lg">
                  <Filter className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Current Queue Status */}
          {currentQueue && (
            <div className="bg-gradient-to-r from-violet-600 to-blue-600 rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-xl border border-gray-100 mb-6 sm:mb-8 text-white">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl sm:text-2xl font-bold">Antrian Aktif</h3>
                <span className="px-4 py-2 bg-white/20 rounded-full text-sm font-bold">
                  {currentQueue.type === "online" ? "Online" : "Offline"}
                </span>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <p className="text-violet-100">Psikolog</p>
                  <p className="font-bold text-xl">
                    {currentQueue.psychologistName}
                  </p>
                  <p className="text-violet-100 mt-2">Nomor Antrian</p>
                  <p className="font-black text-3xl">
                    {currentQueue.queueNumber}
                  </p>
                </div>
                <div className="flex flex-col justify-between">
                  <div>
                    <p className="text-violet-100">Estimasi Waktu</p>
                    <p className="font-bold text-lg">
                      {currentQueue.estimatedTime}
                    </p>
                    {currentQueue.location && (
                      <>
                        <p className="text-violet-100 mt-2">Lokasi</p>
                        <p className="font-bold">{currentQueue.location}</p>
                      </>
                    )}
                  </div>
                  <div className="flex gap-3 mt-4">
                    <button
                      onClick={() => setShowQueueModal(true)}
                      className="flex-1 bg-white text-violet-600 px-4 py-3 rounded-xl font-bold hover:bg-violet-50 transition-all duration-300"
                    >
                      Detail
                    </button>
                    <button
                      onClick={() =>
                        alert("Fitur panggilan darurat akan segera hadir!")
                      }
                      className="flex items-center justify-center px-4 py-3 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-all duration-300"
                    >
                      <Phone className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Psychologists List */}
          <div className="grid gap-6 sm:gap-8">
            {filteredPsychologists.map((psychologist) => (
              <div
                key={psychologist.id}
                className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:scale-102"
              >
                <div className="flex flex-col lg:flex-row gap-6">
                  {/* Psychologist Info */}
                  <div className="flex-1">
                    <div className="flex items-start gap-4 mb-4">
                      <div className="w-16 h-16 bg-violet-600 rounded-2xl flex items-center justify-center shadow-md">
                        <span className="text-white font-bold text-lg">
                          {psychologist.avatar}
                        </span>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-800 mb-1">
                          {psychologist.name}
                        </h3>
                        <p className="text-violet-600 font-semibold mb-2">
                          {psychologist.specialty}
                        </p>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 text-yellow-500 fill-current" />
                            <span className="font-semibold">
                              {psychologist.rating}
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <BookOpen className="w-4 h-4" />
                            <span>{psychologist.experience} tahun</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            <span>{psychologist.location}</span>
                          </div>
                        </div>
                        {psychologist.hospital && (
                          <div className="flex items-center gap-1 mt-2 text-sm text-gray-600">
                            <Building className="w-4 h-4" />
                            <span>{psychologist.hospital}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Availability */}
                    <div className="flex items-center gap-4 mb-4">
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-3 h-3 rounded-full ${
                            psychologist.available.online
                              ? "bg-green-500"
                              : "bg-gray-300"
                          }`}
                        ></div>
                        <span className="text-sm font-medium">Online</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-3 h-3 rounded-full ${
                            psychologist.available.offline
                              ? "bg-green-500"
                              : "bg-gray-300"
                          }`}
                        ></div>
                        <span className="text-sm font-medium">Offline</span>
                      </div>
                      <div className="flex items-center gap-1 text-sm text-gray-600">
                        <Clock className="w-4 h-4" />
                        <span>Tersedia: {psychologist.nextAvailable}</span>
                      </div>
                    </div>

                    {/* Pricing */}
                    <div className="flex gap-4 mb-6">
                      <div className="bg-sky-100 rounded-xl p-3 flex-1">
                        <p className="text-xs text-gray-600 mb-1">
                          Konsultasi Online
                        </p>
                        <p className="font-bold text-violet-700">
                          Rp {psychologist.price.online.toLocaleString()}
                        </p>
                      </div>
                      <div className="bg-violet-100 rounded-xl p-3 flex-1">
                        <p className="text-xs text-gray-600 mb-1">
                          Konsultasi Offline
                        </p>
                        <p className="font-bold text-violet-700">
                          Rp {psychologist.price.offline.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="lg:w-48 flex lg:flex-col gap-3">
                    <button
                      onClick={() => {
                        setSelectedPsychologist(psychologist);
                        setBookingType("online");
                        setShowBookingModal(true);
                      }}
                      disabled={!psychologist.available.online}
                      className={`flex-1 lg:flex-none flex items-center justify-center gap-2 px-6 py-4 rounded-xl font-bold transition-all duration-300 ${
                        psychologist.available.online
                          ? "bg-sky-100 text-violet-700 hover:bg-blue-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                          : "bg-gray-100 text-gray-400 cursor-not-allowed"
                      }`}
                    >
                      <Video className="w-5 h-5" />
                      <span className="text-sm">Online</span>
                    </button>
                    <button
                      onClick={() => {
                        setSelectedPsychologist(psychologist);
                        setBookingType("offline");
                        setShowBookingModal(true);
                      }}
                      disabled={!psychologist.available.offline}
                      className={`flex-1 lg:flex-none flex items-center justify-center gap-2 px-6 py-4 rounded-xl font-bold transition-all duration-300 ${
                        psychologist.available.offline
                          ? "bg-violet-600 text-white hover:bg-violet-700 shadow-lg hover:shadow-xl transform hover:scale-105"
                          : "bg-gray-100 text-gray-400 cursor-not-allowed"
                      }`}
                    >
                      <User className="w-5 h-5" />
                      <span className="text-sm">Offline</span>
                    </button>
                    <a
                        href="/profile-psikolog"
                      className="flex-1 lg:flex-none flex items-center justify-center gap-2 px-6 py-4 border-2 border-violet-600 text-violet-600 rounded-xl font-bold hover:bg-violet-50 transition-all duration-300"
                    >
                      <Stethoscope className="w-5 h-5" />
                      <span className="text-sm">Profil</span>
                    </a>
                  </div>
                </div>
              </div>
            ))}
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

      {/* Booking Modal */}
      {showBookingModal && selectedPsychologist && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl">
            <h3 className="text-2xl font-bold text-gray-800 mb-6">
              Konfirmasi Booking
            </h3>
            <div className="mb-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-violet-600 rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold">
                    {selectedPsychologist.avatar}
                  </span>
                </div>
                <div>
                  <p className="font-bold text-gray-800">
                    {selectedPsychologist.name}
                  </p>
                  <p className="text-violet-600 text-sm">
                    {selectedPsychologist.specialty}
                  </p>
                </div>
              </div>
              <div className="bg-sky-100 rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold">Jenis Konsultasi:</span>
                  <span className="font-bold text-violet-700 capitalize">
                    {bookingType}
                  </span>
                </div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold">Biaya:</span>
                  <span className="font-bold text-violet-700">
                    Rp{" "}
                    {selectedPsychologist.price[bookingType].toLocaleString()}
                  </span>
                </div>
                {bookingType === "offline" && (
                  <div className="flex items-center justify-between">
                    <span className="font-semibold">Lokasi:</span>
                    <span className="font-bold text-violet-700">
                      {selectedPsychologist.hospital}
                    </span>
                  </div>
                )}
              </div>
            </div>
            <div className="flex gap-4">
              <button
                onClick={() => setShowBookingModal(false)}
                className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-bold hover:bg-gray-50 transition-all duration-300"
              >
                Batal
              </button>
              <button
                onClick={() => handleBooking(bookingType)}
                className="flex-1 px-6 py-3 bg-violet-600 text-white rounded-xl font-bold hover:bg-violet-700 transition-all duration-300 shadow-lg"
              >
                Ambil Antrian
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Queue Modal */}
      {showQueueModal && currentQueue && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-8 max-w-lg w-full shadow-2xl">
            <div className="text-center mb-6">
              <div className="w-20 h-20 bg-gradient-to-r from-violet-600 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">
                Antrian Berhasil Dibuat!
              </h3>
              <p className="text-gray-600">
                Anda akan segera mendapat notifikasi ketika giliran Anda tiba
              </p>
            </div>

            <div className="bg-gradient-to-r from-violet-50 to-blue-50 rounded-xl p-6 mb-6">
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="text-center">
                  <p className="text-gray-600 text-sm mb-1">Nomor Antrian</p>
                  <p className="text-3xl font-black text-violet-700">
                    {currentQueue.queueNumber}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-gray-600 text-sm mb-1">Estimasi Waktu</p>
                  <p className="text-lg font-bold text-violet-700">
                    {currentQueue.estimatedTime}
                  </p>
                </div>
              </div>

              <div className="border-t border-violet-200 pt-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-600">Psikolog:</span>
                  <span className="font-bold">
                    {currentQueue.psychologistName}
                  </span>
                </div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-600">Jenis:</span>
                  <span className="font-bold capitalize">
                    {currentQueue.type}
                  </span>
                </div>
                {currentQueue.location && (
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-600">Lokasi:</span>
                    <span className="font-bold">{currentQueue.location}</span>
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Status:</span>
                  <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-bold">
                    Menunggu
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <button
                onClick={() => {
                  if (currentQueue.type === "online") {
                    alert("Membuka ruang chat konsultasi...");
                  } else {
                    alert("Menampilkan peta menuju lokasi...");
                  }
                }}
                className="flex items-center justify-center gap-2 px-4 py-3 bg-sky-100 text-violet-700 rounded-xl font-bold hover:bg-blue-200 transition-all duration-300"
              >
                {currentQueue.type === "online" ? (
                  <>
                    <MessageCircle className="w-5 h-5" />
                    <span>Chat Room</span>
                  </>
                ) : (
                  <>
                    <MapPin className="w-5 h-5" />
                    <span>Lokasi</span>
                  </>
                )}
              </button>
              <button
                onClick={() =>
                  alert("Tunggu Persetujuan Psikolog yaa!")
                }
                className="flex items-center justify-center gap-2 px-4 py-3 bg-green-100 text-green-700 rounded-xl font-bold hover:bg-green-200 transition-all duration-300"
              >
                <Phone className="w-5 h-5" />
                <span>Call</span>
              </button>
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => setShowQueueModal(false)}
                className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-bold hover:bg-gray-50 transition-all duration-300"
              >
                Tutup
              </button>
              <button
                onClick={() => {
                  if (confirm("Apakah Anda yakin ingin membatalkan antrian?")) {
                    setCurrentQueue(null);
                    setShowQueueModal(false);
                  }
                }}
                className="flex-1 px-6 py-3 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition-all duration-300"
              >
                Batalkan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConsultationPage;