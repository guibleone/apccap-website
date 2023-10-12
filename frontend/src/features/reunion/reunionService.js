import axios from 'axios';

const API_URL = '/api/reunion'

// criar reunião
const createReunion = async ({ reunionData, pdfInstance }) => {

    let token = reunionData.token

    // pegar o token do usuário

    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
        },
    }
    const formData = new FormData();
    formData.append('reunionData', JSON.stringify(reunionData));
    formData.append('pdfInstance', pdfInstance.blob, `CONVOCAÇÃO.pdf`);


    const response = await axios.post(API_URL, formData, config);
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

// pegar única reunião

const getOneReunion = async (reunionData) => {

    let token = reunionData.token

    // pegar o token do usuário

    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    }

    const response = await axios.get(API_URL + '/single/' + reunionData.id, config);
    return response.data;

}

// sistema de votação

const handleVoto = async (data) => {

    let token = data.token

    // pegar o token do usuário

    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    }
    const response = await axios.post(API_URL + '/votos/' + data.id, data, config);
    return response.data;

}




const reunionService = {
    createReunion,
    getReunions,
    finishReunion,
    addReunionAta,
    signAta,
    deleteReunion,
    presenceList,
    getOneReunion,
    handleVoto

}

export default reunionService;


