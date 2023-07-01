import axios from 'axios';

const API_URL = 'http://localhost:3001/api/users/'

// registrar usuário
const registerUser = async (userData) => {
    const response = await axios.post(API_URL + 'registrar', userData);

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
const updateUser = async (userData) => {

    let token = userData.token

    // pegar o token do usuário 

    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    }

    const response = await axios.put(API_URL + userData.id, userData, config)

    if (response.data) {
        localStorage.setItem('user', JSON.stringify(response.data))
    }

    return response.data
}

// adicionar foto de perfil
const addProfilePhoto = async (userData) => {
    // pegar o token do usuário

    let token = userData.token

    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
        },
    }

    const response = await axios.post(API_URL + 'foto/' + userData.id, userData, config)

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
}

export default authService;