import { LoaderFunctionArgs, redirect } from "@remix-run/node";
import { getSession, destroySession } from "../utils/session.server";

export async function loader({ request }: LoaderFunctionArgs) {
  const session = await getSession(request.headers.get("Cookie"));
  return redirect("/", {
    headers: {
      "Set-Cookie": await destroySession(session),
    },
  });
}