const asyncHandler = require('express-async-handler')
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)
const User = require('../models/userModel.js')

const paySelos = asyncHandler(async (req, res) => {

    const URL = 'http://localhost:3000'

    const { quantity, userId } = req.body
    const user = await User.findById(userId)

    if (!user) return res.status(404).json({ error: 'Usuário não encontrado' })

    const session = await stripe.checkout.sessions.create({
        line_items: [
            {
                price: 'price_1NZg4KGd1qyb4oDeWPCGsDvF',
                quantity: quantity ? quantity : 1
            },
        ],
        mode: 'payment',
        success_url: `${URL}?success=true`,
        cancel_url: `${URL}?canceled=true`,
    });


    res.json(200, { url: session.url })
})

const payMensalidade = asyncHandler(async (req, res) => {
    const URL = 'http://localhost:3000/credencial';
    const { email, cpf, tipo } = req.body;

    const price = tipo === 'Mês' && 'price_1OFbIWGd1qyb4oDeypVisyDU' || tipo === 'Semestre' && 'price_1OFbIWGd1qyb4oDeQxYCFewQ' || tipo === 'Ano' && 'price_1OFbIWGd1qyb4oDeye6ho62C'

    try {
        // Create a customer with the provided CPF
        const customer = await stripe.customers.create({
            email: email,
            description: cpf,
        });

        // Create a subscription session for the customer
        const session = await stripe.checkout.sessions.create({
            customer: customer.id, // Use the customer's ID
            line_items: [
                {
                    price: price,
                    quantity: 1,
                },
            ],
            mode: 'subscription',
            success_url: `${URL}?success=true`,
            cancel_url: `${URL}?canceled=true`,
        });

        res.status(200).json({ url: session.url });
    } catch (error) {
        res.status(500).json({ error: 'Um erro ocorreu' });
    }
});


const getSubscription = asyncHandler(async (req, res) => {

    const { cpf } = req.body; // Only need 'cpf' here, remove 'email' since you're using 'cpf'

    try {
        const user = await User.findOne({ 'dados_pessoais.cpf': cpf }); // Use 'cpf' instead of 'email' to find the user

        if (!user) {
            return res.status(200).json({ subscription: null });
        }

        const customerResult = await stripe.customers.list({
            email: user.dados_pessoais.email, // Use 'email' instead of 'user.email'
            limit: 1
        });


        if (!customerResult.data.length) {
            return res.status(200).json({ subscription: null });
        }

        const subscription = await stripe.subscriptions.list({
            customer: customerResult.data[0].id, // Use 'customer' instead of 'customerResult'
            limit: 1
        });

        if (subscription.data.length > 0) {
            const portal = await stripe.billingPortal.sessions.create({
                customer: customerResult.data[0].id, // Use 'customer' instead of 'customerResult'
                return_url: 'http://localhost:3000/credencial',
            });

            try {

                user.credencial = subscription.data[0].status;

                await user.save();

            } catch (error) {
                console.error('Erro ao salvar o usuário:', error);
                return res.status(500).json({ error: 'Erro ao salvar o usuário' });
            }

            res.status(200).json({ portal: portal.url, subscription: subscription.data[0].status });
        } else {
            res.status(200).json({ subscription: null });
        }

    } catch (error) {
        console.error('Um erro ocorreu:', error);
        res.status(500).json({ error: 'Um erro ocorreu' });
    }
});


module.exports = {
    paySelos,
    payMensalidade,
    getSubscription,
}
