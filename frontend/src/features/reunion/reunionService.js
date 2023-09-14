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

// adicionar ata de reunião

const addReunionAta = async (reunionData) => {

    let token = reunionData.token

    // pegar o token do usuário

    const config = {
        headers: {
            'Content-Type': 'multipart/form-data', 
            Authorization: `Bearer ${token}`,
        },
    }

    const response = await axios.post(API_URL + '/add-ata/' + reunionData.id, reunionData, config);
    return response.data;

}

// deletar ata de reunião

const deleteReunionAta = async (reunionData) => {
    
    let token = reunionData.token
console.log(reunionData)
    // pegar o token do usuário

    const config = {
        headers: { 
            Authorization: `Bearer ${token}`,
        },
    }

    const response = await axios.post(API_URL + '/delete-ata/' + reunionData.id, reunionData, config);
    return response.data;

}


const reunionService = {
    createReunion,
    getReunions,
    finishReunion,
    addReunionAta,
    deleteReunionAta
}

export default reunionService;


