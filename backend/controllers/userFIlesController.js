const User = require('../models/userModel.js')
const Document = require('../models/userFilesModel.js')
const asyncHandler = require('express-async-handler')
const { ref, getDownloadURL, uploadBytesResumable, deleteObject } = require("firebase/storage");
const { storage } = require('../db/firebase.js');

// pegar todos os documentos
const getDocumentsAdmin = asyncHandler(async (req, res) => {
    try {
        const documents = await Document.find({})
        res.status(200).json(documents)

    } catch (error) {
        res.status(400)
        throw new Error('Algo de errado aconteceu')
    }
})

// pegar documentos
const getDocuments = asyncHandler(async (req, res) => {
    try {

        const user = req.user._id

        if (user) {
            const documents = await Document.find({ user })
            res.status(200).json(documents)
        }

        else {
            res.status(404)
            throw new Error('Usuário não encontrado')
        }


    } catch (error) {
        res.status(400)
        throw new Error('Algo de errado aconteceu')
    }
})

// adicioanr documento 
const addDocument = asyncHandler(async (req, res) => {
    try {
        if (!req.files) {
            res.status(400)
            throw new Error('Selecione um arquivo válido')
        }

        const documents = []

        for (const file of req.files) {
            const storageRef = ref(storage, `documentosProdutor/${req.user._id}/${file.originalname}`);
            const metadata = {
                contentType: file.mimetype,
            };

            try {
                // Upload o arquivo para o Cloud Storage
                const snapshot = await uploadBytesResumable(storageRef, file.buffer, metadata);

                // Pegar a URL do arquivo
                const url = await getDownloadURL(snapshot.ref);

                // Armazenar os metadados do arquivo
                documents.push({
                    type: file.originalname,
                    path: url,
                });

            } catch (error) {
                console.error(error);
                return res.status(500).json({ error: 'Falha ao criar o produto' });
            }
        }

        const createdDocuments = await Document.create(documents.map(document => {
            return {
                name: document.type,
                path: document.path,
                user: req.user._id,
                type: document.type,
            }
        }))

        if (createdDocuments) {
            res.status(201).json(createdDocuments)
        }

        else {
            res.status(400)
            throw new Error('Dados inválidos')
        }


    }
    catch (error) {
        res.status(400)
        throw new Error('Erro ao adicionar documento')
    }

    /*  if (!req.file) {
          res.status(400)
          throw new Error('Selecione um arquivo válido')
      }
  
      const user = await User.findById(req.body.user)
  
      if (user) {
  
          const refStorage = ref(storage, `documents/${user._id}/${req.body.type}/${req.body.name}`)
  
          const metadata = {
              contentType: 'application/pdf',
          }
  
          const snapshot = await uploadBytesResumable(refStorage, req.file.buffer, metadata);
  
          const url = await getDownloadURL(snapshot.ref);
  
          if(!url){
              res.status(400)
              throw new Error('Algo de errado aconteceu')
          }
  
          const document = {
              name: req.body.name,
              path: url,
              user: req.body.user,
              type: req.body.type
          }
  
          const createdDocument = await Document.create(document)
  
          if (createdDocument) {
              res.status(201).json(createdDocument)
          } else {
              res.status(400)
              throw new Error('Dados inválidos')
          }
  
      } else {
          res.status(404)
          throw new Error('Usuário não encontrado')
      }*/

})

// baixar documentos 

const downloadDocument = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const document = await Document.findById(id);

    if (!document) {
        return next(new Error("Documento não encontrado"));
    }

    const url = document.path

    res.status(200).json({ url });

})

// deletar documentos
const deleteDocument = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const document = await Document.findById(id);

    if (!document) {
        res.status(404)
        throw new Error('Documento não encontrado')
    }

    const refStorage = ref(storage, `documentosProdutor/${document.user}/${document.name}`)

    await Document.findByIdAndDelete(id);

    await deleteObject(refStorage)

    res.status(200).json({ id: document._id });
})


module.exports = {
    getDocuments,
    addDocument,
    downloadDocument,
    deleteDocument,
    getDocumentsAdmin
}