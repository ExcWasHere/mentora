import { type MetaFunction, type LoaderFunctionArgs, redirect, json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import Dashboard from "~/Frontend/components/Dashboard/dashboard";
import { getSession } from "~/utils/session.server";

type LoaderData = {
  userName: string;
  userId: string;
  token: string;
  userEmail: string;
};

export const meta: MetaFunction = () => {
  return [
    { title: "MenTora | Dashboard" },
    { name: "Greetings", content: "Welcome to MenTora!" },
  ];
};

export async function loader({ request }: LoaderFunctionArgs) {
  const session = await getSession(request.headers.get("Cookie"));

  if (!session.has("userId") || !session.has("token")) {
    return redirect("/login?unauthorized=1");
  }

  const userName = session.get("userName") ?? "Pengguna";
  const userId = session.get("userId") ?? "";
  const token = session.get("token") ?? "";
  const userEmail = session.get("userEmail") ?? "";

  return json<LoaderData>({ userName, userId, token, userEmail });
}

export default function DashboardRoute() {
  const { userName, userId, token, userEmail } = useLoaderData<LoaderData>();

  return (
    <Dashboard
      userName={userName}
      userId={userId}
      userEmail={userEmail}
      token={token}
    />
  );
}