import { json, redirect, type ActionFunctionArgs, type MetaFunction } from "@remix-run/node";
import PersonalizeUser from "~/Frontend/components/profile/personalize-user";

export const meta: MetaFunction = () => {
  return [
    { title: "MenTora | Personalize" },
    { name: "Greetings", content: "Welcome to MenTora!" },
  ];
};

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const token = formData.get("token");
  const data = {
    gender: formData.get("gender"),
    birthdate: formData.get("birthdate"),
    district_id: formData.get("district_id"),
    subdistrict_id: formData.get("subdistrict_id"),
  };

  if (!token) {
    return json({ errors: { general: "Token tidak ditemukan, silakan login ulang" } }, { status: 401 });
  }

  try {
    const res = await fetch("http://localhost:5000/api/profile", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    const result = await res.json();

    if (!res.ok) {
      return json({ errors: { general: result.error || "Gagal menyimpan profil" } }, { status: 400 });
    }

    return redirect("/login");
  } catch (err) {
    return json({ errors: { general: "Terjadi kesalahan koneksi" } }, { status: 500 });
  }
}

export default function PersonalizePage() {
  return <PersonalizeUser />;
}