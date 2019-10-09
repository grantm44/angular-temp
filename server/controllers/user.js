const User = require('../models/user');
const {normalizeErrors} = require('../helpers/mongoose');
const jwt = require('jsonwebtoken');
const config = require('../config/dev');

exports.auth = function(req, res){
    const {email, password} = req.body;

    if(!password || !email){
        return res.status(422).send({errors:[{title: 'Data missing', detail: 'Could not register user, provide email and password'}]});
    }
    User.findOne({email}, function(err, user){
        if(err){
            return res.status(422).send({errors: MongooseHelpers.normalizeErrors(err.errors)});
        }
        if(!user){
            res.status(422).send({errors:[{title: 'Invalid user', detail: 'No user found'}]});
        }

        if(user.isSamePassword(password)){

            const token = jwt.sign({
                userId: user.id,
                username: user.username
            }, config.SECRET, {expiresIn: '1h'});
            //return jwt token
            return res.json(token);
        }else{
            res.status(422).send({errors:[{title: 'Invalid data', detail: 'Incorrect email or password'}]});
        }
    })
}

exports.register = function(req, res){

    const {username, email, password, passwordConfirmation} = req.body;
    if(!username || !email){
        return res.status(422).send({errors:[{title: 'Data missing', detail: 'Could not register user'}]});
    }
    if(password != passwordConfirmation){
        return res.status(422).send({errors:[{title: 'Password error', detail: 'Passwords do not match'}]});
    }

    User.findOne({email}, function(err, userFound) {
        if(err){
            return res.status(422).send({errors: normalizeErrors(err.errors)});
        }
        if(userFound){
           return res.status(422).send({errors:[{title: 'Invalid email', detail: 'User with this email already exists'}]});
        }
        

        const user = new User({
            username,
            email,
            password
        });
        user.save(function(err) {
            if(err){
               return res.status(422).send({errors: normalizeErrors(err.errors)});
            }

            return res.json({'register': true});
        })
    })
}

exports.authMiddleware = function(req, res, next){
        const token = req.headers.authorization;
        if(token){
            const user = parseToken(token);
            User.findById(user.userId, function(err, user){
                if(err){
                    return res.status(422).send({errors: MongooseHelpers.normalizeErrors(err.errors)});
                }
                if(user){
                    res.locals.user = user;
                    next();
                }else{
                    return notAuthorized(res);
                }
            }) 
        }else{
            return notAuthorized(res);
        }
}

function parseToken(token){
    return jwt.verify(token.split(' ')[1], config.SECRET);
}

function notAuthorized(res){
    return res.status(422).send({errors:[{title: 'Unauthorized', detail: 'Need to login to get access'}]});
}