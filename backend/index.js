// inicializar bibliotecas e funções
const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv').config()
const connect = require('./db/config.js')
const PORT = process.env.PORT || 5000
const { errorHandler } = require('./middlewares/errorMiddleware.js')
const userRouter = require('./routes/userRoutes.js')
const userResumeRouter = require('./routes/userResumeRoutes.js')
const userFilesRouter = require('./routes/userFilesRoutes.js')
const adminRouter = require('./routes/adminRoutes.js')
const productsRouter = require('./routes/productsRoutes.js')
const paymentRouter = require('./routes/paymentRoutes.js')
const emailRouter = require('./routes/emailRoutes.js')
const path = require('path')
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)

// inicializar o expresss
const app = express()

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}))

app.use('/api/users', userRouter)
app.use('/api/resume', userResumeRouter)
app.use('/api/documentos', userFilesRouter)
app.use('/api/admin', adminRouter)
app.use('/api/products', productsRouter)
app.use('/api/payment', paymentRouter)
app.use('/api/email', emailRouter)

const dirname = path.resolve();

app.use(express.static(path.join(dirname, '/frontend/build')));

app.get("*", (req, res) =>
  res.sendFile(path.join(dirname, "./frontend/build/index.html"))
)

// função que conecta ao BD
connect()

// formata os erros
app.use(errorHandler)

// rodar o servidor 
app.listen(PORT, () => { console.log(`Servidor rodando na porta ${PORT}`) })