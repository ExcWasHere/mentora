import type { MetaFunction } from "@remix-run/node";
import RegisterComponent from "~/Frontend/auth/register";

export const meta: MetaFunction = () => {
  return [
    { title: "MenTora | Register" },
    { name: "Greetings", content: "Welcome to MenTora!" },
  ];
};

export default function Index() {
  return (
    <>
      <RegisterComponent />
    </>
  );
}