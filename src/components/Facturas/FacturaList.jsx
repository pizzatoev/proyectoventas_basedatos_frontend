import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { listFacturas, deleteFactura, getFactura } from "../../services/facturaService.js";
import { FiFileText, FiPlus, FiTrash2, FiEye } from "react-icons/fi";

const FacturaList = () => {
    const [facturas, setFacturas] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        loadFacturas();
    }, []);

    const loadFacturas = async () => {
        try {
            const response = await listFacturas();
            const facturasList = response.data?.data || response.data || [];
            setFacturas(Array.isArray(facturasList) ? facturasList : []);
        } catch (error) {
            console.error("Error loading facturas:", error);
            Swal.fire("Error", "Failed to load facturas", "error");
            setFacturas([]);
        }
    };

    const handleViewDetails = async (id) => {
        try {
            const response = await getFactura(id);
            const factura = response.data;
            
            Swal.fire({
                title: `Detalle de la Factura #${factura.idFactura}`,
                html: `
                    <div class="text-left space-y-2">
                        <p><strong>Número de Factura:</strong> ${factura.nro || 'N/A'}</p>
                        <p><strong>ID Pedido:</strong> ${factura.idPedido || 'N/A'}</p>
                        <p><strong>Fecha:</strong> ${factura.fecha ? new Date(factura.fecha).toLocaleDateString() : 'N/A'}</p>
                        <p><strong>Total:</strong> BS. ${(factura.total || 0).toFixed(2)}</p>
                    </div>
                `,
                width: '500px',
                confirmButtonText: 'Cerrar',
                confirmButtonColor: '#2563eb'
            });
        } catch (error) {
            console.error("Error loading factura details:", error);
            Swal.fire({
                title: "Error",
                text: "No se pudo cargar el detalle de la factura",
                icon: "error"
            });
        }
    };

    const handleDelete = (id) => {
        Swal.fire({
            title: "¿Eliminar factura?",
            text: "Esta acción no se puede deshacer.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#6c757d",
            confirmButtonText: "Sí, eliminar",
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await deleteFactura(id);
                    Swal.fire("Eliminado", "Factura eliminada con éxito.", "success");
                    loadFacturas();
                } catch (error) {
                    console.error("Error deleting factura:", error);
                    let errorMessage = "No se pudo eliminar la factura";
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
                        <FiFileText className="text-blue-600" />
                        Lista de Facturas
                    </h1>
                    <p className="text-gray-500 text-sm">
                        Lista de facturas registradas en el sistema.
                    </p>
                </div>
                <button
                    onClick={() => navigate("/facturas/add")}
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition"
                >
                    <FiPlus />
                    Agregar Factura
                </button>
            </div>

            <div className="bg-white shadow-md rounded-xl p-4 overflow-x-auto">
                <table className="w-full border-collapse">
                    <thead>
                        <tr className="bg-blue-50 text-left text-gray-700 text-sm uppercase">
                            <th className="p-3">#</th>
                            <th className="p-3">Nro Factura</th>
                            <th className="p-3">Pedido</th>
                            <th className="p-3">Fecha</th>
                            <th className="p-3">Total</th>
                            <th className="p-3 text-center">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {facturas.length > 0 ? (
                            facturas.map((factura, i) => (
                                <tr
                                    key={factura.idFactura}
                                    className={`border-b hover:bg-gray-50 ${
                                        i % 2 === 0 ? "bg-white" : "bg-gray-50"
                                    }`}
                                >
                                    <td className="p-3 font-medium text-gray-700">{i + 1}</td>
                                    <td className="p-3 text-gray-800 font-semibold">
                                        {factura.nro || 'N/A'}
                                    </td>
                                    <td className="p-3 text-gray-600">
                                        {factura.idPedido || 'N/A'}
                                    </td>
                                    <td className="p-3 text-gray-600">
                                        {factura.fecha ? new Date(factura.fecha).toLocaleDateString() : 'N/A'}
                                    </td>
                                    <td className="p-3 text-gray-600 font-semibold">
                                        BS. {factura.total?.toFixed(2) || '0.00'}
                                    </td>
                                    <td className="p-3 text-center">
                                        <div className="flex justify-center gap-2">
                                            <button
                                                onClick={() => handleViewDetails(factura.idFactura)}
                                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                                                title="Ver Detalle"
                                            >
                                                <FiEye />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(factura.idFactura)}
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
                                <td colSpan="6" className="text-center py-8 text-gray-500 italic">
                                    No se encontraron facturas.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default FacturaList;

