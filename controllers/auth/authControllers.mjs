import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { defaults } from "pg";
import db from "../../models/index.mjs";

const SECRET_KEY = process.env.SECRET_KEY ;

const User = db.users;

const register = async (req, res) => {
 try {
   const { username, email, password , role , profile_picture } = req.body;
   const data = {
     username,
     email,
     password: await bcrypt.hash(password, 10),
     role,
     profile_picture
   };

   const user = await User.create(data);

   if (user) {
     let token = jwt.sign({ id: user.id },SECRET_KEY, {
       expiresIn: 1 * 24 * 60 * 60 * 1000,
     });

     res.cookie("jwt", token, { maxAge: 1 * 24 * 60 * 60, httpOnly: true });
     console.log("user", JSON.stringify(user, null, 2));
     console.log(token);
     return res.status(201).send(user);
   } else {
     return res.status(409).send("Details are not correct");
   }
 } catch (error) {
   console.log(error);
 }
};

const login = async (req, res) => {
 try {
const { email, password } = req.body;

   const user = await User.findOne({
     where: {
     email: email
   } 
     
   });

   if (user) {
     const isSame = await bcrypt.compare(password, user.password);

     if (isSame) {
       let token = jwt.sign({ id: user.id,username: user.username, email: user.email, role: user.role , }, SECRET_KEY, {
        expiresIn: '1d',
        });

       res.cookie("jwt", token, { maxAge: 1 * 24 * 60 * 60, httpOnly: true });
       console.log("user", JSON.stringify(user, null, 2));
       console.log(token);
       return res.status(200).send(token);
     } else {
       return res.status(401).send("Authentication failed");
     }
   } else {
     return res.status(401).send("Authentication failed");
   }
 } catch (error) {
   console.log(error);
 }
};

export default {
 register,
 login,
};