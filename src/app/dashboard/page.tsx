"use client";

import React, { useState } from "react";
import NavBar from "@/components/navigation/navbar";
import SidebarMenu from "@/components/navigation/sideBar";

// Importar vistas
import OrdenesProduccion from "@/components/views/OrdenesProduccion";
import DetallesOrdenes from "@/components/views/DetallesOrdenesProduccion";
import Proveedores from "@/components/views/Proveedores";
import Inventario from "@/components/views/Inventario";
import Usuarios from "@/components/views/Usuarios";
import MateriasPrimas from "@/components/views/MateriasPrimas";

export default function Page() {
  const [selected, setSelected] = useState("Inicio");

  const renderVista = () => {
    switch (selected) {
      case "Órdenes en Producción":
        console.log("Órdenes en Producción");
        return <OrdenesProduccion />;
      case "Detalles de Órdenes":
        console.log("Detalles de Órdenes");
        return <DetallesOrdenes />;
      case "Proveedores":
        console.log("Proveedores");
        return <Proveedores />;
      case "Materias Primas":
        console.log("Materias Primas");
        return <MateriasPrimas />;
      case "Inventario":
        console.log("Inventario");
        return <Inventario />;
      case "Usuarios":
        console.log("Usuarios");
        return <Usuarios />;
      default:
        return (
          <div className="flex flex-col items-center justify-center h-full">
            <h1 className="text-4xl font-bold">Dashboard</h1>
            <p className="text-lg">Bienvenido al dashboard</p>
            <p className="text-lg">Aquí puedes gestionar tu contenido</p>
          </div>
        );
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-100">
      <SidebarMenu selected={selected} handleSelect={setSelected} />
      <div className="flex-1 flex flex-col">
        <NavBar />
        <main className="flex-1 p-4">{renderVista()}</main>
      </div>
    </div>
  );
}
