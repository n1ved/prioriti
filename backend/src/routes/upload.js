const express=require('express');
const middleware=require('../middleware/upload');
const {uploadPDFs}=require('../controller/pdfUpload');

const router=express.Router();

try{
    router.post('/uploadPDF',middleware.array('pdfs',10),uploadPDFs);
} catch (error) {
    console.error('Error occurred while uploading PDFs:', error);
    res.status(500).json({ status: 'error', message: 'Internal Server Error' });
}
module.exports=router;
