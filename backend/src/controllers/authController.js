const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const authConfig = require('../config/auth');

const User = require('../models/User');


const router = express.Router();

function generateToken(params = {}){
    return jwt.sign(params, authConfig.secret, {
        expiresIn:86400,
    });
}

router.post('/register', async(req, res) =>{
    const { email } = req.body;
    try{
        
        if(await User.findOne({ email }))
            return res.status(400).send({ error: 'User already exists'});

        const user = await User.create(req.body);

        user.senha = undefined;
        return res.send({ user, token: generateToken({id: user.id, nome: user.nome, 
            sobrenome: user.sobrenome, cidade: user.cidade, estado: user.estado, fotoUrl: user.fotoUrl }) });
    }
    catch(error){
        return res.status(400).send({ error: 'Registration failed'});
    }
});


router.post('/login', async(req, res)=>{
    const { email, senha } = req.body;
   
    
    const user = await User.findOne({ email }).select('+senha');
    ;
    

    if(!user)
        return res.status(400).send({ error: 'User not found'});

    

    if(!await bcrypt.compare(senha, user.senha))
        return res.status(400).send({ error: 'Invalid password'});

    user.senha = undefined;
    user.email = undefined;

    res.send({ user, token: generateToken({id: user.id, nome: user.nome, 
        sobrenome: user.sobrenome, cidade: user.cidade, estado: user.estado, fotoUrl: user.fotoUrl
     }) });
});

module.exports = app => app.use('/auth', router);