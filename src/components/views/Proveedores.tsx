import {
  ChevronDown,
  ChevronUp,
  Pencil,
  Plus,
  RefreshCcw,
  Trash2,
} from "lucide-react";
import { showToast } from "nextjs-toast-notify";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

interface Proveedores {
  proveedor_id?: number;
  nombre_empresa: string;
  contacto: string;
  telefono: string;
  email: string;
  direccion: string;
  tiempo_entrega_dias: number;
  condiciones_pago: string;
}
type SortKey = keyof Omit<Proveedores, "usuario_id">;

export default function Proveedores() {
  const [proveedores, setProveedores] = useState<Proveedores[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortKey, setSortKey] = useState<SortKey>("nombre_empresa");
  const [sortAsc, setSortAsc] = useState(true);
  const [search, setSearch] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [proveedorParaEditar, setproveedorParaEditar] =
    useState<Proveedores | null>(null);

  const token = localStorage.getItem("token");
  useEffect(() => {
    fetchProveedores();
  }, []);

  const fetchProveedores = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/crud/proveedores");
      const data = await response.json();
      setProveedores(data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching proveedores:", error);
      setLoading(false);
    }
  };
  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortAsc(!sortAsc);
    } else {
      setSortKey(key);
      setSortAsc(true);
    }
  };
  const handleEdit = (proveedores: Proveedores) => {
    setproveedorParaEditar(proveedores);
    setShowAddModal(true);
  };
  const handleDelete = async (id?: number) => {
    if (!id) return;

    console.log("Eliminar proveedor con ID:", id);
    // Creamos la notificación con confirmación
    toast.warning(
      <div>
        <p>¿Estás seguro de que deseas eliminar este proveedor?</p>
        <div className="flex gap-2">
          <button
            onClick={() => {
              confirmDelete(id);
              toast.dismiss(); // Cerramos el toast después de confirmar
            }}
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
      const response = await fetch(`/api/crud/proveedores?proveedor_id=${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        // Si la eliminación es exitosa
        showToast.success("Proveedor Eliminado con éxito!", {
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
        showToast.error("¡Hubo un problema al eliminar el proveedor!", {
          duration: 4000,
          progress: true,
          position: "top-right",
          transition: "bounceIn",
          icon: "",
          sound: true,
        });
        console.error("Error al eliminar el proveedor:", data.error);
      }
    } catch (error) {
      console.error(error);
      showToast.error("¡Hubo un problema al eliminar el proveedor!", {
        duration: 4000,
        progress: true,
        position: "top-right",
        transition: "bounceIn",
        icon: "",
        sound: true,
      });
    }
    fetchProveedores();
  };
  const handleSave = (nuevoProveedor: Proveedores) => {
    if (proveedorParaEditar) {
      console.log("Actualizar:", nuevoProveedor);
      try {
        fetch(
          `/api/crud/proveedores?usuario_id=${proveedorParaEditar.proveedor_id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(nuevoProveedor),
          }
        )
          .then((res) => res.json())
          .then((data) => {
            console.log("Proveedor actualizado:", data);
            fetchProveedores();
          })
          .catch((err) => {
            console.error("Error al actualizar proveedor:", err);
          });
      } catch (error) {
        console.error("Error al actualizar el proveedor:", error);
      }
    } else {
      console.log("Crear nuevo:", nuevoProveedor);
      try {
        fetch("/api/crud/proveedores", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(nuevoProveedor),
        })
          .then((res) => res.json())
          .then((data) => {
            console.log("provedor creado:", data);
            fetchProveedores();
          })
          .catch((err) => {
            console.error("Error al crear proveedor:", err);
          });
      } catch (error) {
        console.error("Error al crear el proveedor:", error);
      }
    }
    setShowAddModal(false);
    setproveedorParaEditar(null);
  };
  const sortedProveedores = [...proveedores]
    .filter((u) =>
      `${u.nombre_empresa} ${u.contacto} ${u.telefono} ${u.email}`
        .toLowerCase()
        .includes(search.toLowerCase())
    )
    .sort((a, b) => {
      const valA = (a[sortKey] ?? "").toString().toLowerCase();
      const valB = b[sortKey] ?? "".toString().toLowerCase();
      return sortAsc
        ? valA.toString().localeCompare(valB.toString())
        : valB.toString().localeCompare(valA.toString());
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
            Proveedores Registrados
          </h2>
          <p className="text-gray-600">
            Gestionar proveedores registrados en el sistema.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            placeholder="Buscar..."
            onChange={(e) => setSearch(e.target.value)}
            className="border rounded-md px-3 py-2 text-black w-full sm:w-auto focus:outline-none focus:ring-2 focus:ring-[#E96D39]"
          />
          <button
            onClick={fetchProveedores}
            className="bg-[#E96D39] text-white px-4 py-2 rounded hover:bg-[#9E4A27] transition"
          >
            <RefreshCcw className="w-4 h-4" />
          </button>
          <button
            onClick={() => {
              setShowAddModal(true);
              setproveedorParaEditar(null);
            }}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>

      {loading ? (
        <p className="text-center text-gray-600">Cargando proveedores...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded-lg shadow-md">
            <thead className="bg-[#9E4A27] text-white">
              <tr>
                {(
                  [
                    "Nombre ",
                    "Contacto",
                    "telefono",
                    "email",
                    "dirección",
                    "Tiempo de Entrega",
                    "Condiciones pago",
                  ] as SortKey[]
                ).map((key) => (
                  <th
                    key={key}
                    className="py-3 px-4 text-left cursor-pointer select-none"
                    onClick={() => handleSort(key)}
                  >
                    <div className="flex items-center gap-1 capitalize">
                      {key} {renderSortIcon(key)}
                    </div>
                  </th>
                ))}
                <th className="py-3 px-4 text-left">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {sortedProveedores.map((proveedores) => (
                <tr
                  key={proveedores.proveedor_id}
                  className="border-b hover:bg-[#E96D39]/10 transition-all"
                >
                  <td className="py-2 px-4 text-black">
                    {proveedores.nombre_empresa}
                  </td>
                  <td className="py-2 px-4 text-black">
                    {proveedores.contacto}
                  </td>
                  <td className="py-2 px-4 text-black">
                    {proveedores.telefono}
                  </td>
                  <td className="py-2 px-4 text-black">{proveedores.email}</td>
                  <td className="py-2 px-4 text-black">
                    {proveedores.direccion}
                  </td>
                  <td className="py-2 px-4 text-black">
                    {proveedores.tiempo_entrega_dias}
                  </td>
                  <td className="py-2 px-4 text-black">
                    {proveedores.condiciones_pago}
                  </td>

                  <td className="py-2 px-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(proveedores)}
                        className="bg-[#E96D39] p-2 rounded hover:bg-[#9E4A27] text-white transition"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(proveedores.proveedor_id)}
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

          {proveedores.length === 0 && (
            <p className="text-center text-gray-500 mt-4">
              No hay proveedores registrados.
            </p>
          )}
        </div>
      )}

      {/* MODAL */}
      {showAddModal && (
        <ProveedoresModal
          show={showAddModal}
          onClose={() => {
            setShowAddModal(false);
            setproveedorParaEditar(null);
          }}
          onSave={handleSave}
          proveedor={proveedorParaEditar}
        />
      )}
    </div>
  );
}

function ProveedoresModal({
  show,
  onClose,
  onSave,
  proveedor,
}: {
  show: boolean;
  onClose: () => void;
  onSave: (proveedor: Proveedores) => void;
  proveedor: Proveedores | null;
}) {
  const [formData, setFormData] = useState<Proveedores>({
    proveedor_id: proveedor ? proveedor.proveedor_id : 0,
    nombre_empresa: proveedor ? proveedor.nombre_empresa : "",
    contacto: proveedor ? proveedor.contacto : "",
    telefono: proveedor ? proveedor.telefono : "",
    email: proveedor ? proveedor.email : "",
    direccion: proveedor ? proveedor.direccion : "",
    tiempo_entrega_dias: proveedor ? proveedor.tiempo_entrega_dias : 0,
    condiciones_pago: proveedor ? proveedor.condiciones_pago : "",
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
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
          {proveedor ? "Editar Proveedor" : "Nuevo Proveedor"}
        </h2>
        <div className="space-y-4">
          <input
            type="text"
            name="nombre_empresa"
            value={formData.nombre_empresa}
            onChange={handleChange}
            placeholder="Nombre de la empresa"
            className="w-full border px-3 py-2 rounded text-black"
          />
          <input
            type="text"
            name="contacto"
            value={formData.contacto}
            onChange={handleChange}
            placeholder="Nombre del contacto"
            className="w-full border px-3 py-2 rounded text-black"
          />
          <input
            type="tel"
            name="telefono"
            value={formData.telefono}
            onChange={handleChange}
            placeholder="Teléfono"
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
            type="text"
            name="direccion"
            value={formData.direccion}
            onChange={handleChange}
            placeholder="Dirección"
            className="w-full border px-3 py-2 rounded text-black"
          />
          <input
            type="number"
            name="tiempo_entrega_dias"
            value={formData.tiempo_entrega_dias}
            onChange={handleChange}
            placeholder="Tiempo de entrega (días)"
            className="w-full border px-3 py-2 rounded text-black"
          />
          <textarea
            name="condiciones_pago"
            value={formData.condiciones_pago}
            onChange={handleChange}
            placeholder="Condiciones de pago"
            className="w-full border px-3 py-2 rounded text-black"
          />
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
