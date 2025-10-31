import multer from 'multer';
import path from 'path';
import { UPLOAD_DIR, MAX_FILE_SIZE } from './env.js';

// Configurer le stockage des fichiers
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, `${UPLOAD_DIR}/users/`);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  }
});

// Filtrer les types de fichiers acceptés
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('❌ Seulement les images (jpeg, jpg, png, gif) sont acceptées'));
  }
};

// Créer le middleware multer
const upload = multer({
  storage: storage,
  limits: { fileSize: MAX_FILE_SIZE },
  fileFilter: fileFilter
});

export default upload;
