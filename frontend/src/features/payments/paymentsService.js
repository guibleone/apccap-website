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

const paymentsService = {
    getSubscription
}

export default paymentsService