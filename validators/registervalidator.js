const { check, validationResult } = require('express-validator');
const alert = require('alert');

const generateValidators = () => [
    check('username','userame must atleast 4 characters').isLength({min:4}),
    
    check('password', 'Your password must be atleast 8 characters which includes one smaller and capital Alphabet and also one number').isLength({min: 8}).matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?!.*\s)/),
    
    check('securityAnswer','Security question must atleast 8 characters and must contain only numbers and alphabets').isLength({min: 8}).matches(/^[0-9A-Za-z\s]+$/),
    
    check('name','Name must be atleast 5 characters with no numerics and can include spaces and "."').isLength({min: 5}).matches(/^[A-Za-z\.\s]+$/),
    
    check('email', 'Please entet a valid email').isEmail().normalizeEmail(),
    
    check('contact', 'Enter valid phone number with 10 digits and starts with 6|7|8|9').isLength({min:10,max:10}).matches(/[6789][0-9]{9}/),

    check('city', 'City is missing').notEmpty(),
]

const reporter = (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        // const errorMessages = errors.array().map(error => error.msg);
        const errorMessages = errors.array();
        // const alertMsg= errors.array({ onlyFirstError: true });
        // alert(alertMsg);        
        // return res.status(400).json({
        //     errors: errorMessages
        // });
        // console.log(errorMessages[0].msg);
        return alert(errorMessages[0].msg);
        // return res.redirect('/user/register');

    }
    
    next();
}

module.exports = {
    add: [
        generateValidators(),
        reporter
    ]
};