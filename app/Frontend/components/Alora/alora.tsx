import { useState, useEffect, useRef } from "react";
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
  Send,
  Bot,
  User,
  Zap,
  Sun,
  Smile,
  Activity,
  Mic,
  MicOff,
  Loader2,
} from "lucide-react";
import { Link, useLoaderData } from "@remix-run/react";

interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
  typing?: boolean;
}

const AloRa = () => {
  const [activeTab, setActiveTab] = useState("alora");
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [message, setMessage] = useState("");
  type LoaderData = {
    userId: string;
    userName?: string;
    userEmail?: string;
    token: string;
  };

  const { userName = "Pengguna", token } = useLoaderData<LoaderData>();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content: `Halo ${
        userName.split(" ")[0]
      }! 👋 Saya AloRa, teman virtual kamu yang siap mendengarkan dan membantu kapan saja. Apa yang ingin kamu ceritakan hari ini?`,
      isUser: false,
      timestamp: new Date(),
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [isListening, setIsListening] = useState(false);
  const [chatMode, setChatMode] = useState("casual");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

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

  const quickActions = [
    { label: "Bagaimana kabarmu hari ini?", icon: Smile },
    { label: "Aku merasa sedih...", icon: Heart },
    { label: "Ceritakan tentang motivasi hidup", icon: Sun },
    { label: "Bagaimana cara mengatasi stress?", icon: Activity },
    { label: "Aku ingin curhat tentang hubungan", icon: Users },
    { label: "Berikan tips produktivitas", icon: Zap },
  ];

  const handleLogout = () => {
    if (confirm("Apakah kamu yakin mau pergi:( ?")) {
      window.location.href = "/logout";
    }
  };

  const handleSendMessage = async () => {
    if (!message.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: message,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setMessage("");
    setIsTyping(true);

    try {
      const res = await fetch("http://localhost:5000/api/alora/new-chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          prompt: message,
          session_id: sessionId,
        }),
      });

      const data = await res.json();
      if (!sessionId && data.session_id) {
        setSessionId(data.session_id);
      }

      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: data.response || "Maaf, aku belum bisa menjawab saat ini 🙏",
        isUser: false,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiResponse]);
    } catch (error) {
      console.error("Error kirim pesan:", error);
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          content: "⚠️ Gagal terhubung ke server.",
          isUser: false,
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsTyping(false);
    }

    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  };

  const handleQuickAction = (action: string) => {
    setMessage(action);
    setTimeout(() => handleSendMessage(), 100);
  };

  const handleVoiceToggle = () => {
    setIsListening(!isListening);
    if (!isListening) {
      setTimeout(() => {
        setIsListening(false);
      }, 3000);
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
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
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
      <div className="lg:ml-64 min-h-screen flex flex-col">
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
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center space-x-2">
                      <h1 className="text-2xl sm:text-3xl font-black text-violet-700">
                        AloRa
                      </h1>
                    </div>
                  </div>
                  <p className="text-gray-600 mt-1 font-medium text-sm">
                    Your Bestie AI, siap mendengarkan {getFirstName(userName)}{" "}
                    24/7 ✨
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

        {/* Chat Container */}
        <div className="flex-1 flex flex-col">
          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="max-w-4xl mx-auto space-y-6">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex items-start space-x-3 ${
                    msg.isUser ? "flex-row-reverse space-x-reverse" : ""
                  } animate-in slide-in-from-bottom-2 duration-500`}
                >
                  {/* Avatar */}
                  <div
                    className={`w-10 h-10 rounded-2xl flex items-center justify-center shadow-lg ${
                      msg.isUser
                        ? "bg-violet-600"
                        : "bg-gradient-to-br from-violet-500 to-pink-500"
                    }`}
                  >
                    {msg.isUser ? (
                      <User className="w-5 h-5 text-white" />
                    ) : (
                      <Bot className="w-5 h-5 text-white" />
                    )}
                  </div>

                  {/* Message Bubble */}
                  <div
                    className={`max-w-xs sm:max-w-md lg:max-w-lg xl:max-w-2xl px-4 py-3 rounded-2xl shadow-lg ${
                      msg.isUser
                        ? "bg-violet-600 text-white rounded-tr-md"
                        : "bg-white text-gray-800 rounded-tl-md border border-gray-100"
                    }`}
                  >
                    <p className="text-sm sm:text-base leading-relaxed">
                      {msg.content}
                    </p>
                    <div
                      className={`text-xs mt-2 ${
                        msg.isUser ? "text-violet-200" : "text-gray-500"
                      }`}
                    >
                      {msg.timestamp.toLocaleTimeString("id-ID", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                  </div>
                </div>
              ))}

              {/* Typing Indicator */}
              {isTyping && (
                <div className="flex items-start space-x-3 animate-in slide-in-from-bottom-2 duration-500">
                  <div className="w-10 h-10 rounded-2xl flex items-center justify-center shadow-lg bg-gradient-to-br from-violet-500 to-pink-500">
                    <Bot className="w-5 h-5 text-white" />
                  </div>
                  <div className="bg-white text-gray-800 px-4 py-3 rounded-2xl rounded-tl-md border border-gray-100 shadow-lg">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-violet-400 rounded-full animate-bounce"></div>
                      <div
                        className="w-2 h-2 bg-violet-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0.1s" }}
                      ></div>
                      <div
                        className="w-2 h-2 bg-violet-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                      ></div>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Quick Actions */}
          {messages.length <= 1 && (
            <div className="px-4 sm:px-6 lg:px-8 py-4">
              <div className="max-w-4xl mx-auto">
                <h3 className="text-lg font-bold text-gray-800 mb-4 text-center">
                  Atau pilih topik di bawah ini:
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {quickActions.map((action, index) => (
                    <button
                      key={index}
                      onClick={() => handleQuickAction(action.label)}
                      className="flex items-center space-x-3 p-4 bg-white border border-gray-200 rounded-xl hover:bg-violet-50 hover:border-violet-200 transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg text-left"
                    >
                      <action.icon className="w-5 h-5 text-violet-600 flex-shrink-0" />
                      <span className="text-sm font-medium text-gray-700">
                        {action.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Input Area */}
          <div className="border-t border-gray-100 bg-white px-4 sm:px-6 lg:px-8 py-4">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-end space-x-3">
                {/* Voice Button */}
                <button
                  onClick={handleVoiceToggle}
                  className={`flex-shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 transform hover:scale-105 shadow-lg ${
                    isListening
                      ? "bg-red-500 text-white animate-pulse"
                      : "bg-violet-100 text-violet-600 hover:bg-violet-200"
                  }`}
                >
                  {isListening ? (
                    <MicOff className="w-5 h-5" />
                  ) : (
                    <Mic className="w-5 h-5" />
                  )}
                </button>

                {/* Text Input */}
                <div className="flex-1 relative">
                  <textarea
                    ref={textareaRef}
                    value={message}
                    onChange={(e) => {
                      setMessage(e.target.value);
                      e.target.style.height = "auto";
                      e.target.style.height = `${Math.min(
                        e.target.scrollHeight,
                        120
                      )}px`;
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                    placeholder="Ketik pesan kamu di sini... (Enter untuk kirim, Shift+Enter untuk baris baru)"
                    className="w-full px-4 py-3 pr-12 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent resize-none min-h-[48px] max-h-[120px] text-sm sm:text-base transition-all duration-300"
                    rows={1}
                  />
                  <div className="absolute right-2 bottom-2 text-xs text-gray-400">
                    {message.length}/1000
                  </div>
                </div>

                {/* Send Button */}
                <button
                  onClick={handleSendMessage}
                  disabled={!message.trim() || isTyping}
                  className="flex-shrink-0 w-12 h-12 bg-violet-600 text-white rounded-2xl flex items-center justify-center hover:bg-violet-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 shadow-lg disabled:hover:scale-100"
                >
                  {isTyping ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <Send className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-white border-t border-gray-200 px-4 sm:px-6 lg:px-8 py-4">
          <div className="max-w-4xl mx-auto">
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

export default AloRa;