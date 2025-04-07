"use client";
import React, { useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

const Navbar: React.FC = () => {
  const router = useRouter(); // Asegúrate de usar useRouter() correctamente

  const handleLogout = () => {
    // Simulación de cierre de sesión
    router.push("/"); // Redirigir a la página de inicio
    localStorage.removeItem("token"); // Eliminar el token del almacenamiento local
  };

  const [nombre, setNombre] = React.useState<string | null>(null);
  const [apellidos, setApellidos] = React.useState<string | null>(null);
  const [email, setEmail] = React.useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    getTokenDecoded();
    if (!token) {
      router.push("/"); // Redirigir a la página de inicio si no hay token
    }
  }, [router]); // Asegúrate de que el efecto se ejecute solo una vez al montar el componente

  const getTokenDecoded = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const response = await fetch("/api/auth/decode", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ token }),
      });

      if (!response.ok) {
        throw new Error("Error al decodificar el token");
      }

      const data = await response.json();
      console.log("Datos decodificados:", data);

      const { nombre } = data.decoded;
      setNombre(nombre); // Set the nombre in state
      const { apellidos } = data.decoded;
      setApellidos(apellidos); // Set the apellidos in state
      const { email } = data.decoded;
      setEmail(email); // Set the email in state
      const { rol } = data.decoded;
      localStorage.setItem("rol", rol); // Store the rol in local storage
      return data.decoded;
    } catch (error) {
      console.error("Error al obtener los datos del token:", error);
    }
  };

  return (
    <nav className="bg-[#E96D39] p-4 shadow-md">
      <div className="container mx-auto flex flex-wrap md:flex-nowrap justify-between items-center gap-4">
        {/* Logo y título */}
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center shadow-lg">
            <Image
              src="/logo1.png"
              width={48}
              height={48}
              alt="Logo"
              className="w-10 h-10"
            />
          </div>
          <div className="text-white text-lg md:text-2xl font-bold tracking-wide">
            Oxford Packaging
          </div>
        </div>

        {/* Usuario y cerrar sesión */}
        <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 w-full md:w-auto">
          <div className="text-white text-sm md:text-lg text-center md:text-left font-semibold">
            Hola! {nombre} {apellidos} — {email}
          </div>
          <button
            onClick={handleLogout}
            className="px-4 py-2 md:px-6 md:py-3 rounded-lg text-sm md:text-lg transition-all duration-300 bg-[#9E4A27] text-white hover:bg-white hover:text-[#9E4A27] border border-[#9E4A27] shadow-md hover:shadow-lg transform hover:scale-105 flex items-center justify-center gap-2 w-auto md:w-[200px] max-w-full"
          >
            <LogOut className="w-5 h-5 md:w-6 md:h-6" />
            <span className="hidden md:inline">Cerrar sesión</span>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
