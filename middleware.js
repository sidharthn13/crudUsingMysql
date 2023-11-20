
const{body,param,validationResult} = require("express-validator")
const validateInput  = [
body().custom((payload,{req})=>{
    const keys = Object.keys(payload)
    if (keys.length!=2){throw new Error("Input should have exactly 2 key value pairs");}
    if (!payload.name) {
        throw new Error("There must be a name key");
      }
      if (!payload.age) {
        throw new Error('There must be an age key');
      }
      return true
}).bail(),
body().custom((payload, { req }) => {
    const nameRegex = /^[a-zA-Z\s]+$/;
    if (!nameRegex.test(payload.name)) {
      throw new Error("Invalid name format");
    }
    return true;
  }).bail(),
body().custom((payload, { req }) => typeof payload.age === 'number')
  .withMessage('Age must be strictly a number'),
  
(req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
]
module.exports = {validateInput}