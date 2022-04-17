const { check, validationResult } = require('express-validator');
const alert = require('alert');

const generateValidators = () => [
    check('username','userame must have more than 4 characters').isLength({min:5}),
    
    check('password', 'Your password must be at least 5 characters').isLength({min: 4}),
    
    check('securityAnswer','question must be more than 3 characters and no numerics').isLength({min: 4}).matches(/^[A-Za-z\s]+$/),
    
    check('city', 'City is missing').not().isEmpty(),
    
    check('name','Name must be more than 4 characters and no numerics').isLength({min: 5}).matches(/^[A-Za-z\s]+$/),
    
    check('email', 'Your email is not valid').isEmail().normalizeEmail(),
    
    check('contact', 'Contact is missing').isInt().notEmpty(),
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
        alert(errorMessages[0].msg);
        return res.redirect('/user/register');

    }
    
    next();
}

module.exports = {
    add: [
        generateValidators(),
        reporter
    ]
};