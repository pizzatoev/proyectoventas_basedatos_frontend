import { useState, useEffect } from 'react';
import { addNewProducto, updateProducto, getProducto } from '../../services/productoService.js';
import { useNavigate, useParams } from "react-router-dom";

const ProductoForm = () => {
    const [nombre, setNombre] = useState('');
    const [precio, setPrecio] = useState('');

    const navigate = useNavigate();
    const { id } = useParams();

    useEffect(() => {
        if (id) {
            getProducto(id).then((response) => {
                console.log(response.data);
                setNombre(response.data.nombre);
                setPrecio(response.data.precio);
            }).catch((error) => {
                console.log(error);
            });
        }
    }, [id]);

    // estado para administrar mensajes de error del formulario
    const [errors, setErrors] = useState({
        nombre: '',
        precio: ''
    });

    // Función para validar cada propiedad obligatoria
    function validateForm() {
        let valid = true;
        const errorsCopy = { ...errors };

        // nombre - puede tener letras y números pero no solo números
        if (nombre.trim()) {
            const nombreTrim = nombre.trim();
            // Verificar que no sea solo números
            if (/^\d+$/.test(nombreTrim)) {
                errorsCopy.nombre = 'El nombre no puede contener solo números';
                valid = false;
            } else if (!/^[A-Za-zÁÉÍÓÚáéíóúÑñ0-9\s]+$/.test(nombreTrim)) {
                errorsCopy.nombre = 'El nombre solo puede contener letras y números';
                valid = false;
            } else {
                errorsCopy.nombre = '';
            }
        } else {
            errorsCopy.nombre = 'Nombre is required';
            valid = false;
        }

        // precio - debe ser mayor a 0 y tener un límite máximo
        if (precio) {
            const precioNum = parseFloat(precio);
            if (isNaN(precioNum)) {
                errorsCopy.precio = 'Precio must be a valid number';
                valid = false;
            } else if (precioNum < 0.1) {
                errorsCopy.precio = 'El precio debe ser mayor o igual a 0.1';
                valid = false;
            } else if (precioNum > 999999.99) {
                errorsCopy.precio = 'El precio no puede ser mayor a 999,999.99';
                valid = false;
            } else {
                errorsCopy.precio = '';
            }
        } else {
            errorsCopy.precio = 'Precio is required';
            valid = false;
        }

        setErrors(errorsCopy);
        return valid;
    }

    function saveProductoOrUpdate(e) {
        e.preventDefault();

        // Validar antes de guardar o actualizar
        if (!validateForm()) {
            return;
        }

        const producto = { nombre: nombre.trim(), precio: parseFloat(precio) };

        if (id) {
            // actualizar
            updateProducto(id, producto).then((response) => {
                console.log(response);
                navigate('/productos');
            }).catch((error) => {
                console.log(error);
            });
        } else {
            addNewProducto(producto).then((response) => {
                console.log(response.data);
                navigate('/productos');
            }).catch((error) => {
                console.log(error);
            });
        }
    }

    function pageTitle() {
        if (id) {
            return <h2 className='text-center text-2xl font-bold text-gray-800'>Actualizar Producto</h2>;
        } else {
            return <h2 className='text-center text-2xl font-bold text-gray-800'>Agregar Producto</h2>;
        }
    }

    return (
        <div className="container mx-auto">
            <br />
            <br />
            <div className="row">
                <div className="bg-white shadow-xl rounded-xl p-6 max-w-2xl mx-auto">
                    {pageTitle()}
                    <div className="mt-6">
                        <form onSubmit={saveProductoOrUpdate}>
                            <div className="form-group mb-4">
                                <label className='form-label text-gray-700 font-medium mb-2 block'>Nombre</label>
                                <input
                                    type="text"
                                    placeholder="Enter Producto Name"
                                    name="nombre"
                                    value={nombre}
                                    className={`w-full border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.nombre ? 'border-red-500' : ''}`}
                                    onChange={(e) => setNombre(e.target.value)}
                                />
                                {errors.nombre && <div className="text-red-500 text-sm mt-1">{errors.nombre}</div>}
                            </div>
                            <div className="form-group mb-4">
                                <label className='form-label text-gray-700 font-medium mb-2 block'>Precio</label>
                                <input
                                    type="number"
                                    step="0.1"
                                    min="0.1"
                                    max="999999.99"
                                    placeholder="Enter Producto Price"
                                    name="precio"
                                    value={precio}
                                    className={`w-full border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.precio ? 'border-red-500' : ''}`}
                                    onChange={(e) => setPrecio(e.target.value)}
                                />
                                {errors.precio && <div className="text-red-500 text-sm mt-1">{errors.precio}</div>}
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
                                    onClick={() => navigate('/productos')}
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

export default ProductoForm;

