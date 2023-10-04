const multer = require("multer");
const dotenv = require("dotenv").config();

// configura o filtro (foto de perfil)
const fileFilterFoto = (req, file, cb) => {
  // rejeitar um arquivo se não for jpeg ou png
  if (
    file.mimetype === "image/jpeg" ||
    file.mimetype === "image/png"
  ) {
    file.originalname = Buffer.from(file.originalname, 'latin1').toString(
      'utf8',
    )
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
    file.originalname = Buffer.from(file.originalname, 'latin1').toString(
      'utf8',
    )
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
    file.mimetype === "text/csv" ||
    file.mimetype === "application/vnd.ms-excel" ||
    file.mimetype === "application/pdf"
  ) {
    file.originalname = Buffer.from(file.originalname, 'latin1').toString(
      'utf8',
    )
    cb(null, true);
  } else {
    cb(null, false);
    return new Error("Formato de arquivo inválido");
  }
}

//configura o filtro (selos)
const fileFilterSelo = (req, file, cb) => {
  // rejeitar um arquivo se não for pdf
  if (
    file.mimetype === "application/pdf"
  ) {
    file.originalname = Buffer.from(file.originalname, 'latin1').toString(
      'utf8',
    )
    cb(null, true);
  } else {
    cb(null, false);
    return new Error("Formato de arquivo inválido");
  }
};

// configura o filtro (relatório)
const fileFilterRelatory = (req, file, cb) => {
  // rejeitar um arquivo se não for pdf
  if (
    file.mimetype === "application/pdf"
  ) {
    file.originalname = Buffer.from(file.originalname, 'latin1').toString(
      'utf8',
    )
    cb(null, true);
  } else {
    cb(null, false);
    return new Error("Formato de arquivo inválido");
  }
};

// configura o filtro (relatórios)
const fileFilterRelatorys = (req, file, cb) => {
  if (file.mimetype === 'application/pdf') {
    file.originalname = Buffer.from(file.originalname, 'latin1').toString('utf8');
    cb(null, true);
  } else {
    const error = new Error('Formato de arquivo inválido');
    error.statusCode = 400;
    cb(error);
  }
};


// configura o tamanho máximo do arquivo (relatório)
const uploadRelatory = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 2048 * 2048 * 10,
  },
  fileFilter: fileFilterRelatory,
});

// configura o tamanho máximo do arquivo (relatórios)
const uploadRelatorys = multer({
  storage: multer.memoryStorage(),
  limits: {
    quantity: 10,
  },
  fileFilter: fileFilterRelatorys,
});

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
  limits: {
    fileSize: 1024 * 1024 * 5,
  },
  fileFilter: fileFilterExcel,

});
// configura o tamanho máximo do arquivo (selos)
const uploadSelo = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 1024 * 1024 * 5,
  },
  fileFilter: fileFilterSelo,
});


module.exports = { uploadProfilePhoto, uploadDoc, uploadProduct, uploadExcel, uploadSelo, uploadRelatory, uploadRelatorys };
