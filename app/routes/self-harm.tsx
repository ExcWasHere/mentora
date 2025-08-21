import { json, type MetaFunction, type LoaderFunctionArgs } from "@remix-run/node";
import { getSession } from "~/utils/session.server";
import SelfHarmTracker from "~/Frontend/components/Self-Harm/selfharm";

export const meta: MetaFunction = () => {
  return [
    { title: "MenTora | AloRa" },
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
    token: session.get("token"),
  });
}

export default function Index() {
  return (
    <>
      <SelfHarmTracker />
    </>
  );
}