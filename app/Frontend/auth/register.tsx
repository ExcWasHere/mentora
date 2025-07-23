import { useState } from "react";

interface RegisterProps {
  onSubmit?: (data: {
    name: string;
    email: string;
    role: string;
    password: string;
    passwordConfirmation: string;
    nip?: string;
    strImage?: File;
  }) => void;
  isLoading?: boolean;
  errors?: {
    name?: string;
    email?: string;
    role?: string;
    password?: string;
    password_confirmation?: string;
    nip?: string;
    strImage?: string;
  };
  onLogin?: () => void;
}

export default function RegisterComponent({
  onSubmit,
  isLoading = false,
  errors = {},
  onLogin
}: RegisterProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [nip, setNip] = useState("");
  const [strImage, setStrImage] = useState<File | null>(null);
  const [validationErrors, setValidationErrors] = useState<{
    name?: string;
    email?: string;
    role?: string;
    password?: string;
    password_confirmation?: string;
    nip?: string;
    strImage?: string;
  }>({});

  const validateForm = () => {
    const newErrors: {
      name?: string;
      email?: string;
      role?: string;
      password?: string;
      password_confirmation?: string;
      nip?: string;
      strImage?: string;
    } = {};

    if (!name || typeof name !== "string" || name.trim().length < 2) {
      newErrors.name = "Nama minimal 2 karakter";
    }

    if (!email || typeof email !== "string" || !email.includes("@")) {
      newErrors.email = "Email tidak valid";
    }

    if (!role) {
      newErrors.role = "Role harus dipilih";
    }

    if (!password || typeof password !== "string" || password.length < 6) {
      newErrors.password = "Password minimal 6 karakter";
    }

    if (password !== passwordConfirmation) {
      newErrors.password_confirmation = "Konfirmasi password tidak cocok";
    }

    if (role === "Pemerintah" && (!nip || nip.trim().length === 0)) {
      newErrors.nip = "NIP wajib diisi untuk role Pemerintah";
    }

    if (role === "Psikolog" && !strImage) {
      newErrors.strImage = "Gambar STR wajib diupload untuk role Psikolog";
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
      onSubmit({
        name,
        email,
        role,
        password,
        passwordConfirmation,
        nip: role === "Pemerintah" ? nip : undefined,
        strImage: role === "Psikolog" ? strImage : undefined,
      });
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const validTypes = ["image/jpeg", "image/jpg", "image/png"];
      if (!validTypes.includes(file.type)) {
        setValidationErrors(prev => ({
          ...prev,
          strImage: "File harus berupa gambar (JPEG, JPG, PNG)"
        }));
        return;
      }
      
      if (file.size > 5 * 1024 * 1024) {
        setValidationErrors(prev => ({
          ...prev,
          strImage: "Ukuran file maksimal 5MB"
        }));
        return;
      }

      setStrImage(file);
      setValidationErrors(prev => ({
        ...prev,
        strImage: undefined
      }));
    }
  };

  const displayErrors = { ...validationErrors, ...errors };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white via-sky-50 to-purple-50 py-8">
      <div className="w-full max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-2 rounded-xl overflow-hidden shadow-xl">
        <div className="bg-white p-10 border-r border-purple-100 overflow-y-auto max-h-screen">
          <div className="mb-8">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-sky-600 to-purple-600 bg-clip-text text-transparent">
              MenTora
            </h2>
            <p className="text-gray-600 mt-2">
              Satu langkah kecil untuk maju, satu perubahan besar untuk dirimu.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700"
              >
                Nama Lengkap
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="mt-1 w-full px-4 py-3 border border-purple-200 rounded-lg focus:ring-2 focus:ring-purple-300 focus:border-purple-400 bg-white transition-colors"
                placeholder="Masukkan nama lengkap Anda"
              />
              {displayErrors?.name && (
                <span className="text-sm text-red-500 mt-1 block">
                  {displayErrors.name}
                </span>
              )}
            </div>

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
                htmlFor="role"
                className="block text-sm font-medium text-gray-700"
              >
                Role
              </label>
              <select
                id="role"
                value={role}
                onChange={(e) => {
                  setRole(e.target.value);
                  setNip("");
                  setStrImage(null);
                }}
                required
                className="mt-1 w-full px-4 py-3 border border-purple-200 rounded-lg focus:ring-2 focus:ring-purple-300 focus:border-purple-400 bg-white transition-colors"
              >
                <option value="">Pilih Role</option>
                <option value="User">User</option>
                <option value="Pemerintah">Pemerintah</option>
                <option value="Psikolog">Psikolog</option>
              </select>
              {displayErrors?.role && (
                <span className="text-sm text-red-500 mt-1 block">
                  {displayErrors.role}
                </span>
              )}
            </div>

            {/* Conditional NIP field for Pemerintah */}
            {role === "Pemerintah" && (
              <div>
                <label
                  htmlFor="nip"
                  className="block text-sm font-medium text-gray-700"
                >
                  NIP (Nomor Induk Pegawai)
                </label>
                <input
                  id="nip"
                  type="text"
                  value={nip}
                  onChange={(e) => setNip(e.target.value)}
                  required
                  className="mt-1 w-full px-4 py-3 border border-purple-200 rounded-lg focus:ring-2 focus:ring-purple-300 focus:border-purple-400 bg-white transition-colors"
                  placeholder="Masukkan NIP Anda"
                />
                {displayErrors?.nip && (
                  <span className="text-sm text-red-500 mt-1 block">
                    {displayErrors.nip}
                  </span>
                )}
              </div>
            )}

            {/* Conditional STR Image field for Psikolog */}
            {role === "Psikolog" && (
              <div>
                <label
                  htmlFor="strImage"
                  className="block text-sm font-medium text-gray-700"
                >
                  Upload Gambar STR (Surat Tanda Registrasi)
                </label>
                <input
                  id="strImage"
                  type="file"
                  accept="image/jpeg,image/jpg,image/png"
                  onChange={handleImageChange}
                  required
                  className="mt-1 w-full px-4 py-3 border border-purple-200 rounded-lg focus:ring-2 focus:ring-purple-300 focus:border-purple-400 bg-white transition-colors file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
                />
                {strImage && (
                  <p className="text-sm text-green-600 mt-1">
                    File terpilih: {strImage.name}
                  </p>
                )}
                {displayErrors?.strImage && (
                  <span className="text-sm text-red-500 mt-1 block">
                    {displayErrors.strImage}
                  </span>
                )}
              </div>
            )}

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

            <div>
              <label
                htmlFor="password-confirm"
                className="block text-sm font-medium text-gray-700"
              >
                Konfirmasi Password
              </label>
              <input
                id="password-confirm"
                type="password"
                value={passwordConfirmation}
                onChange={(e) => setPasswordConfirmation(e.target.value)}
                required
                className="mt-1 w-full px-4 py-3 border border-purple-200 rounded-lg focus:ring-2 focus:ring-purple-300 focus:border-purple-400 bg-white transition-colors"
                placeholder="Konfirmasi password Anda"
              />
              {displayErrors?.password_confirmation && (
                <span className="text-sm text-red-500 mt-1 block">
                  {displayErrors.password_confirmation}
                </span>
              )}
            </div>

            <div className="mt-6">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full px-6 py-3 text-white bg-gradient-to-r from-sky-500 to-purple-500 rounded-lg hover:from-sky-600 hover:to-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-md hover:shadow-lg"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Memproses...
                  </div>
                ) : (
                  "Daftar"
                )}
              </button>
            </div>

            <div className="text-center">
              <p className="text-sm text-gray-600">
                Sudah memiliki akun?{" "}
                <button
                  type="button"
                  onClick={() => window.location.href = "/login"}
                  className="font-medium text-purple-600 hover:text-purple-800 transition-colors"
                >
                  Masuk
                </button>
              </p>
            </div>
          </form>
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
                Hi, Selamat Datang di Mentora!
              </h3>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}