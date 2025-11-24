import api from "./api.js";

export const listProductos = () => api.get("/productos");

export const getProducto = (productoId) => api.get(`/productos/${productoId}`);

export const addNewProducto = (producto) => api.post("/productos", producto);

export const updateProducto = (productoId, producto) => api.put(`/productos/${productoId}`, producto);

export const deleteProducto = (productoId) => api.delete(`/productos/${productoId}`);

