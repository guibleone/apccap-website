import axios from 'axios';

const API_URL = '/api/planilha/';

// pegar única plnilha
const getOneSpread = async (data) => {
    const config = {
        headers: {
            Authorization: `Bearer ${data.token}`,
        }
    }

    const response = await axios.get(API_URL + 'single/' + data.id, config)
    return response.data
}

// pegar planilhas
const getSpreadSheets = async (user) => {
    const config = {
        headers: {
            Authorization: `Bearer ${user.token}`,
        },
    };

    const response = await axios.get(API_URL + user._id, config);
    return response.data
}


// adicionar planilha
const addSpreadSheet = async (data) => {
    const config = {
        headers: {
            Authorization: `Bearer ${data.token}`,
        },
    };

    const response = await axios.post(API_URL + data.id, data.spreadsheet, config);
    return response.data
}

// exclui planilha
const deleteSpreadSheet = async ({ token, id }) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };

    const response = await axios.delete(API_URL + id, config);
    return response.data
}

// adicionar planilha excel
const addExcel = async (data) => {

    const config = {
        headers: {
            Authorization: `Bearer ${data.token}`,
            "Content-Type": "multipart/form-data", // adicionar para upload de arquivos
        },

    };

    const response = await axios.post(API_URL + 'excel/' + data.user, data, config);
    return response.data
}

// deletar planilha excel
const deleteExcel = async (data) => {

    const config = {
        headers: {
            Authorization: `Bearer ${data.token}`,
        },

    };

    const response = await axios.delete(API_URL + 'excel/' + data.id, config);
    return response.data
}

// editar planilha
const editSpreadSheet = async (data) => {
    const config = {
        headers: {
            Authorization: `Bearer ${data.token}`,
        },
    };

    const response = await axios.put(API_URL + data.id, data.spreadsheet, config);
    return response.data
}

const spreadSheetService = {
    getSpreadSheets,
    addSpreadSheet,
    getOneSpread,
    deleteSpreadSheet,
    addExcel,
    deleteExcel,
    editSpreadSheet,
}

export default spreadSheetService