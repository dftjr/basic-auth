'use strict';

const { Users } = require('../models/Users.js');
const base64 = require('base-64');

async function basic(req, res, next) {
  let basicHeaderParts = req.headers.authorization.split(' ');
  let encodedString = basicHeaderParts.pop();  
  let decodedString = base64.decode(encodedString); 
  let [username, password] = decodedString.split(':'); 

  try {
    const user = await Users.authenticateBasic(username, password);
    if (user) {
      req.user = user;
      next();
    } else {
      next('Invalid User');
    }
  } catch (error) {
    next(error);
   }
}

module.exports = basic;