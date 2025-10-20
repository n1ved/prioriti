const {GoogleGenerativeAI}=require('@google/generative-ai');
const uploadService=require('./uploadService');

class ScheduleService{
    constructor(){
        this.genAI=new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        this.model=this.genAI.getGenerativeModel({model:'gemini-2.0-flash:latest'});
    }
    async generateSchedule(scheduleData){
        try{
            const pdfContent=uploadService.getExtractedTexts(scheduleData);
            const prompt=await this.generatePrompt(scheduleData,pdfContent);
            const response=await this.model.generateContent(prompt);
            console.log(response);
            return {
                status:'success',
                data:{
                    schedule:response.text(),
                    parameters:scheduleData,
                    pdfContent:pdfContent.data.length,
                    generatedAt:new Date().toISOString()
                }
            };
        }
        catch(error){
            console.error('Error generating schedule:',error);
            return {
                status:'error',
                message:'Failed to generate schedule',
                note:'Schedule generated using the fallback algorithm',
                details:error.message
            };
        }
    }

    async generatePrompt(scheduleData,pdfContent){
        const {startDate,endDate,weekdaysHours,weekendHours,specialPreferences}=scheduleData;
        return `
Create a detailed study schedule with these parameters:

**Schedule Period:** ${startDate} to ${endDate}
**Study Hours:** 
- Weekdays: ${weekdaysHours} hours per day
- Weekends: ${weekendHours} hours per day
**Special Preferences:** ${specialPreferences || 'None specified'}

**Course Materials Available:**
${pdfContent.length > 0 ? 
  pdfContent.map((content, index) => 
    `Document ${index + 1} (${content.filename}): ${content.text.substring(0, 500)}...`
  ).join('\n\n') : 
  'No course documents uploaded yet.'
}

Please create a week-by-week study schedule that:
1. Distributes topics evenly across the time period
2. Includes specific daily tasks and goals
3. Balances study time with review sessions
4. Respects the available study hours
5. Considers the special preferences
6. Incorporates content from the uploaded materials

Format the schedule as a clear weekly breakdown with daily tasks.

Example format:
**WEEK 1 (MM/DD - MM/DD)**
- Monday (X hours): Topic A - Specific tasks
- Tuesday (X hours): Topic B - Specific tasks
...

**WEEK 2 (MM/DD - MM/DD)**
...
        `;
        }
    generateFallbackSchedule(scheduleData){
        const {startDate,endDate,weekdaysHours,weekendHours,specialPreferences}=scheduleData;
        const start=new Date(startDate);
        const end=new Date(endDate);
        const schedule={};
        let current=start;
        let weekCount=1;
        return `
**Study Schedule - ${startDate} to ${endDate}**

**WEEK 1-2: Foundation Building**
- Weekdays (${weekdaysHours} hours/day): Review basic concepts and uploaded materials
- Weekends (${weekendHours} hours/day): Create comprehensive notes and summaries
- Focus: Understanding fundamentals and organizing study materials

**WEEK 3-4: Deep Learning Phase**
- Weekdays (${weekdaysHours} hours/day): Advanced topics and problem-solving
- Weekends (${weekendHours} hours/day): Practice exercises and group discussions
- Focus: Application of concepts and skill development

**WEEK 5-6: Review & Assessment**
- Weekdays (${weekdaysHours} hours/day): Comprehensive review and mock tests
- Weekends (${weekendHours} hours/day): Final preparations and weak area focus
- Focus: Test readiness and confidence building

**Daily Study Tips:**
- Start with a 10-minute review of previous day's material
- Take 5-minute breaks every 45 minutes
- End each session with a quick summary
- Use active recall and spaced repetition techniques

*This is a template schedule. For AI-powered personalized schedules, please ensure your internet connection and API configuration are working properly.*
        `;
    }

};

module.exports=new ScheduleService();