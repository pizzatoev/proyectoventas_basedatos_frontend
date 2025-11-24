import { Routes, Route } from "react-router-dom";
import FacturaList from "../components/Facturas/FacturaList";
import FacturaForm from "../components/Facturas/FacturaForm";

const FacturasPage = () => {
    return (
        <Routes>
            <Route index element={<FacturaList />} />
            <Route path="add" element={<FacturaForm />} />
        </Routes>
    );
};

export default FacturasPage;

