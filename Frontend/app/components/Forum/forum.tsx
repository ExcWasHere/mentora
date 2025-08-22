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
  Send,
  Trash2,
  MessageSquare,
  MoreVertical,
} from "lucide-react";
import { Link, useLoaderData } from "@remix-run/react";

type LoaderData = {
    userId: string;
    userName?: string;
    userEmail?: string;
  };

interface Post {
  id: string;
  content: string;
  images?: string[];
  user_id: string;
  author: string;
  created_at: string;
  comments: Comment[];
  showComments?: boolean;
}

interface Comment {
  id: string;
  comment: string;
  user_id: string;
  post_id: string;
  author: string;
  created_at: string;
}

const Forum = () => {
  const [activeTab, setActiveTab] = useState("forum");
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [posts, setPosts] = useState<Post[]>([]);
  const [newPost, setNewPost] = useState("");
  const [newComment, setNewComment] = useState<{ [key: string]: string }>({});
  const [showDropdown, setShowDropdown] = useState<{ [key: string]: boolean }>({});
  const { userId, userName = "Pengguna" } = useLoaderData<LoaderData>();

  // nanti replace with actual API calls
  useEffect(() => {
    const samplePosts: Post[] = [
      {
        id: "1",
        content: "Hari ini aku merasa lebih baik setelah berbicara dengan teman-teman. Sharing pengalaman ternyata sangat membantu untuk mengurangi beban pikiran. Terima kasih untuk semua dukungannya! 💙",
        user_id: "1",
        author: "Sarah Chen",
        created_at: "2025-08-15 10:30:00",
        comments: [
          {
            id: "1",
            comment: "Senang mendengar kabar baik ini! Terus semangat ya 😊",
            user_id: "2",
            post_id: "1",
            author: "Maya Putri",
            created_at: "2025-08-15 11:00:00",
          },
          {
            id: "2",
            comment: "Berbagi memang sangat healing. Kamu inspiratif banget!",
            user_id: "3",
            post_id: "1",
            author: "Rizki Ahmad",
            created_at: "2025-08-15 11:15:00",
          },
        ],
        showComments: false,
      },
      {
        id: "2",
        content: "Sedang belajar teknik mindfulness dan meditation. Ada yang punya rekomendasi aplikasi atau panduan yang bagus? Sharing dong pengalamannya 🧘‍♀️",
        user_id: "2",
        author: "Maya Putri", 
        created_at: "2025-08-01 09:15:00",
        comments: [
          {
            id: "3",
            comment: "Coba Headspace atau Calm, kedua aplikasi itu bagus banget untuk pemula!",
            user_id: "1",
            post_id: "2",
            author: "Sarah Chen",
            created_at: "2025-08-01 09:45:00",
          },
        ],
        showComments: false,
      },
      {
        id: "3",
        content: "Reminder buat semuanya: it's okay to not be okay. Take your time untuk healing, jangan terburu-buru. Kita semua punya pace masing-masing. Self-love is the key ✨",
        user_id: "3",
        author: "Rizki Ahmad",
        created_at: "2025-07-30 08:20:00",
        comments: [],
        showComments: false,
      },
    ];
    setPosts(samplePosts);
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

  const formatTimeAgo = (dateString: string): string => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return "Baru saja";
    if (diffInHours < 24) return `${diffInHours} jam lalu`;
    if (diffInHours < 48) return "1 hari lalu";
    return `${Math.floor(diffInHours / 24)} hari lalu`;
  };

  const handleCreatePost = () => {
    if (!newPost.trim()) return;
    
    const post: Post = {
      id: Date.now().toString(),
      content: newPost,
      user_id: userId,
      author: userName || "Anonymous",
      created_at: new Date().toISOString(),
      comments: [],
      showComments: false,
    };
    
    setPosts([post, ...posts]);
    setNewPost("");
  };

  const handleDeletePost = (postId: string) => {
    if (confirm("Apakah Anda yakin ingin menghapus postingan ini?")) {
      setPosts(posts.filter(post => post.id !== postId));
    }
  };

  const handleAddComment = (postId: string) => {
    const commentText = newComment[postId];
    if (!commentText?.trim()) return;

    const comment: Comment = {
      id: Date.now().toString(),
      comment: commentText,
      user_id: userId,
      post_id: postId,
      author: userName || "Anonymous",
      created_at: new Date().toISOString(),
    };

    setPosts(posts.map(post => 
      post.id === postId 
        ? { ...post, comments: [...post.comments, comment] }
        : post
    ));
    
    setNewComment({ ...newComment, [postId]: "" });
  };

  const toggleComments = (postId: string) => {
    setPosts(posts.map(post => 
      post.id === postId 
        ? { ...post, showComments: !post.showComments }
        : post
    ));
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
    <div className="min-h-screen bg-gray-50">
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
                    Forum Komunitas
                  </h1>
                  <p className="text-gray-600 mt-1 font-medium text-sm">
                   Ayo berbagi cerita dan saling mendukung, {getFirstName(userName)}! 💬
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

        {/* Forum Content */}
        <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto">
          {/* Create Post Section */}
          <div className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-lg border border-gray-100 mb-6 sm:mb-8">
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-violet-600 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-white font-bold text-sm">
                  {getInitials(userName ?? "")}
                </span>
              </div>
              <div className="flex-1">
                <textarea
                  value={newPost}
                  onChange={(e) => setNewPost(e.target.value)}
                  placeholder="Bagikan pengalaman, perasaan, atau dukungan untuk komunitas..."
                  className="w-full p-4 border border-gray-200 rounded-2xl resize-none focus:ring-2 focus:ring-violet-500 focus:border-transparent text-gray-700 text-sm sm:text-base"
                  rows={4}
                />
                <div className="flex items-center justify-between mt-4">
                  <div className="flex items-center space-x-4">
                    <button className="flex items-center px-4 py-2 text-gray-600 hover:text-violet-600 transition-colors">
                      <span className="text-sm font-medium">📷 Foto</span>
                    </button>
                  </div>
                  <button
                    onClick={handleCreatePost}
                    disabled={!newPost.trim()}
                    className="flex items-center px-6 py-3 bg-violet-600 text-white rounded-xl hover:bg-violet-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:transform-none"
                  >
                    <Send className="w-4 h-4 mr-2" />
                    <span className="font-semibold text-sm">Kirim</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Posts Feed */}
          <div className="space-y-6 sm:space-y-8">
            {posts.map((post) => (
              <div
                key={post.id}
                className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300"
              >
                {/* Post Header */}
                <div className="flex items-center justify-between mb-4 sm:mb-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-violet-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-sm">
                        {getInitials(post.author)}
                      </span>
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-800 text-sm sm:text-base">
                        {post.author}
                      </h4>
                      <p className="text-xs sm:text-sm text-gray-500 font-medium">
                        {formatTimeAgo(post.created_at)}
                      </p>
                    </div>
                  </div>
                  
                  {post.user_id === userId && (
                    <div className="relative">
                      <button
                        onClick={() => setShowDropdown({
                          ...showDropdown,
                          [post.id]: !showDropdown[post.id]
                        })}
                        className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </button>
                      
                      {showDropdown[post.id] && (
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 z-10">
                          <button
                            onClick={() => {
                              handleDeletePost(post.id);
                              setShowDropdown({ ...showDropdown, [post.id]: false });
                            }}
                            className="w-full px-4 py-3 text-left text-red-600 hover:bg-red-50 rounded-xl transition-colors flex items-center"
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            <span className="font-medium text-sm">Hapus Postingan</span>
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Post Content */}
                <div className="mb-4 sm:mb-6">
                  <p className="text-gray-700 text-sm sm:text-base leading-relaxed">
                    {post.content}
                  </p>
                </div>

                {/* Post Actions */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <button
                    onClick={() => toggleComments(post.id)}
                    className="flex items-center px-4 py-2 text-gray-600 hover:text-violet-600 transition-colors rounded-lg hover:bg-violet-50"
                  >
                    <MessageSquare className="w-4 h-4 mr-2" />
                    <span className="font-medium text-sm">
                      {post.comments.length} Komentar
                    </span>
                  </button>
                </div>

                {/* Comments Section */}
                {post.showComments && (
                  <div className="mt-6 pt-6 border-t border-gray-100">
                    {/* Add Comment */}
                    <div className="flex items-start space-x-3 mb-4">
                      <div className="w-8 h-8 bg-violet-600 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-white font-bold text-xs">
                          {getInitials(userName ?? "")}
                        </span>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <input
                            type="text"
                            value={newComment[post.id] || ""}
                            onChange={(e) => setNewComment({
                              ...newComment,
                              [post.id]: e.target.value
                            })}
                            placeholder="Tulis komentar..."
                            className="flex-1 px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-transparent text-sm"
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                handleAddComment(post.id);
                              }
                            }}
                          />
                          <button
                            onClick={() => handleAddComment(post.id)}
                            disabled={!newComment[post.id]?.trim()}
                            className="px-4 py-2 bg-violet-600 text-white rounded-xl hover:bg-violet-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                          >
                            <Send className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Comments List */}
                    <div className="space-y-4">
                      {post.comments.map((comment) => (
                        <div key={comment.id} className="flex items-start space-x-3">
                          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                            <span className="text-white font-bold text-xs">
                              {getInitials(comment.author)}
                            </span>
                          </div>
                          <div className="flex-1 bg-gray-50 rounded-2xl px-4 py-3">
                            <div className="flex items-center justify-between mb-1">
                              <h5 className="font-semibold text-gray-800 text-sm">
                                {comment.author}
                              </h5>
                              <span className="text-xs text-gray-500">
                                {formatTimeAgo(comment.created_at)}
                              </span>
                            </div>
                            <p className="text-gray-700 text-sm">
                              {comment.comment}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
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
    </div>
  );
};

export default Forum;