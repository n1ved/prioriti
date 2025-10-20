const express=require('express');
const router=express.Router();
const fs=require('fs').promises;

const pdfService=require('../service/uploadService');

const pdfUpload=async(req,res,next)=>{
    try{
        if(!req.files||req.files.length==0){
            return res.status(400).json({status:'error',message:'No files uploaded'});
        }
        const uploadedPDFs=[];
        const failedPDFs=[];
            for(const file of req.files){
                try{
                    console.log(`Processing file: ${file.originalname}`);
                    const extractedText=await pdfService.extractTextFromFile(file);
                    await pdfService.saveExtractedText(file.filename,extractedText);
                    uploadedPDFs.push({fileName:file.filename,originalName:file.originalname,size:file.size,textLength:extractedText.length,status:'success'});
                    console.log(`Processed File: ${file.originalname}`);
                }

                catch(error){
                    console.error(`Error occurred while uploading ${file.originalname}`, error);
                    failedPDFs.push({fileName:file.filename,originalName:file.originalname,size:file.size,status:'failed',error:error.message});
                    try{
                        await fs.unlink(file.path);
                    }
                    catch(unlinkError){
                        console.error(`Error occurred during unlinking ${file.originalname}`,unlinkError);
                    }
                }

            }
            const response={
                status:uploadedPDFs.length>0?'success':'failed',
                message:uploadedPDFs.length>0?`Processed ${uploadedPDFs.length}`:'failed',
                data:{uploaded:uploadedPDFs,failed:failedPDFs,
                    summary:{
                        total:req.files.length,
                        successful:uploadedPDFs.length,
                        failed:failedPDFs.length
                    }
                },
                
            };
        return res.status(200).json(response);
    }
    catch(error){
        console.error(`Error occurred while uploading files`, error);
        return res.status(500).json({status:'error',message:'Upload Failed',details:error.message});
    }
};

module.exports={pdfUpload};