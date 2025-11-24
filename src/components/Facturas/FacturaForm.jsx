import { useState, useEffect } from 'react';
import { addNewFactura } from '../../services/facturaService.js';
import { listPedidos } from '../../services/pedidoService.js';
import { useNavigate } from "react-router-dom";

const FacturaForm = () => {
    const [idPedido, setIdPedido] = useState('');
    const [fecha, setFecha] = useState(new Date().toISOString().split('T')[0]);
    const [nro, setNro] = useState('');
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
        }
    };

    // estado para administrar mensajes de error del formulario
    const [errors, setErrors] = useState({
        idPedido: '',
        fecha: ''
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

        // fecha
        if (fecha.trim()) {
            errorsCopy.fecha = '';
        } else {
            errorsCopy.fecha = 'Fecha is required';
            valid = false;
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
            ...(nro && { nro: nro })
        };

        addNewFactura(factura).then((response) => {
            console.log(response.data);
            navigate('/facturas');
        }).catch((error) => {
            console.log(error);
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
                                    {pedidos.map(pedido =>
                                        <option key={pedido.idPedido} value={pedido.idPedido}>
                                            Pedido #{pedido.idPedido} - Cliente: {pedido.clienteNombre || 'N/A'} - Total: ${pedido.total?.toFixed(2) || '0.00'}
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
                                    className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    onChange={(e) => setNro(e.target.value)}
                                />
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

