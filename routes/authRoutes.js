const { Router } = require('express');
const Controller = require('../controllers/Controller');

const router = Router();

router.get('/signup', Controller.signup_get);
router.post('/signup', Controller.signup_post);
router.get('/login', Controller.login_get);
router.post('/login', Controller.login_post);
router.get('/logout', Controller.logout_get);
router.get('/schedule', Controller.schedule_get);
router.post('/schedule', Controller.schedule_post);


module.exports = router;