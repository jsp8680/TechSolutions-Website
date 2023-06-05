const { Router } = require('express');
const Controller = require('../controllers/Controller');
const { requireAuth } = require('../middleware/middleware');
const router = Router();

router.get('/signup', Controller.signup_get);
router.post('/signup', Controller.signup_post);
router.get('/login', Controller.login_get);
router.post('/login', Controller.login_post);
router.get('/logout', requireAuth, Controller.logout_get);
router.get('/schedule', Controller.schedule_get);
router.post('/schedule', Controller.schedule_post);
router.get('/services', Controller.services_get);
router.get('/contact', Controller.contact_get);
router.get('/about', Controller.about_get);
router.get('/appointments', requireAuth,Controller.appointment_get);
router.get('/appointments/:id/cancel',requireAuth, Controller.cancelAppointment);
router.get('/profile',requireAuth, Controller.profile_get);
router.get('/policies', Controller.policies_get);
router.post('/delete/:id/:email',requireAuth, Controller.delete_post);
router.get('/error', Controller.error_get);




module.exports = router;