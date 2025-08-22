import type { MetaFunction } from "@remix-run/node";
import Navbar from "../common/navbar";
import IndexHero from "../components/LandingPage/section1";

export const meta: MetaFunction = () => {
  return [
    { title: "MenTora | Homepage" },
    { name: "Greetings", content: "Welcome to MenTora!" },
  ];
};

export default function Index() {
  return (
    <>
      <Navbar />
      <IndexHero />
    </>
  );
}