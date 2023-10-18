const asyncHandler = require('express-async-handler');
const Reunion = require('../models/reunionModel.js');
const User = require('../models/userModel.js');
const { ref, getDownloadURL, uploadBytesResumable, deleteObject } = require("firebase/storage");
const { storage } = require('../db/firebase.js');


// criar reunião
const createReunion = asyncHandler(async (req, res) => {
    try {

        const { reunionData } = req.body
        const { title, message, date, typeReunion, pautas, dateConvocacao, convocado_por } = JSON.parse(reunionData)

        let type = ''

        const nomeMembros = []

        if (!req.file) {
            res.status(400)
            throw new Error('Selecione um arquivo válido')
        }


        const storageRef = ref(storage, `convocacoes/${title.replace('/', '_')}.pdf`)
        const metadata = {
            contentType: 'application/pdf',
        }

        const snapshot = await uploadBytesResumable(storageRef, req.file.buffer, metadata);

        const url = await getDownloadURL(snapshot.ref);

        if (!url) {
            res.status(400)
            throw new Error('Algo de errado aconteceu')
        }


        if (typeReunion === 'administrativa') {
            type = 'administrativa'

            const associates = await User.find({ role: { $in: ['presidente', 'secretario', 'tesoureiro', 'conselho'] } })

            associates.forEach(associate => {
                nomeMembros.push(`${associate.dados_pessoais.name} - ${associate.role}`)
            })
        }

        if (typeReunion === 'assembleia_ordinaria') {
            type = 'assembleia_ordinaria'

            const associates = await User.find({ role: { $in: ['presidente', 'secretario', 'tesoureiro', 'conselho', 'produtor'] } })

            associates.forEach(associate => {
                nomeMembros.push(`${associate.dados_pessoais.name} - ${associate.role}`)
            })
        }

        if (typeReunion === 'assembleia_extraordinaria') {
            type = 'assembleia_extraordinaria'

            const associates = await User.find({ role: { $in: ['presidente', 'secretario', 'tesoureiro', 'conselho', 'produtor'] } })

            associates.forEach(associate => {
                nomeMembros.push(`${associate.dados_pessoais.name} - ${associate.role}`)
            })
        }

        const reunion = await Reunion.create({
            title,
            pathPdf: url,
            message,
            date,
            dateConvocacao,
            convocado_por,
            type,
            status: 'agendada',
            membros: {
                convocados: nomeMembros,
                presentes: [],
                faltantes: []
            },
            pautas: pautas?.map(pauta => {
                return {
                    title: pauta.title,
                    description: pauta.description,
                    votos: {
                        favor: [],
                        contra: [],
                    }
                }
            })
        })



        res.json(reunion)
    }
    catch (error) {
        res.status(400)
        throw new Error('Dados inválidos')
    }
})

// listar reuniões por data
const getReunions = asyncHandler(async (req, res) => {
    try {
        const reunions = await Reunion.find({}).sort({ date: 1 });

        res.json(reunions)

    } catch (error) {
        res.status(500).json({ message: 'Erro ao buscar reuniões' });
    }
});

// concluir reunião

const finishReunion = asyncHandler(async (req, res) => {
    try {
        const { id } = req.body

        const reunion = await Reunion.findById(id)

        if (reunion) {
            reunion.status = 'requer_ata'
            await reunion.save()
            res.json({ message: 'Reunião concluída' })
        } else {
            res.status(404)
            throw new Error('Reunião não encontrada')
        }
    } catch (error) {
        res.status(500)
        throw new Error('Erro ao concluir reunião')
    }
})

// adicionar ata

const addReunionAta = asyncHandler(async (req, res) => {

    const reunion = await Reunion.findById(req.params.id)
    const numberAssociates = await User.countDocuments({ role: { $in: ['presidente', 'secretario', 'tesoureiro', 'conselho'] } });

    if (!req.file) {
        res.status(400)
        throw new Error('Selecione um arquivo válido')

    }

    if (!reunion) {
        res.status(404)
        throw new Error('Reunião não encontrada')
    }

    const storageRef = ref(storage, `reunionsAtas/${reunion._id}/${req.file.originalname}`)
    const metadata = {
        contentType: 'application/pdf',
    }

    const snapshot = await uploadBytesResumable(storageRef, req.file.buffer, metadata);

    const url = await getDownloadURL(snapshot.ref);

    if (!url) {
        res.status(400)
        throw new Error('Algo de errado aconteceu')
    }

    reunion.ata.path = url
    reunion.ata.originalname = req.file.originalname
    reunion.assinaturas_faltantes = numberAssociates
    reunion.status = 'nao_assinada'

    await reunion.save()

    res.status(200).json('Ata adicionada com sucesso')

})

// pegar atas

const getReunionAtas = async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 12;
    const skip = (page - 1) * pageSize;
    const search = req.query.search || '';

    try {
        let query = {};

        if (search) {
            query = {
                'ata.originalname': { $regex: search, $options: 'i' }
            };
        }

        const totalDocuments = await Reunion.countDocuments(query);
        const atas = await Reunion
            .find(query)
            .find({ status: 'assinada' })
            .select('ata')
            .skip(skip)
            .limit(pageSize);

        res.json({ totalDocuments, atas });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error while fetching atas' });
    }
}

const signAta = asyncHandler(async (req, res) => {
    try {
        const { id, memberName } = req.body

        if (!id || !memberName) {
            res.status(400)
            throw new Error('Dados inválidos')
        }

        const reunion = await Reunion.findById(id)

        if (reunion.ata.assinaturas.includes(memberName)) {
            res.status(400)
            throw new Error('Você já assinou a ata')
        }

        if (reunion.status === 'assinada') {
            res.status(400)
            throw new Error('Ata já assinada')
        }

        reunion.ata.assinaturas.push(memberName)
        reunion.ata.assinaturas_restantes = reunion.membros.presentes.filter(member => !reunion.ata.assinaturas.includes(member))

        if (reunion.ata.assinaturas.length === reunion.membros.presentes.length) {
            reunion.status = 'assinada'
            reunion.ata.assinaturas_faltantes = []

            await reunion.save()
        }

        await reunion.save()

        res.status(200).json(reunion)


    } catch (error) {
        res.status(500)
        throw new Error('Erro ao assinar ata')
    }
})


// deletar ata

const deleteReunionAta = asyncHandler(async (req, res) => {
    try {
        const { id } = req.body

        const reunion = await Reunion.findById(id)

        if (reunion.ata.path) {
            const storageRef = ref(storage, `reunionsAtas/${reunion._id}/${reunion.ata.originalname}`)
            await deleteObject(storageRef)
        }

        reunion.ata.path = ''
        reunion.ata.originalname = ''

        await reunion.save()

        res.json('Ata deletada')

    } catch (error) {
        res.status(500)
        throw new Error('Erro ao deletar ata')
    }

})

// deletar reunião

const deleteReunion = asyncHandler(async (req, res) => {
    try {
        const id = req.params.id

        const reunion = await Reunion.findById(id)

        if (reunion && reunion.ata.path) {
            const storageRef = ref(storage, `reunionsAtas/${reunion._id}/${reunion.ata.originalname}`)
            await deleteObject(storageRef)
        }

        await Reunion.findByIdAndDelete(id)

        res.status(200).json({ message: 'Reunião deletada' })

    } catch (error) {
        res.status(500)
        throw new Error('Erro ao deletar reunião')
    }
})

// lista de presença

const presenceList = asyncHandler(async (req, res) => {
    try {
        const { presence } = req.body

        const reunion = await Reunion.findById(req.params.id)

        if (!reunion) {
            res.status(404)
            throw new Error('Reunião não encontrada')
        }
        for (const memberName in presence) {
            if (Object.hasOwnProperty.call(presence, memberName) && presence[memberName]) {
                reunion.membros.presentes.push(memberName)
            }
        }

        reunion.membros.faltantes = reunion.membros.convocados.filter(member => !reunion.membros.presentes.includes(member))

        await reunion.save()

        res.status(200).json('Lista de presença atualizada')

    }

    catch (error) {
        res.status(500)
        throw new Error('Erro ao listar presença')
    }
})

// pegar única reunião

const getOneReunion = asyncHandler(async (req, res) => {
    try {
        const reunion = await Reunion.findById(req.params.id)

        if (!reunion) {
            res.status(404)
            throw new Error('Reunião não encontrada')
        }

        res.status(200).json(reunion)

    } catch (error) {
        res.status(500)
        throw new Error('Erro ao buscar reunião')
    }
})

// sistema de votos

const handleVotos = asyncHandler(async (req, res) => {
    try {
        const reunion = await Reunion.findById(req.params.id);

        if (!reunion) {
            return res.status(404).json({ message: 'Reunião não encontrada' });
        }

        const { name, voto, pauta } = req.body;

        if (reunion.pautas[pauta].votos.favor.includes(name) || reunion.pautas[pauta].votos.contra.includes(name)) {
            return res.status(400).json({ message: 'Você já votou nesta pauta' });
        }

        if (voto === 'favor') {
            reunion.pautas[pauta].votos.favor.push(name);
        } else if (voto === 'contra') {
            reunion.pautas[pauta].votos.contra.push(name);
        }

        await reunion.save();

        res.status(200).json({ message: 'Voto computado' });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro interno do servidor' });
    }
});

module.exports = {
    createReunion, getReunions, finishReunion,
    addReunionAta, deleteReunion, deleteReunionAta,
    signAta, presenceList, getOneReunion,
    handleVotos, getReunionAtas
}
