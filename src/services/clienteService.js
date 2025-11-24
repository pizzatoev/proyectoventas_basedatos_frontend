import api from "./api.js";

export const listClientes = () => api.get("/clientes");

export const getCliente = (clienteId) => api.get(`/clientes/${clienteId}`);

export const addNewCliente = (cliente) => api.post("/clientes", cliente);

export const updateCliente = (clienteId, cliente) => api.put(`/clientes/${clienteId}`, cliente);

export const deleteCliente = (clienteId) => api.delete(`/clientes/${clienteId}`);

