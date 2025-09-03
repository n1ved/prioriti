const express=require('express');
const router=express.Router();
const {generateSchedule}=require('../controller/scheduleController');

router.post('/generateSchedule',generateSchedule);
module.exports=router;
