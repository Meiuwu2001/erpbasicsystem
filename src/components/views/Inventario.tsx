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

interface Inventario {
  inventario_id?: number;
  materia_id?: number;
  cantidad: number;
  stock_minimo: number;
  stock_maximo: number;
  productos: MateriasPrimas;
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
type SortKey = keyof Omit<Inventario, "inventario_id">;

export default function Inventario() {
  const [inventario, setInventarios] = useState<Inventario[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortKey, setSortKey] = useState<SortKey>("productos");
  const [sortAsc, setSortAsc] = useState(true);
  const [search, setSearch] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [inventarioToEdit, setInventarioToEdit] = useState<Inventario | null>(
    null
  );
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchInventario();
  }, []);

  const fetchInventario = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/crud/inventario");
      const data = await response.json();
      setInventarios(data);
      setLoading(false);
    } catch (error) {
      console.log("Error fetching inventario", error);
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
  const handleEdit = (inventario: Inventario) => {
    setInventarioToEdit(inventario);
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
      const response = await fetch(`/api/crud/inventario?inventario_id=${id}`, {
        method: "DELETE",
      });

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
    fetchInventario();
  };
  const handleSave = (nuevoInventario: Inventario) => {
    if (inventarioToEdit) {
      console.log("Actualizar:", nuevoInventario);
      try {
        fetch(
          `/api/crud/inventario?inventario_id=${inventarioToEdit.inventario_id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(nuevoInventario),
          }
        )
          .then((res) => res.json())
          .then((data) => {
            console.log("Proveedor actualizado:", data);
            fetchInventario();
          })
          .catch((err) => {
            console.error("Error al actualizar proveedor:", err);
          });
      } catch (error) {
        console.error("Error al actualizar el proveedor:", error);
      }
    } else {
      console.log("Crear nuevo:", nuevoInventario);
      try {
        fetch("/api/crud/inventario", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(nuevoInventario),
        })
          .then((res) => res.json())
          .then((data) => {
            console.log("provedor creado:", data);
            fetchInventario();
          })
          .catch((err) => {
            console.error("Error al crear proveedor:", err);
          });
      } catch (error) {
        console.error("Error al crear el proveedor:", error);
      }
    }
    setShowAddModal(false);
    setInventarioToEdit(null);
  };
  const sortedInventario = [...inventario]
    .filter((u) =>
      `${u.productos} ${u.cantidad}`
        .toLowerCase()
        .includes(search.toLocaleLowerCase())
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
            Inventario Registrados
          </h2>
          <p className="text-gray-600">Gestionar inventario en el sistema.</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            placeholder="Buscar..."
            onChange={(e) => setSearch(e.target.value)}
            className="border rounded-md px-3 py-2 text-black w-full sm:w-auto focus:outline-none focus:ring-2 focus:ring-[#E96D39]"
          />
          <button
            onClick={fetchInventario}
            className="bg-[#E96D39] text-white px-4 py-2 rounded hover:bg-[#9E4A27] transition"
          >
            <RefreshCcw className="w-4 h-4" />
          </button>
          <button
            onClick={() => {
              setShowAddModal(true);
              setInventarioToEdit(null);
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
                    "productos",
                    "cantidad",
                    "stock minimo",
                    "stock maximo",
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
              {sortedInventario.map((inventario) => (
                <tr
                  key={inventario.inventario_id}
                  className="border-b hover:bg-[#E96D39]/10 transition-all"
                >
                  <td className="py-2 px-4 text-black">
                    {inventario.productos.nombre}
                  </td>
                  <td className="py-2 px-4 text-black">
                    {inventario.cantidad}
                  </td>
                  <td className="py-2 px-4 text-black">
                    {inventario.stock_minimo}
                  </td>
                  <td className="py-2 px-4 text-black">
                    {inventario.stock_maximo}
                  </td>

                  <td className="py-2 px-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(inventario)}
                        className="bg-[#E96D39] p-2 rounded hover:bg-[#9E4A27] text-white transition"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(inventario.inventario_id)}
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

          {inventario.length === 0 && (
            <p className="text-center text-gray-500 mt-4">
              No hay inventario disponible.
            </p>
          )}
        </div>
      )}

      {/* MODAL */}
      {showAddModal && (
        <InventarioModal
          show={showAddModal}
          onClose={() => {
            setShowAddModal(false);
            setInventarioToEdit(null);
          }}
          onSave={handleSave}
          inventario={inventarioToEdit}
        />
      )}
    </div>
  );
}
function InventarioModal({
  show,
  onClose,
  onSave,
  inventario,
}: {
  show: boolean;
  onClose: () => void;
  onSave: (inventario: Inventario) => void;
  inventario: Inventario | null;
}) {
  const [formData, setFormData] = useState<Inventario>({
    inventario_id: inventario?.inventario_id,
    materia_id: inventario?.materia_id ?? 0,
    cantidad: inventario?.cantidad || 0,
    stock_minimo: inventario?.stock_minimo || 0,
    stock_maximo: inventario?.stock_maximo || 0,
    productos: inventario?.productos || {
      materia_id: 0,
      nombre: "",
      descripcion: "",
      unidad_medida: "",
      cantidad_disponible: 0,
      costo_unitario: 0,
      provedor_id: 0,
    },
  });

  const [materiasPrimas, setMateriasPrimas] = useState<MateriasPrimas[]>([]);

  useEffect(() => {
    fetchMateriasPrimas().then(setMateriasPrimas).catch(console.error);
  }, []);

  async function fetchMateriasPrimas(): Promise<MateriasPrimas[]> {
    const res = await fetch("/api/crud/materias_primas");
    if (!res.ok) throw new Error("Error al obtener materias primas");
    return res.json();
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "materia_id" ? Number(value) : Number(value),
    }));
  };

  const handleSubmit = () => {
    onSave(formData);
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-black/30 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-full max-w-md shadow-lg">
        <h2 className="text-xl font-bold mb-4 text-black">
          {inventario ? "Editar Inventario" : "Nuevo Inventario"}
        </h2>
        <div className="space-y-4">
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
          <input
            type="number"
            name="cantidad"
            value={formData.cantidad}
            onChange={handleChange}
            placeholder="Cantidad"
            className="w-full border px-3 py-2 rounded text-black"
          />
          <input
            type="number"
            name="stock_minimo"
            value={formData.stock_minimo}
            onChange={handleChange}
            placeholder="Stock mínimo"
            className="w-full border px-3 py-2 rounded text-black"
          />
          <input
            type="number"
            name="stock_maximo"
            value={formData.stock_maximo}
            onChange={handleChange}
            placeholder="Stock máximo"
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
