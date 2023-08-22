import axios from 'axios'

const API_URI = '/api/admin'
//const API_URI = 'https://apccap-api.onrender.com/api/admin'

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

// desaprovar usuário
const disapproveUser = async ({ id, token }) => {

    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }

    const response = await axios.put(API_URI + '/user/disapprove/' + id, {}, config)
    return response.data
}


// PARTE DO SECRETÁRIO

const sendRelatory = async (relatoryData) => {

    const config = {
        headers: {
            Authorization: `Bearer ${relatoryData.token}`
        }
    }

    const response = await axios.post(API_URI + '/relatory/' + relatoryData.id, relatoryData, config)
    return response.data
}

// EMAILS

// tirar o https://apccap-api.onrender.com/api/email no desenvolvimento
//https://apccap-api.onrender.com

const sendEmail = async (emailData) => {
    const response = await axios.post('https://apccap-api.onrender.com/api/email', emailData)
    return response.data
}

const sendConvocationEmail = async (emailData) => {
    const response = await axios.post('https://apccap-api.onrender.com/api/email/convocation', emailData)
    return response.data  
}


const adminService = {
    getUserData,
    getResumeData,
    getDocumentsData,
    deleteUser,
    alterAccess,
    listUsers,
    aproveUser,
    sendRelatory,
    sendEmail,
    disapproveUser,
    sendConvocationEmail
}

export default adminService

