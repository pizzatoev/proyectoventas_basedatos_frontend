import { Routes, Route } from "react-router-dom";
import ProductoList from "../components/Productos/ProductoList";
import ProductoForm from "../components/Productos/ProductoForm";

const ProductosPage = () => {
    return (
        <Routes>
            <Route index element={<ProductoList />} />
            <Route path="add" element={<ProductoForm />} />
            <Route path="edit/:id" element={<ProductoForm />} />
        </Routes>
    );
};

export default ProductosPage;

