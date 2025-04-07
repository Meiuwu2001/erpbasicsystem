"use client";

import React, { useEffect, useState } from "react";
import {
  Pencil,
  Trash2,
  ChevronDown,
  ChevronUp,
  RefreshCcw,
  Plus,
} from "lucide-react";
import { showToast } from "nextjs-toast-notify";
import { toast } from "react-toastify";

interface Usuario {
  usuario_id?: number;
  nombre: string;
  apellidos: string;
  email: string;
  contrasenia: string;
  rol: string;
}

type SortKey = keyof Omit<Usuario, "usuario_id">;

export default function Usuarios() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortKey, setSortKey] = useState<SortKey>("nombre");
  const [sortAsc, setSortAsc] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [usuarioParaEditar, setUsuarioParaEditar] = useState<Usuario | null>(
    null
  );
  const [search, setSearch] = useState("");

  const token = localStorage.getItem("token");
  useEffect(() => {
    fetchUsuarios();
  }, []);

  const fetchUsuarios = () => {
    setLoading(true);
    fetch("/api/crud/user")
      .then((res) => res.json())
      .then((data) => {
        setUsuarios(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error al obtener usuarios:", err);
        setLoading(false);
      });
  };

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortAsc(!sortAsc);
    } else {
      setSortKey(key);
      setSortAsc(true);
    }
  };

  const handleEdit = (usuario: Usuario) => {
    setUsuarioParaEditar(usuario);
    setShowAddModal(true);
  };
  const handleDelete = async (id?: number) => {
    if (!id) return;

    console.log("Eliminar usuario con ID:", id);
    // Creamos la notificación con confirmación
    toast.warning(
      <div>
        <p>¿Estás seguro de que deseas eliminar este usuario?</p>
        <div className="flex gap-2">
          <button
            onClick={() => confirmDelete(id)}
            className="bg-red-500 px-3 py-1 rounded text-white"
          >
            Confirmar
          </button>
          <button
            onClick={() => toast.dismiss()}
            className="bg-gray-300 px-3 py-1 rounded"
          >
            Cancelar
          </button>
        </div>
      </div>,
      {
        position: "top-right",
        autoClose: false,
        closeOnClick: false,
        draggable: false,
        className: "custom-toast",
      }
    );
  };

  const confirmDelete = async (id?: number) => {
    if (!id) return;

    try {
      // Realizando la petición al servidor
      const response = await fetch(`/api/crud/user?usuario_id=${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        // Si la eliminación es exitosa
        showToast.success("¡Usuario Eliminado con éxito!", {
          duration: 4000,
          progress: true,
          position: "top-right",
          transition: "bounceIn",
          icon: "",
          sound: true,
        });
        // Puedes actualizar la lista de usuarios o hacer alguna otra acción
      } else {
        // Si hay un error
        const data = await response.json();
        showToast.error("¡Hubo un problema al eliminar el usuario!", {
          duration: 4000,
          progress: true,
          position: "top-right",
          transition: "bounceIn",
          icon: "",
          sound: true,
        });
        console.error("Error al eliminar el usuario:", data.error);
      }
    } catch (error) {
      console.error(error);
      alert("Hubo un problema al intentar eliminar el usuario.");
    }
    fetchUsuarios();
  };

  const handleSave = (nuevoUsuario: Usuario) => {
    if (usuarioParaEditar) {
      console.log("Actualizar:", nuevoUsuario);
      try {
        fetch(`/api/crud/user?usuario_id=${usuarioParaEditar.usuario_id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(nuevoUsuario),
        })
          .then((res) => res.json())
          .then((data) => {
            console.log("Usuario actualizado:", data);
            fetchUsuarios();
          })
          .catch((err) => {
            console.error("Error al actualizar usuario:", err);
          });
      } catch (error) {
        console.error("Error al actualizar el usuario:", error);
      }
    } else {
      console.log("Crear nuevo:", nuevoUsuario);
      try {
        fetch("/api/auth/register", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(nuevoUsuario),
        })
          .then((res) => res.json())
          .then((data) => {
            console.log("Usuario creado:", data);
            fetchUsuarios();
          })
          .catch((err) => {
            console.error("Error al crear usuario:", err);
          });
      } catch (error) {
        console.error("Error al crear el usuario:", error);
      }
    }
    setShowAddModal(false);
    setUsuarioParaEditar(null);
  };

  const sortedUsuarios = [...usuarios]
    .filter((u) =>
      `${u.nombre} ${u.apellidos} ${u.email} ${u.rol}`
        .toLowerCase()
        .includes(search.toLowerCase())
    )
    .sort((a, b) => {
      const valA = (a[sortKey] ?? "").toString().toLowerCase();
      const valB = b[sortKey] ?? "".toString().toLowerCase();
      return sortAsc ? valA.localeCompare(valB) : valB.localeCompare(valA);
    });

  const renderSortIcon = (key: SortKey) => {
    if (sortKey !== key) return <ChevronDown className="w-4 h-4 opacity-50" />;
    return sortAsc ? (
      <ChevronUp className="w-4 h-4" />
    ) : (
      <ChevronDown className="w-4 h-4" />
    );
  };

  return (
    <div className="p-4">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
        <div>
          <h2 className="text-2xl font-bold text-[#9E4A27]">
            Usuarios Registrados
          </h2>
          <p className="text-gray-600">
            Gestionar usuarios registrados en el sistema.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            placeholder="Buscar por nombre, email..."
            onChange={(e) => setSearch(e.target.value)}
            className="border rounded-md px-3 py-2 text-black w-full sm:w-auto focus:outline-none focus:ring-2 focus:ring-[#E96D39]"
          />
          <button
            onClick={fetchUsuarios}
            className="bg-[#E96D39] text-white px-4 py-2 rounded hover:bg-[#9E4A27] transition"
          >
            <RefreshCcw className="w-4 h-4" />
          </button>
          <button
            onClick={() => {
              setShowAddModal(true);
              setUsuarioParaEditar(null);
            }}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>

      {loading ? (
        <p className="text-center text-gray-600">Cargando usuarios...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded-lg shadow-md">
            <thead className="bg-[#9E4A27] text-white">
              <tr>
                {(["nombre", "apellidos", "email", "rol"] as SortKey[]).map(
                  (key) => (
                    <th
                      key={key}
                      className="py-3 px-4 text-left cursor-pointer select-none"
                      onClick={() => handleSort(key)}
                    >
                      <div className="flex items-center gap-1 capitalize">
                        {key} {renderSortIcon(key)}
                      </div>
                    </th>
                  )
                )}
                <th className="py-3 px-4 text-left">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {sortedUsuarios.map((usuario) => (
                <tr
                  key={usuario.usuario_id}
                  className="border-b hover:bg-[#E96D39]/10 transition-all"
                >
                  <td className="py-2 px-4 text-black">{usuario.nombre}</td>
                  <td className="py-2 px-4 text-black">{usuario.apellidos}</td>
                  <td className="py-2 px-4 text-black">{usuario.email}</td>
                  <td className="py-2 px-4 text-black">{usuario.rol}</td>
                  <td className="py-2 px-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(usuario)}
                        className="bg-[#E96D39] p-2 rounded hover:bg-[#9E4A27] text-white transition"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(usuario.usuario_id)}
                        className="bg-red-500 p-2 rounded hover:bg-red-700 text-white transition"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {usuarios.length === 0 && (
            <p className="text-center text-gray-500 mt-4">
              No hay usuarios registrados.
            </p>
          )}
        </div>
      )}

      {/* MODAL */}
      {showAddModal && (
        <UsuarioModal
          show={showAddModal}
          onClose={() => {
            setShowAddModal(false);
            setUsuarioParaEditar(null);
          }}
          onSave={handleSave}
          usuario={usuarioParaEditar}
        />
      )}
    </div>
  );
}

function UsuarioModal({
  show,
  onClose,
  onSave,
  usuario,
}: {
  show: boolean;
  onClose: () => void;
  onSave: (usuario: Usuario) => void;
  usuario: Usuario | null;
}) {
  const [formData, setFormData] = useState<Usuario>({
    nombre: "",
    apellidos: "",
    email: "",
    rol: "",
    contrasenia: "",
    ...usuario,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    onSave(formData);
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-black/30 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-full max-w-md shadow-lg">
        <h2 className="text-xl font-bold mb-4 text-black">
          {usuario ? "Editar Usuario" : "Nuevo Usuario"}
        </h2>
        <div className="space-y-4">
          <input
            type="text"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            placeholder="Nombre"
            className="w-full border px-3 py-2 rounded text-black"
          />
          <input
            type="text"
            name="apellidos"
            value={formData.apellidos}
            onChange={handleChange}
            placeholder="Apellidos"
            className="w-full border px-3 py-2 rounded text-black"
          />
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Correo electrónico"
            className="w-full border px-3 py-2 rounded text-black"
          />
          <input
            type="password"
            name="contrasenia"
            value={formData.contrasenia}
            onChange={handleChange}
            placeholder="Contraseña"
            className="w-full border px-3 py-2 rounded text-black"
          />
          <select
            name="rol"
            value={formData.rol}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded text-black"
          >
            <option value="">Selecciona un rol</option>
            <option value="ADMINISTRADOR">Administrador</option>
            <option value="SUPERVISOR">Supervisor</option>
            <option value="OPERADOR">Operador</option>
            <option value="ALMACEN">Almacén</option>
          </select>
        </div>
        <div className="mt-6 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 border rounded text-gray-700"
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-[#E96D39] text-white rounded hover:bg-[#9E4A27]"
          >
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
}
