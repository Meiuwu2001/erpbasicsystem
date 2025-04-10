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

interface MateriasPrimas {
  materia_id?: number;
  nombre: string;
  descripcion: string;
  unidad_medida: string;
  cantidad_disponible: number;
  costo_unitario: number;
  provedor_id?: number;
  proveedores?: Proveedor; // ← relación con proveedor
}
interface Proveedor {
  proveedor_id: number;
  nombre_empresa: string;
}
type SortKey = keyof Omit<MateriasPrimas, "materia_id">;

export default function MateriasPrimas() {
  const [materiasPrimas, setMateriasPrimas] = useState<MateriasPrimas[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortKey, setSortKey] = useState<SortKey>("nombre");
  const [sortAsc, setSortAsc] = useState(true);
  const [search, setSearch] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [materiasPrimasToEdit, setMateriasPrimasToEdit] =
    useState<MateriasPrimas | null>(null);
  const token = localStorage.getItem("token");
  useEffect(() => {
    fetchMateriasPrimas();
  }, []);
  const fetchMateriasPrimas = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/crud/materias_primas");
      const data = await response.json();
      setMateriasPrimas(data);
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
  const handleEdit = (materiasPrimas: MateriasPrimas) => {
    setMateriasPrimasToEdit(materiasPrimas);
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
        `/api/crud/materias_primas?materia_id=${id}`,
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
    fetchMateriasPrimas();
  };
  const handleSave = (nuevaMateria: MateriasPrimas) => {
    if (materiasPrimasToEdit) {
      console.log("Actualizar:", nuevaMateria);
      try {
        fetch(
          `/api/crud/materias_primas?materia_id=${materiasPrimasToEdit.materia_id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(nuevaMateria),
          }
        )
          .then((res) => res.json())
          .then((data) => {
            console.log("Materia actualizado:", data);
            fetchMateriasPrimas();
          })
          .catch((err) => {
            console.error("Error al actualizar materia:", err);
          });
      } catch (error) {
        console.error("Error al actualizar materia:", error);
      }
    } else {
      console.log("Crear nuevo:", nuevaMateria);
      try {
        fetch("/api/crud/materias_primas", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(nuevaMateria),
        })
          .then((res) => res.json())
          .then((data) => {
            console.log("materia creado:", data);
            fetchMateriasPrimas();
          })
          .catch((err) => {
            console.error("Error al crear materia:", err);
          });
      } catch (error) {
        console.error("Error al crear materia:", error);
      }
    }
    setShowAddModal(false);
    setMateriasPrimasToEdit(null);
  };
  const sortedMaterias = [...materiasPrimas]
    .filter((u) =>
      `${u.nombre} ${u.descripcion} ${u.unidad_medida} ${u.cantidad_disponible} ${u.costo_unitario} ${u.proveedores?.nombre_empresa}`
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
            Materias Primas Registrados
          </h2>
          <p className="text-gray-600">
            Gestionar materias primas registrados en el sistema.
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
            onClick={fetchMateriasPrimas}
            className="bg-[#E96D39] text-white px-4 py-2 rounded hover:bg-[#9E4A27] transition"
          >
            <RefreshCcw className="w-4 h-4" />
          </button>
          <button
            onClick={() => {
              setShowAddModal(true);
              setMateriasPrimasToEdit(null);
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
                    "nombre",
                    "descripcion",
                    "Unidad de Medida",
                    "Cantidad Disponible",
                    "Costo Unitario",
                    "Proveedor",
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
              {sortedMaterias.map((materias) => (
                <tr
                  key={materias.materia_id}
                  className="border-b hover:bg-[#E96D39]/10 transition-all"
                >
                  <td className="py-2 px-4 text-black">{materias.nombre}</td>
                  <td className="py-2 px-4 text-black">
                    {materias.descripcion}
                  </td>
                  <td className="py-2 px-4 text-black">
                    {materias.unidad_medida}
                  </td>
                  <td className="py-2 px-4 text-black">
                    {materias.cantidad_disponible}
                  </td>
                  <td className="py-2 px-4 text-black">
                    {materias.costo_unitario}
                  </td>
                  <td className="py-2 px-4 text-black">
                    {materias.proveedores?.nombre_empresa ?? "Sin proveedor"}
                  </td>

                  <td className="py-2 px-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(materias)}
                        className="bg-[#E96D39] p-2 rounded hover:bg-[#9E4A27] text-white transition"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(materias.materia_id)}
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

          {materiasPrimas.length === 0 && (
            <p className="text-center text-gray-500 mt-4">
              No hay materias primas registrados.
            </p>
          )}
        </div>
      )}

      {/* MODAL */}
      {showAddModal && (
        <MateriasPrimasModal
          show={showAddModal}
          onClose={() => {
            setShowAddModal(false);
            setMateriasPrimasToEdit(null);
          }}
          onSave={handleSave}
          materiaPrima={materiasPrimasToEdit}
        />
      )}
    </div>
  );
}
function MateriasPrimasModal({
  show,
  onClose,
  onSave,
  materiaPrima,
}: {
  show: boolean;
  onClose: () => void;
  onSave: (materia: MateriasPrimas) => void;
  materiaPrima: MateriasPrimas | null;
}) {
  const [formData, setFormData] = useState<MateriasPrimas>({
    materia_id: materiaPrima?.materia_id,
    nombre: materiaPrima?.nombre || "",
    descripcion: materiaPrima?.descripcion || "",
    unidad_medida: materiaPrima?.unidad_medida || "",
    cantidad_disponible: materiaPrima?.cantidad_disponible || 0,
    costo_unitario: materiaPrima?.costo_unitario || 0,
    provedor_id: materiaPrima?.provedor_id,
  });

  const [proveedores, setProveedores] = useState<Proveedor[]>([]);

  useEffect(() => {
    fetchProveedores().then(setProveedores).catch(console.error);
  }, []);
  async function fetchProveedores(): Promise<Proveedor[]> {
    const res = await fetch("/api/crud/proveedores");
    if (!res.ok) throw new Error("Error al obtener proveedores");
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
      [name]: name === "proovedor_id" ? Number(value) : value,
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
          {materiaPrima ? "Editar Materia Prima" : "Nueva Materia Prima"}
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
          <textarea
            name="descripcion"
            value={formData.descripcion}
            onChange={handleChange}
            placeholder="Descripción"
            className="w-full border px-3 py-2 rounded text-black"
          />
          <select
            name="unidad_medida"
            value={formData.unidad_medida}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded text-black"
          >
            <option value="">Selecciona una unidad</option>
            <option value="KG">Kilogramos (KG)</option>
            <option value="M">Metros (M)</option>
            <option value="PIEZAS">Piezas</option>
            <option value="L">Litros (L)</option>
          </select>

          <input
            type="number"
            name="cantidad_disponible"
            value={formData.cantidad_disponible}
            onChange={handleChange}
            placeholder="Cantidad disponible"
            className="w-full border px-3 py-2 rounded text-black"
          />
          <input
            type="number"
            name="costo_unitario"
            value={formData.costo_unitario}
            onChange={handleChange}
            placeholder="Costo unitario"
            className="w-full border px-3 py-2 rounded text-black"
          />
          <select
            name="provedor_id"
            value={formData.provedor_id ?? ""}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded text-black"
          >
            <option value="">Selecciona un proveedor</option>
            {proveedores.map((p) => (
              <option key={p.proveedor_id} value={p.proveedor_id}>
                {p.nombre_empresa}
              </option>
            ))}
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
