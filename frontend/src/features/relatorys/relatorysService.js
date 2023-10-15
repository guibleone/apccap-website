import axios from 'axios';

const API_URL = '/api/relatorys/'


// adicionar relatório

const addRelatory = async (data) => {

    // pegar token 

    let token = data.token

    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
        },
    }

    const formData = new FormData();
    formData.append('path', data.path);

    const response = await axios.post(API_URL, formData, config);
    return response.data;
}

// deletar relatório

const deleteRelatory = async (data) => {

    // pegar token

    let token = data.token

    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    }

    const response = await axios.delete(API_URL + data.id, config);
    return response.data;
}


const relatorysService = {
    addRelatory,
    deleteRelatory
}

export default relatorysService;