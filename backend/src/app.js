const express=require('express');
const app=express();

require('dotenv').config();

const cors=require('cors');
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// const middleware=require('./middleware/authMiddleware');
// app.use(middleware);

//uploading api
const uploadRoutes=require('./routes/upload');
app.use('/api/upload', uploadRoutes);

//scheduling stuff api
const scheduleRoutes=require('./routes/schedule');
app.use('/api', scheduleRoutes);

app.get('/health', (req, res) => {
    try {
        console.log('Backend health check requested');
        res.status(200).json({
            status: 'ok',
            message: `Backend is running on ${process.env.BACKEND_URL || 'http://localhost:5000'}`,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error('Health check error:', error);
        res.status(500).json({ status: 'error', message: 'Internal Server Error' });
    }
});

app.use((err,req,res,next)=>{
    console.error(err.stack);
    if(err.code === 'LIMIT_FILE_SIZE'){
        return res.status(400).json({ status: 'error', message: 'File size is too large' });
    }
    if(err.code === 'FILE_TYPE_NOT_ALLOWED'){
        return res.status(400).json({ status: 'error', message: 'File type is not allowed' });
    }
    res.status(500).json({ status: 'error', message: 'Something went wrong' });

})

module.exports = app;
