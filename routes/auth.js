const Auth = require('../model/auth')
const express = require('express')
const mongoose = require('mongoose')

const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const jwtMiddleware = require('../middleware/jwtMiddlewere');


router.post( '/',  async (req, res)  => {
    try{

        


        const{name, password,  email, role} = req.body
        const salt = await bcrypt.genSalt(10)
        const hashPass = await bcrypt.hash(password, salt);

        const existingUser = await Auth.findOne({ email });
        if (existingUser) {
            return res.status(400).send({ message: 'Bu email bilan foydalanuvchi allaqachon mavjud.' });
        }


        const newUser = new Auth({
            name ,
            email,
            password: hashPass,
            role,
        })

        await newUser.save()

        const token = jwt.sign(
            {userId: newUser._id,  neme: newUser.name},
            'mirobid',
            {expiresIn: '36h'}
        )

        res.json({token} )
    }catch(e){
        console.error(e);
        res.status(500).json({ message: 'xatolik' });
    }
})


router.get("/", async (req, res) => {
    try {
        const allUsers = await Auth.find(); 
        res.json(allUsers);  
    } catch (error) {
        console.error("Xato:", error);
        res.status(500).json({ message: 'Server xatosi', error: error.message });
    }
});



router.put("/update", jwtMiddleware, async(req, res) =>{

    const {name, email, password, role} = req.body
    const id = req.user.userId

    try{
        const updateData = {
            name,
            email,
            role,
          };
      

        if (password) {
            const salt = await bcrypt.genSalt(10);
            updateData.password = await bcrypt.hash(password, salt);
        }

        const updateUser = await Auth.findByIdAndUpdate(id, updateData, {new: true})


        if (!updateUser) {
            return res.status(404).send({ message: 'Foydalanuvchi topilmadi.' });
          }
      
        res.json({ message: 'yengilandi', user: updateUser });
        
    } catch(e){
        console.log(e);
        
        res.send('user yangilanmadi')
    }
})


router.delete( "/delete", jwtMiddleware, async(req, res) =>{
    const id = req.user.userId

    try{
        const deleteUser = await Auth.findByIdAndDelete(id)
        res.send("user yoq qilindi")
    }catch{
        res.send("ochirishda qandaydir xatolik bor")
    }
})



router.post('/login', async(req, res) => {
   

    try{
        const {email, password} = req.body
        const user = await  Auth.findOne({email})
        if (!user) {
            return res.status(404).json({ message: "user topilmadi" });
        }


        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
          return res.status(400).json({ message: "parol xato" });
        }

        const token = jwt.sign(
            { userId: user._id, name: user.name, role: user.role },
            "mirobid", 
            { expiresIn: "36h" } 
          );

        res.json({
            token,
            user: {
                name: user.name,
                email: user.email,
                role: user.role
              }
        })

    }catch(e){
        console.log(e);
        res.status(500).json({ message: "Server xatosi" });
        
    }

})





module.exports = router;

