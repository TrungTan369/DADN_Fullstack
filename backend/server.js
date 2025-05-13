const express = require('express');
const cors = require('cors');
const socketIo = require('socket.io');
const http = require('http');
require('dotenv').config();


const connectMongoDB = require('./db/connectDB');
const PORT = process.env.PORT || 5000;
const deviceRoutes = require("./routes/deviceRoutes");
const sensorRoutes = require("./routes/sensorRoutes");
const authRoutes = require("./routes/authRoutes");
const scheduleRoutes = require("./routes/scheduleRoutes");
// const handleSchedule_ = require('./utils/handleSchedule');
const startScheduleLoop = require('./utils/handleSchedule');
// Cấu hình CORS
const app = express();
const server = http.createServer(app);
app.use(
    cors({
      origin: "*",
      methods: ["GET", "POST", "DELETE", "PUT"],
      allowedHeaders: ["Content-Type", "Authorization"],
    })
  );
app.use(express.json({ limit: "5mb" }));    // chống ddos

// Middleware xử lý lỗi
app.use((err, req, res, next) => {  
    console.error(err);
    res.status(500).json({
        success: false,
        error: 'Something went wrong'
    });
});
// handleSchedule_();
// Routes xử lý request
app.use("/api/devices", deviceRoutes);
app.use("/api/sensors", sensorRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/schedules", scheduleRoutes);


const io = socketIo(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
        allowedHeaders: ["Content-Type", "Authorization"],
    }
});

startScheduleLoop(io);

io.on('connection', (socket) => {
    console.log('A user connected', socket.id);
    socket.on('disconnect', () => {
        console.log('A user disconnected', socket.id);
    });
});

//lưu socket io vào app bằng tên socketio
app.set('socketio', io);


// Khởi động server
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    connectMongoDB();
});
