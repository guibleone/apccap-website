import axios from 'axios';

const API_URL = '/api/users/'


// registrar usuário
const registerUser = async ({ userData, logo }) => {

    const formData = new FormData();
    formData.append('userData', JSON.stringify(userData));
    formData.append('logo', logo);

    const config = {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    }

    const response = await axios.post(API_URL + 'registrar', formData, config);

    if (response.data) {
        localStorage.setItem('user', JSON.stringify(response.data));
    }

    localStorage.removeItem('documents')
    localStorage.removeItem('product')
    localStorage.removeItem('error')

    return response.data;

}

// login de usuário
const loginUser = async (userData) => {
    const response = await axios.post(API_URL + 'entrar', userData)

    if (response.data) {
        localStorage.setItem('user', JSON.stringify(response.data))
    }

    localStorage.removeItem('product')
    localStorage.removeItem('error')

    return response.data
}

// atualizar usuário
const updateUser = async ({ userData, logo }) => {

    let token = userData.token


    const formData = new FormData();
    formData.append('userData', JSON.stringify(userData));
    formData.append('logo', logo);

    // pegar o token do usuário 

    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
        },
    }

    const response = await axios.put(API_URL + userData.id, formData, config)

    if (response.data) {
        localStorage.setItem('user', JSON.stringify(response.data))
    }

    return response.data
}

// adicionar foto de perfil
const addProfilePhoto = async (userData) => {
    // pegar o token do usuário

    let token = userData.token

    const formData = new FormData();
    formData.append('pathFoto', userData.pathFoto);

    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
        },
    }

    const response = await axios.post(API_URL + 'foto/' + userData.id, formData, config)

    if (response.data) {
        localStorage.setItem('user', JSON.stringify(response.data))
    }

    return response.data
}

// reiniciar aprovação
const resetAprove = async ({ id, token }) => {

    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }

    const response = await axios.put(API_URL + 'reset/' + id, {}, config)

    if (response.data) {
        localStorage.setItem('user', JSON.stringify(response.data))
        localStorage.removeItem('documents', JSON.stringify(response.data))

    }

    return response.data
}

// enviar recurso

const sendRecurso = async (userData) => {

    let token = userData.token

    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
        },
    }

    const response = await axios.post(API_URL + 'recurso/' + userData.id, userData, config)

    if (response.data) {
        localStorage.setItem('user', JSON.stringify(response.data))
    }

    return response.data
}

// se tornar um produtor

const becomeProducer = async (token) => {

    console.log(token)
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },

    }

    const response = await axios.post(API_URL + 'become-producer', token, config)

    if (response.data) {
        localStorage.setItem('user', JSON.stringify(response.data))
    }

    return response.data
}


// associção se tornar produtor e vice versa

const associateProducer = async (data) => {

    const config = {

        headers: {
            Authorization: `Bearer ${data.token}`
        }

    }

    const response = await axios.post(API_URL + '/associate-producer', data, config)

    if (response.data) {
        localStorage.setItem('user', JSON.stringify(response.data))
    }

    return response.data
}



// logout de usuário
const logout = async () => {
    localStorage.removeItem('user')
    localStorage.removeItem('resume')
    localStorage.removeItem('documents')

}

const authService = {
    registerUser,
    loginUser,
    logout,
    updateUser,
    addProfilePhoto,
    resetAprove,
    sendRecurso,
    becomeProducer,
    associateProducer
}

export default authService;