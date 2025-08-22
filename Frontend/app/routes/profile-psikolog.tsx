import { json, LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { getSession } from "../utils/session.server";
import PsikologProfile from "../components/Consultation/profile-psikolog";

export const meta: MetaFunction = () => {
  return [
    { title: "MenTora | Psikolog" },
    { name: "Greetings", content: "Welcome to MenTora!" },
  ];
};

export async function loader({ request }: LoaderFunctionArgs) {
  const session = await getSession(request.headers.get("Cookie"));

  if (!session.has("userId")) {
    return json({ error: "Unauthorized" }, { status: 401 });
  }

  return json({
    userId: session.get("userId"),
    userName: session.get("userName"),
    userEmail: session.get("userEmail"),
  });
}

export default function Index() {
  return (
    <>
      <PsikologProfile/>
    </>
  );
}