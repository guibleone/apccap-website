import axios from "axios"

const API_URL = '/api/documentos/'


// pegar documentos ADMIN
const getDocumentsAdmin = async (token) => {

    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    }

    const response = await axios.get(API_URL + 'admin', config)

    if (response.data) {
        localStorage.setItem('documents', JSON.stringify(response.data))

    }

    return response.data

}


// pegar documentos 
const getDocuments = async (token) => {

    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    }

    const response = await axios.get(API_URL, config)

    if (response.data) {
        localStorage.setItem('documents', JSON.stringify(response.data))

    }

    return response.data

}

// baixar documentos 
const downloadDocument = async (documentData, token) => {

    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        }
    }

    const response = await axios.get(API_URL + 'baixar/' + documentData._id, config)

    if (response.data) {
        window.open(response.data.url)
    }


    // return response.data
}

// adcionar documentos
const addDocument = async (documentData) => {

    let token = documentData.token

    const formData = new FormData();

    for (let i = 0; i < documentData.files.length; i++) {
        formData.append('files', JSON.stringify(documentData.files[i]));
    }
    

    const config = {
        headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
        },
    }

    const response = await axios.post(API_URL + 'adicionar', formData, config)

    if (response.data) {
        localStorage.setItem('documents', JSON.stringify(response.data))
    }

    return response.data
}

// deletar documento
const deleteDocument = async (documentData) => {

    const response = await axios.delete(API_URL + 'deletar/' + documentData.document)

    if (response.data) {
        localStorage.setItem('documents', JSON.stringify(response.data))
    }

    return response.data
}


const documentsService = {
    getDocuments,
    downloadDocument,
    addDocument,
    deleteDocument,
    getDocumentsAdmin
}

export default documentsService