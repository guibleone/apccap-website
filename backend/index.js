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
const spreadSheetRouter = require('./routes/spreadSheetsRoutes.js')
const reunionRouter = require('./routes/reunionRoutes.js')
const path = require('path')
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)
const multer = require('multer');
const { uploadRelatorys } = require('./middlewares/multer.js')

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
app.use('/api/planilha', spreadSheetRouter)
app.use('/api/reunion', reunionRouter)

const storage = multer.memoryStorage(); // Use memory storage for simplicity, you can configure it to save files to disk
const upload = multer({ storage });

app.post('/api/upload', uploadRelatorys.array('files'), (req, res) => {
  console.log(req.body);
  console.log(req.files);
  res.json({ message: 'Files uploaded successfully' });
});


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