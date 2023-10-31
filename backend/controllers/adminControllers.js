const User = require('../models/userModel')
const Document = require('../models/userFilesModel')
const Resume = require('../models/userResumeModel')
const Products = require('../models/productModel')
const SpreadSheet = require('../models/spreadSheetModel')
const asyncHandler = require('express-async-handler')
const fs = require('fs')
const { promisify, types } = require('util')
const { ref, getDownloadURL, uploadBytesResumable, deleteObject } = require("firebase/storage");
const { storage } = require('../db/firebase.js');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)
const jwt = require('jsonwebtoken')



// pegar usuários 

const getUsersData = asyncHandler(async (req, res) => {
    const page = req.query.page ? parseInt(req.query.page) : 1;
    const pageSize = req.query.pageSize ? parseInt(req.query.pageSize) : 12;
    const skip = (page - 1) * pageSize;
    const status = req.query.status ? req.query.status : '';
    const productsQuantity = req.query.productsQuantity ? req.query.productsQuantity : '';
    const roles = req.query.role ? req.query.role.split(',') : '';


    try {
        let query = {};

        if (status !== 'undefined' && status !== '') {
            query = {
                $or: [
                    { status: status },
                ],
            }
        }

        if (productsQuantity === 'true') {
            query = {
                $and: [
                    { productsQuantity: { $gte: 0.5 } }
                ]
            };
        }

        if (roles !== 'undefined' && roles !== '' && roles[0] !== 'undefined') {
            query = {
                $and: [
                    { role: { $in: roles } }
                ]
            }
        }

        if (roles.includes('todos') && roles[0] !== 'undefined') {
            query = {}
        }

        const totalDocuments = await User.countDocuments(query);

        const users = await User
            .find(query)
            .skip(skip)
            .limit(pageSize)
            .select('-dados_pessoais.password')
            .exec()


        res.status(200).json({ totalDocuments, users, productsQuantity, roles });
    } catch (error) {
        res.status(400).json({ error: 'Erro ao carregar usuários' });
    }
});



// pegar membros da associação
const getMembros = asyncHandler(async (req, res) => {
    try {
        const users = await User.find({
            $or:
                [
                    { role: { $in: ['presidente', 'secretario', 'tesoureiro', 'conselho'] } },
                    { oldRole: { $in: ['presidente', 'secretario', 'tesoureiro', 'conselho'] } }
                ]
        })
            .select('dados_pessoais.name dados_pessoais.profilePhoto role')
            .exec()
        res.status(200).json(users)
    } catch (error) {
        res.status(400)
        throw new Error('Erro ao carrgegar usuários')

    }
})

// pegar produtores

const getProducers = asyncHandler(async (req, res) => {
    const page = req.query.page ? parseInt(req.query.page) : 1;
    const pageSize = req.query.pageSize ? parseInt(req.query.pageSize) : 12;
    const skip = (page - 1) * pageSize;
    const cidade = req.query.cidade ? req.query.cidade : '';

    const formatedCidade = cidade.toLowerCase().replaceAll(' ', '_');

    try {

        let query = {};

        if (cidade) {
            query = {
                $or: [
                    { 'propriedade.cidade_propriedade': cidade },
                ],
            };
        }

        if (cidade === 'todos') query = { 'propriedade.cidade_propriedade': { $exists: true } };

        const totalDocuments = await User.countDocuments(query);

        const produtores = await User
            .find(query)
            .skip(skip)
            .limit(pageSize)
            .select('propriedade.cidade_propriedade propriedade.estado_propriedade propriedade.logradouro_propriedade propriedade.cep_propriedade propriedade.nome_propriedade marca.whatsapp marca.instagram marca.logo marca.site dados_pessoais.name')
            .exec()

        res.status(200).json({ totalDocuments, produtores, formatedCidade })
    } catch (error) {
        res.status(400)
        throw new Error('Erro ao carrgegar usuários')
    }
})


// pegar dados do usuário
const getUserData = asyncHandler(async (req, res) => {
    try {

        const user = await User.findById(req.params.id).select('-dados_pessoais.password')

        if (user) {
            res.status(200).json(user)
        } else {
            res.status(404)
            throw new Error('Usuário não encontrado')
        }
    } catch (error) {
        res.status(400)
        throw new Error('Erro ao carrgegar usuário')
    }
})


// pegar documentos do usuário
const getUserDocuments = asyncHandler(async (req, res) => {
    try {
        const documents = await Document.find({ user: req.params.id })
        // const token = req.user.token

        if (documents) {
            res.status(200).json(documents)
        } else {
            res.status(404)
            throw new Error('Documentos não encontrados')
        }
    } catch (error) {
        res.status(400)
        throw new Error('Erro ao carrgegar documentos')
    }
})

// pegar resumo do usuário
const getUserResume = asyncHandler(async (req, res) => {
    try {
        const resume = await Resume.find({ user: req.params.id })

        if (resume) {
            res.status(200).json(resume)
        } else {
            res.status(404)
            throw new Error('Resumo não encontrado')
        }

    } catch (error) {
        res.status(400)
        throw new Error('Erro ao carregar o resumo')

    }
})


// deletar usuário
const deleteUser = asyncHandler(async (req, res) => {
    try {

        const user = await User.findById(req.params.id)
        const documents = await Document.find({ user: req.params.id })
        const products = await Products.find({ producer: req.params.id })
        const spreadSheets = await SpreadSheet.find({ user: req.params.id })

        if (!user) {
            res.status(404)
            throw new Error('Usuário não encontrado')
        }


        if (user.pathFoto) {
            const storageRef = ref(storage, `profilePhotos/${user._id}`)
            await deleteObject(storageRef)
        }

        if (user.selos.pathRelatory) {
            const storageRef = ref(storage, `relatóriosSelos/${user._id}`)
            await deleteObject(storageRef)
        }

        if (user.analise.analise_pedido.path) {
            const storageRef = ref(storage, `conselhoRelatórios/${user._id}/analise_pedido`)
            await deleteObject(storageRef)
        }

        if (user.analise.vistoria.path) {
            const storageRef = ref(storage, `conselhoRelatórios/${user._id}/vistoria`)
            await deleteObject(storageRef)
        }

        if (user.analise.analise_laboratorial.path) {
            const storageRef = ref(storage, `conselhoRelatórios/${user._id}/analise_laboratorial`)
            await deleteObject(storageRef)
        }
        if (user.analise.analise_pedido.recurso.path) {
            const storageRef = ref(storage, `conselhoRelatórios/${user._id}/recurso`)
            await deleteObject(storageRef)
        }

        if (user.marca.logo) {
            const storageRef = ref(storage, `logos/${user._id}`)
            await deleteObject(storageRef)
        }

        if (documents) {
            documents.map(async (document) => {
                const storageRef = ref(storage, `documentosProdutor/${user._id}/${document.name}`)
                await deleteObject(storageRef)
            })

        }

        if (spreadSheets) {
            spreadSheets.map(async (spreadSheet) => {
                const storageRef = ref(storage, `planilha/${user.name}/${spreadSheet.title_spread}`)
                await deleteObject(storageRef)
            })
        }

        if (products) {
            products.map(async (product) => {
                if (product.relatorys.length > 0) {
                    product.relatorys.forEach(async (relatory) => {
                        const refStorage = ref(storage, `productRelatorys/${product.producer}/${product.name}/${relatory.name}`)
                        await deleteObject(refStorage)
                    })
                }
                if (product.analise.analise_pedido.path) {
                    const refStorage = ref(storage, `productsRelatorysConselho/${product.producer}/${product.name}/analise_pedido`)
                    await deleteObject(refStorage)
                }
                if (product.analise.vistoria.path) {
                    const refStorage = ref(storage, `productsRelatorysConselho/${product.producer}/${product.name}/vistoria`)
                    await deleteObject(refStorage)
                }
                if (product.analise.analise_laboratorial.path) {
                    const refStorage = ref(storage, `productsRelatorysConselho/${product.producer}/${product.name}/analise_laboratorial`)
                    await deleteObject(refStorage)
                }
                if (product.path) {
                    const refStorage = ref(storage, `productsPhotos/${product.producer}/${product.name}.jpg`)
                    await deleteObject(refStorage)
                }
            })
        }

        await User.findByIdAndDelete(req.params.id)
        await Document.deleteMany({ user: req.params.id })
        await Resume.deleteMany({ user: req.params.id })
        await SpreadSheet.deleteMany({ user: req.params.id })
        await Products.deleteMany({ producer: req.params.id })

        res.status(200).json('Usuário deletado com sucesso')

    } catch (error) {
        res.status(400)
        throw new Error('Erro ao deletar usuário')
    }
})

// altera nivel de acesso do usuário
const alterRole = asyncHandler(async (req, res) => {
    try {

        const user = await User.findById(req.params.id)

        if (!user) {
            res.status(404)
            throw new Error('Usuário não encontrado')
        }

        if (!req.body.role) {
            res.status(400)
            throw new Error('Informe o nível de acesso')
        }

        if (user.oldRole) {
            user.oldRole = ''

            await user.save()
        }

        user.role = req.body.role

        await user.save()

        res.status(200).json(user)


    } catch (error) {
        res.status(400)
        throw new Error('Erro ao alterar o nível de acesso')
    }
})

// aprovar usuário
const aproveUser = asyncHandler(async (req, res) => {
    try {

        const user = await User.findById(req.params.id)

        if (!user) {
            res.status(404)
            throw new Error('Usuário não encontrado')
        }

        if (user.status === 'aprovado') {
            res.status(400)
            throw new Error('Usuário já aprovado')
        }

        user.status = 'aprovado'
        user.role = 'produtor'

        await user.save()

        res.status(200).json(user)


    } catch (error) {
        res.status(400)
        throw new Error('Erro ao aprovar usuário')
    }
})

// desaprovar usuário
const disapproveUser = asyncHandler(async (req, res) => {
    try {

        const user = await User.findById(req.params.id)

        if (!user) {
            res.status(404)
            throw new Error('Usuário não encontrado')
        }

        if (user.status === 'reprovado') {
            res.status(400)
            throw new Error('Usuário já reprovado')
        }

        user.status = 'reprovado'
        await user.save()

        res.status(200).json(user)

    } catch (error) {
        res.status(400)
        throw new Error('Erro ao desaprovar usuário')
    }
})


const getPayment = asyncHandler(async (req, res) => {

    let { amount, id } = req.body

    try {
        const payment = await stripe.paymentIntents.create({
            amount,
            currency: 'BRL',
            description: 'Compra de selos',
            payment_method: id,
            confirm: true
        })

        console.log("Pagamento", payment)
        res.status(200).json({
            message: "Pagamento efetuado com sucesso!",
            confirm: 'success'
        })

    } catch (error) {
        res.status(400).json({
            message: "Pagamento não efetuado!",
            confirm: 'error'
        })
    }
})

// PARTE DO SECRETÁRIO

const approveRelatory = asyncHandler(async (req, res) => {

    try {
        const { type } = req.body

        const user = await User.findById(req.params.id)

        if (!user) {
            res.status(404)
            throw new Error('Usuário não encontrado')
        }

        if (type === 'analise_laboratorial') {
            user.status = 'aprovado'
            await user.save()
        }

        user.analise[type].status = 'aprovado'

        await user.save()

        res.status(200).send(user)

    } catch (error) {
        res.status(400)
        throw new Error('Erro ao aprovar relatório')
    }
})

// reprovar relatório
const repproveRelatory = asyncHandler(async (req, res) => {
    try {
        const { type } = req.body

        const user = await User.findById(req.params.id)

        if (!user) {
            res.status(404)
            throw new Error('Usuário não encontrado')
        }

        if (type === 'analise_pedido') {

            if (user.analise.analise_pedido.recurso.path) {
                const refStorage = ref(storage, `conselhoRelatórios/${user._id}/recurso`)
                await deleteObject(refStorage)
            }

            user.analise.analise_pedido.recurso.path = ''
            user.analise.analise_pedido.recurso.status = 'pendente'
            user.analise.analise_pedido.recurso.time = Date.now()
            await user.save()
        }

        if (user.analise.analise_laboratorial.status === 'reprovado' || user.analise.vistoria.status === 'reprovado') {
            user.status = 'reprovado'
            await user.save()
        }

        user.analise[type].status = 'reprovado'
        await user.save()

        res.status(200).json(user)

    } catch (error) {
        res.status(400)
        throw new Error('Erro ao reprovar relatório')
    }
})



// parte do presidente

const getProuducts = asyncHandler(async (req, res) => {
    try {
        const products = await Products.find({ producer: req.params.id })

        if (!products) {
            res.status(404)
            throw new Error('Produtos não encontrados')
        }

        res.status(200).json(products)

    } catch (error) {
        res.status(400)
        throw new Error('Erro ao carregar produtos')
    }
})

const aproveSelos = asyncHandler(async (req, res) => {
    try {
        const user = await User.findById(req.params.id)

        if (!user) {
            res.status(404)
            throw new Error('Usuário não encontrado')
        }

        if (user.selos.status === 'aprovado') {
            res.status(400)
            throw new Error('Selos já aprovados')
        }

        if (user.selos.status === 'reprovado') {
            res.status(400)
            throw new Error('Selos já reprovados')
        }

        if (user.selos.status === 'pendente') {
            res.status(400)
            throw new Error('Selos já pendentes')
        }

        if (!user.selos.pathRelatory) {
            res.status(400)
            throw new Error('Relatório não encontrado')
        }

        user.selos.status = 'pendente'

        await user.save()

        res.status(200).json(user)

    } catch (error) {
        res.status(400)
        throw new Error('Erro ao aprovar selos')
    }
})


const disaproveSelos = asyncHandler(async (req, res) => {
    try {

        const user = await User.findById(req.params.id)

        if (!user) {
            res.status(404)
            throw new Error('Usuário não encontrado')
        }

        if (user.selos.status === 'aprovado') {
            res.status(400)
            throw new Error('Selos já aprovados')
        }

        if (user.selos.status === 'reprovado') {
            res.status(400)
            throw new Error('Selos já reprovados')
        }

        if (user.selos.status === 'pendente') {
            res.status(400)
            throw new Error('Selos já pendentes')
        }

        if (!user.selos.pathRelatory) {
            res.status(400)
            throw new Error('Relatório não encontrado')
        }

        user.selos.status = 'reprovado'

        await user.save()

        res.status(200).json(user)

    } catch (error) {
        res.status(400)
        throw new Error('Erro ao desaprovar selos')
    }
})

// PARTE DO CONSELHO
const addRelatorys = asyncHandler(async (req, res) => {
    try {
        const { type } = req.body;

        const user = await User.findById(req.params.id);

        if (!req.file) {
            return res.status(400).json({ error: 'Insira o relatório' });
        }

        if (!type) {
            return res.status(400).json({ error: 'Insira o tipo de relatório' });
        }

        if (!user) {
            return res.status(400).json({ error: 'Usuário não encontrado' });
        }

        const refStorage = ref(storage, `conselhoRelatórios/${user._id}/${type}`);

        const metadata = {
            contentType: 'application/pdf',
        };

        const snapshot = await uploadBytesResumable(refStorage, req.file.buffer, metadata);

        const url = await getDownloadURL(snapshot.ref);

        if (!url) {
            return res.status(400).json({ error: 'Algo de errado aconteceu' });
        }

        user.analise[type].path = url;
        user.analise[type].status = 'pendente'

        await user.save();

        return res.status(200).json(user);
    } catch (error) {
        return res.status(400).json({ error: 'Erro ao adicionar relatórios' });
    }
});

// deletar relatórios

const deleteRelatorys = asyncHandler(async (req, res) => {
    try {

        const { type } = req.body

        const user = await User.findById(req.params.id)

        if (!type) {
            res.status(400)
            throw new Error('Informe o tipo de relatório')
        }

        if (!user) {
            res.status(400)
            throw new Error('Usuário não encontrado')
        }

        const refStorage = ref(storage, `conselhoRelatórios/${user._id}/${type}`)
        await deleteObject(refStorage)

        user.analise[type].path = ''
        user.analise[type].status = ''

        await user.save()

        res.status(200).json(user)


    } catch (error) {
        res.status(400)
        throw new Error('Erro ao deletar relatório')
    }
})

// aprovar recurso
const approveRecurso = asyncHandler(async (req, res) => {
    try {

        const user = await User.findById(req.params.id)

        if (!user) {
            res.status(404)
            throw new Error('Usuário não encontrado')
        }

        if (!user.analise.analise_pedido.recurso.path) {
            res.status(400)
            throw new Error('Relatório não encontrado')
        }

        if (user.analise.analise_pedido.path) {
            const refStorage = ref(storage, `conselhoRelatórios/${user._id}/analise_pedido`)
            await deleteObject(refStorage)
        }

        user.analise.analise_pedido.recurso.status = 'aprovado'
        user.analise.analise_pedido.status = 'pendente'
        user.analise.analise_pedido.path = ''

        await user.save()

        res.status(200).json(user)


    } catch (error) {
        res.status(400)
        throw new Error('Erro ao aprovar recurso')
    }
})

// reprovar recurso
const repproveRecurso = asyncHandler(async (req, res) => {
    try {

        const user = await User.findById(req.params.id)

        if (!user) {
            res.status(404)
            throw new Error('Usuário não encontrado')
        }

        if (!user.analise.analise_pedido.recurso.path) {
            res.status(400)
            throw new Error('Recurso não encontrado')
        }

        user.analise.analise_pedido.recurso.status = 'reprovado'
        user.status = 'reprovado'

        await user.save()

        res.status(200).json(user)

    } catch (error) {
        res.status(400)
        throw new Error('Erro ao reprovar recurso')
    }
})


module.exports = {
    getUserData,
    getUserDocuments,
    getUserResume,
    deleteUser,
    alterRole,
    aproveUser,
    getPayment,
    approveRelatory,
    disapproveUser,
    getProuducts,
    aproveSelos,
    disaproveSelos,
    addRelatorys,
    deleteRelatorys,
    repproveRelatory,
    approveRecurso,
    repproveRecurso,
    getMembros,
    getProducers,
    getUsersData


}