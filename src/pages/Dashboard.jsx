import { useEffect, useState } from "react";
import { listClientes } from "../services/clienteService.js";
import { listProductos } from "../services/productoService.js";
import { listPedidos } from "../services/pedidoService.js";
import { listFacturas } from "../services/facturaService.js";
import { FiUsers, FiPackage, FiShoppingCart, FiFileText } from "react-icons/fi";

const Dashboard = () => {
    const [stats, setStats] = useState({
        clientes: 0,
        productos: 0,
        pedidos: 0,
        facturas: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadStats();
    }, []);

    const loadStats = async () => {
        try {
            const [clientesRes, productosRes, pedidosRes, facturasRes] = await Promise.all([
                listClientes(),
                listProductos(),
                listPedidos(),
                listFacturas()
            ]);

            setStats({
                clientes: Array.isArray(clientesRes.data) ? clientesRes.data.length : 0,
                productos: Array.isArray(productosRes.data) ? productosRes.data.length : 0,
                pedidos: Array.isArray(pedidosRes.data) ? pedidosRes.data.length : 0,
                facturas: Array.isArray(facturasRes.data) ? facturasRes.data.length : 0
            });
        } catch (error) {
            console.error("Error loading stats:", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-gray-800 mb-2">Dashboard</h1>
                <p className="text-gray-600">Bienvenido al Sistema de Gestión de Ventas</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-600 text-sm font-medium">Clientes</p>
                            <p className="text-3xl font-bold text-gray-800 mt-2">{stats.clientes}</p>
                        </div>
                        <div className="text-4xl text-blue-500">
                            <FiUsers />
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-600 text-sm font-medium">Productos</p>
                            <p className="text-3xl font-bold text-gray-800 mt-2">{stats.productos}</p>
                        </div>
                        <div className="text-4xl text-green-500">
                            <FiPackage />
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-yellow-500">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-600 text-sm font-medium">Pedidos</p>
                            <p className="text-3xl font-bold text-gray-800 mt-2">{stats.pedidos}</p>
                        </div>
                        <div className="text-4xl text-yellow-500">
                            <FiShoppingCart />
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-purple-500">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-600 text-sm font-medium">Facturas</p>
                            <p className="text-3xl font-bold text-gray-800 mt-2">{stats.facturas}</p>
                        </div>
                        <div className="text-4xl text-purple-500">
                            <FiFileText />
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Información del Sistema</h2>
                <p className="text-gray-600">
                    SalesMaster PRO es un sistema integral para la gestión de ventas y facturación.
                    Desde aquí puedes gestionar clientes, productos, pedidos y facturas de manera eficiente.
                </p>
            </div>
        </div>
    );
};

export default Dashboard;

