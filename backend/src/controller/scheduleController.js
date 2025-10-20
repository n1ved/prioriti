
const scheduleService=require('../service/scheduleService');

const generateSchedule=async(req,res,next)=>{
    try{
        const {
            startDate,endDate,weekdaysHours,weekendHours,specialPreferences}=req.body;
            if(!startDate||!endDate||!weekdaysHours||!weekendHours){
                return res.status(400).json({status:'error',message:'Missing required fields'});
            }
            
        
            //console.log('Generated Schedule:',schedule);
            const start=new Date(startDate);
            const end=new Date(endDate);
            if(end<=start){
                return res.status(400).json({status:'error',message:'End date must be after start date'});
            }
            if(weekdaysHours<0||weekendHours<0){
                return res.status(400).json({status:'error',message:'Hours must be non-negative'});
            }
            if(weekdaysHours>24||weekendHours>24){
                return res.status(400).json({status:'error',message:'Hours must be less than or equal to 24'});
            }
            // if(specialPreferences&&typeof specialPreferences!=='object'){
            //     return res.status(400).json({status:'error',message:'Special preferences must be an object'});
            // }
            console.log('Schedule generating with details:',{startDate,endDate,weekdaysHours:parseInt(weekdaysHours),weekendHours:parseInt(weekendHours),specialPreferences});
            const schedule=await scheduleService.generateSchedule({startDate,endDate,weekdaysHours,weekendHours,specialPreferences});
            if(!schedule){
                return res.status(500).json({status:'error',message:'Failed to generate schedule'});
            }
            console.log('Generated Schedule:',schedule);
            if(schedule.status==='success'){
                console.log('Generated Schedule Data:',schedule.data);
                return res.status(200).json({status:'success',data:schedule.data});
            }
            else{
                return res.status(500).json({status:'error',message:'Failed to generate schedule'});
            }
            //return res.status(200).json({status:'success',data:schedule});
        }
    catch(error){
        console.error('Error occurred while generating schedule:',error);
        return res.status(500).json({status:'error',message:'Schedule Generation Failed',details:error.message});
    }
};

// I'll get this shit done later
const getScheduleHistory = async (req,res,next){
    
};