const {body,validationResult}=require("express-validator")
const validateUserData = [
    body().custom((payload)=>{
        const keys = Object.keys(payload).length;
        if(keys!=3){throw new Error("invalid data")}
        if(!payload.userName){throw new Error("no userName data present in payload")}
        if(!payload.email){throw new Error("no email data present in payload")}
        if(!payload.password){throw new Error("no password data present in payload")}
        return true;
    }).bail(),
    
    body()
    .custom((payload, { req }) => {
      const gmailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
      if (!gmailRegex.test(payload.email)) {
        throw new Error("Invalid Email format");
      }
      return true;
    }),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(400).json({ errors: errors.array() });
        }
        next();
      },
]
module.exports = {validateUserData};