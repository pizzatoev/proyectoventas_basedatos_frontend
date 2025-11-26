import { useEffect, useState } from "react";
import { listClientes } from "../services/clienteService.js";
import { listProductos } from "../services/productoService.js";
import { listPedidos } from "../services/pedidoService.js";
import { listFacturas } from "../services/facturaService.js";
import { FiUsers, FiPackage, FiShoppingCart, FiFileText } from "react-icons/fi";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const Dashboard = () => {
    const [stats, setStats] = useState({
        clientes: 0,
        productos: 0,
        pedidos: 0,
        facturas: 0
    });
    const [topClientes, setTopClientes] = useState([]);
    const [topProductos, setTopProductos] = useState([]);
    const [totalVentasMes, setTotalVentasMes] = useState(0);
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

            const clientes = Array.isArray(clientesRes.data) ? clientesRes.data : [];
            const productos = Array.isArray(productosRes.data) ? productosRes.data : [];
            const pedidos = Array.isArray(pedidosRes.data) ? pedidosRes.data : [];
            const facturas = Array.isArray(facturasRes.data) ? facturasRes.data : [];

            setStats({
                clientes: clientes.length,
                productos: productos.length,
                pedidos: pedidos.length,
                facturas: facturas.length
            });

            // Calcular top clientes (por total gastado)
            const clientesMap = new Map();
            pedidos.forEach(pedido => {
                const clienteId = pedido.idCliente;
                const clienteNombre = pedido.nombreCliente || 'Cliente Desconocido';
                const total = parseFloat(pedido.total) || 0;
                
                if (clientesMap.has(clienteId)) {
                    clientesMap.set(clienteId, {
                        id: clienteId,
                        nombre: clienteNombre,
                        total: clientesMap.get(clienteId).total + total,
                        pedidos: clientesMap.get(clienteId).pedidos + 1
                    });
                } else {
                    clientesMap.set(clienteId, {
                        id: clienteId,
                        nombre: clienteNombre,
                        total: total,
                        pedidos: 1
                    });
                }
            });

            const topClientesData = Array.from(clientesMap.values())
                .sort((a, b) => b.total - a.total)
                .slice(0, 5)
                .map((cliente, index) => ({
                    nombre: cliente.nombre.length > 15 ? cliente.nombre.substring(0, 15) + '...' : cliente.nombre,
                    total: parseFloat(cliente.total.toFixed(2)),
                    pedidos: cliente.pedidos
                }));

            setTopClientes(topClientesData);

            // Calcular top productos (por cantidad vendida)
            const productosMap = new Map();
            pedidos.forEach(pedido => {
                if (pedido.productos && Array.isArray(pedido.productos)) {
                    pedido.productos.forEach(prod => {
                        const productoId = prod.idProd;
                        const productoNombre = prod.nombreProducto || prod.nombre || 'Producto Desconocido';
                        const cantidad = parseInt(prod.cantidad) || 0;
                        
                        if (productosMap.has(productoId)) {
                            productosMap.set(productoId, {
                                id: productoId,
                                nombre: productoNombre,
                                cantidad: productosMap.get(productoId).cantidad + cantidad,
                                ventas: productosMap.get(productoId).ventas + 1
                            });
                        } else {
                            productosMap.set(productoId, {
                                id: productoId,
                                nombre: productoNombre,
                                cantidad: cantidad,
                                ventas: 1
                            });
                        }
                    });
                }
            });

            const topProductosData = Array.from(productosMap.values())
                .sort((a, b) => b.cantidad - a.cantidad)
                .slice(0, 5)
                .map((producto, index) => ({
                    nombre: producto.nombre.length > 20 ? producto.nombre.substring(0, 20) + '...' : producto.nombre,
                    cantidad: producto.cantidad,
                    ventas: producto.ventas
                }));

            setTopProductos(topProductosData);

            // Calcular total de ventas del mes actual
            const ahora = new Date();
            const mesActual = ahora.getMonth();
            const añoActual = ahora.getFullYear();
            
            const ventasMes = facturas
                .filter(factura => {
                    if (!factura.fecha) return false;
                    const fechaFactura = new Date(factura.fecha);
                    return fechaFactura.getMonth() === mesActual && 
                           fechaFactura.getFullYear() === añoActual;
                })
                .reduce((total, factura) => {
                    return total + (parseFloat(factura.total) || 0);
                }, 0);

            setTotalVentasMes(ventasMes);
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

            {/* Total Ventas del Mes */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg shadow-lg p-6 text-white">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-blue-100 text-sm font-medium">Total Ventas del Mes</p>
                        <p className="text-4xl font-bold mt-2">BS. {totalVentasMes.toFixed(2)}</p>
                        <p className="text-blue-100 text-xs mt-2">
                            {new Date().toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })}
                        </p>
                    </div>
                    <div className="text-5xl text-blue-200 opacity-80">
                        <FiShoppingCart />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Top Clientes */}
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                        <FiUsers className="text-blue-600" />
                        Top 5 Clientes
                    </h2>
                    {topClientes.length > 0 ? (
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart
                                data={topClientes}
                                layout="vertical"
                                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                            >
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis type="number" />
                                <YAxis dataKey="nombre" type="category" width={100} />
                                <Tooltip 
                                    formatter={(value) => [`BS. ${value.toFixed(2)}`, 'Total']}
                                />
                                <Legend />
                                <Bar dataKey="total" fill="#3b82f6" name="Total (BS.)" />
                            </BarChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="text-center py-8 text-gray-500">
                            No hay datos de clientes disponibles
                        </div>
                    )}
                </div>

                {/* Top Productos */}
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                        <FiPackage className="text-green-600" />
                        Top 5 Productos Más Vendidos
                    </h2>
                    {topProductos.length > 0 ? (
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart
                                data={topProductos}
                                layout="vertical"
                                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                            >
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis type="number" />
                                <YAxis dataKey="nombre" type="category" width={100} />
                                <Tooltip 
                                    formatter={(value) => [value, 'Cantidad']}
                                />
                                <Legend />
                                <Bar dataKey="cantidad" fill="#10b981" name="Cantidad Vendida" />
                            </BarChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="text-center py-8 text-gray-500">
                            No hay datos de productos disponibles
                        </div>
                    )}
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

