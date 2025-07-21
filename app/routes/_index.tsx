import type { MetaFunction } from "@remix-run/node";
import Navbar from "../Frontend/common/navbar";
import IndexHero from "../Frontend/components/LandingPage/section1";

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
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