import { type MetaFunction, type LoaderFunctionArgs, redirect, json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { getSession } from "../utils/session.server";
import DashboardPemerintah from "../components/Dashboard/dashboard-pemerintah";


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
  return <DashboardPemerintah userName={userName} userId={userId} />;
}