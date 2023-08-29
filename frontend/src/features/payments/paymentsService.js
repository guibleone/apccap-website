import axios from "axios";

const API_URL = "/api/payment/"

// pegar assinatura
const getSubscription = async (user) => {

    const config = {
        headers: {
            Authorization: `Bearer ${user.token}`,
        },
    }

    const response = await axios.post(API_URL + 'assinatura', user , config)

    return response.data

}

// pegar balanço
const getBalance = async (token) => {

    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },

    }

    const response = await axios.get(API_URL + 'balance', config)
    return response.data
    
}


const paymentsService = {
    getSubscription,
    getBalance
}

export default paymentsService