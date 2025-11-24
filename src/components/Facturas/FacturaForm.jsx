import { useState, useEffect } from 'react';
import { addNewFactura } from '../../services/facturaService.js';
import { listPedidos } from '../../services/pedidoService.js';
import { listFacturas } from '../../services/facturaService.js';
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const FacturaForm = () => {
    const [idPedido, setIdPedido] = useState('');
    const [fecha, setFecha] = useState(new Date().toISOString().split('T')[0]);
    const [nro, setNro] = useState('');
    const [pedidos, setPedidos] = useState([]);
    const [facturas, setFacturas] = useState([]);

    const navigate = useNavigate();

    useEffect(() => {
        loadPedidos();
        loadFacturas();
    }, []);

    const loadPedidos = async () => {
        try {
            const response = await listPedidos();
            const pedidosList = response.data?.data || response.data || [];
            setPedidos(Array.isArray(pedidosList) ? pedidosList : []);
        } catch (error) {
            console.error("Error loading pedidos:", error);
        }
    };

    const loadFacturas = async () => {
        try {
            const response = await listFacturas();
            const facturasList = response.data?.data || response.data || [];
            setFacturas(Array.isArray(facturasList) ? facturasList : []);
        } catch (error) {
            console.error("Error loading facturas:", error);
        }
    };

    // Obtener IDs de pedidos que ya tienen factura
    const pedidosFacturados = facturas.map(f => f.idPedido).filter(id => id != null);
    
    // Filtrar pedidos que no tienen factura
    const pedidosDisponibles = pedidos.filter(p => !pedidosFacturados.includes(p.idPedido));

    // estado para administrar mensajes de error del formulario
    const [errors, setErrors] = useState({
        idPedido: '',
        fecha: '',
        nro: ''
    });

    // Función para validar cada propiedad obligatoria
    function validateForm() {
        let valid = true;
        const errorsCopy = { ...errors };

        // idPedido
        if (idPedido) {
            errorsCopy.idPedido = '';
        } else {
            errorsCopy.idPedido = 'Select Pedido';
            valid = false;
        }

        // fecha - debe ser igual o posterior a la fecha del pedido, pero solo del día de hoy
        if (fecha.trim()) {
            // Obtener la fecha de hoy en formato YYYY-MM-DD
            const hoy = new Date();
            const fechaHoy = hoy.getFullYear() + '-' + 
                           String(hoy.getMonth() + 1).padStart(2, '0') + '-' + 
                           String(hoy.getDate()).padStart(2, '0');
            
            // Obtener la fecha del pedido seleccionado
            const pedidoSeleccionado = pedidos.find(p => p.idPedido === parseInt(idPedido));
            if (pedidoSeleccionado && pedidoSeleccionado.fecha) {
                // Convertir fecha del pedido a formato YYYY-MM-DD
                const fechaPedidoObj = new Date(pedidoSeleccionado.fecha);
                const fechaPedido = fechaPedidoObj.getFullYear() + '-' + 
                                  String(fechaPedidoObj.getMonth() + 1).padStart(2, '0') + '-' + 
                                  String(fechaPedidoObj.getDate()).padStart(2, '0');
                
                // La fecha de la factura no puede ser anterior a la fecha del pedido
                if (fecha < fechaPedido) {
                    errorsCopy.fecha = 'La fecha de la factura no puede ser anterior a la fecha del pedido';
                    valid = false;
                } else if (fecha > fechaHoy) {
                    // No puede ser futura
                    errorsCopy.fecha = 'Solo se pueden registrar facturas del día de hoy';
                    valid = false;
                } else if (fecha < fechaHoy) {
                    // No puede ser anterior a hoy
                    errorsCopy.fecha = 'La fecha no puede ser anterior al día de hoy';
                    valid = false;
                } else {
                    errorsCopy.fecha = '';
                }
            } else {
                // Si no hay pedido seleccionado, solo validar que sea hoy
                if (fecha < fechaHoy) {
                    errorsCopy.fecha = 'La fecha no puede ser anterior al día de hoy';
                    valid = false;
                } else if (fecha > fechaHoy) {
                    errorsCopy.fecha = 'Solo se pueden registrar facturas del día de hoy';
                    valid = false;
                } else {
                    errorsCopy.fecha = '';
                }
            }
        } else {
            errorsCopy.fecha = 'Fecha is required';
            valid = false;
        }

        // nro factura (opcional pero si se ingresa debe validarse)
        if (nro.trim()) {
            const nroNum = parseInt(nro);
            if (isNaN(nroNum) || nroNum < 0) {
                errorsCopy.nro = 'El número de factura debe ser un número positivo';
                valid = false;
            } else if (nro.length > 20) {
                errorsCopy.nro = 'El número de factura no puede tener más de 20 caracteres';
                valid = false;
            } else {
                errorsCopy.nro = '';
            }
        } else {
            errorsCopy.nro = '';
        }

        setErrors(errorsCopy);
        return valid;
    }

    function saveFactura(e) {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        // Convertir fecha de formato "YYYY-MM-DD" a formato ISO con hora para LocalDateTime
        const fechaFormato = fecha ? (fecha.includes('T') ? fecha : `${fecha}T00:00:00`) : null;

        const factura = {
            idPedido: parseInt(idPedido),
            fecha: fechaFormato,
            ...(nro && nro.trim() && { nro: nro.trim() })
        };

        addNewFactura(factura).then((response) => {
            console.log(response.data);
            Swal.fire({
                title: "Éxito",
                text: "Factura creada correctamente",
                icon: "success",
                confirmButtonColor: "#2563eb",
            });
            navigate('/facturas');
        }).catch((error) => {
            console.log(error);
            let errorMessage = "Error al crear la factura";
            
            // Manejar diferentes tipos de errores del backend
            if (error.response?.data) {
                const errorData = error.response.data;
                
                // Intentar obtener el mensaje de error
                if (errorData.message) {
                    errorMessage = errorData.message;
                } else if (errorData.data) {
                    // Algunos backends devuelven el mensaje en data
                    if (typeof errorData.data === 'string') {
                        errorMessage = errorData.data;
                    } else if (errorData.data.message) {
                        errorMessage = errorData.data.message;
                    }
                } else if (errorData.error) {
                    errorMessage = errorData.error;
                }
                
                // Verificar si es un error de validación (400) o conflicto (409)
                if (error.response.status === 400 || error.response.status === 409) {
                    // Estos son errores de validación o conflicto, mostrar el mensaje específico
                    if (!errorMessage || errorMessage === "Error al crear la factura") {
                        errorMessage = "El número de factura ya existe o hay un error de validación";
                    }
                }
            } else if (error.request) {
                errorMessage = "No se pudo conectar con el servidor";
            } else {
                errorMessage = error.message || "Error desconocido";
            }
            
            Swal.fire({
                title: "Error",
                text: errorMessage,
                icon: "error"
            });
        });
    }

    return (
        <div className="container mx-auto">
            <br />
            <br />
            <div className="row">
                <div className="bg-white shadow-xl rounded-xl p-6 max-w-2xl mx-auto">
                    <h2 className='text-center text-2xl font-bold text-gray-800 mb-6'>Agregar Factura</h2>
                    <div className="mt-6">
                        <form onSubmit={saveFactura}>
                            <div className="form-group mb-4">
                                <label className='form-label text-gray-700 font-medium mb-2 block'>Select Pedido</label>
                                <select
                                    className={`w-full border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.idPedido ? 'border-red-500' : ''}`}
                                    value={idPedido}
                                    onChange={(e) => setIdPedido(e.target.value)}
                                >
                                    <option value="">Select Pedido</option>
                                    {pedidosDisponibles.map(pedido =>
                                        <option key={pedido.idPedido} value={pedido.idPedido}>
                                            Pedido #{pedido.idPedido} - Cliente: {pedido.clienteNombre || 'N/A'} - Total: BS. {pedido.total?.toFixed(2) || '0.00'}
                                        </option>
                                    )}
                                </select>
                                {errors.idPedido && <div className="text-red-500 text-sm mt-1">{errors.idPedido}</div>}
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
                                <label className='form-label text-gray-700 font-medium mb-2 block'>Nro Factura (Opcional)</label>
                                <input
                                    type="text"
                                    placeholder="Enter Nro Factura (optional)"
                                    name="nro"
                                    value={nro}
                                    maxLength={20}
                                    className={`w-full border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.nro ? 'border-red-500' : ''}`}
                                    onChange={(e) => setNro(e.target.value)}
                                />
                                {errors.nro && <div className="text-red-500 text-sm mt-1">{errors.nro}</div>}
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
                                    onClick={() => navigate('/facturas')}
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

export default FacturaForm;

