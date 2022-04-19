import axios from './axios';

export const register = async (nome, senha, email, phone) => {
  const user = { 
    nome: nome,
    login: email,
    senha: senha,
    email: email,
    roles: "CLIENT",
    phone: phone
  }
  return await axios.post("/seguranca/register", user)
}

export const login = async (email, senha) => {
  const user = { 
    login: email,
    senha: senha,
  }
  return await axios.post("/seguranca/login", user)
}

export const getOrders = async (role) => {
  const path = role=="ADMIN" ? "/admin/agendamentos" : "/client/agendamentos"
  return await axios.get(path)
}

export const getOrder = async (orderId) => {
  return await axios.get("/agendamentos/"+orderId)
}

export const payOrder = async (orderId) => {
  return await axios.put("/agendamentos/"+orderId+"/pagar", {})
}

export const finishOrder = async (orderId) => {
  return await axios.put("/agendamentos/"+orderId+"/terminr", {})
}

export const finishOrder = async (orderId) => {
  return await axios.put("/agendamentos/"+orderId+"/iniciar", {})
}

export const parkOrder = async (role, orderId, kilometers, code) => {
  const path = role=="ADMIN" ? "/admin" : "/client"
  return await axios.put(path+"/agendamentos/"+orderId+"/estacionar", {kilometragem: kilometers, codigo: code})
}

export const cancelOrder = async (orderId) => {
  return await axios.put("/agendamentos/"+orderId+"/cancelar", {})
}

export const approveOrder = async (orderId) => {
  return await axios.put("/agendamentos/"+orderId+"/aprovar", {})
}

export const createOrder = async (idVeiculo, idLavagem, data) => {
  const payload = {
    agendamento = {
      idVeiculo: idVeiculo,
      idLavagem: idLavagem,
      data: data
    }
  }

  return await axios.post("/agendamentos/", payload)
}

export const deleteVehicle = async (vehicleId) => {
  return await axios.delete("/veiculos/"+vehicleId, {})
}

export const editVehicle = async (title, price, vehicleId) => {
  const payload = {
    veiculo: {
      titulo: title,
      preco: price
    }
  }
  return await axios.put("/veiculos/"+vehicleId, payload)
}

export const addVehicle = async (title, price) => {
  const payload = {
    veiculo: {
      titulo: title,
      preco: price
    }
  }
  return await axios.post("/veiculos/", payload)
}

export const getVehicles = async () => {
  return await axios.get("/veiculos")
}

export const getVehicle = async (vehicleId) => {
  return await axios.get("/veiculos/"+vehicleId)
}

export const deleteWash = async (washId) => {
  return await axios.delete("/lavagens/"+washId, {})
}

export const editWash = async (title, price, washId) => {
  const payload = {
    veiculo: {
      titulo: title,
      preco: price
    }
  }
  return await axios.put("/lavagens/"+washId, payload)
}

export const addWash = async (title, price) => {
  const payload = {
    veiculo: {
      titulo: title,
      preco: price
    }
  }
  return await axios.post("/lavagens/", payload)
}

export const getWashes = async () => {
  return await axios.get("/lavagens")
}

export const getWash = async (washId) => {
  return await axios.get("/lavagens/"+washId)
}

export const getUsers = async () => {
  return await axios.get("/usuarios")
}