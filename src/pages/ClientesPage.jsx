import { Routes, Route } from "react-router-dom";
import ClienteList from "../components/Clientes/ClienteList";
import ClienteForm from "../components/Clientes/ClienteForm";

const ClientesPage = () => {
    return (
        <Routes>
            <Route index element={<ClienteList />} />
            <Route path="add" element={<ClienteForm />} />
            <Route path="edit/:id" element={<ClienteForm />} />
        </Routes>
    );
};

export default ClientesPage;

