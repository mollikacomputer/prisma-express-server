import { Request, Response } from "express";
import app from "./app";
const PORT = process.env.port || 5000;
async function main(){
    try {
        app.listen(PORT, ()=>{
            console.log(`prisma express server is running on port ${PORT}`)
        })
    } catch (error) {
        console.error("Error starting the server :", error)
    }
}
main();