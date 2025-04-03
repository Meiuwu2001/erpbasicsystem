"use client";
import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

const Navbar: React.FC = () => {
  const [selected, setSelected] = useState<string>("");
  const router = useRouter(); // Asegúrate de usar useRouter() correctamente

  const handleLogout = () => {
    // Simulación de cierre de sesión
    router.push("/"); // Redirigir a la página de inicio
    localStorage.removeItem("token"); // Eliminar el token del almacenamiento local
  };

  const handleSelect = (option: string) => {
    setSelected(option);
  };

  const username = "Usuario Simulado"; // Nombre de usuario simulado

  return (
    <nav className="bg-[#E96D39] p-4">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo */}
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center shadow-md">
            <Image
              src="/logo1.png"
              width={48}
              height={48}
              alt="Logo"
              className="w-10 h-10"
            />
          </div>
          <div className="text-white text-lg font-bold">Oxford Packaging</div>
        </div>

        {/* Usuario y cerrar sesión */}
        <div className="flex items-center gap-4">
          <div className="text-white text-lg">Hola! {username}</div>
          <button
            onClick={handleLogout}
            className="px-6 py-2 rounded-full text-lg transition-all duration-300 bg-[#9E4A27] text-white hover:bg-[#ffffff] hover:text-[#9E4A27] border border-[#9E4A27]"
          >
            Cerrar sesión
          </button>
        </div>
      </div>

      {/* Botones de navegación */}
      <div className="container mx-auto mt-4 flex justify-around">
        {[
          "Órdenes en Producción",
          "Materias Primas",
          "Inventario",
          "Usuarios",
        ].map((buttonText) => (
          <button
            key={buttonText}
            onClick={() => handleSelect(buttonText)}
            className={`px-6 py-2 rounded-full text-lg transition-all duration-300 text-[#9E4A27] 
              ${
                selected === buttonText
                  ? "bg-[#9E4A27] text-white"
                  : "bg-white text-[##9E4A27] border border-[#E96D39]"
              } 
              hover:bg-[#9E4A27] hover:text-white`}
          >
            {buttonText}
          </button>
        ))}
      </div>
    </nav>
  );
};

export default Navbar;
