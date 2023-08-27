const asyncHandler = require('express-async-handler')
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)

const paySelos = asyncHandler(async (req, res) => {

    const URL = 'http://localhost:3000'
    
    const { quantity } = req.body

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

    const URL = 'http://localhost:3000/credencial-produtor';
    const { email } = req.body;

    try {
        const session = await stripe.checkout.sessions.create({
            line_items: [
                {
                    price: 'price_1NiGIeGd1qyb4oDeAHRJHfPW',
                    quantity: 1
                },
            ],
            mode: 'subscription',
            success_url: `${URL}?success=true`,
            cancel_url: `${URL}?canceled=true`,
            customer_email: email
        });

        res.status(200).json({ url: session.url });
    } catch (error) {
        res.status(500).json({ error: 'Um erro ocorreu' });
    }
})

const getSubscription = asyncHandler(async (req, res) => {

    const { email } = req.body;

    try {
        const customer = await stripe.customers.list({
            email: email,
            limit: 1
        });

        if(!customer.data.length) return res.status(200).json({subscription: null });

        const subscription = await stripe.subscriptions.list({
            customer: customer.data[0].id,
            limit: 1
        });

        if (subscription.data.length > 0) {

            const portal = await stripe.billingPortal.sessions.create({
                customer: customer.data[0].id,
                return_url: 'http://localhost:3000/credencial-produtor',
            });

            res.status(200).json({ portal: portal.url, subscription: subscription.data[0].status  });

            return 
        }

        res.status(200).json({subscription: null });

    } catch (error) {
        res.status(500).json({ error: 'Um erro ocorreu' });
    }
})


module.exports = {
    paySelos,
    payMensalidade,
    getSubscription
}
