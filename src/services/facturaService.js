import api from "./api.js";

export const listFacturas = () => api.get("/facturas");

export const getFactura = (facturaId) => api.get(`/facturas/${facturaId}`);

export const addNewFactura = (factura) => api.post("/facturas", factura);

export const updateFactura = (facturaId, factura) => api.put(`/facturas/${facturaId}`, factura);

export const deleteFactura = (facturaId) => api.delete(`/facturas/${facturaId}`);

