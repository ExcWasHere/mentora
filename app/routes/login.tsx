import type { MetaFunction } from "@remix-run/node";
import LoginComponent from "~/Frontend/auth/login";

export const meta: MetaFunction = () => {
  return [
    { title: "MenTora | Login" },
    { name: "Greetings", content: "Welcome to MenTora!" },
  ];
};

export default function Index() {
  return (
    <>
      <LoginComponent />
    </>
  );
}