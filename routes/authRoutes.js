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
router.get('/contact', Controller.contact_get);
router.get('/about', Controller.about_get);
router.get('/appointments', Controller.appointment_get);
router.get('/appointments/:id/cancel', Controller.cancelAppointment);
router.get('/appointments/:id/reschedule', Controller.rescheduleAppointment_get);
router.post('/appointments/:id/reschedule', Controller.rescheduleAppointment_post);



module.exports = router;