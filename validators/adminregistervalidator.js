const { check, validationResult } = require('express-validator');
const alert = require('alert');

const generateValidators = () => [
    check('username','userame must atleast 4 characters').isLength({min:4}),
    
    check('password', 'Your password must be atleast 8 characters which includes one smaller and capital Alphabet and also one number').isLength({min: 8}).matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?!.*\s)/),
    
    check('securityAnswer','Security question must be atleast 8 characters and must contain only numbers and alphabets').isLength({min: 8}).matches(/^[0-9A-Za-z\s]+$/),
    
    check('email', 'Please entet a valid email').isEmail().normalizeEmail(),
    
]

const reporter = (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        const errorMessages = errors.array();
        return alert(errorMessages[0].msg);


    }
    
    next();
}

module.exports = {
    add: [
        generateValidators(),
        reporter
    ]
};