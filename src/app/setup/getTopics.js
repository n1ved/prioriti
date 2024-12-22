import { GoogleGenerativeAI } from "@google/generative-ai";
import { GoogleAIFileManager } from "@google/generative-ai/server";
import formData from "form-data";
import fs from "fs";
import axios from "axios";
import fetch from "node-fetch";

 const genAI = new GoogleGenerativeAI("AIzaSyA9Qcf_c6YETaAbttvWUCQWNKxbGlF45VQ");
 const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
// const fileManager = new GoogleAIFileManager(
//   "AIzaSyCaNoI0kmHM28npk90B0E2wNLOS2dxVz34",
// );

// async function remotePdfToPart(url, path, displayName) {
//   try {
//     // Fetch the PDF file from the remote URL
//     const pdfBuffer = await fetch(url).then((response) =>
//       response.arrayBuffer(),
//     );
//     const binaryPdf = Buffer.from(pdfBuffer);

//     // Save the file locally to the specified path
//     fs.writeFileSync(path, binaryPdf, "binary");

//     // Upload the saved file using GoogleAIFileManager
//     const uploadResult = await fileManager.uploadFile(path, {
//       mimeType: "application/pdf",
//       displayName,
//     });

//     return {
//       fileData: {
//         fileUri: uploadResult.file.uri,
//         mimeType: uploadResult.file.mimeType,
//       },
//     };
//   } catch (error) {
//     console.error(`Error in remotePdfToPart for ${displayName}:`, error);
//     throw error; // Rethrow to handle it at the caller level
//   }
// }

// const fs = require('fs');
// const fetch = require('node-fetch');  // Use node-fetch for making the request
// const FormData = require('form-data'); // Use form-data to handle multipart form data

// async function uploadPhoto(link) {
//     const form = new FormData();
    
//     // Add the file to the form
//     const filePath = '/path/to/your/photo.jpg'; // Change this to the correct file path
//     form.append('file', fs.createReadStream(filePath)); // Add file to form

//     try {
//         // Send the POST request to tmpfiles.org/api
//         const response = await fetch('https://tmpfiles.org/api', {
//             method: 'POST',
//             body: form,
//             headers: form.getHeaders() // Automatically add necessary headers
//         });

//         const result = await response.json();  // Parse the JSON response
//         console.log('Upload successful:', result);  // Log the response
//     } catch (error) {
//         console.error('Error uploading photo:', error);
//     }
// }

// const uploadFile = async (arr) => {
//   try {
//     let urls = [];
//     for (const photo of arr) {
//       const form = new formData();
//       const fileContent = fs.readFileSync(pdf); // Read PDF file
//       form.append("file", fileContent, pdf); // Attach the file to the form

//       // Upload file using Axios
//       const response = await axios.post(
//         "https://tmpfiles.org/api/v1/upload",
//         form,
//         {
//           headers: {
//             ...form.getHeaders(),
//           },
//         },
//       );

//       // Push the uploaded file's URL to the array
//       urls.push(response.data.url);
//     }

//     console.log("Files uploaded successfully.");
//     return urls;
//   } catch (error) {
//     console.error("Error while uploading:", error);
//     return [];
//   }
// };

// async function pdfToAI(arr) {
//   try {
//     const urls = await uploadFile(arr); // Upload files and get URLs
//     const prompt = [];
//     let num = 1;

//     // Process each uploaded URL
//     for (const url of urls) {
//       if (url) {
//         // Ensure URL is valid before processing
//         const part = await remotePdfToPart(
//           url,
//           `pdf${num}.pdf`,
//           `pdf${num}.pdf`,
//         );
//         if (part) {
//           prompt.push(part.fileData.fileUri); // Push the file URI to the prompt array
//         }
//         num++;
//       } else {
//         console.log("Invalid URL provided.",url);
//       }
//     }

//     // Add the final instruction to the prompt
//     prompt.push(
//       "Extract all the topics from each module in each of the courses as an array called 'syllabus'. " +
//         "Each element should be a JSON object containing 'course_name', 'credits', and 'modules' with module name, hours, and topics. " +
//         "Just return the JSON, no additional text.",
//     );

//     // Send the prompt to the model for conteant generation
//     const result = await model.generateContent({
//       prompt: prompt.join("\n"), // Properly join the prompt array into a single string
//     });

//     console.log(result.output); // Output the AI's response
//   } catch (error) {
//     console.error("Error in pdfToAI:", error);
//   }
// }


// Test the function
console.log(await up([
    "https://x0.at/V1FB.jpeg",
    "https://x0.at/JHal.jpeg",
    "https://x0.at/e2ir.jpeg",
    "https://x0.at/UPxd.jpeg"
]));


export async function up(links) {
    let images = [];
    for (const link of links) {
        const imageResp = await fetch(link)
            .then((response) => response.arrayBuffer());

        const curr = [
            {
                inlineData: {
                    data: Buffer.from(imageResp).toString("base64"),
                    mimeType: "image/jpeg",
                },
            }
        ];
        images.push(curr);
    }

    // Enhanced syllabus prompt
    const syllabusPrompt = "Create a structured syllabus based on the courses and their modules. For each course, return a JSON array where each object represents a course with the keys 'course_name' and an array of 'modules'. " +
"Each 'module' object should have the 'module_name' and an array of 'topics'. Combine related topics and reduce them where necessary to create a clear, concise list. " +
"Each 'topic' should be a general description or key concept, not directly copied from any source. " +
"The response should be in valid JSON format with no extra text or additional information, just the syllabus data."
;

    images.push(syllabusPrompt);

    // Pass the improved prompt to the model
    return (await model.generateContent(images)).response.text();
}

