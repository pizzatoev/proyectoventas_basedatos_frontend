import api from "./api.js";

export const listPedidos = () => api.get("/pedidos");

export const getPedido = (pedidoId) => api.get(`/pedidos/${pedidoId}`);

export const addNewPedido = (pedido) => api.post("/pedidos", pedido);

export const updatePedido = (pedidoId, pedido) => api.put(`/pedidos/${pedidoId}`, pedido);

export const deletePedido = (pedidoId) => api.delete(`/pedidos/${pedidoId}`);

