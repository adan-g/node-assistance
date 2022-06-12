const express = require('express');
const router = express.Router();
const crud = (require('../controllers/crud'));
const signUpController = require('../controllers/signUpController');
const loginController = require('../controllers/loginController');


router.get('/', 
  loginController.userAuthenticated,
  crud.currentWeek
);

router.get('/week/:week', crud.otherWeek);


router.get('/entry', 
  loginController.userAuthenticated,
  crud.entry
)

router.get('/exit', 
  loginController.userAuthenticated,
  crud.exit
)


router.post('/saveEntry', crud.saveEntry);
router.post('/saveExit', crud.saveExit);

router.get('/signUp', signUpController.signUpForm);
router.post('/signUp', signUpController.newSignUp);
router.get('/confirm/:email', signUpController.confirmAccount)


router.get('/login', loginController.loginForm);
router.post('/login', loginController.userAuthentication);

router.get('/log-out', loginController.logOut);


router.get('/resetPassword', loginController.formResetPassword)
router.post('/resetPassword', loginController.sendToken)
router.get('/resetPassword/:token', loginController.validateToken)
router.post('/resetPassword/:token', loginController.updatePassword)


module.exports = router;