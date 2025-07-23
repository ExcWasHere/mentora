import type { MetaFunction } from "@remix-run/node";
import Dashboard from "~/Frontend/components/Dashboard/dashboard";

export const meta: MetaFunction = () => {
  return [
    { title: "MenTora | Dashboard" },
    { name: "Greetings", content: "Welcome to MenTora!" },
  ];
};

export default function Index() {
  return (
    <>
      <Dashboard />
    </>
  );
}