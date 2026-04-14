import React from "react";
import Dashboard from "./components/Dashboard";

export const metadata = {
  title: "Agent Dashboard | Sidago CRM",
  description:
    "Sidago CRM is a secure and scalable customer relationship management platform designed to help businesses manage leads, track interactions, and build stronger customer connections with ease.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function page() {
  return <Dashboard />;
}
