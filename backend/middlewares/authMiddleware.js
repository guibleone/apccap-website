const jwt = require('jsonwebtoken')
const asyncHandler = require('express-async-handler')
const User = require('../models/userModel')

// Proteger rotas
const protect = asyncHandler(async (req, res, next) => {
  let token

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Pegar token do header
      token = req.headers.authorization.split(' ')[1]

      // Verificar token
      const decoded = jwt.verify(token, process.env.JWT_SECRET)

      // Pegar usuário pelo token
      req.user = await User.findById(decoded.userId).select('-password')

      next()
    } catch (error) {
      console.log(error)
      res.status(401)
      throw new Error('Não autorizado')
    }
  }

  if (!token) {
    res.status(401)
    throw new Error('Não autorizado. Sem token')
  }
})

// Proteger rotas para o admin
const hasRole = (roles) => {
  return asyncHandler(async (req, res, next) => {
    
    let token

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {

      try {

        token = req.headers.authorization.split(' ')[1]
        // Verificar token
        const decoded = jwt.verify(token, process.env.JWT_SECRET)   

        // Pegar usuário pelo token
        const user = await User.findById(decoded.userId).select('-dados_pessoais.password')
        req.user = user

        if (!user || !roles.includes(user.role)) {
          req.role = user.role
          res.status(403)
          throw new Error('Não autorizado. Sem permissão')
        }
        next()

      } catch (error) {
        console.log(error)
        res.status(401)
        throw new Error('Não autorizado. Ocoreu um erro')
      }
    }

    if (!token) {
      res.status(404)
      throw new Error('Não autorizado. Sem token')
    }

  })
}

module.exports = { protect, hasRole }
