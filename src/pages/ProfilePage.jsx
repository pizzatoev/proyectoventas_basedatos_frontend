import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Swal from "sweetalert2";
import { FiUser, FiMail, FiShield, FiLogOut } from "react-icons/fi";

const ProfilePage = () => {
    const navigate = useNavigate();
    const { user, logout } = useAuth();

    const handleLogout = () => {
        Swal.fire({
            title: "¿Cerrar sesión?",
            text: "Estás a punto de cerrar tu sesión",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#6c757d",
            confirmButtonText: "Sí, cerrar sesión",
            cancelButtonText: "Cancelar"
        }).then((result) => {
            if (result.isConfirmed) {
                logout();
                navigate("/login");
            }
        });
    };

    return (
        <div className="space-y-6">
            <div className="bg-white shadow-sm rounded-xl p-5">
                <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                    <FiUser className="text-blue-600" />
                    Perfil de Usuario
                </h1>
                <p className="text-gray-500 text-sm mt-1">
                    Información de tu cuenta y configuración
                </p>
            </div>

            <div className="bg-white shadow-md rounded-xl p-6 max-w-2xl">
                <div className="space-y-6">
                    {/* Información Personal */}
                    <div>
                        <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                            <FiUser className="text-blue-600" />
                            Información Personal
                        </h2>
                        <div className="space-y-4">
                            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                                <div className="flex-1">
                                    <p className="text-sm text-gray-500 mb-1">Nombre Completo</p>
                                    <p className="text-lg font-semibold text-gray-800">
                                        {user?.firstname} {user?.lastname}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                                <FiMail className="text-gray-400 text-xl" />
                                <div className="flex-1">
                                    <p className="text-sm text-gray-500 mb-1">Correo Electrónico</p>
                                    <p className="text-lg font-semibold text-gray-800">
                                        {user?.email || "N/A"}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                                <FiShield className="text-gray-400 text-xl" />
                                <div className="flex-1">
                                    <p className="text-sm text-gray-500 mb-1">Rol</p>
                                    <p className="text-lg font-semibold text-gray-800">
                                        <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                                            user?.role === "ADMIN" 
                                                ? "bg-purple-100 text-purple-700" 
                                                : "bg-blue-100 text-blue-700"
                                        }`}>
                                            {user?.role || "N/A"}
                                        </span>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Separador */}
                    <div className="border-t border-gray-200"></div>

                    {/* Acciones */}
                    <div>
                        <h2 className="text-lg font-semibold text-gray-800 mb-4">Acciones</h2>
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-medium transition-colors w-full sm:w-auto"
                        >
                            <FiLogOut />
                            Cerrar Sesión
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;

