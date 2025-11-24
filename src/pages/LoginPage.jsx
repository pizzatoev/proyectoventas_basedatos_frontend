import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { useAuth } from "../context/AuthContext";
import { login } from "../services/authService.js";

const LoginPage = () => {
    const navigate = useNavigate();
    const { login: setAuth } = useAuth();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    // estado para administrar mensajes de error del formulario
    const [errors, setErrors] = useState({
        email: '',
        password: ''
    });

    // Función para validar cada propiedad obligatoria
    function validateForm() {
        let valid = true;
        const errorsCopy = { ...errors };

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

        // password
        if (password.trim()) {
            errorsCopy.password = '';
        } else {
            errorsCopy.password = 'Password is required';
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
            const response = await login({ email, password });
            const data = response.data;

            // Manejar token y datos del usuario
            const token = data.token || data.accessToken;
            if (!token) throw new Error("Token no recibido desde el backend.");

            // Algunos backends devuelven { token, user }, otros devuelven todo junto
            const userData = data.user || {
                userId: data.userId,
                email: data.email,
                firstname: data.firstname,
                lastname: data.lastname,
                role: data.role
            };

            // Guardar token y datos en el contexto y localStorage
            setAuth(token, userData);

            // Mensaje de bienvenida
            Swal.fire({
                title: "Bienvenido",
                text: "Autenticación exitosa. Cargando tu panel...",
                icon: "success",
                confirmButtonColor: "#2563eb",
                timer: 1500,
                showConfirmButton: false,
            });

            // Redirigir tras una breve pausa
            setTimeout(() => navigate("/dashboard"), 1600);
        } catch (err) {
            console.error("Error al iniciar sesión:", err);
            
            let errorMessage = "Error al iniciar sesión";
            
            if (err.response) {
                // El servidor respondió con un código de estado de error
                const status = err.response.status;
                if (status === 403) {
                    errorMessage = "Acceso denegado. Verifica tus credenciales o contacta al administrador.";
                } else if (status === 401) {
                    errorMessage = "Credenciales incorrectas. Verifica tu email y contraseña.";
                } else if (status === 404) {
                    errorMessage = "El endpoint no fue encontrado. Verifica que el backend esté corriendo.";
                } else {
                    errorMessage = err.response?.data?.message || `Error del servidor (${status})`;
                }
            } else if (err.request) {
                // La petición fue hecha pero no se recibió respuesta
                errorMessage = "No se pudo conectar con el servidor. Verifica que el backend esté corriendo en http://localhost:8080";
            } else {
                // Algo más causó el error
                errorMessage = err.message || "Error desconocido";
            }
            
            Swal.fire({
                title: "Error",
                text: errorMessage,
                icon: "error"
            });
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
            <div className="bg-white shadow-2xl rounded-xl p-8 w-full max-w-md">
                <h1 className="text-3xl font-bold text-center text-blue-600 mb-2">
                    SalesMaster PRO
                </h1>
                <p className="text-center text-gray-600 mb-6">Sistema Integral de Gestión de Ventas</p>

                <form onSubmit={handleSubmit} className="space-y-4">
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
                            placeholder="Enter your password"
                            name="password"
                            value={password}
                            className={`w-full border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.password ? 'border-red-500' : ''}`}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        {errors.password && <div className="text-red-500 text-sm mt-1">{errors.password}</div>}
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
                    >
                        Iniciar sesión
                    </button>
                </form>

                <p className="text-center text-sm mt-4 text-gray-500">
                    ¿No tienes una cuenta?{" "}
                    <span
                        className="text-blue-600 cursor-pointer hover:underline font-medium"
                        onClick={() => navigate("/register")}
                    >
                        Crear cuenta
                    </span>
                </p>
            </div>
        </div>
    );
};

export default LoginPage;

