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

interface OrdenesProduccion {
  orden_id?: number;
  fecha_inicio: Date;
  fecha_fin: Date;
  estado: string;
  cantidad_producida: number;
  materia_id: number;
  productos?: MateriasPrimas;
  responsable_id: number;
  usuarios?: Usuario;
}
interface MateriasPrimas {
  materia_id?: number;
  nombre: string;
  descripcion: string;
  unidad_medida: string;
  cantidad_disponible: number;
  costo_unitario: number;
  provedor_id?: number;
}
interface Usuario {
  usuario_id?: number;
  nombre: string;
  apellidos: string;
  email: string;
  contrasenia: string;
  rol: string;
}
type SortKey = keyof Omit<OrdenesProduccion, "orden_id">;

export default function OrdenesProduccion() {
  const [ordenesProduccion, setOrdenesProduccion] = useState<
    OrdenesProduccion[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [sortKey, setSortKey] = useState<SortKey>("fecha_inicio");
  const [sortAsc, setSortAsc] = useState(true);
  const [search, setSearch] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [ordenesToEdit, setOrdenesToEdit] = useState<OrdenesProduccion | null>(
    null
  );
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchOrdenes();
  }, []);

  const fetchOrdenes = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/crud/ordenes_produccion");
      const data = await response.json();
      setOrdenesProduccion(data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching materias primas:", error);
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
  const handleEdit = (ordenesProduccion: OrdenesProduccion) => {
    setOrdenesToEdit(ordenesProduccion);
    setShowAddModal(true);
  };
  const handleDelete = async (id?: number) => {
    if (!id) return;

    console.log("Eliminar proveedor con ID:", id);
    // Creamos la notificación con confirmación
    toast.warning(
      <div>
        <p>¿Estás seguro de que deseas eliminar esta materia prima?</p>
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
      const response = await fetch(
        `/api/crud/ordenes_produccion?orden_id=${id}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        // Si la eliminación es exitosa
        showToast.success("Materia Prima Eliminada con éxito!", {
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
        showToast.error("¡Hubo un problema al eliminar la materia prima!", {
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
    fetchOrdenes();
  };
  const handleSave = (nuevaOrden: OrdenesProduccion) => {
    if (ordenesToEdit) {
      console.log("Actualizar:", nuevaOrden);
      try {
        fetch(
          `/api/crud/ordenes_produccion?orden_id=${ordenesToEdit.orden_id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(nuevaOrden),
          }
        )
          .then((res) => res.json())
          .then((data) => {
            console.log("Materia actualizado:", data);
            fetchOrdenes();
          })
          .catch((err) => {
            console.error("Error al actualizar maeria:", err);
          });
      } catch (error) {
        console.error("Error al actualizar el materia:", error);
      }
    } else {
      console.log("Crear nuevo:", nuevaOrden);
      try {
        fetch("/api/crud/ordenes_produccion", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(nuevaOrden),
        })
          .then((res) => res.json())
          .then((data) => {
            console.log("materia creado:", data);
            fetchOrdenes();
          })
          .catch((err) => {
            console.error("Error al crear materia:", err);
          });
      } catch (error) {
        console.error("Error al crear el materia:", error);
      }
    }
    setShowAddModal(false);
    setOrdenesToEdit(null);
  };
  const sortedOrdenes = [...ordenesProduccion]
    .filter((u) =>
      `${u.fecha_fin} ${u.fecha_inicio} ${u.cantidad_producida} ${u.productos} ${u.estado}`
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
            Órdenes de Producción Registradas
          </h2>
          <p className="text-gray-600">
            Gestionar las órdenes de producción del sistema.
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
            onClick={fetchOrdenes}
            className="bg-[#E96D39] text-white px-4 py-2 rounded hover:bg-[#9E4A27] transition"
          >
            <RefreshCcw className="w-4 h-4" />
          </button>
          <button
            onClick={() => {
              setShowAddModal(true);
              setOrdenesToEdit(null);
            }}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>

      {loading ? (
        <p className="text-center text-gray-600">
          Cargando órdenes de producción...
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded-lg shadow-md">
            <thead className="bg-[#9E4A27] text-white">
              <tr>
                <th
                  className="py-3 px-4 text-left cursor-pointer"
                  onClick={() => handleSort("fecha_inicio")}
                >
                  <div className="flex items-center gap-1">
                    Fecha Inicio {renderSortIcon("fecha_inicio")}
                  </div>
                </th>
                <th
                  className="py-3 px-4 text-left cursor-pointer"
                  onClick={() => handleSort("fecha_fin")}
                >
                  <div className="flex items-center gap-1">
                    Fecha Fin {renderSortIcon("fecha_fin")}
                  </div>
                </th>
                <th
                  className="py-3 px-4 text-left cursor-pointer"
                  onClick={() => handleSort("cantidad_producida")}
                >
                  <div className="flex items-center gap-1">
                    Cantidad Producida {renderSortIcon("cantidad_producida")}
                  </div>
                </th>
                <th className="py-3 px-4 text-left">Materia Prima</th>
                <th className="py-3 px-4 text-left">Responsable</th>
                <th className="py-3 px-4 text-left">Estado</th>
                <th className="py-3 px-4 text-left">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {sortedOrdenes.map((orden) => (
                <tr
                  key={orden.orden_id}
                  className="border-b hover:bg-[#E96D39]/10 transition-all"
                >
                  <td className="py-2 px-4 text-black">
                    {new Date(orden.fecha_inicio).toLocaleDateString()}
                  </td>
                  <td className="py-2 px-4 text-black">
                    {new Date(orden.fecha_fin).toLocaleDateString()}
                  </td>
                  <td className="py-2 px-4 text-black">
                    {orden.cantidad_producida}
                  </td>
                  <td className="py-2 px-4 text-black">
                    {orden.productos?.nombre}
                  </td>
                  <td className="py-2 px-4 text-black">
                    {orden.usuarios?.nombre} {orden.usuarios?.apellidos}
                  </td>
                  <td className="py-2 px-4 text-black">{orden.estado}</td>
                  <td className="py-2 px-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(orden)}
                        className="bg-[#E96D39] p-2 rounded hover:bg-[#9E4A27] text-white transition"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(orden.orden_id)}
                        className="bg-red-600 p-2 rounded hover:bg-red-700 text-white transition"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {ordenesProduccion.length === 0 && (
            <p className="text-center text-gray-500 mt-4">
              No hay ordenes en producción registrados.
            </p>
          )}
        </div>
      )}
      {showAddModal && (
        <OrdenesModal
          show={showAddModal}
          onClose={() => {
            setShowAddModal(false);
            setOrdenesToEdit(null);
          }}
          onSave={handleSave}
          ordenes={ordenesToEdit}
        />
      )}
    </div>
  );
}
function OrdenesModal({
  show,
  onClose,
  onSave,
  ordenes,
}: {
  show: boolean;
  onClose: () => void;
  onSave: (ordenes: OrdenesProduccion) => void;
  ordenes: OrdenesProduccion | null;
}) {
  const [formData, setFormData] = useState({
    fecha_inicio: ordenes?.fecha_inicio
      ? new Date(ordenes.fecha_inicio).toISOString().split("T")[0]
      : new Date().toISOString().split("T")[0],
    fecha_fin: ordenes?.fecha_fin
      ? new Date(ordenes.fecha_fin).toISOString().split("T")[0]
      : new Date().toISOString().split("T")[0],
    estado: ordenes?.estado ?? "",
    cantidad_producida: ordenes?.cantidad_producida ?? 0,
    materia_id: ordenes?.materia_id ?? 0,
    responsable_id: ordenes?.responsable_id ?? 0,
  });

  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [materiasPrimas, setMateriasPrimas] = useState<MateriasPrimas[]>([]);

  useEffect(() => {
    fetchUsuarios().then(setUsuarios).catch(console.error);
    fetchMateriasPrimas().then(setMateriasPrimas).catch(console.error);
  }, []);
  async function fetchUsuarios(): Promise<Usuario[]> {
    const res = await fetch("/api/crud/user");
    if (!res.ok) throw new Error("Error al obtener proveedores");
    return res.json();
  }
  async function fetchMateriasPrimas(): Promise<MateriasPrimas[]> {
    const res = await fetch("/api/crud/materias_primas");
    if (!res.ok) throw new Error("Error al obtener materias primas");
    return res.json();
  }

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: ["cantidad_producida", "materia_id", "responsable_id"].includes(
        name
      )
        ? parseInt(value)
        : value,
    }));
  };

  const handleSubmit = () => {
    const dataToSend = {
      ...formData,
      fecha_inicio: new Date(formData.fecha_inicio), // Convertir a Date
      fecha_fin: new Date(formData.fecha_fin), // Convertir a Date
    };
    onSave(dataToSend); // Enviar los datos con las fechas como Date
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-black/30 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-full max-w-md shadow-lg">
        <h2 className="text-xl font-bold mb-4 text-black">Nueva Orden</h2>
        <div className="space-y-4">
          <label className="block text-sm text-black">
            Fecha de Inicio
            <input
              type="date"
              name="fecha_inicio"
              value={formData.fecha_inicio}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded text-black"
            />
          </label>

          <label className="block text-sm text-black">
            Fecha de Fin
            <input
              type="date"
              name="fecha_fin"
              value={formData.fecha_fin}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded text-black"
            />
          </label>

          <label className="block text-sm text-black">
            Estado
            <select
              name="estado"
              value={formData.estado}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded text-black"
            >
              <option value="">Selecciona estado</option>
              <option value="CANCELADO">Cncelado</option>
              <option value="EN_PROCESO">En Proceso</option>
              <option value="COMPLETADO">Completado</option>
            </select>
          </label>
          <label className="block text-sm text-black">
            Cantidad Producida
            <input
              type="number"
              name="cantidad_producida"
              value={formData.cantidad_producida}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded text-black"
            />
          </label>
          <label className="block text-sm text-black">
            Producto
            <select
              name="materia_id"
              value={formData.materia_id}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded text-black"
            >
              <option value="">Selecciona una materia prima</option>
              {materiasPrimas.map((materia) => (
                <option key={materia.materia_id} value={materia.materia_id}>
                  {materia.nombre} - {materia.descripcion}
                </option>
              ))}
            </select>
          </label>
          <label className="block text-sm text-black">
            Responsable
            <select
              name="responsable_id"
              value={formData.responsable_id}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded text-black"
            >
              <option value="">Selecciona un responsable</option>
              {usuarios.map((p) => (
                <option key={p.usuario_id} value={p.usuario_id}>
                  {p.nombre} {p.apellidos}
                </option>
              ))}
            </select>
          </label>
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
