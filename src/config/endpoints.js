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

export const getOrders = async (role, token) => {
  const path = role=="ADMIN" ? "/admin/agendamentos" : "/client/agendamentos"
  return await axios.get(path, {
    headers: {
      'Authorization': `Bearer ${token}` 
    }
  })
}

export const getOrder = async (orderId, token) => {
  return await axios.get("/agendamentos/"+orderId, {
    headers: {
      'Authorization': `Bearer ${token}` 
    }
  })
}

export const payOrder = async (orderId, token) => {
  return await axios.put("/agendamentos/"+orderId+"/pagar", {}, {
    headers: {
      'Authorization': `Bearer ${token}` 
    }
  })
}

export const finishOrder = async (orderId, token) => {
  return await axios.put("/agendamentos/"+orderId+"/terminar", {}, {
    headers: {
      'Authorization': `Bearer ${token}` 
    }
  })
}

export const parkOrder = async (role, orderId, kilometers, code, token) => {
  const path = role=="ADMIN" ? "/admin" : "/client"
  return await axios.put(path+"/agendamentos/"+orderId+"/estacionar", {kilometragem: kilometers, codigo: code}, {
    headers: {
      'Authorization': `Bearer ${token}` 
    }
  })
}

export const cancelOrder = async (orderId, token) => {
  return await axios.put("/agendamentos/"+orderId+"/cancelar", {}, {
    headers: {
      'Authorization': `Bearer ${token}` 
    }
  })
}

export const approveOrder = async (orderId, token) => {
  return await axios.put("/agendamentos/"+orderId+"/aprovar", {}, {
    headers: {
      'Authorization': `Bearer ${token}` 
    }
  })
}

export const startOrder = async (orderId, token) => {
  return await axios.put("/agendamentos/"+orderId+"/iniciar", {}, {
    headers: {
      'Authorization': `Bearer ${token}` 
    }
  })
}

export const rescheduleOrder = async (orderId, date, token) => {
  return await axios.put("/agendamentos/"+orderId+"/reagendar", {suggestedDate: date}, {
    headers: {
      'Authorization': `Bearer ${token}` 
    }
  })
}

export const createOrder = async (idVeiculo, idLavagem, data, token) => {
  const payload = {
    agendamento: {
      idVeiculo: idVeiculo,
      idLavagem: idLavagem,
      originalDate: data
    }
  }

  return await axios.post("/agendamentos/", payload, {
    headers: {
      'Authorization': `Bearer ${token}` 
    }
  })
}

export const deleteVehicle = async (vehicleId, token) => {
  return await axios.put("/veiculos/deletar/"+vehicleId, {}, {
    headers: {
      'Authorization': `Bearer ${token}` 
    }
  })
}

export const editVehicle = async (title, price, vehicleId, token) => {
  const payload = {
    veiculo: {
      titulo: title,
      preco: price
    }
  }
  return await axios.put("/veiculos/"+vehicleId, payload, {
    headers: {
      'Authorization': `Bearer ${token}` 
    }
  })
}

export const addVehicle = async (title, price, token) => {
  const payload = {
    veiculo: {
      titulo: title,
      preco: price
    }
  }

  return await axios.post("/veiculos/", payload, {
    headers: {
      'Authorization': `Bearer ${token}` 
    }
  })
}

export const getVehicles = async (token) => {
  return await axios.get("/veiculos", {
    headers: {
      'Authorization': `Bearer ${token}` 
    }
  })
}

export const getVehicle = async (vehicleId, token) => {
  return await axios.get("/veiculos/"+vehicleId, {
    headers: {
      'Authorization': `Bearer ${token}` 
    }
  })
}

export const deleteWash = async (washId, token) => {
  return await axios.put("/lavagens/deletar/"+washId, {}, {
    headers: {
      'Authorization': `Bearer ${token}` 
    }
  })
}

export const editWash = async (title, price, washId, desc, token) => {
  const payload = {
    lavagem: {
      titulo: title,
      preco: price,
      descricao: desc
    }
  }
  return await axios.put("/lavagens/"+washId, payload, {
    headers: {
      'Authorization': `Bearer ${token}` 
    }
  })
}

export const addWash = async (title, price, desc, token) => {
  const payload = {
    lavagem: {
      titulo: title,
      preco: price,
      descricao: desc
    }
  }
  return await axios.post("/lavagens/", payload, {
    headers: {
      'Authorization': `Bearer ${token}` 
    }
  })
}

export const getWashes = async (token) => {
  return await axios.get("/lavagens", {
    headers: {
      'Authorization': `Bearer ${token}` 
    }
  })
}

export const getWash = async (washId, token) => {
  return await axios.get("/lavagens/"+washId, {
    headers: {
      'Authorization': `Bearer ${token}` 
    }
  })
}

export const getAddress = async (token) => {
  return await axios.get("/endereco", {
    headers: {
      'Authorization': `Bearer ${token}` 
    }
  })
}

export const getUsers = async (token) => {
  return await axios.get("/usuarios", {
    headers: {
      'Authorization': `Bearer ${token}` 
    }
  })
}