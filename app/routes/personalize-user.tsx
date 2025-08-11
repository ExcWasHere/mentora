import type { MetaFunction } from "@remix-run/node";
import PersonalizeUser from "~/Frontend/components/profile/personalize-user";

export const meta: MetaFunction = () => {
  return [
    { title: "MenTora | Personalize" },
    { name: "Greetings", content: "Welcome to MenTora!" },
  ];
};

export default function Index() {
  return (
    <>
      <PersonalizeUser />
    </>
  );
}