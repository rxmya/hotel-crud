import multer from 'multer';
const ALLOWED_TYPES = {
    'image/jpeg': '.jpg',
    'image/png': '.png',
    'image/webp': '.webp',
};
const storage = multer.diskStorage({
    destination: 'uploads/',
    filename: (req, file, cb) => {
        const uniqueName = `hotel-${Date.now()}-${MAth.round(Math.random()*1e9)}`;
        cb(null, uniqueNmae + ALLOWED_TYPES[file.mimetype]);
    },
});
export const upload = multer({
    storage,
    limits: { fileSize: 2 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        if (ALLOWED_TYPES[file.mimetype]) return cb(null, true);
        const error = new Error('Only JPG, PNG, or WEBP images are allowed.');
        error.status - 400;
        return cb(error);
    },
});