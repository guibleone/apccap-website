const multer = require("multer");
const dotenv = require("dotenv").config();

// configura o filtro (foto de perfil)
const fileFilterFoto = (req, file, cb) => {
  // rejeitar um arquivo se não for jpeg ou png
  if (
    file.mimetype === "image/jpeg" ||
    file.mimetype === "image/png"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
    return new Error("Formato de arquivo inválido");
  }
};

// configura o filtro (documentos)
const fileFilterDoc = (req, file, cb) => {
  // rejeitar um arquivo se não for pdf 
  if (
    file.mimetype === "application/pdf"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
    return new Error("Formato de arquivo inválido");
  }
};

// configura o filtro (produtos)
const fileFilterProduct = (req, file, cb) => {
  // rejeitar um arquivo se não for jpeg ou png
  if (
    file.mimetype === "image/jpeg" ||
    file.mimetype === "image/png"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
    return new Error("Formato de arquivo inválido");
  }
};

// configura o filtro (excel)
const fileFilterExcel = (req, file, cb) => {
  // rejeitar um arquivo se não for compatível com o excel
  if (
    file.mimetype === "text/csv"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
    return new Error("Formato de arquivo inválido");
  }}


// configura o tamanho máximo do arquivo (foto de perfil)
const uploadProfilePhoto = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 1024 * 1024 * 5,
  },
  fileFilter: fileFilterFoto,
});

// configura o tamanho máximo do arquivo (documentos)
const uploadDoc = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 1024 * 1024 * 5,
  },
  fileFilter: fileFilterDoc,
});

// configura o tamanho máximo do arquivo (produtos)

const uploadProduct = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 1024 * 1024 * 5,
  },
  fileFilter: fileFilterProduct,
})

// configura o tamanho máximo do arquivo (excel)
const uploadExcel = multer({
  storage: multer.memoryStorage(),
  defParamCharset: 'utf8',
	defCharset: 'utf8',
  limits: {
    fileSize: 1024 * 1024 * 5,
  },
  fileFilter: fileFilterExcel,

});

module.exports = {uploadProfilePhoto, uploadDoc, uploadProduct, uploadExcel};
