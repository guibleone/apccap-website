const asyncHandler = require('express-async-handler')
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)

const paySelos = asyncHandler(async (req, res) => {
    const URL = 'http://localhost:3000'
    const { quantity } = req.body

    const session = await stripe.checkout.sessions.create({
        line_items: [
            {
                // Provide the exact Price ID (for example, pr_1234) of the product you want to sell
                price: 'price_1NZg4KGd1qyb4oDeWPCGsDvF',
                quantity: quantity ? quantity : 1
            },
        ],
        mode: 'payment',
        success_url: `${URL}?success=true`,
        cancel_url: `${URL}?canceled=true`,
    });
    res.json(200, {url:session.url})
})

module.exports = {
    paySelos
}