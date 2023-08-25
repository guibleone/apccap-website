import axios from "axios";

const API_URL = '/api/resume/'


// pegar currículo
const getResume = async (resumaData) => {
    // pegar o token do usuário
    let token = resumaData

    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    }

    const response = await axios.get(API_URL, config);

    if (response.data) {
        localStorage.setItem('resume', JSON.stringify(response.data))
    }

    return response.data
}

// criar currículo
const createResume = async (resumeData) => {

    let token = resumeData.userToken

    // pegar o token do usuário

    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    }

    const response = await axios.post(API_URL, resumeData, config);

    if (response.data) {
        localStorage.setItem('resume', JSON.stringify(response.data))
    }


    return response.data;
}

// atualizar currículo
const updateResume = async (resumeData) => {

    let token = resumeData.userToken

    // pegar o token do usuário

    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    }


    const response = await axios.put(API_URL + resumeData.id, resumeData, config);

    if (response.data) {
        localStorage.setItem('resume', JSON.stringify(response.data))
    }

    return response.data;
}

const resumeService = {
    getResume,
    createResume,
    updateResume
}

export default resumeService;




