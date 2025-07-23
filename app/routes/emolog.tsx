import type { MetaFunction } from "@remix-run/node";
import EmologPage from "~/Frontend/components/emolog/emolog";

export const meta: MetaFunction = () => {
  return [
    { title: "MenTora | Emolog" },
    { name: "Greetings", content: "Welcome to MenTora!" },
  ];
};

export default function Index() {
  return (
    <>
      <EmologPage />
    </>
  );
}