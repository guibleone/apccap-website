import axios from 'axios'

const API_URI = '/api/admin'

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

// aprovar relatório 
const approveRelatory = async (relatoryData) => {

    const config = {
        headers: {
            Authorization: `Bearer ${relatoryData.token}`
        }
    }

    const response = await axios.post(API_URI + '/relatory-approve/' + relatoryData.id, relatoryData, config)
    return response.data
}

// desparovar relatório

const repproveRelatory = async (relatoryData) => {
    
    const config = {
        headers: {
            Authorization: `Bearer ${relatoryData.token}`
        }
    }

    const response = await axios.post(API_URI + '/relatory-repprove/' + relatoryData.id, relatoryData, config)
    return response.data
}

// PARTE DO PRESIDENTE
const getProducts = async (data) => {

    const config = {
        headers: {
            Authorization: `Bearer ${data.token}`
        }
    }


    const response = await axios.get(API_URI + '/products/' + data.id, config)
    return response.data
}

const approveSelos = async (data) => {

    const config = {
        headers: {
            Authorization: `Bearer ${data.token}`
        }
    }

    const response = await axios.post(API_URI + '/aproveSelos/' + data.id, data, config)
    return response.data
}

// desaprovar selos

const disaproveSelos = async (data) => {

    const config = {
        headers: {
            Authorization: `Bearer ${data.token}`
        }
    }

    const response = await axios.post(API_URI + '/disaproveSelos/' + data.id, data, config)

    return response.data
}

// PARTE DO CONSLEHO

// adicionar relatórios
const addRelatorys = async (data) => {

    console.log(data)
    const config = {
        headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${data.token}`
        }
    }

    const response = await axios.post(API_URI + '/add-relatorys/' + data.id, data, config)

    return response.data
}

//deletar relatórios
const deleteRelatorys = async (data) => {

    const config = {
        headers: {
            Authorization: `Bearer ${data.token}`
        }
    }

    const response = await axios.post(API_URI + '/delete-relatorys/' + data.id, data, config)
    return response.data
}

// aprovar recurso 

const approveRecurso = async(data) => {

    const config = {
        headers: {
            Authorization: `Bearer ${data.token}`
        }
    }

    const response = await axios.post(API_URI + '/recurso-approve/' + data.id, data, config)
    return response.data
}

// reprovar recurso

const repproveRecurso = async(data) => {

    const config = {
        headers: {
            Authorization: `Bearer ${data.token}`
        }
    }

    const response = await axios.post(API_URI + '/recurso-repprove/' + data.id, data, config)
    return response.data
}


// QUEM SOMOS

const getMembros = async () => {
    const response = await axios.get(API_URI + '/membros')
    return response.data
}

// EMAILS

const sendEmail = async (emailData) => {
    const response = await axios.post('/api/email', emailData)
    return response.data
}

const sendConvocationEmail = async (emailData) => {
    const response = await axios.post('/api/email/convocation', emailData)
    return response.data
}

const sendRelatoryEmail = async (emailData) => {
    const response = await axios.post('/api/email/relatory', emailData)
    return response.data
}

const sendRecursoEmail = async (emailData) => {
    const response = await axios.post('/api/email/recurso', emailData)
    return response.data
}

const sendProductRelatoryEmail = async (emailData) => {
    const response = await axios.post('/api/email/produto', emailData)
    return response.data
}

const sendResetEmail = async (emailData) => {
    const response = await axios.post('/api/email/reset', emailData)
    if(response.data){
        localStorage.setItem('resetCode', response.data)
    }
    return response.data
}




const adminService = {
    getUserData,
    getResumeData,
    getDocumentsData,
    deleteUser,
    alterAccess,
    aproveUser,
    sendRelatory,
    sendEmail,
    disapproveUser,
    sendConvocationEmail,
    getProducts,
    approveSelos,
    disaproveSelos,
    addRelatorys,
    deleteRelatorys,
    approveRelatory,
    sendRelatoryEmail,
    repproveRelatory,
    approveRecurso,
    sendRecursoEmail,
    repproveRecurso,
    sendProductRelatoryEmail,
    getMembros,
    sendResetEmail
}

export default adminService

