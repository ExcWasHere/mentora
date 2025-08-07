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
  MapPin,
  Star,
  Phone,
  Clock,
  BookOpen,
  Video,
  User,
  Building,
  CheckCircle,
  Mail,
  Award,
  Calendar as CalendarIcon,
  ChevronLeft,
  Share2,
  Bookmark,
  MessageSquare,
  ThumbsUp,
} from "lucide-react";
import { useLoaderData, Link } from "@remix-run/react";

interface Review {
  id: string;
  patientName: string;
  rating: number;
  comment: string;
  date: string;
  consultationType: "online" | "offline";
}

interface Schedule {
  day: string;
  times: string[];
  available: boolean;
}

interface PsychologistDetail {
  id: string;
  name: string;
  specialty: string;
  rating: number;
  totalReviews: number;
  experience: number;
  location: string;
  hospital: string;
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
  description: string;
  education: string[];
  certifications: string[];
  languages: string[];
  whatsapp: string;
  email: string;
  schedule: Schedule[];
  reviews: Review[];
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

const PsikologProfile = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedReviewFilter, setSelectedReviewFilter] = useState("all");
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [bookingType, setBookingType] = useState<"online" | "offline">("online");
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [activeProfileTab, setActiveProfileTab] = useState("overview");

  type LoaderData = {
    userId: string;
    userName?: string;
    userEmail?: string;
  };

  const { userName = "Pengguna" } = useLoaderData<LoaderData>();
  const psychologist: PsychologistDetail = {
    id: "1",
    name: "Dr. Sarah Wijaya, M.Psi",
    specialty: "Psikolog Klinis",
    rating: 4.9,
    totalReviews: 148,
    experience: 8,
    location: "Jakarta Selatan",
    hospital: "RS. Mentari Sehat",
    avatar: "SW",
    price: { online: 150000, offline: 200000 },
    available: { online: true, offline: true },
    nextAvailable: "Hari ini, 14:00",
    description: "Dr. Sarah Wijaya adalah seorang psikolog klinis berpengalaman dengan keahlian khusus dalam menangani gangguan kecemasan, depresi, dan trauma. Dengan pendekatan yang holistik dan empati tinggi, beliau telah membantu ratusan pasien untuk mencapai kesehatan mental yang optimal.",
    education: [
      "S2 Psikologi Klinis - Universitas Indonesia (2015)",
      "S1 Psikologi - Universitas Gadjah Mada (2013)"
    ],
    certifications: [
      "Certified Clinical Psychologist (HIMPSI)",
      "Trauma-Focused CBT Certification",
      "Mindfulness-Based Therapy Certification"
    ],
    languages: ["Bahasa Indonesia", "English", "Mandarin"],
    whatsapp: "+628123456789",
    email: "dr.sarah.wijaya@mentorasehat.com",
    schedule: [
      { day: "Senin", times: ["09:00", "11:00", "14:00", "16:00"], available: true },
      { day: "Selasa", times: ["10:00", "13:00", "15:00"], available: true },
      { day: "Rabu", times: ["09:00", "11:00", "14:00", "16:00"], available: true },
      { day: "Kamis", times: ["10:00", "13:00", "15:00"], available: true },
      { day: "Jumat", times: ["09:00", "11:00"], available: true },
      { day: "Sabtu", times: ["09:00", "11:00"], available: true },
      { day: "Minggu", times: [], available: false },
    ],
    reviews: [
      {
        id: "1",
        patientName: "Andi S.",
        rating: 5,
        comment: "Dr. Sarah sangat profesional dan membantu. Sesi konseling online sangat efektif dan membuat saya merasa lebih baik.",
        date: "2 hari yang lalu",
        consultationType: "online"
      },
      {
        id: "2", 
        patientName: "Maya R.",
        rating: 5,
        comment: "Pendekatan yang sangat humanis dan tidak menghakimi. Terima kasih Dr. Sarah!",
        date: "1 minggu yang lalu",
        consultationType: "offline"
      },
      {
        id: "3",
        patientName: "Budi T.",
        rating: 4,
        comment: "Konsultasi yang sangat membantu untuk mengatasi kecemasan saya. Recommended!",
        date: "2 minggu yang lalu",
        consultationType: "online"
      }
    ]
  };

  const filteredReviews = psychologist.reviews.filter(review => {
    if (selectedReviewFilter === "online") return review.consultationType === "online";
    if (selectedReviewFilter === "offline") return review.consultationType === "offline";
    return true;
  });

  const handleBooking = (type: "online" | "offline") => {
    setShowBookingModal(false);
    alert(`Booking ${type} berhasil! Anda akan diarahkan ke halaman pembayaran.`);
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
                <div className="flex items-center space-x-3">
                  <Link
                    to="/consultation"
                    className="bg-sky-100 text-violet-700 p-2 rounded-xl hover:bg-blue-200 transition-colors"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </Link>
                  <div>
                    <h1 className="text-2xl sm:text-3xl font-black text-violet-700">
                      Profile Psikolog
                    </h1>
                    <p className="text-gray-600 mt-1 font-medium text-sm">
                     Ini adalah Detail profil dan informasi psikolog Anda, {getFirstName(userName)}! 👨‍⚕️
                    </p>
                  </div>
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
          {/* Psychologist Header Card */}
          <div className="bg-gradient-to-r from-violet-600 to-blue-600 rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-xl border border-gray-100 mb-6 sm:mb-8 text-white">
            <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center">
              <div className="w-24 h-24 bg-white rounded-2xl flex items-center justify-center shadow-lg">
                <span className="text-violet-600 font-bold text-3xl">
                  {psychologist.avatar}
                </span>
              </div>
              
              <div className="flex-1">
                <h2 className="text-2xl sm:text-3xl font-bold mb-2">{psychologist.name}</h2>
                <p className="text-violet-100 text-lg mb-3">{psychologist.specialty}</p>
                
                <div className="flex flex-wrap gap-4 mb-4">
                  <div className="flex items-center gap-2 bg-white/20 rounded-lg px-3 py-1">
                    <Star className="w-4 h-4 text-yellow-300 fill-current" />
                    <span className="font-bold">{psychologist.rating}</span>
                    <span className="text-violet-100">({psychologist.totalReviews} ulasan)</span>
                  </div>
                  <div className="flex items-center gap-2 bg-white/20 rounded-lg px-3 py-1">
                    <BookOpen className="w-4 h-4" />
                    <span>{psychologist.experience} tahun pengalaman</span>
                  </div>
                  <div className="flex items-center gap-2 bg-white/20 rounded-lg px-3 py-1">
                    <MapPin className="w-4 h-4" />
                    <span>{psychologist.location}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 mb-4">
                  <Building className="w-4 h-4" />
                  <span className="text-violet-100">{psychologist.hospital}</span>
                </div>

                <div className="flex flex-wrap gap-3">
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${psychologist.available.online ? "bg-green-400" : "bg-red-400"}`}></div>
                    <span className="text-sm">Online {psychologist.available.online ? "Tersedia" : "Tidak Tersedia"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${psychologist.available.offline ? "bg-green-400" : "bg-red-400"}`}></div>
                    <span className="text-sm">Offline {psychologist.available.offline ? "Tersedia" : "Tidak Tersedia"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span className="text-sm">{psychologist.nextAvailable}</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-3 lg:w-48">
                <button
                  onClick={() => setIsBookmarked(!isBookmarked)}
                  className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-bold transition-all duration-300 ${
                    isBookmarked 
                      ? "bg-yellow-500 text-white"
                      : "bg-white/20 text-white hover:bg-white/30"
                  }`}
                >
                  <Bookmark className="w-5 h-5" fill={isBookmarked ? "currentColor" : "none"} />
                  <span>{isBookmarked ? "Disimpan" : "Simpan"}</span>
                </button>
                <button className="flex items-center justify-center gap-2 px-4 py-3 bg-white/20 text-white rounded-xl font-bold hover:bg-white/30 transition-all duration-300">
                  <Share2 className="w-5 h-5" />
                  <span>Bagikan</span>
                </button>
              </div>
            </div>
          </div>

          {/* Profile Tabs */}
          <div className="bg-white rounded-2xl sm:rounded-3xl shadow-lg border border-gray-100 mb-6 sm:mb-8">
            <div className="flex flex-wrap gap-2 p-4 border-b border-gray-200">
              {[
                { id: "overview", label: "Overview" },
                { id: "schedule", label: "Jadwal" },
                { id: "reviews", label: "Ulasan" },
                { id: "contact", label: "Kontak" }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveProfileTab(tab.id)}
                  className={`px-4 py-2 rounded-lg font-semibold transition-all duration-300 ${
                    activeProfileTab === tab.id
                      ? "bg-violet-600 text-white shadow-md"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="p-6">
              {/* Overview Tab */}
              {activeProfileTab === "overview" && (
                <div className="space-y-8">
                  {/* Description */}
                  <div>
                    <h3 className="text-xl font-bold text-gray-800 mb-4">Tentang Dr. {psychologist.name.split(' ')[1]}</h3>
                    <p className="text-gray-600 leading-relaxed">{psychologist.description}</p>
                  </div>

                  {/* Education */}
                  <div>
                    <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                      <Award className="w-5 h-5 text-violet-600" />
                      Pendidikan
                    </h3>
                    <div className="space-y-3">
                      {psychologist.education.map((edu, index) => (
                        <div key={index} className="bg-sky-100 rounded-xl p-4">
                          <p className="font-semibold text-gray-800">{edu}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Certifications */}
                  <div>
                    <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-violet-600" />
                      Sertifikasi
                    </h3>
                    <div className="grid md:grid-cols-2 gap-3">
                      {psychologist.certifications.map((cert, index) => (
                        <div key={index} className="bg-violet-100 rounded-xl p-4">
                          <p className="font-semibold text-violet-800">{cert}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Languages */}
                  <div>
                    <h3 className="text-xl font-bold text-gray-800 mb-4">Bahasa yang Dikuasai</h3>
                    <div className="flex flex-wrap gap-2">
                      {psychologist.languages.map((lang, index) => (
                        <span key={index} className="px-3 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold">
                          {lang}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Schedule Tab */}
              {activeProfileTab === "schedule" && (
                <div>
                  <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                    <CalendarIcon className="w-5 h-5 text-violet-600" />
                    Jadwal Praktik Mingguan
                  </h3>
                  <div className="space-y-4">
                    {psychologist.schedule.map((day, index) => (
                      <div key={index} className={`p-4 rounded-xl border-2 ${
                        day.available 
                          ? "border-green-200 bg-green-50"
                          : "border-gray-200 bg-gray-50"
                      }`}>
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-bold text-lg text-gray-800">{day.day}</h4>
                          <span className={`px-3 py-1 rounded-full text-sm font-bold ${
                            day.available 
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-200 text-gray-600"
                          }`}>
                            {day.available ? "Tersedia" : "Tutup"}
                          </span>
                        </div>
                        {day.available ? (
                          <div className="flex flex-wrap gap-2">
                            {day.times.map((time, timeIndex) => (
                              <span key={timeIndex} className="px-3 py-1 bg-violet-100 text-violet-800 rounded-lg text-sm font-semibold">
                                {time}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <p className="text-gray-600 text-sm">Tidak ada jadwal praktik</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Reviews Tab */}
              {activeProfileTab === "reviews" && (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                      <MessageSquare className="w-5 h-5 text-violet-600" />
                      Ulasan Pasien ({psychologist.totalReviews})
                    </h3>
                    <select
                      value={selectedReviewFilter}
                      onChange={(e) => setSelectedReviewFilter(e.target.value)}
                      className="px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none"
                    >
                      <option value="all">Semua Ulasan</option>
                      <option value="online">Online</option>
                      <option value="offline">Offline</option>
                    </select>
                  </div>

                  <div className="space-y-4">
                    {filteredReviews.map((review) => (
                      <div key={review.id} className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-violet-600 rounded-full flex items-center justify-center">
                              <span className="text-white font-bold text-sm">
                                {review.patientName.split(' ').map(n => n[0]).join('')}
                              </span>
                            </div>
                            <div>
                              <p className="font-semibold text-gray-800">{review.patientName}</p>
                              <div className="flex items-center gap-2">
                                <div className="flex items-center">
                                  {[...Array(5)].map((_, i) => (
                                    <Star
                                      key={i}
                                      className={`w-4 h-4 ${
                                        i < review.rating
                                          ? "text-yellow-500 fill-current"
                                          : "text-gray-300"
                                      }`}
                                    />
                                  ))}
                                </div>
                                <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                                  review.consultationType === "online"
                                    ? "bg-sky-100 text-blue-700"
                                    : "bg-violet-100 text-violet-700"
                                }`}>
                                  {review.consultationType === "online" ? "Online" : "Offline"}
                                </span>
                              </div>
                            </div>
                          </div>
                          <span className="text-gray-500 text-sm">{review.date}</span>
                        </div>
                        <p className="text-gray-700 leading-relaxed">{review.comment}</p>
                        <div className="flex items-center gap-2 mt-4">
                          <button className="flex items-center gap-1 text-gray-500 hover:text-violet-600 transition-colors">
                            <ThumbsUp className="w-4 h-4" />
                            <span className="text-sm">Membantu</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {filteredReviews.length === 0 && (
                    <div className="text-center py-8">
                      <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500">Tidak ada ulasan untuk filter yang dipilih</p>
                    </div>
                  )}
                </div>
              )}

              {/* Contact Tab */}
              {activeProfileTab === "contact" && (
                <div>
                  <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                    <Phone className="w-5 h-5 text-violet-600" />
                    Informasi Kontak
                  </h3>

                  <div className="space-y-6">
                    {/* Practice Location */}
                    <div className="bg-sky-100 rounded-xl p-6">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-violet-600 rounded-xl flex items-center justify-center">
                          <Building className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-bold text-lg text-gray-800 mb-2">Tempat Praktik</h4>
                          <p className="text-gray-700 font-semibold mb-1">{psychologist.hospital}</p>
                          <p className="text-gray-600">{psychologist.location}</p>
                          <button className="mt-3 px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors font-semibold">
                            Lihat di Peta
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* WhatsApp */}
                    <div className="bg-green-50 rounded-xl p-6 border-2 border-green-200">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center">
                          <Phone className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-bold text-lg text-gray-800 mb-1">WhatsApp</h4>
                          <a
                            href={`https://wa.me/${psychologist.whatsapp.replace('+', '')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-semibold"
                          >
                            <Phone className="w-4 h-4" />
                            Chat WhatsApp
                          </a>
                        </div>
                      </div>
                    </div>

                    {/* Email */}
                    <div className="bg-blue-50 rounded-xl p-6 border-2 border-blue-200">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
                          <Mail className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-bold text-lg text-gray-800 mb-1">Email</h4>
                          <a
                            href={`mailto:${psychologist.email}`}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-semibold"
                          >
                            <Mail className="w-4 h-4" />
                            Kirim Email
                          </a>
                        </div>
                      </div>
                    </div>

                    {/* Important Notes */}
                    <div className="bg-yellow-50 rounded-xl p-6 border-2 border-yellow-200">
                      <h4 className="font-bold text-lg text-gray-800 mb-3 flex items-center gap-2">
                        <Bell className="w-5 h-5 text-yellow-600" />
                        Catatan Penting
                      </h4>
                      <ul className="space-y-2 text-gray-700">
                        <li className="flex items-start gap-2">
                          <span className="w-2 h-2 bg-yellow-500 rounded-full mt-2 flex-shrink-0"></span>
                          <span>Harap menggunakan bahasa yang sopan</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="w-2 h-2 bg-yellow-500 rounded-full mt-2 flex-shrink-0"></span>
                          <span>Respons email dalam 1-2 hari kerja</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="w-2 h-2 bg-yellow-500 rounded-full mt-2 flex-shrink-0"></span>
                          <span>Dilarang menyalahgunakan informasi yang diberikan</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}
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

export default PsikologProfile;