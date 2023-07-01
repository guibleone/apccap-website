import axios from 'axios'

const API_URI = 'http://localhost:3001/api/admin/'

// pegar usuário
const getUserData = async ({ id, token }) => {

    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },

    }
    const response = await axios.get(API_URI + '/user/' + id, config)

    return response.data

}
// pegar resumo do usuário
const getResumeData = async ({ id, token }) => {

    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },

    }

    const response = await axios.get(API_URI + '/resume/' + id, config)

    return response.data
}

// pegar documentos do usuário
const getDocumentsData = async ({ id, token }) => {

    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },

    }

    const response = await axios.get(API_URI + '/documents/' + id, config)

    return response.data
}


// deletar usuário

const deleteUser = async ({ id, token }) => {

    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }

    const response = await axios.delete(API_URI + '/user/' + id, config)

    return response.data
}

// alterar nível de acesso do usuário
const alterAccess = async (accessData) => {

    const config = {
        headers: {
            Authorization: `Bearer ${accessData.token}`
        }

    }

    const response = await axios.put(API_URI + '/user/' + accessData.id, accessData, config)

    return response.data
}

// listar todos os usuários
const listUsers = async (token) => {
    
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },

    }

    const response = await axios.get(API_URI, config)

    return response.data
}

// aprovar usuário
const aproveUser = async ({ id, token }) => {

    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }

    const response = await axios.put(API_URI + '/user/aprove/' + id, {}, config)

    return response.data
}





const adminService = {
    getUserData,
    getResumeData,
    getDocumentsData,
    deleteUser,
    alterAccess,
    listUsers,
    aproveUser
}

export default adminService

