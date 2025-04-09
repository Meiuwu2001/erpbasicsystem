"use client";

import React, { useState } from "react";
import { Menu, X } from "lucide-react";

interface SidebarProps {
  selected: string;
  handleSelect: (option: string) => void;
}

const menuItems = [
  "Inicio",
  "Órdenes en Producción",
  "Proveedores",
  "Materias Primas",
  "Inventario",
  "Usuarios",
];

export default function SidebarMenu({ selected, handleSelect }: SidebarProps) {
  const [isOpen, setIsOpen] = useState(false); // para el menú móvil

  return (
    <>
      {/* Botón hamburguesa visible solo en móviles */}
      <div className="md:hidden p-4 flex justify-between items-center bg-[#E96D39]">
        <h2 className="text-white text-lg font-semibold">Menú</h2>
        <button onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? (
            <X className="text-white w-6 h-6" />
          ) : (
            <Menu className="text-white w-6 h-6" />
          )}
        </button>
      </div>

      {/* Menú lateral */}
      <aside
        className={`bg-white w-64 md:block fixed md:relative top-0 left-0 z-40 min-h-screen border-r border-gray-200 shadow-md p-4
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}
      >
        <h2 className="text-xl font-semibold text-[#9E4A27] mb-6">Menú</h2>
        <ul className="flex flex-col gap-4">
          {menuItems.map((item) => (
            <li key={item}>
              <button
                onClick={() => {
                  handleSelect(item);
                  setIsOpen(false); // cerrar menú en móvil
                }}
                className={`w-full text-left px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                  selected === item
                    ? "bg-[#9E4A27] text-white"
                    : "text-[#9E4A27] hover:bg-[#E96D39]/10"
                }`}
              >
                {item}
              </button>
            </li>
          ))}
        </ul>
      </aside>

      {/* Overlay oscuro cuando el menú está abierto en móviles */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
