const express=require('express');
const pdf=require('pdf-parse');
const fs=require('fs').promises;

class UploadService{
    constructor(){
        this.extractedTexts=[];
    }
async extractTextFromFile(file){
    try{
        const data=await fs.readFile(file.path);
        const readData=await pdf(data);
        return readData.text;
    }
    catch(error){
        console.error('Error extracting text:',error);
        throw new Error('Failed to extract text');
        
    }
}
async saveExtractedText(filename,text){
    try{
        this.extractedTexts.push({filename,text,extractedDate:new Date().toISOString()});
        console.log(this.extractedTexts);
        return {status:'success',message:'Text extracted and saved successfully'};
    }
    catch(error){
        console.error('Error saving extracted text:',error);
        throw new Error('Failed to save extracted text');
    }
}

getExtractedTexts(){
    try{
        return {status:'success',data:this.extractedTexts};
    }
    catch(error){
        console.error('Error getting extracted texts:',error);
        throw new Error('Failed to get extracted texts');
    }
}

clearExtractedTexts(){
    try{
        this.extractedTexts=[];
        return {status:'success',message:'All extracted texts cleared successfully'};
    }
    catch(error){
        console.error('Error clearing extracted texts:',error);
        throw new Error('Failed to clear extracted texts');
    }
};
}


module.exports=new UploadService();