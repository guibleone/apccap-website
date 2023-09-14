import axios from 'axios';

const API_URL = '/api/reunion'

// criar reunião
const createReunion = async (reunionData) => {

    let token = reunionData.token

    // pegar o token do usuário

    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    }

    const response = await axios.post(API_URL, reunionData, config);
    return response.data;

}

// listar reuniões por data

const getReunions = async (token) => {

    // pegar o token do usuário

    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    }

    const response = await axios.get(API_URL, config);
    return response.data;

}

// concluir reunião

const finishReunion = async (reunionData) => {

    let token = reunionData.token

    // pegar o token do usuário

    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    }

    const response = await axios.post(API_URL + '/finish', reunionData, config);
    return response.data;

}

const reunionService = {
    createReunion,
    getReunions,
    finishReunion
}

export default reunionService;


