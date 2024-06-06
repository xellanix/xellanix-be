var Users = require("../models/userModel");
var bcrypt = require ("bcrypt");
var jwt = require ("jsonwebtoken");
var dotenv = require ("dotenv");


const getUsers = async(req, res) => {
    try {
        const users = await Users.findAll({
            attributes:['user_id','username','email']
        });
        res.json(users);
    } catch (error) {
        console.log(error);
    }
}
module.exports = getUsers;


const Register = async(req, res) => {
    const {name, email, password, confPassword} = req.body;
    if(password !== confPassword) return res.status(400).json({msg: "Password dan Confirm Password tidak cocok"});
    const salt = await bcrypt.genSalt();
    const hashPassword = await bcrypt.hash(password, salt);
    try {
        await Users.create({
        username: name,
        email: email,
        password: hashPassword,
        user_photo: "",
        access_id: 1
    });
    res.json({msg: "Register Berhasil"})
    } catch (error) {
        console.log(error);
    }
}
module.exports = Register;

const Login = async(req,res) => {
    try {
        const user = await Users.findAll({
            where:{
                email: req.body.email
            }
        });
        const match = await bcrypt.compare(req.body.password, user[0].password);
        if(!match) return res.status(400).json({msg: "Wrong Password"});
        const userId = user[0].user_id;
        const name = user[0].username;
        const email = user[0].email;
        const accessToken = jwt.sign({userId, name, email}, process.env.ACCESS_TOKEN_SECRET,{
            expiresIn: '20s'
        });
        const refreshToken = jwt.sign({userId, name, email}, process.env.REFRESH_TOKEN_SECRET,{
            expiresIn: '1d'
        });
        await Users.update({refresh_token: refreshToken},{
            where:{
                user_id: userId
            }
    });
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000
        });
        res.json({accessToken})
    } catch (error) {
        res.status(404).json({msg:"Email tidak ditemukan"});
    }
}
module.exports = Login;