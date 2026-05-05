import bcrypt from "bcrypt"
import UserService from "../users/user.service.js";
import { User } from "../users/users.js";
import generateToken from "./jwt.js";

export class AuthService{

    async register(name:string,email:string,password:string, role:string = "user"){ // ← agregado role con default
        if(!email || !password){
            throw new Error("Email y contraseña son requeridos");
        }
        const passwordHash = await bcrypt.hash(password,10)
        const userService = new UserService();
        const user = await userService.createUser({
            name:name,
            email:email,
            password:passwordHash,
            role: role // ← agregado role
        });
        return user;
    }

    async login(email:string,password:string){
         if(!email || !password){
            throw new Error("Email y contraseña son requeridos");
        }
        const user:any = await User.findOne({email:email});

        if(!user){
            throw new Error("Usuario no encontrado");
        }

        const comparePassword = await bcrypt.compare(password,user.password)
        if(!comparePassword){
            throw new Error("Contraseña incorrecta");
        }

        const token = generateToken(
            {
                id:user._id,
                email:user.email,
                role:user.role // ← agregado role en el token
            }
        )

        return {
            accessToken:token,
            user:user
        }
    }
    
}