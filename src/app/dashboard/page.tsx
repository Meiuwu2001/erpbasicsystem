import React from "react";
import Footer from "@/components/navigation/footer";
import NavBar from "@/components/navigation/navbar";

export default function page() {
  return (
    <div>
      <NavBar />
      <div className="flex flex-col items-center justify-center h-screen">
        <h1 className="text-4xl font-bold">Dashboard</h1>
        <p className="text-lg">Bienvenido al dashboard</p>
        <p className="text-lg">Aquí puedes gestionar tu contenido</p>
      </div>
      <Footer />
    </div>
  );
}
