import express from 'express';
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from 'url';

import notesRoutes from "./routes/notesRoutes.js"
import { connectDB } from "./config/db.js"
import rateLimiter from './middleware/rateLimiter.js';


dotenv.config();

const app = express();
const PORT=process.env.PORT || 5001;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);



//middleware
if(process.env.NODE_ENV != "production"){
  app.use(cors({
  origin:"http://localhost:5173",
})
);
}


app.use(express.json());//this middle layer will parse JSON bodies
app.use("/api", rateLimiter);


//our simple custom middleware
// app.use((req,res,next) => {
//   console.log(`Req method is ${req.method} & Req URL is ${req.url}`);
//   next();
// });


app.use("/api/notes", notesRoutes);


if(process.env.NODE_ENV === "production" && !process.env.VERCEL){
    app.use(express.static(path.join(__dirname, "../../frontend/dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "../../frontend/dist", "index.html"));
    });
}

if (!process.env.VERCEL) {
    connectDB().then (()=> {
        app.listen(PORT, ()=>{
          console.log("Server started on PORT:",PORT);
        });
    });
} else {
    // Connect to DB but do not listen on a port for Vercel Serverless Functions
    connectDB();
}

export default app;




