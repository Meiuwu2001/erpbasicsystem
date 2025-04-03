"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

const Login: React.FC = () => {
  const router = useRouter();
  const [showLogin, setShowLogin] = useState(false);
  const [email, setEmail] = useState("");
  const [contrasenia, setContrasenia] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/");
    }
  }, [router]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    fetch("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, contrasenia }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.token) {
          localStorage.setItem("token", data.token);
          router.push("/dashboard");
        } else {
          alert("Credenciales inválidas");
        }
      })
      .catch((error) => console.error("Error:", error));
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#9E4A27]">
      {!showLogin ? (
        <div className="bg-white p-8 rounded-xl shadow-xl w-[450px] flex flex-col items-center transition-transform transform-gpu animate__animated animate__fadeIn animate__delay-1s">
          {/* Logo y texto de bienvenida */}
          <div className="flex items-center gap-4 mb-6">
            <Image
              src="/logo1.png"
              width={192} // Aumento el tamaño de la imagen
              height={192} // Aumento el tamaño de la imagen
              alt="Oxford Logo"
              className="w-48 h-48 transition-transform transform-gpu animate__animated animate__fadeIn animate__delay-1s" // Animación de entrada
            />
           
          </div>
          <p className="text-lg font-semibold text-gray-800 text-center">
              BIENVENIDOS AL SISTEMA PARA LA GESTIÓN DE PRODUCCIÓN Y ALMACÉN DE
              OXFORD PACKAGING
            </p>
          {/* Botón para iniciar sesión */}
          <button
            onClick={() => setShowLogin(true)}
            className="mt-6 px-6 py-3 text-white text-lg font-bold bg-[#E96D39] rounded-lg shadow-lg hover:bg-[#9E4A27] transition transform hover:scale-105"
          >
            Iniciar Sesión
          </button>
        </div>
      ) : (
        <div className="w-full max-w-md p-8 bg-white rounded-xl shadow-lg transition-all animate__animated animate__fadeIn animate__delay-1s">
          <Image
            src="/logo1.png"
            width={96}
            height={96}
            alt="Oxford Logo"
            className="mx-auto w-24 h-24"
          />
          <h2 className="text-3xl font-bold text-[#E96D39] text-center mb-4">
            Bienvenido
          </h2>
          <p className="text-gray-600 text-center mb-6">
            Inicia sesión con tu cuenta
          </p>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-3 py-2 mt-1 border text-gray-900 border-gray-300 rounded-lg focus:ring-[#E96D39] focus:border-[#E96D39] transition"
              />
            </div>
            <div>
              <label
                htmlFor="contrasenia"
                className="block text-sm font-medium text-gray-900"
              >
                Contraseña
              </label>
              <input
                type="password"
                id="contrasenia"
                value={contrasenia}
                onChange={(e) => setContrasenia(e.target.value)}
                required
                className="w-full px-3 py-2 mt-1 text-gray-900 border border-gray-300 rounded-lg focus:ring-[#E96D39] focus:border-[#E96D39] transition"
              />
            </div>
            <button
              type="submit"
              className="w-full px-4 py-2 text-white bg-[#E96D39] rounded-lg hover:bg-[#9E4A27] transition transform hover:scale-105"
            >
              Iniciar Sesión
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Login;
