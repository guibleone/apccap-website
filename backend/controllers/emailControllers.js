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
                html: `
                <h4>Atenção Associado, </h4>
                <p>${message}</p> <br>
                <p>Atenciosamente, </p>
                <img src=https://firebasestorage.googleapis.com/v0/b/igcachaca.appspot.com/o/imagens%2Flogo-apccap.png?alt=media&token=77051693-5b1c-4b72-8d1a-9d3f3dc4b29d" alt="logo" width="100px" height="100px" />                 
                `
            });

            return res.status(200).send(data);
        }
        default:
            res.setHeader("Allow", ["POST"]);
            res.status(405).end(`Método ${method} Não é permitido`);
    }
})

const senConvocationEmail = asyncHandler(async (req, res) => {

    const { typeReunion } = req.body

    let roles = []
    let title = ''

    if (typeReunion.administrativa) {
        roles.push('presidente', 'secretario', 'admin', 'tesoureiro')
        title = 'Convocação Reunião Administrativa'
    }

    if (typeReunion.assembleia_ordinal) {
        roles.push('presidente', 'secretario', 'admin', 'tesoureiro', 'produtor')
        title = 'Convocação Assembleia Ordinária'
    }

    if (typeReunion.assembleia_extraordinaria) {
        roles.push('presidente', 'secretario', 'admin', 'tesoureiro', 'produtor')
        title = 'Convocação Assembleia Extraordinária'
    }

    const usersAssociates = await User.find({ role: { $in: roles } })

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
                subject: title, // TODO: change to `title
                html:
                    `
                <h4>Atenção Associado, </h4>
                <p>${message}</p> <br> 
                <h4>Data: ${date}</h4>
                <p>Atenciosamente, </p>
                <img src=https://firebasestorage.googleapis.com/v0/b/igcachaca.appspot.com/o/imagens%2Flogo-apccap.png?alt=media&token=77051693-5b1c-4b72-8d1a-9d3f3dc4b29d" alt="logo" width="100px" height="100px" />       
            `
            });

            return res.status(200).send(data);

        } default:
            res.setHeader("Allow", ["POST"]);
            res.status(405).end(`Método ${method} Não é permitido`);
    }
})

const sendRelatoryEmail = asyncHandler(async (req, res) => {

    const { method } = req;

    const { type, email, result } = req.body

    let title = ''

    if (type === 'analise_pedido') {
        title = 'Análise de Pedido'
    }

    if (type === 'vistoria') {
        title = 'Vistoria'
    }

    if (type === 'analise_laboratorial') {
        title = 'Análise Laboratorial'
    }

    const resend = new Resend(process.env.RESEND_API_KEY)

    if (!email || !type) {
        res.status(400)
        throw new Error('Preencha todos os campos')
    }

    try {
        const data = await resend.sendEmail({
            from: 'Apccap <credencial.produtor@apccap.shop>',
            to: `${email}`, // TODO: change to `email
            subject: title, // TODO: change to `title
            html:`<h4>Atenção Produtor, </h4>

                <p>Seu relatório de ${title} foi <h4>${result}</h4>.</p> 
                
                <p>Para mais informações, entre em contato com a associação. Ou acesse o site <a href="www.apccap.shop">Apccap</a>. </p> 
                
                <p>Atenciosamente, </p>

                <h4>Direção APCCAP</h4>

                `
        });

        return res.status(200).send(data);

    } catch (error) {
        console.log(error)

    }
})


module.exports = { sendEmail, senConvocationEmail, sendRelatoryEmail }