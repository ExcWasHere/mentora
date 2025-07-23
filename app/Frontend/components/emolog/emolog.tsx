import { useEffect, useState } from "react";
import {
  Home,
  Calendar,
  Users,
  MessageCircle,
  Heart,
  FileText,
  LogOut,
  X,
} from "lucide-react";
import { useLoaderData } from "@remix-run/react";

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
    gradient: "from-sky-500 to-blue-600",
    href: "/dashboard",
  },
  {
    id: "emolog",
    label: "Emotion Log",
    icon: Calendar,
    gradient: "from-sky-400 to-sky-600",
    href: "/emolog",
  },
  {
    id: "social-flow",
    label: "Social Flow",
    icon: Users,
    gradient: "from-sky-500 to-cyan-600",
    href: "/social-flow",
  },
  {
    id: "consultation",
    label: "Consultation",
    icon: MessageCircle,
    gradient: "from-sky-600 to-blue-600",
    href: "/consultation",
  },
  {
    id: "release-emotion",
    label: "Release Emotion",
    icon: Heart,
    gradient: "from-sky-500 to-pink-500",
    href: "/release-emotion",
  },
  {
    id: "hope-scan",
    label: "Hope Scan",
    icon: FileText,
    gradient: "from-sky-400 to-indigo-500",
    href: "/hope-scan",
  },
];

const EmologPage = () => {
  const [activeTab, setActiveTab] = useState("emolog");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);
  const [note, setNote] = useState("");
  type LoaderData = {
    userId: string;
    userName?: string;
    userEmail?: string;
  };

  const { userId } = useLoaderData<LoaderData>();
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
  }, []);

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
        setSelected("");
        fetchEmolog();
      }
    } catch (error) {
      console.error("Network error saat menyimpan emosi:", error);
      alert("Ups! Terjadi kesalahan jaringan 😢");
    }
  };

  const handleDelete = (id: number) => {
    setHistory(history.filter((h) => h.id !== id));
  };

  const handleLogout = () => {
    if (confirm("Apakah kamu yakin mau pergi:( ?")) {
      window.location.href = "/logout";
    }
  };

  const Logo = () => (
    <div className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg overflow-hidden">
      <img
        src="/favicon.ico"
        alt="MenTora Logo"
        className="w-full h-full object-contain"
      />
    </div>
  );

  const SidebarItem = ({ item }) => (
    <a
      href={item.href}
      onClick={() => {
        setActiveTab(item.id);
        setSidebarOpen(false);
      }}
      className={`group relative w-full flex items-center px-4 py-3.5 text-left rounded-xl transition-all duration-300 ${
        item.id === activeTab
          ? "bg-white text-gray-800 shadow-lg transform translate-x-2 scale-105"
          : "text-white hover:bg-white/20 hover:transform hover:translate-x-1"
      }`}
    >
      <div
        className={`w-9 h-9 rounded-lg flex items-center justify-center mr-3 shadow-md transition-all duration-300 ${
          item.id === activeTab
            ? `bg-gradient-to-r ${item.gradient}`
            : "bg-white/20 group-hover:bg-white/30 group-hover:scale-110"
        }`}
      >
        <item.icon className="w-4 h-4 text-white" />
      </div>
      <span className="font-medium text-sm">{item.label}</span>
      {item.id === activeTab && (
        <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-sky-400 to-blue-600 rounded-r-full"></div>
      )}
    </a>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-sky-50 to-sky-100">
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          role="button"
          tabIndex={0}
          aria-label="Tutup sidebar"
          onClick={() => setSidebarOpen(false)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              setSidebarOpen(false);
            }
          }}
        />
      )}

      <div
        className={`fixed inset-y-0 left-0 w-64 bg-gradient-to-b from-sky-600 via-sky-700 to-blue-800 shadow-2xl transform transition-transform duration-300 z-50 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
      >
        <div className="flex items-center justify-between h-16 px-4 border-b border-white/20 bg-white/10 backdrop-blur-sm">
          <div className="flex items-center space-x-3">
            <Logo />
            <h2 className="text-2xl font-black text-white">
              Men<span className="text-sky-300">Tora</span>
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
        <nav className="mt-6 px-3 pb-20">
          <div className="space-y-2">
            {sidebarItems.map((item) => (
              <SidebarItem key={item.id} item={item} />
            ))}
          </div>
        </nav>
        <div className="absolute bottom-4 left-3 right-3 lg:hidden">
          <button
            onClick={handleLogout}
            className="w-full flex items-center px-4 py-3 text-white hover:bg-white/20 rounded-xl transition-all duration-300 group"
          >
            <div className="w-9 h-9 rounded-lg flex items-center justify-center mr-3 bg-white/20 group-hover:bg-white/30 group-hover:scale-110">
              <LogOut className="w-4 h-4 text-white" />
            </div>
            <span className="font-medium text-sm">Logout</span>
          </button>
        </div>
      </div>

      <main className="lg:ml-64 p-6">
        <header className="mb-8">
          <h1 className="text-3xl font-black bg-gradient-to-r from-sky-600 to-blue-600 bg-clip-text text-transparent">
            Emotion Log
          </h1>
          <p className="text-gray-600 mt-1">
            Catat dan pantau emosimu setiap hari 🌟
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-xl shadow">
            <h3 className="font-bold text-sky-900 mb-4">
              Bagaimana perasaanmu hari ini?
            </h3>
            <div className="grid grid-cols-3 gap-3 mb-4">
              {EMOTION_OPTIONS.map((opt) => (
                <button
                  key={opt.key}
                  onClick={() => setSelected(opt.key)}
                  className={`p-3 rounded-lg flex flex-col items-center ${
                    selected === opt.key
                      ? "ring-2 ring-sky-400 bg-sky-50"
                      : "bg-sky-50"
                  }`}
                >
                  <span className="text-2xl">{opt.emoji}</span>
                  <span className="text-sm font-medium mt-1">{opt.label}</span>
                </button>
              ))}
            </div>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Catatan (opsional)"
              className="w-full border border-sky-300 rounded-lg p-3 mb-4 focus:outline-none focus:ring-2 focus:ring-sky-500"
              rows={2}
            />
            <div className="mb-4">
              <label
                htmlFor="interactionWith"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Interaksi Dengan
              </label>
              <select
                id="interactionWith"
                value={interactionWith}
                onChange={(e) => setInteractionWith(e.target.value)}
                className="w-full border border-sky-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-sky-500"
              >
                <option value="Teman">Teman</option>
                <option value="Keluarga">Keluarga</option>
                <option value="Rekan Kerja">Rekan Kerja</option>
                <option value="Pasangan">Pasangan</option>
                <option value="Lainnya">Lainnya</option>
              </select>
            </div>

            <button
              disabled={!selected}
              onClick={handleSave}
              className="w-full bg-sky-600 text-white py-2 rounded-lg hover:bg-sky-700 disabled:opacity-50"
            >
              Simpan Emosi
            </button>
          </div>

          <div className="bg-white p-6 rounded-xl shadow">
            <h3 className="font-bold text-sky-900 mb-4">Riwayat Emosi</h3>
            {history.length === 0 ? (
              <p className="text-gray-500 italic">
                Belum ada data. Catat emosimu!
              </p>
            ) : (
              <div className="space-y-2">
                {history.map((h) => (
                  <div key={h.id} className="bg-sky-50 p-3 rounded-lg">
                    <div className="flex justify-between">
                      <span>
                        {
                          EMOTION_OPTIONS.find((e) => e.key === h.emotion)
                            ?.emoji
                        }{" "}
                        {
                          EMOTION_OPTIONS.find((e) => e.key === h.emotion)
                            ?.label
                        }
                      </span>
                      <span className="text-xs text-gray-500">
                        {h.date} {h.time}
                      </span>
                    </div>
                    {h.interaction_with && (
                      <p className="text-sm text-sky-700 mt-1">
                        Interaksi dengan:{" "}
                        <span className="font-medium">
                          {h.interaction_with}
                        </span>
                      </p>
                    )}

                    {h.note && (
                      <p className="text-sm text-gray-600 mt-1">{h.note}</p>
                    )}
                    <button
                      onClick={() => handleDelete(h.id)}
                      className="text-xs text-red-500 mt-1"
                    >
                      Hapus
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default EmologPage;