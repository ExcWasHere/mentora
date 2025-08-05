import { useEffect, useState } from "react";
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
} from "lucide-react";
import { useLoaderData, Link } from "@remix-run/react";

const EMOTION_OPTIONS = [
  { key: "Sangat Baik", label: "Sangat Baik", emoji: "😄" },
  { key: "Baik", label: "Baik", emoji: "🙂" },
  { key: "Biasa", label: "Biasa", emoji: "😐" },
  { key: "Sedih", label: "Sedih", emoji: "😔" },
  { key: "Cemas", label: "Cemas", emoji: "😰" },
  { key: "Marah", label: "Marah", emoji: "😡" },
];

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

const EmologPage = () => {
  const [activeTab, setActiveTab] = useState("emotions");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);
  const [note, setNote] = useState("");
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  
  type LoaderData = {
    userId: string;
    userName?: string;
    userEmail?: string;
  };

  const { userId, userName = "Pengguna" } = useLoaderData<LoaderData>();
  const [interactionWith, setInteractionWith] = useState("Teman");
  
  type EmologHistory = {
    id: number;
    emotion: string;
    note?: string;
    interaction_with?: string;
    activity?: string;
    mood?: string;
    date?: string;
    time?: string;
  };
  
  const [history, setHistory] = useState<EmologHistory[]>([]);
  
  const fetchEmolog = async () => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/emolog?user_id=${userId}`
      );
      const data = await res.json();
      console.log("Fetched history:", data);
      setHistory(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Gagal fetch riwayat emosi:", error);
      setHistory([]);
    }
  };

  useEffect(() => {
    fetchEmolog();
  }, [userId]);

  const handleSave = async () => {
    console.log("Submitting emotion...");
    if (!selected) return;
    const payload = {
      user_id: userId,
      emotion: selected,
      note,
      interaction_with: interactionWith,
      activity: "Ngobrol bareng",
      mood: "Positif",
      date: new Date().toISOString().split("T")[0],
    };

    try {
      const res = await fetch("http://localhost:5000/api/emolog", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = await res.json();
      console.log("Response from server:", result);

      if (!res.ok) {
        alert("Gagal menyimpan emosi 😢");
        console.error("Server error:", result?.error || res.statusText);
      } else {
        alert("Berhasil menyimpan emosi! 💙");
        setNote("");
        setSelected(null);
        fetchEmolog();
      }
    } catch (error) {
      console.error("Network error saat menyimpan emosi:", error);
      alert("Ups! Terjadi kesalahan jaringan 😢");
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm("Apakah kamu yakin ingin menghapus emosi ini?")) {
      setHistory(history.filter((h) => h.id !== id));
    }
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
                    Emotion Log
                  </h1>
                  <p className="text-gray-600 mt-1 font-medium text-sm">
                    Catat dan pantau emosimu setiap hari, {getFirstName(userName)}! 🌟
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
          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 mb-6 sm:mb-8">
            {/* Form Emotion */}
            <div className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-lg border border-gray-100">
              <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-6">
                Bagaimana perasaanmu hari ini?
              </h3>
              
              {/* Emotion Options */}
              <div className="grid grid-cols-3 gap-3 sm:gap-4 mb-6">
                {EMOTION_OPTIONS.map((opt) => (
                  <button
                    key={opt.key}
                    onClick={() => setSelected(opt.key)}
                    className={`p-3 sm:p-4 rounded-2xl flex flex-col items-center transition-all duration-300 transform hover:scale-105 shadow-md ${
                      selected === opt.key
                        ? "ring-2 ring-violet-400 bg-violet-50 shadow-lg"
                        : "bg-sky-100 hover:bg-blue-200"
                    }`}
                  >
                    <span className="text-2xl sm:text-3xl mb-2">{opt.emoji}</span>
                    <span className="text-xs sm:text-sm font-medium text-violet-700">
                      {opt.label}
                    </span>
                  </button>
                ))}
              </div>

              {/* Note Input */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Catatan (opsional)
                </label>
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Ceritakan lebih detail tentang perasaanmu hari ini..."
                  className="w-full border border-gray-300 rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all duration-300 resize-none"
                  rows={3}
                />
              </div>

              {/* Interaction Selector */}
              <div className="mb-6">
                <label
                  htmlFor="interactionWith"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  Interaksi Dengan
                </label>
                <select
                  id="interactionWith"
                  value={interactionWith}
                  onChange={(e) => setInteractionWith(e.target.value)}
                  className="w-full border border-gray-300 rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all duration-300"
                >
                  <option value="Teman">Teman</option>
                  <option value="Keluarga">Keluarga</option>
                  <option value="Rekan Kerja">Rekan Kerja</option>
                  <option value="Pasangan">Pasangan</option>
                  <option value="Lainnya">Lainnya</option>
                </select>
              </div>

              {/* Save Button */}
              <button
                disabled={!selected}
                onClick={handleSave}
                className="w-full bg-violet-600 text-white py-4 rounded-xl hover:bg-violet-700 disabled:opacity-50 disabled:cursor-not-allowed font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                {selected ? "Simpan Emosi 💜" : "Pilih Emosi Terlebih Dahulu"}
              </button>
            </div>

            {/* Diary */}
            <div className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-lg border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl sm:text-2xl font-bold text-gray-800">
                  EmoDiary
                </h3>
                <span className="text-sm font-medium text-violet-600 bg-violet-100 px-3 py-1 rounded-full">
                  {history.length} Catatan
                </span>
              </div>
              
              {history.length === 0 ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-sky-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Calendar className="w-8 h-8 text-violet-700" />
                  </div>
                  <p className="text-gray-500 font-medium">
                    Belum ada data emosi
                  </p>
                  <p className="text-sm text-gray-400 mt-1">
                    Mulai catat emosimu hari ini! 🌟
                  </p>
                </div>
              ) : (
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {history.map((h, index) => (
                    <div
                      key={h.id}
                      className="bg-sky-50 p-4 rounded-2xl border border-blue-200 hover:shadow-md transition-all duration-300 transform hover:scale-102"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center">
                          <span className="text-2xl mr-3">
                            {
                              EMOTION_OPTIONS.find((e) => e.key === h.emotion)
                                ?.emoji
                            }
                          </span>
                          <div>
                            <span className="font-bold text-violet-700">
                              {
                                EMOTION_OPTIONS.find((e) => e.key === h.emotion)
                                  ?.label
                              }
                            </span>
                            {h.interaction_with && (
                              <p className="text-sm text-gray-600 mt-1">
                                dengan{" "}
                                <span className="font-medium text-violet-600">
                                  {h.interaction_with}
                                </span>
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="text-xs text-gray-500 font-medium">
                            {h.date} {h.time}
                          </span>
                        </div>
                      </div>
                      
                      {h.note && (
                        <p className="text-sm text-gray-700 mt-2 bg-white p-3 rounded-lg border border-gray-100">
                          "{h.note}"
                        </p>
                      )}
                      
                      <div className="flex justify-end mt-3">
                        <button
                          onClick={() => handleDelete(h.id)}
                          className="text-xs text-red-500 hover:text-red-700 font-medium px-2 py-1 rounded-lg hover:bg-red-50 transition-colors"
                        >
                          Hapus
                        </button>
                      </div>
                    </div>
                  ))}
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

export default EmologPage;