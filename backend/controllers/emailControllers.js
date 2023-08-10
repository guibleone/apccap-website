const asyncHandler = require('express-async-handler')
const { Resend } = require('resend')
const User = require('../models/userModel.js')

const sendEmail = asyncHandler(async (req, res) => {
    const resend = new Resend(process.env.RESEND_API_KEY)
    const { method } = req;

    const { email, title, message } = req.body;

    if (!email || !title || !message) {
        res.status(400)
        throw new Error('Preencha todos os campos')
    }

    switch (method) {
        case "POST": {
            const data = await resend.sendEmail({
                from: 'Apccap <contato.produtor@apccap.shop>',
                to: `${email}`, // TODO: change to `email
                subject: `${title}`, // TODO: change to `title
                html: `<p>${message}</p>`
            });

            return res.status(200).send(data);
        }
        default:
            res.setHeader("Allow", ["POST"]);
            res.status(405).end(`Método ${method} Não é permitido`);
    }
})

const senConvocationEmail = asyncHandler(async (req, res) => {

    const usersAssociates = await User.find({ role: ['presidente', 'secretario', 'tesoureiro', 'admin'] })
    const emails = usersAssociates.map(user => (user.email))

    const resend = new Resend(process.env.RESEND_API_KEY)
    const { method } = req;

    const { message, date } = req.body;

    if (!date || !message) {
        res.status(400)
        throw new Error('Preencha todos os campos')
    }

    switch (method) {
        case "POST": {
            const data = await resend.sendEmail({
                from: 'Apccap <reuniao.associados@apccap.shop>',
                to: emails, // TODO: change to `email
                subject: `Convocação de Reunião`, // TODO: change to `title
                html: `<p>${message}</p> <br> <h2>Data: ${date}</h2>`
            });

            return res.status(200).send(data);

        } default:
            res.setHeader("Allow", ["POST"]);
            res.status(405).end(`Método ${method} Não é permitido`);
    }
})

module.exports = { sendEmail, senConvocationEmail }