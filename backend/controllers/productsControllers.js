const asyncHandler = require('express-async-handler');
const Product = require('../models/productModel.js');
const User = require('../models/userModel.js');
const Resume = require('../models/userResumeModel.js');
const { ref, getDownloadURL, uploadBytesResumable, deleteObject } = require("firebase/storage");
const { storage } = require('../db/firebase.js')

// pegar produtos
const getProducts = asyncHandler(async (req, res) => {

    const user = req.params.id ? req.params.id : req.user._id

    if (!user) {
        res.status(401)
        throw new Error('Não autorizado. Sem token')
    }

    const products = await Product.find({ producer: user })

    res.status(200).json(products);
}
)

// pegar unico produto
const getSingleProduct = asyncHandler(async (req, res) => {

    const product = await Product.findById(req.params.id)

    if (!product) {
        res.status(404)
        throw new Error('Produto não encontrado')
    }

    res.status(200).json(product)
})

// gerar selos

const generateSelos = ({ params }) => {

    const { sequence_value, quantity, startSelo, endSelo } = params

    const firstPart = (sequence_value).toString().padStart(3, "0")

    for (let i = 0; i < quantity; i++) {

        if (lastSelo) {
            const selo = `${firstPart}` + `${(parseInt(lastSelo.slice(-4)) + i + 1).toString().padStart(5, "0")}`
            selos.push(selo)
            continue
        }

        const selo = `${firstPart}` + `${(i + 1).toString().padStart(5, "0")}`
    }


    return selos
}

// adicionar produtos
const addProduct = asyncHandler(async (req, res) => {

    const { name, quantity, description } = req.body;
    const user = await User.findById(req.user._id)

    // Checar se o usuário enviou arquivos
    if (!req.files || req.files.length === 0) {
        return res.status(400).json({ error: 'Nenhum arquivo foi selecionado' });
    }

    if (!name || !quantity || !description) {
        return res.status(400).json({ error: 'Insira os dados corretamente' });
    }
    // Criar um array para armazenar os metadados dos arquivos
    const relatorys = [];

    // Upload os arquivos para o Cloud Storage
    for (const file of req.files) {
        const storageRef = ref(storage, `productRelatorys/${req.user._id}/${name}/${file.originalname}`);
        const metadata = {
            contentType: file.mimetype,
        };

        try {
            // Upload o arquivo para o Cloud Storage
            const snapshot = await uploadBytesResumable(storageRef, file.buffer, metadata);

            // Pegar a URL do arquivo
            const url = await getDownloadURL(snapshot.ref);

            // Armazenar os metadados do arquivo
            relatorys.push({
                name: file.originalname,
                path: url,
            });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Falha ao criar o produto' });
        }
    }

    // Criar o produto
    const product = await Product.create({
        name,
        description,
        selo: {
            quantity
        },
        relatorys,
        producer: req.user._id,
    });

    // Checar se o produto foi criado
    if (product) {
        user.productsQuantity += 1
        await user.save()
        res.status(201).json(product);
    } else {
        res.status(500).json({ error: 'Failed to create the product' });
    }


    /* const user = await User.findById(req.user._id)
 
 
     if (user.selos.newQuantity < quantity) {
         res.status(400)
         throw new Error('Quantidade de selos insuficiente')
     }
 
     if (user.selos.status === 'analise' && user.selos.newQuantity < 1) {
         res.status(400)
         throw new Error('Seus selos estão em análise')
     }
 
     if (user.selos.status === 'pendente' && user.selos.newQuantity < 1) {
         res.status(400)
         throw new Error('Seus selos estão pendentes')
     }
 
     if (!name || !quantity || !description) {
         res.status(404)
         throw new Error('Insira os dados corretamente')
     }
 
     const product = await Product.create({
         name,
         description,
         startSelo: !user.selos.endSelo ? `${user.sequence_value.toString().padStart(3, "0")}` + `${(1).toString().padStart(5, "0")}` :
             `${user.selos.endSelo.slice(0, 3)}` + `${(parseInt(user.selos.endSelo.slice(-5)) + 1).toString().padStart(5, "0")}`,
         endSelo: !user.selos.endSelo ? `${user.sequence_value.toString().padStart(3, "0")}` + `${(quantity).toString().padStart(5, "0")}` :
             `${user.selos.endSelo.slice(0, 3)}` + `${(parseInt(user.selos.endSelo.slice(-5)) + parseInt(quantity)).toString().padStart(5, "0")}`,
         producer: user._id
     })
 
     if (product) {
         user.selos.newQuantity -= quantity
         user.selos.startSelo = product.startSelo
         user.selos.endSelo = product.endSelo
         await user.save()
 
         res.status(201).json(product)
     }
 
     else {
         res.status(400)
         throw new Error('Dados inválidos')
     }*/
})

// atualizar produto
const updateProduct = asyncHandler(async (req, res) => {

    const { description } = req.body

    const user = await User.findById(req.user._id)

    const product = await Product.findById(req.params.id)

    if (product) {
        product.producer = user._id
        product.description = description

        const updatedProduct = await product.save()

        res.json(updatedProduct)

    } else {
        res.status(404)
        throw new Error('Produto não encontrado')
    }
})

// adicionar foto
const addPhoto = asyncHandler(async (req, res) => {

    const product = await Product.findById(req.params.id)
    const user = req.user._id

    if (product) {

        if (!req.file) {
            res.status(404)
            throw new Error('Formato de Arquivo Inválido')
        }

        const refStorage = ref(storage, `productsPhotos/${user}/${product.name}.jpg`)

        const metadata = {
            contentType: 'image/jpeg',
        }

        const snapshot = await uploadBytesResumable(refStorage, req.file.buffer, metadata);

        const url = await getDownloadURL(snapshot.ref);

        product.path = url

        const updatedProduct = await product.save()

        res.json(updatedProduct)

    } else {
        res.status(404)
        throw new Error('Produto não encontrado')
    }
})


// rasteeio de produto
const trackProduct = asyncHandler(async (req, res) => {

    const { selo } = req.body
    
    if (!selo) {
        res.status(404)
        throw new Error('Selo inválido')
    }

    if (selo.slice(0, 3) === '000') {
        res.status(404)
        throw new Error('Selo inválido')
    }

    if (selo.slice(0, 8) > 99999999) {
        res.status(404)
        throw new Error('Selo inválido')
    }

    if (selo.length !== 8) {
        res.status(404)
        throw new Error('Selo inválido')
    }

    const firtsPart = selo.slice(0, 3)

    const user = await User.findOne({ sequence_value: firtsPart })

    if (!user) {
        res.status(404)
        throw new Error('Selo inválido por usuário')
    }

    const products = await Product.find({ producer: user._id })

    if (!products) {
        res.status(404)
        throw new Error('Selo inválido por produto')
    }

    const product = products.find((product) => {
        if (product.selo.startSelo <= selo && product.selo.endSelo >= selo) {
            return product
        }
    })

    if (!product) {
        res.status(404)
        throw new Error('Selo inválido')
    }

    res.status(200).json(product)

})


// deletar produtos
const deleteProduct = asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id)

    if (product) {
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
        await product.deleteOne()

        res.json('Produto deletado com sucesso')
    } else {
        res.status(404)
        throw new Error('Produto não encontrado')
    }
})

// pegar dados do usuário
const getProducer = asyncHandler(async (req, res) => {
    try {
        const producer = await User.findById(req.params.id)

        if (!producer) {
            res.status(404)
            throw new Error('Produtor não encontrado')
        }

        res.status(200).json(producer)


    } catch (error) {
        res.status(404)
        throw new Error('Produtor não encontrado')
    }
})

// pegar resumo do produtor
const getProducerResume = asyncHandler(async (req, res) => {
    try {
        const resume = await Resume.find({ user: req.params.id })

        if (!resume) {
            res.status(404)
            throw new Error('Resumo não encontrado')
        }

        res.status(200).json(resume)

    } catch (error) {
        res.status(404)
        throw new Error('Resumo não encontrado')
    }
})

// pegar selos 
const getSelos = asyncHandler(async (req, res) => {

    const user = await User.findById(req.params.id)

    if (!user) {
        res.status(404)
        throw new Error('Usuário não encontrado')
    }

    res.status(201).json(user.selos)
})

// adicionar selo 
const addSelo = asyncHandler(async (req, res) => {

    const { quantity } = req.body

    const pathRelatory = req.file

    const user = await User.findById(req.params.id)

    if (!user) {
        res.status(404)
        throw new Error('Usuário não encontrado')
    }

    if (!quantity) {
        res.status(404)
        throw new Error('Insira a quantidade de selos')
    }

    if (!pathRelatory) {
        res.status(404)
        throw new Error('Insira o relatório')
    }

    if (user.selos.status === 'analise') {
        res.status(404)
        throw new Error('Aguarde a análise do seus selos')

    }

    if (user.selos.status === 'aprovado') {
        res.status(404)
        user.selos.status = 'analise'
    }

    if (user.selos.status === 'reprovado') {
        res.status(404)
        user.selos.status = 'analise'
    }

    if (user.selos.status === 'pendente') {
        res.status(404)
        throw new Error('Seus selos estão pendentes')
    }

    const refStorage = ref(storage, `realatóriosSelos/${user._id}/${pathRelatory.originalname}`)

    const metadata = {
        contentType: 'application/pdf'
    }

    const snapshot = await uploadBytesResumable(refStorage, req.file.buffer, metadata);

    const url = await getDownloadURL(snapshot.ref);

    user.selos.pathRelatory = url
    user.selos.status = 'analise'
    user.selos.quantity = quantity

    await user.save()

    res.status(201).json(`${quantity} selos enviados para análise`)

})

// adicionar selos pagos

const addSelosPayed = asyncHandler(async (req, res) => {
    try {

        const { userId, productId } = req.body
        console.log(req.body)

        const product = await Product.findById(productId)
        const user = await User.findById(userId)

        if (!product) return res.status(404).json({ error: 'Produto não encontado não encontrado' })
        if (!user) return res.status(404).json({ error: 'Usuário não encontrado' })

        product.status = 'aprovado'
        product.selo.startSelo = !user.selos.endSelo ? `${user.sequence_value.toString().padStart(3, "0")}` + `${(1).toString().padStart(5, "0")}` :
            `${user.selos.endSelo.slice(0, 3)}` + `${(parseInt(user.selos.endSelo.slice(-5)) + 1).toString().padStart(5, "0")}`,
            product.selo.endSelo = !user.selos.endSelo ? `${user.sequence_value.toString().padStart(3, "0")}` + `${(product.selo.quantity).toString().padStart(5, "0")}` :
                `${user.selos.endSelo.slice(0, 3)}` + `${(parseInt(user.selos.endSelo.slice(-5)) + parseInt(product.selo.quantity)).toString().padStart(5, "0")}`

        user.selos.startSelo = product.selo.startSelo
        user.selos.endSelo = product.selo.endSelo
   
        await product.save()
        await user.save()

        res.status(200).json({ message: 'Produto pago com sucesso' })
    } catch (error) {
        res.status(404)
        throw new Error('Usuário não encontrado')
    }

})
//  CONSELHO

// adicionar relatórios de produtos

const addRelatorysProducts = asyncHandler(async (req, res) => {
    try {
        const { type } = req.body;

        const product = await Product.findById(req.params.id);

        if (!req.file) {
            return res.status(400).json({ error: 'Insira o relatório' });
        }

        if (!type) {
            return res.status(400).json({ error: 'Insira o tipo de relatório' });
        }

        if (!product) {
            return res.status(400).json({ error: 'Produto não encontrado' });
        }

        const refStorage = ref(storage, `productsRelatorysConselho/${product.producer}/${product.name}/${type}`);

        const metadata = {
            contentType: 'application/pdf',
        };

        const snapshot = await uploadBytesResumable(refStorage, req.file.buffer, metadata);

        const url = await getDownloadURL(snapshot.ref);

        if (!url) {
            return res.status(400).json({ error: 'Algo de errado aconteceu' });
        }

        product.analise[type].path = url;
        product.analise[type].status = 'pendente'


        await product.save();

        return res.status(200).json(product);

    } catch (error) {
        return res.status(400).json({ error: 'Erro ao adicionar relatórios' });
    }
});

// deletar relatórios de produtos

const deleteRelatorysProducts = asyncHandler(async (req, res) => {
    try {

        const { type } = req.body

        const product = await Product.findById(req.params.id)

        if (!type) {
            res.status(400)
            throw new Error('Informe o tipo de relatório')
        }

        if (!product) {
            res.status(400)
            throw new Error('Produto não encontrado')
        }

        const refStorage = ref(storage, `productsRelatorysConselho/${product.producer}/${product.name}/${type}`)
        await deleteObject(refStorage)

        product.analise[type].path = ''
        product.analise[type].status = ''

        await product.save()

        res.status(200).json(product)

    } catch (error) {
        res.status(400)
        throw new Error('Erro ao deletar relatório')
    }
})

const approveProductRelatory = asyncHandler(async (req, res) => {

    try {
        const { type } = req.body

        const product = await Product.findById(req.params.id)
        const user = await User.findById(product.producer)

        if (!product) {
            res.status(404)
            throw new Error('Usuário não encontrado')
        }

        if (type === 'analise_laboratorial') {
            product.analise.analise_laboratorial.status = 'aprovado'
            product.status = 'pendente'
            user.productsQuantity -= 1

            await user.save()
            await product.save()
        }

        product.analise[type].status = 'aprovado'

        await product.save()

        res.status(200).send(product)

    } catch (error) {
        res.status(400)
        throw new Error('Erro ao aprovar relatório')
    }
})

// reprovar relatório
const repproveProductRelatory = asyncHandler(async (req, res) => {
    try {
        const { type } = req.body

        const product = await User.findById(req.params.id)

        if (!product) {
            res.status(404)
            throw new Error('Usuário não encontrado')
        }

        if (type === 'analise_pedido') {

            if (product.analise.analise_pedido.recurso.path) {
                const refStorage = ref(storage, `conselhoRelatórios/${product._id}/recurso`)
                await deleteObject(refStorage)
            }

            product.analise.analise_pedido.recurso.path = ''
            product.analise.analise_pedido.recurso.status = 'pendente'
            product.analise.analise_pedido.recurso.time = Date.now()
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



module.exports =
{
    getProducts,
    addProduct,
    deleteProduct,
    getSingleProduct,
    updateProduct,
    addPhoto,
    trackProduct,
    getProducer,
    getProducerResume,
    getSelos,
    addSelo,
    generateSelos,
    addSelosPayed,
    addRelatorysProducts,
    deleteRelatorysProducts,
    approveProductRelatory

}