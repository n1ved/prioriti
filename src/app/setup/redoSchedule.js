import { GoogleGenerativeAI } from "@google/generative-ai";
const genAI = new GoogleGenerativeAI("AIzaSyA9Qcf_c6YETaAbttvWUCQWNKxbGlF45VQ");
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

async function redoSch(syllabus,incomplete_date,cur_date,topics,hours,cur_end){
    const prompt=[];
    prompt.push(syllabus);
    prompt.push(`on the day ${incomplete_date} the topics ${topics} was not completed , re make the rest of the schedule till ${cur_end} from the day ${cur_date} taking the incomplete topics from ${incomplete_date} into account. Each day the student has ${hours} to study. The schedule should specify the date, the course name and the topics for said day that the student should study. And for each topic there should also be a recommended time to study said topic in minutes. the schedule and allotted time should be specified based on the difficulty of the topic/course and the credit weightage of the course. All course should have about an uniform progress.Remove any of the last topics from the schedule if it cannot be completed in time.`);
    prompt.push(`[
        {
        "date": "2024-12-21",
        "courses": [
        {
        "course_name": "Course 1",
        "topics": [
        {
        "topic_name": "Introduction to Course 1",
        "time": "2 hour"
        }
        ]
        }
        ]
        }
        ]
        give  output like this with just the schedule array without any other additional text`);
    const result = await model.generateContent(prompt);
    const schedule = result.response.text();
    return schedule;
}

// console.log(await redoSch(`[
// {
// "date": "2024-12-20",
// "courses": [
// {
// "course_name": "Computer Graphics and Image Processing",
// "topics": [
// {
// "topic_name": "Basics of Computer Graphics and its applications",
// "time": "60 minutes"
// },
// {
// "topic_name": "Video Display devices",
// "time": "60 minutes"
// }
// ]
// }
// ]
// },
// {
// "date": "2024-12-21",
// "courses": [
// {
// "course_name": "Computer Graphics and Image Processing",
// "topics": [
// {
// "topic_name": "Line drawing algorithms",
// "time": "60 minutes"
// },
// {
// "topic_name": "Circle drawing algorithms",
// "time": "60 minutes"
// }
// ]
// }
// ]
// },
// {
// "date": "2024-12-22",
// "courses": [
// {
// "course_name": "Compiler Design",
// "topics": [
// {
// "topic_name": "Analysis of the source program",
// "time": "60 minutes"
// },
// {
// "topic_name": "Phases of a compiler",
// "time": "60 minutes"
// }
// ]
// }
// ]
// },
// {
// "date": "2024-12-23",
// "courses": [
// {
// "course_name": "Compiler Design",
// "topics": [
// {
// "topic_name": "Compiler writing tools",
// "time": "60 minutes"
// },
// {
// "topic_name": "Bootstrapping",
// "time": "60 minutes"
// }
// ]
// }
// ]
// },
// {
// "date": "2024-12-24",
// "courses": [
// {
// "course_name": "Programming in Python",
// "topics": [
// {
// "topic_name": "Getting started with Python programming",
// "time": "60 minutes"
// },
// {
// "topic_name": "Interactive shell, IDLE, iPython Notebooks",
// "time": "60 minutes"
// }
// ]
// }
// ]
// },
// {
// "date": "2024-12-25",
// "courses": [
// {
// "course_name": "Programming in Python",
// "topics": [
// {
// "topic_name": "Numeric data types and character sets",
// "time": "60 minutes"
// },
// {
// "topic_name": "Expressions",
// "time": "60 minutes"
// }
// ]
// }
// ]
// },
// {
// "date": "2024-12-26",
// "courses": [
// {
// "course_name": "Programming in Python",
// "topics": [
// {
// "topic_name": "Control statements",
// "time": "60 minutes"
// },
// {
// "topic_name": "Iteration with for/while loop",
// "time": "60 minutes"
// }
// ]
// }
// ]
// },
// {
// "date": "2024-12-27",
// "courses": [
// {
// "course_name": "Comprehensive Course Work",
// "topics": [
// {
// "topic_name": "Discrete Mathematical Structures - Module 1 and Module 2",
// "time": "60 minutes"
// },
// {
// "topic_name": "Data Structures - Module 1, Module 2 and Module 3",
// "time": "60 minutes"
// }
// ]
// }
// ]
// },
// {
// "date": "2024-12-28",
// "courses": [
// {
// "course_name": "Comprehensive Course Work",
// "topics": [
// {
// "topic_name": "Operating Systems - Module 1 and Module 2",
// "time": "60 minutes"
// },
// {
// "topic_name": "Computer Organization And Architecture - Module 1, Module 2 and Module 3",
// "time": "60 minutes"
// }
// ]
// }
// ]
// },
// {
// "date": "2024-12-29",
// "courses": [
// {
// "course_name": "Industrial Economics & Foreign Trade",
// "topics": [
// {
// "topic_name": "Scarcity and choice",
// "time": "60 minutes"
// },
// {
// "topic_name": "Basic economic problems",
// "time": "60 minutes"
// }
// ]
// }
// ]
// }
// ]
// `,`2024-12-22`,`2024-12-23`,`Analysis of the source program`,`2 hours`,`2024-12-30`))