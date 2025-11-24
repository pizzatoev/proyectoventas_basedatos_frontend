import { useState, useEffect } from 'react';
import { addNewCliente, updateCliente, getCliente } from '../../services/clienteService.js';
import { useNavigate, useParams } from "react-router-dom";

const ClienteForm = () => {
    const [nombre, setNombre] = useState('');
    const [email, setEmail] = useState('');

    const navigate = useNavigate();
    const { id } = useParams();

    useEffect(() => {
        if (id) {
            getCliente(id).then((response) => {
                console.log(response.data);
                setNombre(response.data.nombre);
                setEmail(response.data.email);
            }).catch((error) => {
                console.log(error);
            });
        }
    }, [id]);

    // estado para administrar mensajes de error del formulario
    const [errors, setErrors] = useState({
        nombre: '',
        email: ''
    });

    // Función para validar cada propiedad obligatoria
    function validateForm() {
        let valid = true;
        const errorsCopy = { ...errors };

        // nombre
        if (nombre.trim()) {
            errorsCopy.nombre = '';
        } else {
            errorsCopy.nombre = 'Nombre is required';
            valid = false;
        }

        // email
        if (email.trim()) {
            const validEmail = /^(?=.{6,254}$)(?=.{1,64}@)[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
            if (!validEmail.test(email)) {
                errorsCopy.email = 'Email is not correct';
                valid = false;
            } else {
                errorsCopy.email = '';
            }
        } else {
            errorsCopy.email = 'Email is required';
            valid = false;
        }

        setErrors(errorsCopy);
        return valid;
    }

    function saveClienteOrUpdate(e) {
        e.preventDefault();

        const cliente = { nombre, email };

        if (id) {
            // actualizar
            updateCliente(id, cliente).then((response) => {
                console.log(response);
                navigate('/clientes');
            }).catch((error) => {
                console.log(error);
            });
        } else {
            if (validateForm()) {
                addNewCliente(cliente).then((response) => {
                    console.log(response.data);
                    navigate('/clientes');
                }).catch((error) => {
                    console.log(error);
                });
            }
        }
    }

    function pageTitle() {
        if (id) {
            return <h2 className='text-center text-2xl font-bold text-gray-800'>Actualizar Cliente</h2>;
        } else {
            return <h2 className='text-center text-2xl font-bold text-gray-800'>Agregar Cliente</h2>;
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
                        <form onSubmit={saveClienteOrUpdate}>
                            <div className="form-group mb-4">
                                <label className='form-label text-gray-700 font-medium mb-2 block'>Nombre</label>
                                <input
                                    type="text"
                                    placeholder="Enter Cliente Name"
                                    name="nombre"
                                    value={nombre}
                                    className={`w-full border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.nombre ? 'border-red-500' : ''}`}
                                    onChange={(e) => setNombre(e.target.value)}
                                />
                                {errors.nombre && <div className="text-red-500 text-sm mt-1">{errors.nombre}</div>}
                            </div>
                            <div className="form-group mb-4">
                                <label className='form-label text-gray-700 font-medium mb-2 block'>Email</label>
                                <input
                                    type="text"
                                    placeholder="Enter Cliente Email"
                                    name="email"
                                    value={email}
                                    className={`w-full border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.email ? 'border-red-500' : ''}`}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                                {errors.email && <div className="text-red-500 text-sm mt-1">{errors.email}</div>}
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
                                    onClick={() => navigate('/clientes')}
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

export default ClienteForm;

