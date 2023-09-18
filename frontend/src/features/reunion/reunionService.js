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
    console.log(reunionData)
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

// assinar ata

const signAta = async (reunionData) => {

    let token = reunionData.token

    // pegar o token do usuário

    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    }

    const response = await axios.post(API_URL + '/sign-ata', reunionData, config);
    return response.data;

}

// delete reunião

const deleteReunion = async (reunionData) => {

    let token = reunionData.token

    // pegar o token do usuário

    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    }

    const response = await axios.delete(API_URL + '/' + reunionData.id, config);
    return response.data;

}

// lista de presença

const presenceList = async (reunionData) => {

    let token = reunionData.token

    // pegar o token do usuário

    const config = {
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
    }

    const response = await axios.post(API_URL + '/presence/' + reunionData.id, reunionData, config);
    return response.data;

}

    

const reunionService = {
    createReunion,
    getReunions,
    finishReunion,
    addReunionAta,
    signAta,
    deleteReunion,
    presenceList
    
}

export default reunionService;


