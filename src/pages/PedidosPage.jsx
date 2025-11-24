import { Routes, Route } from "react-router-dom";
import PedidoList from "../components/Pedidos/PedidoList";
import PedidoForm from "../components/Pedidos/PedidoForm";

const PedidosPage = () => {
    return (
        <Routes>
            <Route index element={<PedidoList />} />
            <Route path="add" element={<PedidoForm />} />
        </Routes>
    );
};

export default PedidosPage;

