import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { listProductos, deleteProducto } from "../../services/productoService.js";
import { FiPackage, FiPlus, FiEdit2, FiTrash2 } from "react-icons/fi";

const ProductoList = () => {
    const [productos, setProductos] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        loadProductos();
    }, []);

    const loadProductos = async () => {
        try {
            const response = await listProductos();
            const productosList = response.data?.data || response.data || [];
            setProductos(Array.isArray(productosList) ? productosList : []);
        } catch (error) {
            console.error("Error loading productos:", error);
            Swal.fire("Error", "Failed to load productos", "error");
            setProductos([]);
        }
    };

    const handleDelete = (id) => {
        Swal.fire({
            title: "¿Eliminar producto?",
            text: "Esta acción no se puede deshacer.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#6c757d",
            confirmButtonText: "Sí, eliminar",
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await deleteProducto(id);
                    Swal.fire("Eliminado", "Producto eliminado con éxito.", "success");
                    loadProductos();
                } catch (error) {
                    console.error("Error deleting producto:", error);
                    let errorMessage = "No se pudo eliminar el producto";
                    if (error.response?.data) {
                        const errorData = error.response.data;
                        if (errorData.message) {
                            errorMessage = errorData.message;
                        } else if (errorData.data && typeof errorData.data === 'string') {
                            errorMessage = errorData.data;
                        }
                    }
                    Swal.fire({
                        title: "Error",
                        text: errorMessage,
                        icon: "error"
                    });
                }
            }
        });
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center bg-white shadow-sm rounded-xl p-5">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                        <FiPackage className="text-blue-600" />
                        Lista de Productos
                    </h1>
                    <p className="text-gray-500 text-sm">
                        Lista de productos registrados en el sistema.
                    </p>
                </div>
                <button
                    onClick={() => navigate("/productos/add")}
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition"
                >
                    <FiPlus />
                    Agregar Producto
                </button>
            </div>

            <div className="bg-white shadow-md rounded-xl p-4 overflow-x-auto">
                <table className="w-full border-collapse">
                    <thead>
                        <tr className="bg-blue-50 text-left text-gray-700 text-sm uppercase">
                            <th className="p-3">#</th>
                            <th className="p-3">Nombre</th>
                            <th className="p-3">Precio</th>
                            <th className="p-3 text-center">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {productos.length > 0 ? (
                            productos.map((producto, i) => (
                                <tr
                                    key={producto.idProd}
                                    className={`border-b hover:bg-gray-50 ${
                                        i % 2 === 0 ? "bg-white" : "bg-gray-50"
                                    }`}
                                >
                                    <td className="p-3 font-medium text-gray-700">{i + 1}</td>
                                    <td className="p-3 text-gray-800 font-semibold">
                                        {producto.nombre}
                                    </td>
                                    <td className="p-3 text-gray-600">
                                        BS. {producto.precio?.toFixed(2) || '0.00'}
                                    </td>
                                    <td className="p-3 text-center">
                                        <div className="flex justify-center gap-2">
                                            <Link
                                                to={`/productos/edit/${producto.idProd}`}
                                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                                                title="Edit"
                                            >
                                                <FiEdit2 />
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(producto.idProd)}
                                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                                                title="Delete"
                                            >
                                                <FiTrash2 />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="4" className="text-center py-8 text-gray-500 italic">
                                    No se encontraron productos.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ProductoList;

