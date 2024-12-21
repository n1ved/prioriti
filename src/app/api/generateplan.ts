import { NextResponse } from 'next/server';
import { config as dotenvConfig } from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';
import pdfParse from 'pdf-parse';
import multer from 'multer';
import Cors from 'cors';

dotenvConfig({ path: '.env.local' });

// Initialize Google Gemini API
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

// Multer setup for file uploads
const multerUpload = multer({ storage: multer.memoryStorage() });

// CORS middleware setup
const corsMiddleware = Cors({
  origin: '*',
  methods: ['POST'],
});

// Utility function for running middleware
function runMiddleware(req: any, fn: any) {
  return new Promise((resolve, reject) => {
    fn(req, {}, (result: any) => {
      if (result instanceof Error) {
        return reject(result);
      }
      return resolve(result);
    });
  });
}

// Handle PDF parsing
async function parsePDF(files: any) {
  let textContent = '';
  for (const file of files) {
    const data = await pdfParse(file.buffer);
    textContent += data.text + '\n';
  }
  return textContent;
}

// Function to extract module text and teaching plan from the whole text
function extractModuleContent(text: string) {
  const moduleRegex = /Module -? ?(\d+) ?\(([^)]*)\)([\s\S]*?)(?=Module -? ?\d+|$)/g;
  const teachingPlanRegex = /Teaching Plan([\s\S]*?)(?=Module -? ?\d+|$)/g;
  const courseNameRegex = /Course Name: ?([^(\n]+)/;
  const modules: { [key: string]: { title: string; content: string } } = {};
  let match;

  // Extract modules content
  while ((match = moduleRegex.exec(text)) !== null) {
    const moduleNumber = match[1];
    const moduleTitle = match[2].trim();
    const moduleContent = match[3].trim();
    modules[`module${moduleNumber}`] = {
      title: moduleTitle,
      content: moduleContent,
    };
  }

  // Extract teaching plan
  const teachingPlanMatch = teachingPlanRegex.exec(text);
  let teachingPlan: string | null = null;
  if (teachingPlanMatch) {
    teachingPlan = teachingPlanMatch[1].trim();
  }

  // Extract course name
  const courseNameMatch = courseNameRegex.exec(text);
  let courseName: string | null = null;
  if (courseNameMatch) {
    courseName = courseNameMatch[1].trim();
  }

  return { modules, teachingPlan, courseName };
}

async function generateStudyPlan(
  modules: { [key: string]: { title: string; content: string } },
  teachingPlan: string | null,
  courseName: string | null
) {
  const prompt = `You will be provided with content from a course syllabus, specifically divided into modules and a teaching plan which contains topics and their allocated hours. Based on this information, create a detailed study plan in JSON format.

        Here are the rules for generating the study plan:
        1. The course name should be extracted from the syllabus.
        2. Extract all topics and their allocated hours from the 'Teaching Plan'.
        3. Structure the study plan with dates, subjects, and topics. Each day should contain one or more subjects, and each subject should have one or more topics.
        4. Use the teaching plan to extract the number of hours and topics.
        5. Create a study schedule by equally distributing the number of hours over 15 days of study, starting from 2024-07-10.
        6. The output MUST be a valid JSON object with the below format. Do not include any additional text.

        {
          "dates": [
            {
              "date": "YYYY-MM-DD",
              "subjects": [
                {
                  "subject_name": "Course Name",
                  "topics": [
                    {
                      "topic_name": "Topic Name",
                      "topic_time": "Number of hours"
                    }
                  ]
                }
              ]
            }
          ]
        }

        Here are the details:
        Course Name:
        ${courseName}

        Modules:
        ${JSON.stringify(modules)}

        Teaching Plan:
        ${teachingPlan}
  `;

  try {
    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    console.error('Error generating study plan:', error);
    throw new Error('Failed to generate study plan.');
  }
}

// Function to modify the study plan based on user feedback
async function modifyStudyPlan(currentPlan: any, feedback: string) {
  const prompt = `You will be provided with a current study plan and feedback from the user. Based on this information, modify the study plan accordingly. Ensure the output is a valid JSON object.

        Current Study Plan:
        ${JSON.stringify(currentPlan)}

        User Feedback:
        ${feedback}
        
        The output MUST be a valid JSON object with the below format. Do not include any additional text.

        {
          "dates": [
            {
              "date": "YYYY-MM-DD",
              "subjects": [
                {
                  "subject_name": "Course Name",
                  "topics": [
                    {
                      "topic_name": "Topic Name",
                      "topic_time": "Number of hours"
                    }
                  ]
                }
              ]
            }
          ]
        }
  `;

  try {
    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    console.error('Error modifying study plan:', error);
    throw new Error('Failed to modify study plan.');
  }
}

// API Route Handler for generating the study plan
export async function POST(req: Request) {
  try {
    await runMiddleware(req, corsMiddleware);

    const upload = multerUpload.array('pdfs', 5);
    const files: any = await new Promise((resolve, reject) => {
      upload(req as any, { res: {} } as any, (err: any) => {
        if (err) reject(err);
        else resolve((req as any).files);
      });
    });

    if (!files || files.length === 0) {
      return NextResponse.json({ error: 'No PDF files uploaded.' }, { status: 400 });
    }

    const textContent = await parsePDF(files);
    const { modules, teachingPlan, courseName } = extractModuleContent(textContent);

    const studyPlan = await generateStudyPlan(modules, teachingPlan, courseName);

    try {
      const parsedStudyPlan = JSON.parse(studyPlan);
      return NextResponse.json({ studyPlan: parsedStudyPlan }, { status: 200 });
    } catch (parseError) {
      console.error("Error parsing JSON:", parseError);
      return NextResponse.json({ error: "Failed to parse the study plan JSON output" }, { status: 500 });
    }

  } catch (error) {
    console.error('Error processing request:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

// API Route Handler for modifying the study plan
export async function modifyPlanHandler(req: Request) {
  try {
    await runMiddleware(req, corsMiddleware);

    const { currentPlan, feedback } = await req.json();

    const modifiedPlan = await modifyStudyPlan(currentPlan, feedback);

    try {
      const parsedModifiedPlan = JSON.parse(modifiedPlan);
      return NextResponse.json({ modifiedPlan: parsedModifiedPlan }, { status: 200 });
    } catch (parseError) {
      console.error("Error parsing JSON:", parseError);
      return NextResponse.json({ error: "Failed to parse the modified study plan JSON output" }, { status: 500 });
    }

  } catch (error) {
    console.error('Error processing request:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export const config = {
  api: {
    bodyParser: true,
  },
};
