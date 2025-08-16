import { type MetaFunction, type LoaderFunctionArgs, redirect, json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import DashboardPemerintah from "~/Frontend/components/Dashboard/dashboard-pemerintah";
import { getSession } from "~/utils/session.server";

type LoaderData = {
  userName: string;
  userId: string;
};

export const meta: MetaFunction = () => {
  return [
    { title: "MenTora | Dashboard-Pemerintah" },
    { name: "Greetings", content: "Welcome to MenTora!" },
  ];
};

export async function loader({ request }: LoaderFunctionArgs) {
  const session = await getSession(request.headers.get("Cookie"));

  if (!session.has("userId")) {
    return redirect("/login?unauthorized=1");
  }

  const userName = session.get("userName") ?? "Pengguna";
  const userId = session.get("userId") ?? "";

  return json<LoaderData>({ userName, userId });
}

export default function DashboardRoute() {
  const { userName, userId } = useLoaderData<LoaderData>();
  return <DashboardPemerintah userName={userName} userId={userId} userEmail={""} />;
}