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


const blogService = {
    createPublication
}


export default blogService

