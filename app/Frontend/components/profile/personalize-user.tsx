import { useState, useEffect } from "react";

interface PersonalizeProps {
  token: string;
  onSubmit?: (data: {
    token: string;
    gender: string;
    birthdate: string;
    district_id: string;
    subdistrict_id: string;
  }) => void;
  onSkip?: () => void;
  isLoading?: boolean;
  errors?: {
    gender?: string;
    birthdate?: string;
    district_id?: string;
    subdistrict_id?: string;
  };
  userEmail?: string;
}

const mockDistricts = [
  { id: "1", name: "Malang" },
  { id: "2", name: "Batu" },
  { id: "3", name: "Kepanjen" },
  { id: "4", name: "Singosari" },
  { id: "5", name: "Tumpang" },
];

const mockSubdistricts: Record<string, Array<{ id: string; name: string }>> = {
  "1": [
    { id: "1", name: "Klojen" },
    { id: "2", name: "Blimbing" },
    { id: "3", name: "Kedungkandang" },
    { id: "4", name: "Sukun" },
    { id: "5", name: "Lowokwaru" },
  ],
  "2": [
    { id: "6", name: "Batu" },
    { id: "7", name: "Junrejo" },
    { id: "8", name: "Bumiaji" },
  ],
  "3": [
    { id: "9", name: "Kepanjen" },
    { id: "10", name: "Gondanglegi" },
    { id: "11", name: "Pagelaran" },
  ],
  "4": [
    { id: "12", name: "Singosari" },
    { id: "13", name: "Karangploso" },
  ],
  "5": [
    { id: "14", name: "Tumpang" },
    { id: "15", name: "Poncokusumo" },
  ],
};

export default function PersonalizeUser({
  token,
  isLoading = false,
  errors = {},
  userEmail,
}: PersonalizeProps) {
  const [gender, setGender] = useState("");
  const [birthdate, setBirthdate] = useState("");
  const [districtId, setDistrictId] = useState("");
  const [subdistrictId, setSubdistrictId] = useState("");
  const [validationErrors, setValidationErrors] = useState<{
    gender?: string;
    birthdate?: string;
    district_id?: string;
    subdistrict_id?: string;
  }>({});
  const [availableSubdistricts, setAvailableSubdistricts] = useState<
    Array<{ id: string; name: string }>
  >([]);

  useEffect(() => {
    if (districtId) {
      setAvailableSubdistricts(mockSubdistricts[districtId] || []);
      setSubdistrictId("");
    } else {
      setAvailableSubdistricts([]);
    }
  }, [districtId]);

  const validateForm = () => {
    const newErrors: {
      gender?: string;
      birthdate?: string;
      district_id?: string;
      subdistrict_id?: string;
    } = {};

    if (!gender) {
      newErrors.gender = "Jenis kelamin harus dipilih";
    }

    if (!birthdate) {
      newErrors.birthdate = "Tanggal lahir harus diisi";
    } else {
      const today = new Date();
      const selectedDate = new Date(birthdate);
      let age = today.getFullYear() - selectedDate.getFullYear();
      const monthDiff = today.getMonth() - selectedDate.getMonth();

      if (
        monthDiff < 0 ||
        (monthDiff === 0 && today.getDate() < selectedDate.getDate())
      ) {
        age--;
      }

      if (selectedDate > today) {
        newErrors.birthdate = "Tanggal lahir tidak boleh di masa depan";
      } else if (age < 13) {
        newErrors.birthdate = "Minimal umur 13 tahun";
      } else if (age > 100) {
        newErrors.birthdate = "Umur tidak valid";
      }
    }

    if (!districtId) {
      newErrors.district_id = "Kabupaten/Kota harus dipilih";
    }

    if (!subdistrictId) {
      newErrors.subdistrict_id = "Kecamatan harus dipilih";
    }

    setValidationErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const displayErrors = { ...validationErrors, ...errors };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      const res = await fetch("http://localhost:5000/api/profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          gender,
          birthdate,
          district_id: districtId,
          subdistrict_id: subdistrictId,
        }),
      });

      const data = await res.json();
      console.log("Profile response:", data);

      if (res.ok) {
        alert("Profil berhasil disimpan 🎉");
        window.location.href = "/dashboard";
      } else {
        alert(data.error || "Gagal menyimpan profil");
      }
    } catch (err) {
      console.error("Error saving profile:", err);
      alert("Ups! Terjadi kesalahan jaringan");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white via-sky-50 to-purple-50 py-8">
      <img
        src="/latar-belakang.svg"
        alt="background"
        className="fixed inset-0 w-full h-full object-cover opacity-60 pointer-events-none"
      />
      <div className="w-full max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-2 rounded-xl overflow-hidden shadow-xl">
        <div className="bg-white p-10 border-r border-purple-100 overflow-y-auto max-h-screen">
          <div className="mb-8">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-sky-600 to-purple-600 bg-clip-text text-transparent">
              MenTora
            </h2>
            <p className="text-gray-600 mt-2">
              Ceritakan sedikit tentang diri Anda untuk pengalaman yang lebih
              personal.
            </p>
            {userEmail && (
              <p className="text-sm text-gray-500 mt-1">
                Melengkapi profil untuk:{" "}
                <span className="font-medium">{userEmail}</span>
              </p>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Jenis Kelamin
              </label>
              <div className="grid grid-cols-2 gap-4">
                <label className="relative cursor-pointer">
                  <input
                    type="radio"
                    name="gender"
                    value="L"
                    checked={gender === "L"}
                    onChange={(e) => setGender(e.target.value)}
                    className="sr-only peer"
                  />
                  <div className="w-full p-4 text-center border-2 border-purple-200 rounded-lg peer-checked:border-purple-500 peer-checked:bg-purple-50 hover:border-purple-300 transition-all">
                    <div className="text-2xl mb-2">👨</div>
                    <span className="text-sm font-medium text-gray-700">
                      Laki-laki
                    </span>
                  </div>
                </label>
                <label className="relative cursor-pointer">
                  <input
                    type="radio"
                    name="gender"
                    value="P"
                    checked={gender === "P"}
                    onChange={(e) => setGender(e.target.value)}
                    className="sr-only peer"
                  />
                  <div className="w-full p-4 text-center border-2 border-purple-200 rounded-lg peer-checked:border-purple-500 peer-checked:bg-purple-50 hover:border-purple-300 transition-all">
                    <div className="text-2xl mb-2">👩</div>
                    <span className="text-sm font-medium text-gray-700">
                      Perempuan
                    </span>
                  </div>
                </label>
              </div>
              {displayErrors?.gender && (
                <span className="text-sm text-red-500 mt-2 block">
                  {displayErrors.gender}
                </span>
              )}
            </div>

            <div>
              <label
                htmlFor="birthdate"
                className="block text-sm font-medium text-gray-700"
              >
                Tanggal Lahir
              </label>
              <input
                id="birthdate"
                type="date"
                value={birthdate}
                onChange={(e) => setBirthdate(e.target.value)}
                className="mt-1 w-full px-4 py-3 border border-purple-200 rounded-lg focus:ring-2 focus:ring-purple-300 focus:border-purple-400 bg-white transition-colors"
              />
              {displayErrors?.birthdate && (
                <span className="text-sm text-red-500 mt-1 block">
                  {displayErrors.birthdate}
                </span>
              )}
            </div>

            <div>
              <label
                htmlFor="district"
                className="block text-sm font-medium text-gray-700"
              >
                Kabupaten/Kota
              </label>
              <select
                id="district"
                value={districtId}
                onChange={(e) => setDistrictId(e.target.value)}
                className="mt-1 w-full px-4 py-3 border border-purple-200 rounded-lg focus:ring-2 focus:ring-purple-300 focus:border-purple-400 bg-white transition-colors"
              >
                <option value="">Pilih Kabupaten/Kota</option>
                {mockDistricts.map((district) => (
                  <option key={district.id} value={district.id}>
                    {district.name}
                  </option>
                ))}
              </select>
              {displayErrors?.district_id && (
                <span className="text-sm text-red-500 mt-1 block">
                  {displayErrors.district_id}
                </span>
              )}
            </div>

            <div>
              <label
                htmlFor="subdistrict"
                className="block text-sm font-medium text-gray-700"
              >
                Kecamatan
              </label>
              <select
                id="subdistrict"
                value={subdistrictId}
                onChange={(e) => setSubdistrictId(e.target.value)}
                disabled={!districtId}
                className="mt-1 w-full px-4 py-3 border border-purple-200 rounded-lg focus:ring-2 focus:ring-purple-300 focus:border-purple-400 bg-white transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed"
              >
                <option value="">
                  {districtId
                    ? "Pilih Kecamatan"
                    : "Pilih Kabupaten/Kota terlebih dahulu"}
                </option>
                {availableSubdistricts.map((subdistrict) => (
                  <option key={subdistrict.id} value={subdistrict.id}>
                    {subdistrict.name}
                  </option>
                ))}
              </select>
              {displayErrors?.subdistrict_id && (
                <span className="text-sm text-red-500 mt-1 block">
                  {displayErrors.subdistrict_id}
                </span>
              )}
            </div>

            <div className="space-y-4 pt-4">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full px-6 py-3 text-white bg-gradient-to-r from-sky-500 to-purple-500 rounded-lg hover:from-sky-600 hover:to-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-md hover:shadow-lg"
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
                    Menyimpan...
                  </div>
                ) : (
                  "Simpan & Lanjutkan"
                )}
              </button>
            </div>

            <div className="text-center">
              <p className="text-xs text-gray-500">
                Informasi ini akan membantu kami memberikan konten yang lebih
                relevan untuk Anda.
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