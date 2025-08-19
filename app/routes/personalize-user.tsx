import { json, redirect, type LoaderFunctionArgs, type ActionFunctionArgs, type MetaFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import PersonalizeUser from "~/Frontend/components/profile/personalize-user";
import { getSession } from "~/utils/session.server";

export const meta: MetaFunction = () => {
  return [
    { title: "MenTora | Personalize" },
    { name: "Greetings", content: "Welcome to MenTora!" },
  ];
};

export async function loader({ request }: LoaderFunctionArgs) {
  const session = await getSession(request.headers.get("Cookie"));
  const token = session.get("token");
  const userEmail = session.get("userEmail");

  if (!token) {
    return redirect("/login");
  }

  return json({ token, userEmail });
}

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
    const res = await fetch("http://localhost:5000/api/user-profile", { // ✅ endpoint fix
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

    return redirect("/dashboard");
  } catch (err) {
    return json({ errors: { general: "Terjadi kesalahan koneksi" } }, { status: 500 });
  }
}

export default function PersonalizePage() {
  const { token, userEmail } = useLoaderData<typeof loader>();
  return <PersonalizeUser token={token} userEmail={userEmail} />;
}