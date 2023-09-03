import axios from "axios";

const API_URI = '/api/products/';


// pegar produtos
export const getProducts = async () => {
    const user = JSON.parse(localStorage.getItem('user'));
    const token = user.token;
    const config = {
        headers: {
            'Content-type': 'application/json',
            Authorization: `Bearer ${token}`
        }
    }

    const response = await axios.get(API_URI, config);
    return response.data;
}

// adicionar produtos
export const addProduct = async (product) => {
    const user = JSON.parse(localStorage.getItem('user'));

    const token = user.token;
    const config = {
        headers: {
            'Content-type': 'application/json',
            Authorization: `Bearer ${token}`
        }
    }

    const response = await axios.post(API_URI, product, config);
    return response.data;
}

// deletar produtos
export const deleteProduct = async (product) => {
    const user = JSON.parse(localStorage.getItem('user'));

    const token = user.token;

    const config = {
        headers: {
            'Content-type': 'application/json',
            Authorization: `Bearer ${token}`
        }
    }

    const response = await axios.delete(API_URI + product.id, config);
    return response.data

}

// pegar único produto
export const getSingleProduct = async (product) => {
    const user = JSON.parse(localStorage.getItem('user'));

    const token = user.token;

    const config = {
        headers: {
            'Content-type': 'application/json',
            Authorization: `Bearer ${token}`
        }
    }

    const response = await axios.get(API_URI + product, config)
    return response.data
}

// atualizar produto
export const updateProduct = async (product) => {
    const token = product.token;

    const config = {
        headers: {
            'Content-type': 'application/json',
            Authorization: `Bearer ${token}`
        }

    }

    const response = await axios.put(API_URI + product.id, product, config)

    return response.data
}

// adcionar foto do produto
export const addProductPhoto = async (product) => {
    const user = JSON.parse(localStorage.getItem('user'));

    const token = user.token;

    const config = {
        headers: {
            'Content-type': 'multipart/form-data',
            Authorization: `Bearer ${token}`
        }
    }

    const response = await axios.post(API_URI + 'foto/' + product.id, product, config);
    return response.data;
}

// rastrear produto
export const trackProduct = async (selo) => {

    const response = await axios.post(API_URI + 'rastrear', selo)
    return response.data
}

// pegar produtor
export const getProducer = async (id) => {

    const response = await axios.get(API_URI + 'produtor/' + id)

    return response.data

}

// pegar resumo do produtor
export const getProducerResume = async (id) => {

    const response = await axios.get(API_URI + 'produtor/resume/' + id)

    return response.data
}

// pegar selos
export const getSelos = async (userData) => {
    // pegar o token do usuário

    let token = userData.token

    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },

    }

    const response = await axios.get(API_URI + 'selo/' + userData.id, config)
    return response.data

}

// adiicionar selo
export const addSelo = async (userData) => {

    const config = {
        headers: {
            'Content-type': 'multipart/form-data',
            Authorization: `Bearer ${userData.token}`
        }
    }

    const response = await axios.post(API_URI + 'selo/' + userData.id, userData, config)
    return response.data
}



// adicionar selos pagos
export const addSelosPayed = async (userData) => {

    const response = await axios.post(API_URI + 'selo-pago', userData)
    return response.data
}



// exportar todos os métodos

const productsService = {
    getProducts,
    addProduct,
    deleteProduct,
    getSingleProduct,
    updateProduct,
    addProductPhoto,
    trackProduct,
    getProducer,
    getProducerResume,
    getSelos,
    addSelo,
    addSelosPayed
}

export default productsService;

