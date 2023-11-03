import axios from 'axios'

const API_URL = '/api/blog'

// criar uma nova notícia
const createPublication = async ({ values, thumbnail }) => {


    const formData = new FormData();
    formData.append('values', JSON.stringify(values));
    formData.append('thumbnail', thumbnail);

    const config = {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    }

    const response = await axios.post(API_URL, formData, config)
    return response.data
}

// pegar única notícia
const getSinglePublication = async (id) => {
    const response = await axios.get(`${API_URL}/${id}`)
    return response.data
}

// deletar uma notícia
const deletePublication = async (id) => {
    const response = await axios.delete(`${API_URL}/${id}`)
    return response.data
}

// editar uma notícia

const editPublication = async ({ editValues, thumbnail, id }) => {

    const formData = new FormData();
    formData.append('editValues', JSON.stringify(editValues));
    formData.append('thumbnail', thumbnail);

    const config = {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    }

    const response = await axios.put(`${API_URL}/${id}`, formData, config)
    return response.data
}


const blogService = {
    createPublication,
    getSinglePublication,
    deletePublication,
    editPublication
}


export default blogService

