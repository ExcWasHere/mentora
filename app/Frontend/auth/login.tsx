import { useState, useEffect } from "react";

interface LoginProps {
  onSubmit?: (credentials: {
    email: string;
    password: string;
    rememberMe: boolean;
  }) => void;
  isLoading?: boolean;
  errors?: { email?: string; password?: string };
  showUnauthorizedMessage?: boolean;
  onForgotPassword?: () => void;
  onRegister?: () => void;
}

export default function LoginComponent({
  onSubmit,
  isLoading = false,
  errors = {},
  showUnauthorizedMessage = false,
  onForgotPassword,
  onRegister,
}: LoginProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPopup, setShowPopup] = useState(showUnauthorizedMessage);
  const [validationErrors, setValidationErrors] = useState<{
    email?: string;
    password?: string;
  }>({});

  useEffect(() => {
    if (showUnauthorizedMessage) {
      const timer = setTimeout(() => {
        setShowPopup(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showUnauthorizedMessage]);

  const validateForm = () => {
    const newErrors: { email?: string; password?: string } = {};

    if (!email || typeof email !== "string" || !email.includes("@")) {
      newErrors.email = "Email tidak valid";
    }

    if (!password || typeof password !== "string" || password.length < 6) {
      newErrors.password = "Password minimal 6 karakter";
    }

    setValidationErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    if (onSubmit) {
      onSubmit({ email, password, rememberMe });
    }
  };

  const displayErrors = { ...validationErrors, ...errors };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white via-sky-50 to-purple-50 relative">
      {showPopup && (
        <div className="fixed top-5 right-5 z-50 bg-gradient-to-r from-sky-50 to-purple-50 border border-purple-200 text-purple-800 px-4 py-3 rounded-lg shadow-lg transform opacity-0 animate-[fade-slide-right_0.4s_ease-out_forwards]">
          <div className="flex items-center">
            <svg
              className="w-5 h-5 mr-2 text-purple-600"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11V5a1 1 0 10-2 0v2a1 1 0 001 1h2a1 1 0 100-2h-1zm-1 4a1 1 0 100 2 1 1 0 000-2z"
                clipRule="evenodd"
              />
            </svg>
            <span>Maaf, login dulu yuk!</span>
          </div>
        </div>
      )}

      <div className="w-full max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-2 rounded-xl overflow-hidden shadow-xl">
        <div className="bg-white p-10 border-r border-purple-100">
          <div className="mb-8">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-sky-600 to-purple-600 bg-clip-text text-transparent">
              MenTora
            </h2>
            <p className="text-gray-600 mt-2">
              Sudah sejauh ini, yuk teruskan langkah kecilmu bersama Mentora.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="mt-1 w-full px-4 py-3 border border-purple-200 rounded-lg focus:ring-2 focus:ring-purple-300 focus:border-purple-400 bg-white transition-colors"
                placeholder="Masukkan email Anda"
              />
              {displayErrors?.email && (
                <span className="text-sm text-red-500 mt-1 block">
                  {displayErrors.email}
                </span>
              )}
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="mt-1 w-full px-4 py-3 border border-purple-200 rounded-lg focus:ring-2 focus:ring-purple-300 focus:border-purple-400 bg-white transition-colors"
                placeholder="Masukkan password Anda"
              />
              {displayErrors?.password && (
                <span className="text-sm text-red-500 mt-1 block">
                  {displayErrors.password}
                </span>
              )}
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember"
                  name="remember"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 text-purple-600 border-purple-300 rounded focus:ring-purple-500"
                />
                <label
                  htmlFor="remember"
                  className="ml-2 block text-sm text-gray-600"
                >
                  Ingat Saya
                </label>
              </div>
              <div>
                <button
                  type="button"
                  onClick={onForgotPassword}
                  className="text-sm text-purple-600 hover:text-purple-800 transition-colors"
                >
                  Lupa Password?
                </button>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full px-6 py-3 text-white bg-gradient-to-r from-sky-500 to-purple-500 rounded-lg hover:from-sky-600 hover:to-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-md hover:shadow-lg"
                onClick={async () => {
                  if (!isLoading) {
                    try {
                      const response = await fetch("/api/auth/login", {
                        method: "POST",
                        headers: {
                          "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                          email: email,
                          password: password,
                        }),
                      });
                      const data = await response.json();
                      if (response.ok && data.success) {
                        if (data.token) {
                          localStorage.setItem("authToken", data.token);
                        }
                        window.location.href = "/dashboard";
                      } else {
                        alert(
                          data.message ||
                            "Periksa email dan password Anda."
                        );
                      }
                    } catch (error) {
                      console.error("Error during login:", error);
                      alert("Silakan coba lagi.");
                    } finally {
                      setEmail("");
                      setPassword("");
                      setRememberMe(false);
                    }
                  }
                }}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Memproses...
                  </div>
                ) : (
                  "Masuk"
                )}
              </button>
            </div>

            <div className="text-center">
              <p className="text-sm text-gray-600">
                Belum memiliki akun?{" "}
                <button
                  type="button"
                  onClick={() => (window.location.href = "/register")}
                  className="font-medium text-purple-600 hover:text-purple-800 transition-colors"
                >
                  Daftar sekarang
                </button>
              </p>
            </div>
          </form>
        </div>

        <div className="hidden lg:block bg-gradient-to-br from-sky-200 via-purple-100 to-purple-200 p-10 relative overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center z-10">
              <img
                src="/favicon.ico"
                alt="Mentora Logo"
                className="h-24 w-24 mx-auto mb-6 opacity-90 drop-shadow-lg"
              />
              <h3 className="mt-6 text-2xl font-bold text-white drop-shadow-md">
                Hi, Selamat Datang di Mentora!
              </h3>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fade-slide-right {
          0% {
            opacity: 0;
            transform: translateX(20px);
          }
          100% {
            opacity: 1;
            transform: translateX(0);
          }
        }
        .animate-\\[fade-slide-right_0\\.4s_ease-out_forwards\\] {
          animation: fade-slide-right 0.4s ease-out forwards;
        }
      `}</style>
    </div>
  );
}