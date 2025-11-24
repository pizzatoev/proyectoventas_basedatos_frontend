import React from "react";
import {
    BrowserRouter as Router,
    Routes,
    Route,
    Navigate,
} from "react-router-dom";

import { AuthProvider } from "./context/AuthContext";
import PrivateRoute from "./Routes/PrivateRoute";

import MainLayout from "./components/Layout/MainLayout";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import Dashboard from "./pages/Dashboard";
import ClientesPage from "./pages/ClientesPage";
import ProductosPage from "./pages/ProductosPage";
import PedidosPage from "./pages/PedidosPage";
import FacturasPage from "./pages/FacturasPage";
import ProfilePage from "./pages/ProfilePage";

import "./index.css";

function App() {
    return (
        <Router
            future={{
                v7_startTransition: true,
                v7_relativeSplatPath: true,
            }}
        >
            <AuthProvider>
                <Routes>
                    {/* RUTAS PÚBLICAS */}
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />

                    {/* RUTAS PROTEGIDAS */}
                    <Route
                        path="/"
                        element={
                            <PrivateRoute>
                                <MainLayout />
                            </PrivateRoute>
                        }
                    >
                        <Route index element={<Navigate to="/dashboard" replace />} />
                        <Route path="dashboard" element={<Dashboard />} />
                        <Route path="clientes/*" element={<ClientesPage />} />
                        <Route path="productos/*" element={<ProductosPage />} />
                        <Route path="pedidos/*" element={<PedidosPage />} />
                        <Route path="facturas/*" element={<FacturasPage />} />
                        <Route path="perfil" element={<ProfilePage />} />
                    </Route>

                    {/* Redirección general */}
                    <Route path="*" element={<Navigate to="/login" replace />} />
                </Routes>
            </AuthProvider>
        </Router>
    );
}

export default App;
