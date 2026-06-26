import { prisma } from "../../lib/prisma";
import { ILogginUser } from "./auth.interface"
import bcrypt from "bcryptjs";

const loginUser= async(payload: ILogginUser)=>{
    const {email, password} = payload;
    const user = await prisma.user.findFirstOrThrow({
        where:{email}
    })
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    
    if(!isPasswordMatch){
        throw new Error("Password is incorrect");
    }
    return user;
}



export const authService = {
    loginUser
}