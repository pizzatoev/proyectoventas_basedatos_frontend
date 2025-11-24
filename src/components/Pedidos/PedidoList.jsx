import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { listPedidos, deletePedido, getPedido } from "../../services/pedidoService.js";
import { FiShoppingCart, FiPlus, FiTrash2, FiEye } from "react-icons/fi";

const PedidoList = () => {
    const [pedidos, setPedidos] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        loadPedidos();
    }, []);

    const loadPedidos = async () => {
        try {
            const response = await listPedidos();
            const pedidosList = response.data?.data || response.data || [];
            setPedidos(Array.isArray(pedidosList) ? pedidosList : []);
        } catch (error) {
            console.error("Error loading pedidos:", error);
            Swal.fire("Error", "Failed to load pedidos", "error");
            setPedidos([]);
        }
    };

    const handleViewDetails = async (id) => {
        try {
            const response = await getPedido(id);
            const pedido = response.data;
            
            // Construir HTML con los detalles del pedido
            let productosHtml = '<div class="mt-4"><h3 class="font-semibold mb-2">Productos:</h3><ul class="list-disc list-inside space-y-1">';
            if (pedido.productos && pedido.productos.length > 0) {
                pedido.productos.forEach((prod, idx) => {
                    const nombre = prod.nombreProducto || prod.nombre || 'N/A';
                    const cantidad = prod.cantidad || 0;
                    const precio = prod.precio || 0;
                    const subtotal = prod.subtotal || 0;
                    productosHtml += `<li><strong>${nombre}</strong> - Cantidad: ${cantidad} - Precio: BS. ${parseFloat(precio).toFixed(2)} - Subtotal: BS. ${parseFloat(subtotal).toFixed(2)}</li>`;
                });
            } else {
                productosHtml += '<li>No hay productos</li>';
            }
            productosHtml += '</ul></div>';
            
            Swal.fire({
                title: `Detalle del Pedido #${pedido.idPedido}`,
                html: `
                    <div class="text-left space-y-2">
                        <p><strong>Cliente:</strong> ${pedido.nombreCliente || pedido.cliente?.nombre || 'N/A'}</p>
                        <p><strong>Fecha:</strong> ${pedido.fecha ? new Date(pedido.fecha).toLocaleDateString() : 'N/A'}</p>
                        <p><strong>Total:</strong> BS. ${(pedido.total || 0).toFixed(2)}</p>
                        ${productosHtml}
                    </div>
                `,
                width: '600px',
                confirmButtonText: 'Cerrar',
                confirmButtonColor: '#2563eb'
            });
        } catch (error) {
            console.error("Error loading pedido details:", error);
            Swal.fire({
                title: "Error",
                text: "No se pudo cargar el detalle del pedido",
                icon: "error"
            });
        }
    };

    const handleDelete = (id) => {
        Swal.fire({
            title: "¿Eliminar pedido?",
            text: "Esta acción no se puede deshacer.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#6c757d",
            confirmButtonText: "Sí, eliminar",
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await deletePedido(id);
                    Swal.fire("Eliminado", "Pedido eliminado con éxito.", "success");
                    loadPedidos();
                } catch (error) {
                    console.error("Error deleting pedido:", error);
                    let errorMessage = "No se pudo eliminar el pedido";
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
                        <FiShoppingCart className="text-blue-600" />
                        Lista de Pedidos
                    </h1>
                    <p className="text-gray-500 text-sm">
                        Lista de pedidos registrados en el sistema.
                    </p>
                </div>
                <button
                    onClick={() => navigate("/pedidos/add")}
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition"
                >
                    <FiPlus />
                    Agregar Pedido
                </button>
            </div>

            <div className="bg-white shadow-md rounded-xl p-4 overflow-x-auto">
                <table className="w-full border-collapse">
                    <thead>
                        <tr className="bg-blue-50 text-left text-gray-700 text-sm uppercase">
                            <th className="p-3">#</th>
                            <th className="p-3">Cliente</th>
                            <th className="p-3">Fecha</th>
                            <th className="p-3">Total</th>
                            <th className="p-3 text-center">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {pedidos.length > 0 ? (
                            pedidos.map((pedido, i) => (
                                <tr
                                    key={pedido.idPedido}
                                    className={`border-b hover:bg-gray-50 ${
                                        i % 2 === 0 ? "bg-white" : "bg-gray-50"
                                    }`}
                                >
                                    <td className="p-3 font-medium text-gray-700">{i + 1}</td>
                                    <td className="p-3 text-gray-800 font-semibold">
                                        {pedido.nombreCliente || 'N/A'}
                                    </td>
                                    <td className="p-3 text-gray-600">
                                        {pedido.fecha ? new Date(pedido.fecha).toLocaleDateString() : 'N/A'}
                                    </td>
                                    <td className="p-3 text-gray-600 font-semibold">
                                        BS. {pedido.total?.toFixed(2) || '0.00'}
                                    </td>
                                    <td className="p-3 text-center">
                                        <div className="flex justify-center gap-2">
                                            <button
                                                onClick={() => handleViewDetails(pedido.idPedido)}
                                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                                                title="Ver Detalle"
                                            >
                                                <FiEye />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(pedido.idPedido)}
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
                                <td colSpan="5" className="text-center py-8 text-gray-500 italic">
                                    No se encontraron pedidos.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default PedidoList;

