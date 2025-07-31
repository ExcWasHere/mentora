import {
  json,
  redirect,
  type ActionFunctionArgs,
  type LoaderFunctionArgs,
} from "@remix-run/node";
import {
  Form,
  Link,
  MetaFunction,
  useActionData,
  useNavigation,
  useSearchParams,
} from "@remix-run/react";
import { commitSession, getSession } from "~/utils/session.server";
import { useEffect, useState } from "react";

export const meta: MetaFunction = () => {
  return [
    { title: "Mentora | Login" },
    { name: "description", content: "Welcome to Mentora!" },
  ];
};

export async function loader({ request }: LoaderFunctionArgs) {
  const session = await getSession(request.headers.get("Cookie"));
  if (session.has("userId")) {
    return redirect("/dashboard");
  }
  return json({});
}

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const email = formData.get("email");
  const password = formData.get("password");

  const errors: { email?: string; password?: string } = {};

  if (!email || typeof email !== "string" || !email.includes("@")) {
    errors.email = "Email tidak valid";
  }

  if (!password || typeof password !== "string" || password.length < 6) {
    errors.password = "Password minimal 6 karakter";
  }

  if (Object.keys(errors).length > 0) {
    return json({ errors }, { status: 400 });
  }

  try {
    const response = await fetch("http://localhost:5000/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const data = await response.json();
      console.error("Login API error:", data);
      return json({ errors: { email: data.error } }, { status: 400 });
    }

    const user = await response.json();
    console.log("User data from API:", user);
    if (!user.id || !user.name || !user.email) {
      console.error("Incomplete user data:", user);
      return json({ 
        errors: { email: "Data user tidak lengkap" } 
      }, { status: 400 });
    }

    const session = await getSession(request.headers.get("Cookie"));
    session.set("userId", user.id.toString());
    session.set("userEmail", user.email);
    session.set("userName", user.name);
    
    console.log("Setting session data:", {
      userId: user.id.toString(),
      userEmail: user.email,
      userName: user.name
    });

    return redirect("/dashboard", {
      headers: { "Set-Cookie": await commitSession(session) },
    });
    
  } catch (error) {
    console.error("Login fetch error:", error);
    return json({ 
      errors: { email: "Terjadi kesalahan koneksi" } 
    }, { status: 500 });
  }
}

export default function Login() {
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";
  const [searchParams] = useSearchParams();
  const unauthorized = searchParams.get("unauthorized");
  const [showPopup, setShowPopup] = useState(!!unauthorized);

  useEffect(() => {
    if (unauthorized) {
      const timer = setTimeout(() => {
        setShowPopup(false);
        window.history.replaceState({}, document.title, "/login");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [unauthorized]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white via-sky-50 to-purple-50 py-8 relative">
      {showPopup && (
        <div className="fixed top-5 right-5 z-50 bg-purple-100 border border-purple-300 text-purple-800 px-4 py-3 rounded-lg shadow-lg transform opacity-0 animate-[fade-slide-right_0.4s_ease-out_forwards]">
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

          <Form method="post" className="space-y-6">
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
                name="email"
                required
                className="mt-1 w-full px-4 py-3 border border-purple-200 rounded-lg focus:ring-2 focus:ring-purple-300 focus:border-purple-400 bg-white transition-colors"
                placeholder="Masukkan email Anda"
              />
              {actionData?.errors?.email && (
                <span className="text-sm text-red-500 mt-1 block">
                  {actionData.errors.email}
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
                name="password"
                required
                className="mt-1 w-full px-4 py-3 border border-purple-200 rounded-lg focus:ring-2 focus:ring-purple-300 focus:border-purple-400 bg-white transition-colors"
                placeholder="Masukkan password Anda"
              />
              {actionData?.errors?.password && (
                <span className="text-sm text-red-500 mt-1 block">
                  {actionData.errors.password}
                </span>
              )}
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember"
                  name="remember"
                  type="checkbox"
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
                <Link
                  to="/forgot-password"
                  className="text-sm text-purple-600 hover:text-purple-800 transition-colors"
                >
                  Lupa Password?
                </Link>
              </div>
            </div>

            <div className="mt-6">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full px-6 py-3 text-white bg-gradient-to-r from-sky-500 to-purple-500 rounded-lg hover:from-sky-600 hover:to-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-md hover:shadow-lg"
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
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
                <Link
                  to="/register"
                  className="font-medium text-purple-600 hover:text-purple-800 transition-colors"
                >
                  Daftar sekarang
                </Link>
              </p>
            </div>
          </Form>
        </div>

        {/* Right panel - Illustration */}
        <div className="hidden lg:block bg-gradient-to-br from-sky-200 via-purple-100 to-purple-200 p-10 relative overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center z-10">
              <img
                src="/favicon.ico"
                alt="Mentora Logo"
                className="h-24 w-24 mx-auto mb-6 opacity-90 drop-shadow-lg"
              />
              <h3 className="mt-6 text-2xl font-bold text-white drop-shadow-md">
                Hi, Selamat Datang Kembali!
              </h3>
            </div>
          </div>
        </div>
      </div>

      <style>
        {`
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
        `}
      </style>
    </div>
  );
}