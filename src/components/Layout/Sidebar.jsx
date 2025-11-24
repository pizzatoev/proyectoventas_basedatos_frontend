import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { FiBarChart2, FiUsers, FiPackage, FiShoppingCart, FiFileText, FiUser } from "react-icons/fi";

const Sidebar = () => {
    const location = useLocation();
    const { user } = useAuth();

    const menuItems = [
        { path: "/dashboard", label: "Dashboard", icon: FiBarChart2 },
        { path: "/clientes", label: "Clientes", icon: FiUsers },
        { path: "/productos", label: "Productos", icon: FiPackage },
        { path: "/pedidos", label: "Pedidos", icon: FiShoppingCart },
        { path: "/facturas", label: "Facturas", icon: FiFileText },
        { path: "/perfil", label: "Perfil", icon: FiUser },
    ];

    const isActive = (path) => {
        return location.pathname === path || location.pathname.startsWith(path + "/");
    };

    return (
        <aside className="w-64 bg-gray-800 text-white min-h-screen">
            <nav className="p-4">
                <ul className="space-y-2">
                    {menuItems.map((item) => (
                        <li key={item.path}>
                            <Link
                                to={item.path}
                                className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                                    isActive(item.path)
                                        ? "bg-blue-600 text-white"
                                        : "text-gray-300 hover:bg-gray-700"
                                }`}
                            >
                                <item.icon className="text-xl" />
                                <span className="font-medium">{item.label}</span>
                            </Link>
                        </li>
                    ))}
                </ul>
            </nav>
        </aside>
    );
};

export default Sidebar;

