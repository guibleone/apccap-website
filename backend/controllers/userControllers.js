// ** funções de controle para as rotas dos usuários ** 
const User = require('../models/userModel.js')
const Document = require('../models/userFilesModel.js')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const asyncHandler = require('express-async-handler')
const { ref, getDownloadURL, uploadBytesResumable, deleteObject } = require("firebase/storage");
const { storage } = require('../db/firebase.js')

// registrar usuário
const registerUser = asyncHandler(async (req, res) => {

    const { userData } = req.body;

    try {

        const { dadosPessoaisData, propriedadeData, marcaData, isAssociado } = JSON.parse(userData);

        if (dadosPessoaisData && propriedadeData && marcaData) {

            const emailExists = await User.findOne({
                'dados_pessoais.email': dadosPessoaisData.email,

            });

            const cpfExists = await User.findOne({
                'dados_pessoais.cpf': dadosPessoaisData.cpf,
            });

            if (emailExists) {
                res.status(400).json({ message: 'Email já cadastrado. Tente outro.' });
                return;
            }

            if (cpfExists) {
                res.status(400).json({ message: 'CPF já cadastrado. Tente outro.' });
                return;
            }

            const logo = req.file;

            if (!logo) {
                res.status(400).json({ message: 'Selecione uma imagem válida' });
                return;
            }

            const salt = await bcrypt.genSalt(10);
            const hashPassword = await bcrypt.hash(dadosPessoaisData.password, salt);

            const user = await User.create({
                dados_pessoais: {
                    ...dadosPessoaisData,
                    password2: '',
                    password: hashPassword,
                },
                propriedade: propriedadeData,
                marca: { ...marcaData, logo: '' },
            });

            if (user) {

                if (isAssociado) {
                    user.role = 'produtor_associado'
                    user.status = 'analise'
                }

                user.token = generateToken(user._id);

                const storageRef = ref(storage, `logos/${user._id}`)

                const metadata = {
                    contentType: logo.mimetype,
                }

                const snapshot = await uploadBytesResumable(storageRef, logo.buffer, metadata);

                const url = await getDownloadURL(snapshot.ref);


                const updatedMarca = {
                    ...user.marca,
                    logo: url,
                };

                user.marca = updatedMarca

                await user.save();

                return res.json(user);

            } else {
                return res.status(400).json({ message: 'Dados inválidos' });
            }
        } else {

            res.status(400).json({ message: 'Preencha todos os campos' });
        }

    } catch (error) {
        res.status(500)
        throw new Error('Erro ao criar usuário')
    }

});



// adicionar foto de perfil
const addProfilePhoto = asyncHandler(async (req, res) => {
    try {

        if (!req.file) {
            res.status(400)
            throw new Error('Selecione uma imagem válida')
        }

        const user = await User.findById(req.params.id)

        if (user) {

            if (user.dados_pessoais.profilePhoto) {
                const storageRef = ref(storage, `profilePhotos/${user._id}`)
                await deleteObject(storageRef)
            }

            const storageRef = ref(storage, `profilePhotos/${user._id}`)

            const metadata = {
                contentType: req.file.mimetype,
            }

            const snapshot = await uploadBytesResumable(storageRef, req.file.buffer, metadata);

            const url = await getDownloadURL(snapshot.ref);

            user.dados_pessoais = {
                ...user.dados_pessoais,
                profilePhoto: url
            }

            await user.save()

            res.json(user)

        } else {
            res.status(404)
            throw new Error('Usuário não encontrado')
        }

    } catch (error) {
        res.status(400)
        throw new Error('Erro ao adicionar foto de perfil')
    }

})

// adidionar logo da marca

const loginUser = asyncHandler(async (req, res) => {

    const { cpf, password } = req.body;

    try {
        if (!cpf || !password) {
            res.status(400);
            throw new Error('Preencha todos os campos');
        }

        const user = await User.findOne({ 'dados_pessoais.cpf': cpf });

        const userPassword = user && user.dados_pessoais.password

        if (user && (await bcrypt.compare(password, userPassword))) {
            const token = generateToken(user._id);

            user.token = token;

            await user.save();

            res.json(user);
        } else {
            res.status(401);
            return res.json({ message: 'CPF ou senha inválidos' });
        }
    } catch (error) {
        res.status(500)
        throw new Error('Erro ao fazer login')
    }
});


// deletar usuário
const deleteUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id)

    if (user) {
        await user.deleteOne()
        res.json({ id: req.params.id, message: 'Usuário removido' })
    } else {
        res.status(404)
        throw new Error('Usuário não encontrado')
    }
})

const updateUser = asyncHandler(async (req, res) => {

    const userId = req.params.id;
    const { userData } = req.body;

    try {
        const { dadosPessoaisData, propriedadeData, marcaData } = JSON.parse(userData);

        if (dadosPessoaisData && propriedadeData && marcaData) {

            const emailExists = await User.findOne({
                'dados_pessoais.email': dadosPessoaisData.email,
                _id: { $ne: userId },
            });

            const cpfExists = await User.findOne({
                'dados_pessoais.cpf': dadosPessoaisData.cpf,
                _id: { $ne: userId },
            });

            if (emailExists) {
                res.status(400).json({ message: 'Email já cadastrado. Tente outro.' });
                return;
            }

            if (cpfExists) {
                res.status(400).json({ message: 'CPF já cadastrado. Tente outro.' });
                return;
            }

            const user = await User.findById(userId);

            const updatedDadosPessoais = {
                ...user.dados_pessoais,
                ...dadosPessoaisData,
            };

            const updatedPropriedade = {
                ...user.propriedade,
                ...propriedadeData,
            };


            const updatedMarca = {
                ...user.marca,
                ...marcaData,
            };

            const logo = req.file;

            if (logo) {

                if (user.marca.logo) {
                    const storageRef = ref(storage, `logos/${user._id}`)
                    await deleteObject(storageRef)
                }

                const storageRef = ref(storage, `logos/${user._id}`)

                const metadata = {
                    contentType: logo.mimetype,
                }

                const snapshot = await uploadBytesResumable(storageRef, logo.buffer, metadata);

                const url = await getDownloadURL(snapshot.ref);

                updatedMarca.logo = url
            }


            if (updatedDadosPessoais && updatedPropriedade && updatedMarca) {

                user.dados_pessoais = updatedDadosPessoais
                user.propriedade = updatedPropriedade
                user.marca = updatedMarca

                await user.save();

                res.status(200).json(user)

            } else {
                res.status(404).json({ message: 'Usuário não encontrado.' });
            }

        } else {

            res.status(400).json({ message: 'Preencha todos os campos' });
        }

    } catch (error) {
        res.status(500)
        throw new Error('Erro ao atualizar usuário')
    }

});


// reiniciar aprovação

const restartAprove = asyncHandler(async (req, res) => {
    try {

        const user = await User.findById(req.params.id)
        const documents = await Document.find({ user: req.params.id })

        if (!user) {
            res.status(404)
            throw new Error('Usuário não encontrado')
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

        user.status = 'analise'
        user.relatory = ''
        user.analise = {
            analise_pedido: {
                status: '',
                path: '',
                time: null,
                recurso: {
                    status: '',
                    path: '',
                    time: null,
                }
            },
            vistoria: {
                status: '',
                path: '',
            },
            analise_laboratorial: {
                status: '',
                path: '',
            },

        }

        if (documents) {
            documents.map(async (document) => {
                const storageRef = ref(storage, `documentosProdutor/${document.user}/${document.name}`)
                await deleteObject(storageRef)
            })
        }

        await Document.deleteMany({ user: req.params.id })

        await user.save()

        res.json(user)

    } catch (error) {
        res.status(400)
        throw new Error('Erro ao reiniciar aprovação')
    }
})


const handleRecurso = asyncHandler(async (req, res) => {

    try {

        if (req.file) {

            const user = await User.findById(req.params.id)

            if (!user) {
                res.status(404)
                throw new Error('Usuário não encontrado')
            }

            const storageRef = ref(storage, `conselhoRelatórios/${user._id}/recurso`)

            const metadata = {
                contentType: req.file.mimetype,
            }

            const snapshot = await uploadBytesResumable(storageRef, req.file.buffer, metadata);

            const url = await getDownloadURL(snapshot.ref);

            user.analise.analise_pedido.recurso.path = url
            user.analise.analise_pedido.recurso.time = null

            await user.save()

            res.json(user)
        }

    } catch (error) {
        res.status(400)
        throw new Error('Erro ao enviar recurso')
    }

})

// se tornar um produtor 

const becomeProducer = asyncHandler(async (req, res) => {
    try {

        const user = await User.findById(req.user._id)

        if (!user) {
            res.status(404)
            throw new Error('Usuário não encontrado')
        }

        user.status = 'analise'

        await user.save()

        res.json({ ...user._doc, token: generateToken(user._id) })

    } catch (error) {
        res.status(400)
        throw new Error('Erro ao se tornar produtor')
    }

})


// associção ter acesso produtor
const associateProducer = asyncHandler(async (req, res) => {
    try {
        const { id } = req.body;

        if (!id) {
            res.status(400).json({ error: 'Informe o id do usuário' });
            return;
        }

        const user = await User.findById(id);

        if (!user) {
            res.status(404).json({ error: 'Usuário não encontrado' });
            return;
        }

        if (user.oldRole === 'produtor') {
            res.status(400).json({ error: 'Usuário já é produtor' });
            return;
        }

        if (user.oldRole) {
            user.role = user.oldRole;
            user.oldRole = '';

            await user.save();

            res.json(user)
            return;
        }

        user.oldRole = user.role;
        user.role = 'produtor';

        await user.save();

        res.json(user)
        return;

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao associar produtor' });
    }
});

// submeter formulário de requerimento

const submitForm = asyncHandler(async (req, res) => {
    try {
        const { id } = req.params

        const { formData } = req.body

        const user = await User.findById(id)

        if (!user) {
            res.status(404).json({ error: 'Usuário não encontrado' });
            return;
        }

        if (!formData) {
            res.status(400).json({ error: 'Preencha todos os campos' });
            return;
        }

        user.formulario_requerimento = formData

        await user.save()

        res.status(200).json(user)

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao submeter formulário' });
    }
});

// associar-se

const associate = asyncHandler(async (req, res) => {
    try {
        const { id } = req.body;

        if (!id) {
            res.status(400).json({ error: 'Informe o id do usuário' });
            return;
        }

        const user = await User.findById(id);

        if (!user) {
            res.status(404).json({ error: 'Usuário não encontrado' });
            return;
        }

        if (user.role === 'produtor_associado') {
            res.status(400).json({ error: 'Usuário já é produtor associado' });
            return;
        }

        user.role = 'produtor_associado';
        user.status = 'analise'

        await user.save();

        res.json(user)
        return;

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao associar produtor' });
    }
})

// cancelar credencial
const cancelCredencial = asyncHandler(async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            res.status(400).json({ error: 'Informe o id do usuário' });
            return;
        }

        const user = await User.findById(id);

        if (!user) {
            res.status(404).json({ error: 'Usuário não encontrado' });
            return;
        }

        if (user.role === 'produtor') {
            res.status(400).json({ error: 'Usuário já é produtor' });
            return;
        }

        user.role = 'produtor';

        if (user.analise.analise_pedido.path) {
            const storageRef = ref(storage, `conselhoRelatórios/${user._id}/analise_pedido`)
            await deleteObject(storageRef)
        }

        if (user.analise.analise_pedido.recurso.path) {
            const storageRef = ref(storage, `conselhoRelatórios/${user._id}/recurso`)
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

        user.formulario_requerimento = null

        user.analise = {
            analise_pedido: {
                status: '',
                path: '',
                time: null,
                recurso: {
                    status: '',
                    path: '',
                    time: null,
                }
            },
            vistoria: {
                status: '',
                path: '',
            },
            analise_laboratorial: {
                status: '',
                path: '',
            },
        }

        await user.save();

        res.json(user)
        return;

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao associar produtor' });
    }
})

// redefinir senha

const resetPassword = asyncHandler(async (req, res) => {
    try {
        const { password, email } = req.body;
        console.log(password, email);

        const user = await User.findOne({ "dados_pessoais.email": email });

        if (!user) {
            res.status(400).json({ error: 'Email não encontrado' });
            return;
        }

        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(password, salt);

        const updatedDadosPessoais = {
            ...user.dados_pessoais,
            password: hashPassword,
        };

        user.dados_pessoais = updatedDadosPessoais

        await user.save()

        res.status(200).json({ message: 'Senha redefinida com sucesso' });
        
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao redefinir senha' });
    }
});

// gerar token
const generateToken = (userId) => {
    const secretKey = process.env.JWT_SECRET;
    return jwt.sign({ userId }, secretKey, { expiresIn: '48h' });
};

// exportar funções
module.exports = {
    registerUser,
    loginUser,
    deleteUser,
    updateUser,
    addProfilePhoto,
    restartAprove,
    handleRecurso,
    becomeProducer,
    associateProducer,
    submitForm,
    associate,
    cancelCredencial,
    resetPassword
}