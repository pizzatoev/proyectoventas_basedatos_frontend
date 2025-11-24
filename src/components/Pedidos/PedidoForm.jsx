import { useState, useEffect } from 'react';
import { addNewPedido } from '../../services/pedidoService.js';
import { listClientes } from '../../services/clienteService.js';
import { listProductos } from '../../services/productoService.js';
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { FiPlus, FiTrash2 } from "react-icons/fi";

const PedidoForm = () => {
    const [idCliente, setIdCliente] = useState('');
    const [fecha, setFecha] = useState(new Date().toISOString().split('T')[0]);
    const [clientes, setClientes] = useState([]);
    const [productos, setProductos] = useState([]);
    const [productosSeleccionados, setProductosSeleccionados] = useState([]);

    const navigate = useNavigate();

    useEffect(() => {
        loadClientes();
        loadProductos();
    }, []);

    const loadClientes = () => {
        listClientes().then((response) => {
            const clientesList = response.data?.data || response.data || [];
            setClientes(Array.isArray(clientesList) ? clientesList : []);
        }).catch((error) => {
            console.error(error);
        });
    };

    const loadProductos = () => {
        listProductos().then((response) => {
            const productosList = response.data?.data || response.data || [];
            setProductos(Array.isArray(productosList) ? productosList : []);
        }).catch((error) => {
            console.error(error);
        });
    };

    const agregarProducto = () => {
        setProductosSeleccionados([...productosSeleccionados, { idProd: '', cantidad: 1, producto: null }]);
    };

    const eliminarProducto = (index) => {
        const nuevos = productosSeleccionados.filter((_, i) => i !== index);
        setProductosSeleccionados(nuevos);
    };

    const actualizarProducto = (index, campo, valor) => {
        const nuevos = [...productosSeleccionados];
        if (campo === 'idProd') {
            const productoSeleccionado = productos.find(p => p.idProd === parseInt(valor));
            nuevos[index] = { ...nuevos[index], idProd: valor, producto: productoSeleccionado };
        } else {
            nuevos[index] = { ...nuevos[index], [campo]: valor };
        }
        setProductosSeleccionados(nuevos);
    };

    // estado para administrar mensajes de error del formulario
    const [errors, setErrors] = useState({
        idCliente: '',
        fecha: '',
        productos: ''
    });

    // Función para validar cada propiedad obligatoria
    function validateForm() {
        let valid = true;
        const errorsCopy = { ...errors };

        // idCliente
        if (idCliente) {
            errorsCopy.idCliente = '';
        } else {
            errorsCopy.idCliente = 'Select Cliente';
            valid = false;
        }

        // fecha - no debe ser anterior a la fecha actual
        if (fecha.trim()) {
            const fechaSeleccionada = new Date(fecha);
            const fechaActual = new Date();
            fechaActual.setHours(0, 0, 0, 0);
            fechaSeleccionada.setHours(0, 0, 0, 0);
            
            if (fechaSeleccionada < fechaActual) {
                errorsCopy.fecha = 'La fecha no puede ser anterior a la fecha actual';
                valid = false;
            } else {
                errorsCopy.fecha = '';
            }
        } else {
            errorsCopy.fecha = 'Fecha is required';
            valid = false;
        }

        // productos
        if (productosSeleccionados.length === 0) {
            errorsCopy.productos = 'At least one product is required';
            valid = false;
        } else {
            // Validar cada producto
            for (let i = 0; i < productosSeleccionados.length; i++) {
                const p = productosSeleccionados[i];
                if (!p.idProd) {
                    errorsCopy.productos = 'Todos los productos deben estar seleccionados';
                    valid = false;
                    break;
                }
                // Validar que cantidad sea un número válido
                const cantidadNum = parseInt(p.cantidad);
                if (!p.cantidad || isNaN(cantidadNum) || cantidadNum <= 0) {
                    errorsCopy.productos = 'La cantidad debe ser mayor a 0';
                    valid = false;
                    break;
                }
                // Validar límite de caracteres en cantidad (máximo 6 dígitos = 999999)
                const cantidadStr = p.cantidad.toString();
                if (cantidadStr.length > 6) {
                    errorsCopy.productos = 'La cantidad no puede tener más de 6 dígitos';
                    valid = false;
                    break;
                }
            }
            if (valid) {
                errorsCopy.productos = '';
            }
        }

        setErrors(errorsCopy);
        return valid;
    }

    function savePedido(e) {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        const productosFormato = productosSeleccionados.map(p => ({
            idProd: parseInt(p.idProd),
            cantidad: parseInt(p.cantidad)
        }));

        // Convertir fecha de formato "YYYY-MM-DD" a formato ISO con hora para LocalDateTime
        // El backend espera LocalDateTime, así que agregamos "T00:00:00" si solo viene la fecha
        const fechaFormato = fecha ? (fecha.includes('T') ? fecha : `${fecha}T00:00:00`) : null;

        // Convertir idCliente a número
        const idClienteNum = parseInt(idCliente, 10);
        
        const pedido = {
            idCliente: idClienteNum,
            fecha: fechaFormato,
            productos: productosFormato
        };

        addNewPedido(pedido).then((response) => {
            console.log(response.data);
            navigate('/pedidos');
        }).catch((error) => {
            console.log(error);
        });
    }

    const calcularTotal = () => {
        return productosSeleccionados.reduce((total, item) => {
            if (item.producto && item.cantidad) {
                return total + (item.producto.precio * item.cantidad);
            }
            return total;
        }, 0);
    };

    return (
        <div className="container mx-auto">
            <br />
            <br />
            <div className="row">
                <div className="bg-white shadow-xl rounded-xl p-6 max-w-4xl mx-auto">
                    <h2 className='text-center text-2xl font-bold text-gray-800 mb-6'>Agregar Pedido</h2>
                    <div className="mt-6">
                        <form onSubmit={savePedido}>
                            <div className="form-group mb-4">
                                <label className='form-label text-gray-700 font-medium mb-2 block'>Select Cliente</label>
                                <select
                                    className={`w-full border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.idCliente ? 'border-red-500' : ''}`}
                                    value={idCliente}
                                    onChange={(e) => setIdCliente(e.target.value)}
                                >
                                    <option value="">Select Cliente</option>
                                    {clientes.map(cliente =>
                                        <option key={cliente.idCliente} value={cliente.idCliente}>
                                            {cliente.nombre}
                                        </option>
                                    )}
                                </select>
                                {errors.idCliente && <div className="text-red-500 text-sm mt-1">{errors.idCliente}</div>}
                            </div>

                            <div className="form-group mb-4">
                                <label className='form-label text-gray-700 font-medium mb-2 block'>Fecha</label>
                                <input
                                    type="date"
                                    name="fecha"
                                    value={fecha}
                                    className={`w-full border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.fecha ? 'border-red-500' : ''}`}
                                    onChange={(e) => setFecha(e.target.value)}
                                />
                                {errors.fecha && <div className="text-red-500 text-sm mt-1">{errors.fecha}</div>}
                            </div>

                            <div className="form-group mb-4">
                                <div className="flex justify-between items-center mb-2">
                                    <label className='form-label text-gray-700 font-medium'>Productos</label>
                                    <button
                                        type="button"
                                        onClick={agregarProducto}
                                        className="flex items-center gap-1 bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-lg text-sm"
                                    >
                                        <FiPlus />
                                        Agregar Producto
                                    </button>
                                </div>
                                {errors.productos && <div className="text-red-500 text-sm mb-2">{errors.productos}</div>}
                                
                                {productosSeleccionados.map((item, index) => (
                                    <div key={index} className="flex gap-2 mb-2 items-end">
                                        <div className="flex-1">
                                            <select
                                                className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500"
                                                value={item.idProd}
                                                onChange={(e) => actualizarProducto(index, 'idProd', e.target.value)}
                                            >
                                                <option value="">Select Producto</option>
                                                {productos
                                                    .filter(producto => {
                                                        // Filtrar productos ya seleccionados
                                                        const yaSeleccionado = productosSeleccionados.some(
                                                            p => p.idProd === producto.idProd.toString() && p.idProd !== item.idProd
                                                        );
                                                        return !yaSeleccionado;
                                                    })
                                                    .map(producto =>
                                                        <option key={producto.idProd} value={producto.idProd}>
                                                            {producto.nombre} - BS. {producto.precio?.toFixed(2)}
                                                        </option>
                                                    )}
                                            </select>
                                        </div>
                                        <div className="w-32">
                                            <input
                                                type="number"
                                                min="1"
                                                max="999999"
                                                placeholder="Cantidad"
                                                className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500"
                                                value={item.cantidad}
                                                onChange={(e) => {
                                                    const valor = e.target.value;
                                                    // Limitar a 6 dígitos y solo números positivos
                                                    if (valor === '' || (valor.length <= 6 && parseInt(valor) > 0)) {
                                                        actualizarProducto(index, 'cantidad', valor === '' ? '' : parseInt(valor));
                                                    }
                                                }}
                                            />
                                        </div>
                                        <div className="w-24 text-right font-semibold">
                                            BS. {item.producto && item.cantidad ? (item.producto.precio * item.cantidad).toFixed(2) : '0.00'}
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => eliminarProducto(index)}
                                            className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-lg flex items-center justify-center"
                                        >
                                            <FiTrash2 />
                                        </button>
                                    </div>
                                ))}
                            </div>

                            <div className="bg-gray-100 p-4 rounded-lg mb-4">
                                <div className="flex justify-between items-center">
                                    <span className="text-lg font-bold text-gray-700">Total:</span>
                                    <span className="text-2xl font-bold text-blue-600">BS. {calcularTotal().toFixed(2)}</span>
                                </div>
                            </div>

                            <div className="flex gap-3">
                                <button
                                    className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
                                    type="submit"
                                >
                                    Guardar
                                </button>
                                <button
                                    type="button"
                                    onClick={() => navigate('/pedidos')}
                                    className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
                                >
                                    Cancelar
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PedidoForm;

