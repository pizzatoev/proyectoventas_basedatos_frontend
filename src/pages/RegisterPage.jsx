import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { register } from "../services/authService.js";

const RegisterPage = () => {
    const navigate = useNavigate();

    const [firstname, setFirstname] = useState('');
    const [lastname, setLastname] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('VENDEDOR');

    // estado para administrar mensajes de error del formulario
    const [errors, setErrors] = useState({
        firstname: '',
        lastname: '',
        email: '',
        password: '',
        role: ''
    });

    // Función para validar cada propiedad obligatoria
    function validateForm() {
        let valid = true;
        const errorsCopy = { ...errors };

        // firstname - solo letras
        if (firstname.trim()) {
            const nombreRegex = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/;
            if (!nombreRegex.test(firstname.trim())) {
                errorsCopy.firstname = 'El nombre solo puede contener letras';
                valid = false;
            } else {
                errorsCopy.firstname = '';
            }
        } else {
            errorsCopy.firstname = 'Se requiere el primer nombre';
            valid = false;
        }

        // lastname - solo letras
        if (lastname.trim()) {
            const nombreRegex = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/;
            if (!nombreRegex.test(lastname.trim())) {
                errorsCopy.lastname = 'El apellido solo puede contener letras';
                valid = false;
            } else {
                errorsCopy.lastname = '';
            }
        } else {
            errorsCopy.lastname = 'Se requiere el apellido';
            valid = false;
        }

        // email
        if (email.trim()) {
            const validEmail = /^(?=.{6,254}$)(?=.{1,64}@)[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
            if (!validEmail.test(email)) {
                errorsCopy.email = 'El email no es correcto';
                valid = false;
            } else {
                errorsCopy.email = '';
            }
        } else {
            errorsCopy.email = 'Se requiere el email';
            valid = false;
        }

        // password - máximo 32 caracteres, debe tener letras y números
        if (password.trim()) {
            if (password.length < 6) {
                errorsCopy.password = 'La contraseña debe tener al menos 6 caracteres';
                valid = false;
            } else if (password.length > 32) {
                errorsCopy.password = 'La contraseña debe tener como máximo 32 caracteres';
                valid = false;
            } else if (!/[A-Za-z]/.test(password) || !/[0-9]/.test(password)) {
                errorsCopy.password = 'La contraseña debe contener letras y números';
                valid = false;
            } else {
                errorsCopy.password = '';
            }
        } else {
            errorsCopy.password = 'Se requiere la contraseña';
            valid = false;
        }

        // role
        if (role) {
            errorsCopy.role = '';
        } else {
            errorsCopy.role = 'Seleccione un rol';
            valid = false;
        }

        setErrors(errorsCopy);
        return valid;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }

        try {
            const userData = { firstname, lastname, email, password, role };
            const response = await register(userData);
            
            Swal.fire({
                title: "Registro exitoso",
                text: "Tu cuenta ha sido creada correctamente. Por favor inicia sesión.",
                icon: "success",
                confirmButtonColor: "#2563eb",
            }).then(() => {
                navigate("/login");
            });
        } catch (err) {
            console.error("Error al registrar:", err);
            Swal.fire({
                title: "Error",
                text: err.response?.data?.message || "Error al crear la cuenta. Intenta nuevamente.",
                icon: "error"
            });
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
            <div className="bg-white shadow-2xl rounded-xl p-8 w-full max-w-md">
                <h1 className="text-3xl font-bold text-center text-blue-600 mb-2">
                    Registro
                </h1>
                <p className="text-center text-gray-600 mb-6">Crea tu cuenta en SalesMaster PRO</p>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="form-group mb-2">
                        <label className='form-label text-gray-700 font-medium'>First Name</label>
                        <input
                            type="text"
                            placeholder="Enter your first name"
                            name="firstname"
                            value={firstname}
                            className={`w-full border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.firstname ? 'border-red-500' : ''}`}
                            onChange={(e) => setFirstname(e.target.value)}
                        />
                        {errors.firstname && <div className="text-red-500 text-sm mt-1">{errors.firstname}</div>}
                    </div>

                    <div className="form-group mb-2">
                        <label className='form-label text-gray-700 font-medium'>Last Name</label>
                        <input
                            type="text"
                            placeholder="Enter your last name"
                            name="lastname"
                            value={lastname}
                            className={`w-full border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.lastname ? 'border-red-500' : ''}`}
                            onChange={(e) => setLastname(e.target.value)}
                        />
                        {errors.lastname && <div className="text-red-500 text-sm mt-1">{errors.lastname}</div>}
                    </div>

                    <div className="form-group mb-2">
                        <label className='form-label text-gray-700 font-medium'>Email</label>
                        <input
                            type="text"
                            placeholder="Enter your email"
                            name="email"
                            value={email}
                            className={`w-full border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.email ? 'border-red-500' : ''}`}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        {errors.email && <div className="text-red-500 text-sm mt-1">{errors.email}</div>}
                    </div>

                    <div className="form-group mb-2">
                        <label className='form-label text-gray-700 font-medium'>Password</label>
                        <input
                            type="password"
                            placeholder="Enter your password (6-32 chars, letters and numbers)"
                            name="password"
                            value={password}
                            className={`w-full border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.password ? 'border-red-500' : ''}`}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        {errors.password && <div className="text-red-500 text-sm mt-1">{errors.password}</div>}
                    </div>

                    <div className="form-group mb-2">
                        <label className='form-label text-gray-700 font-medium'>Role</label>
                        <select
                            className={`w-full border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.role ? 'border-red-500' : ''}`}
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                        >
                            <option value="VENDEDOR">VENDEDOR</option>
                            <option value="ADMIN">ADMIN</option>
                        </select>
                        {errors.role && <div className="text-red-500 text-sm mt-1">{errors.role}</div>}
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
                    >
                        Registrar
                    </button>
                </form>

                <p className="text-center text-sm mt-4 text-gray-500">
                    ¿Ya tienes una cuenta?{" "}
                    <span
                        className="text-blue-600 cursor-pointer hover:underline font-medium"
                        onClick={() => navigate("/login")}
                    >
                        Iniciar sesión
                    </span>
                </p>
            </div>
        </div>
    );
};

export default RegisterPage;

