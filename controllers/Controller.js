const User = require("../models/User");
const Appointment = require("../models/Appointment");
const jwt = require('jsonwebtoken');
const MongoClient = require('mongodb').MongoClient;
const url = "mongodb+srv://censedpower8:coco1234@cluster1.hupl8dz.mongodb.net/";

// handle errors

const handleErrorsForAppointments = (err) => {
  console.log(err.message, err.code);
  let errors = {date: '', time: '', phone: '', serviceType: '', description: '' };

   // Check if date is in the future
   if (err.message.includes('date must be in the future')) {
    errors.date = 'Date must be in the future';
  }

//
// Check if the provided date is on a weekend (Saturday or Sunday)
if (err.message.includes('Appointments cannot be scheduled on weekends')) {
  errors.date = 'Appointments cannot be scheduled on weekends';
}
  // Check if description data is greater than a certain length
  if(err.message.includes('description must be less than 100 characters')){

    errors.description = 'Description must be less than 100 characters';
  }

  // Check if description data is shorter than a certain length
  if(err.message.includes('description must be more than 10 characters')){
    errors.description = 'Description must be more than 10 characters';
  }
  // incorrect phone
  if (err.message === 'incorrect phone') {
    errors.phone = 'Invalid phone number';
  }

  
  // validation errors
  if (err.message.includes('appointments validation failed')) {
    Object.values(err.errors).forEach(({ properties }) => {
      errors[properties.path] = properties.message;
    });
  }
  
  return errors;
};

const handleErrors = (err) => {
  console.log(err.message, err.code);
  let errors = { firstname: '', lastname: '', email: '', password: '' };

  

  // incorrect email
  if (err.message === 'incorrect email') {
    errors.email = 'Invalid email';
  }

  // incorrect password
  if (err.message === 'incorrect password') {
    errors.password = 'That password is incorrect';
  }

  // duplicate email error
  if (err.code === 11000) {
    errors.email = 'That email is already registered';
    return errors;
  }

  // validation errors
  if (err.message.includes('user validation failed')) {
    // console.log(err);
    Object.values(err.errors).forEach(({ properties }) => {
      // console.log(val);
      // console.log(properties);
      errors[properties.path] = properties.message;
    });
  }
  
  
  return errors;
}

// create json web token
const maxAge = 3 * 24 * 60 * 60;
const createToken = (id) => {
  return jwt.sign({ id }, 'net ninja secret', {
    expiresIn: maxAge
  });
};

// controller actions
module.exports.signup_get = (req, res) => {
  res.render('signup');
}

module.exports.login_get = (req, res) => {
  res.render('login');
}

module.exports.signup_post = async (req, res) => {
  const { firstname, lastname, email, password } = req.body;

  try {
    const user = await User.create({firstname,lastname, email, password });
    const token = createToken(user._id);
    res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
    res.status(201).json({ user: user._id, email: user.email });
  }
  catch(err) {
    const errors = handleErrors(err);
    res.status(400).json({ errors });
  }
 
}

module.exports.login_post = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.login(email, password);
    const token = createToken(user._id);
    res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
    res.status(200).json({ user: user._id, email: user.email });
  } 
  catch (err) {
    const errors = handleErrors(err);
    res.status(400).json({ errors });
  }

}

module.exports.logout_get = (req, res) => {
  res.cookie('jwt', '', { maxAge: 1 });
  res.redirect('/');
}

module.exports.contact_get = (req, res) => {
  res.render('contact');
}

module.exports.about_get = (req, res) => {
  res.render('about');
}

module.exports.schedule_get = (req, res) => {
  
  res.render('schedule');
}

module.exports.about_get = (req, res) => {
  
   // Check if the user property exists
console.log(res.locals.user.email); // Check if the email property exists
  res.render('about');
}


module.exports.cancelAppointment = (req, res) => {
  const appointmentId = req.params.id;

  // Update the appointment status to "canceled" in the database
  Appointment.findByIdAndDelete(appointmentId, { status: 'Canceled' })
    .then(() => {
      res.redirect('/appointments');
    })
    .catch(err => {
      console.log(err);
      res.render('error'); // Render an error page or handle the error appropriately
    });
};

module.exports.rescheduleAppointment_get = (req, res) => {
  const appointmentId = req.params.id;

  // Implement the logic to reschedule the appointment
  Appointment.findById(appointmentId)
    .then(appointment => {
      if (!appointment) {
        // Handle case where appointment is not found
        res.render('error', { message: 'Appointment not found' });
      } else {
        // Render the reschedule form with the appointment data
        res.render('reschedule', { appointment });
      }
    })
    .catch(err => {
      // Handle error while fetching the appointment
      console.log(err);
      res.render('error', { message: 'Error fetching appointment' });
    });
};

// Handle the form submission for rescheduling
module.exports.rescheduleAppointment_post = (req, res) => {
  const appointmentId = req.params.id;
  const { date, time } = req.body;

  // Update the existing appointment with the new date and time
  Appointment.findByIdAndUpdate(appointmentId, { date, time })
    .then(() => {
      // Redirect to the appointments page after successful rescheduling
      res.redirect('/appointments');
    })
    .catch(err => {
      // Handle error while updating the appointment
      console.log(err);
      res.render('error', { message: 'Error rescheduling appointment' });
    });
};


  module.exports.appointment_get = (req, res) => {
    const userEmail = res.locals.user.email; // Assuming you have user authentication and the email is available in res.locals.user.email
    console.log(res.locals.user.email); // Check if the email property exists
    Appointment.find({ email: userEmail, status: 'Scheduled' })
      .then(appointments => {
        // Convert the time to AM/PM format
        appointments.forEach(appointment => {
          const [hour, minute] = appointment.time.split(":");
          const date = new Date();
          date.setHours(hour, minute);
          appointment.time = date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
        });
  
        res.render('appointments', { appointments }); // Pass appointments as a local variable to the template
      })
      .catch(err => {
        console.log(err);
        res.render('error'); // Render an error page or handle the error appropriately
      });
  }
  



  


// module.exports.appointments_get = (req, res) => {
//   const userEmail = req.user.email; // Assuming you have user authentication and the email is available in req.user.email

//   Appointment.find({ email: userEmail })
//     .then(appointments => {
//       // Convert the time to AM/PM format
//       appointments.forEach(appointment => {
//         const [hour, minute] = appointment.time.split(":");
//         const date = new Date();
//         date.setHours(hour, minute);
//         appointment.time = date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
//       });

//       res.render('appointments', { appointments });
//     })
//     .catch(err => {
//       console.log(err);
//       res.render('error'); // Render an error page or handle the error appropriately
//     });
// }



module.exports.schedule_post = (req, res) => {
  const { email, date, time, phone, serviceType, description } = req.body;


   // Check if the provided date is in the past
   if (new Date(date) < new Date()) {
    const errors = handleErrorsForAppointments({ message: 'date must be in the future' });
    res.status(400).json({ errors });
    return;
  }
  // Check if the provided date is on a weekend (Saturday or Sunday)
  const appointmentDate = new Date(date);
  const dayOfWeek = appointmentDate.getDay();
  console.log(dayOfWeek); 
  if(dayOfWeek === 0 || dayOfWeek === 5 || dayOfWeek === 6){
    const errors = handleErrorsForAppointments({ message: 'Appointments cannot be scheduled on weekends' });
    res.status(400).json({ errors });
    return;
  }

//check if description data is greater than a certain length
if (description.length > 100) {
  const errors = handleErrorsForAppointments({ message: 'description must be less than 100 characters' });
  res.status(400).json({ errors });
  return;
}
//check if description data is shorter than a certain length
if (description.length < 10) {
  const errors = handleErrorsForAppointments({ message: 'description must be more than 10 characters' });
  res.status(400).json({ errors });
  return;
}
  

  // Create a new appointment instance
  const newAppointment = new Appointment({
    email,
    date,
    time,
    phone,
    serviceType,
    description,
    status: 'Scheduled', // Set initial status as 'Scheduled'
  });

  // Save the new appointment to the database
  newAppointment.save()
    .then(savedAppointment => {
      console.log('Appointment saved successfully!');
      
      sendEmail(email, date, time);
       // Redirect to appointments page after successful scheduling
      // Send the appointment data back in the response
    res.status(200).json({ appointment: savedAppointment });
    })
    .catch(err => {
      const errors = handleErrorsForAppointments(err);
      res.status(400).json({ errors });// Redirect to schedule page with an error message
    });
};




const sgMail = require('@sendgrid/mail')
const API_KEY = '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'
sgMail.setApiKey(API_KEY)
function sendEmail(email,date, time){
const msg = {
  to: email, // Change to your recipient
  from: 'swagnum02@gmail.com', // Change to your verified sender
  subject: 'Appointment Confirmation',
  text: 'dd',
  html: `<h1>Appointment Confirmation</h1>
  <p>Thank you for scheduling an appointment with us. Your appointment is scheduled for ${date} at ${time}. We will contact you if there are any changes. We look forward to seeing you!</p>
    <p>Thank you,</p>
    <p>TechSolutions</p>
    <p><a href="http://localhost:3000/reschedule">Reschedule</a></p>
    <p><a href="http://localhost:3000/cancel">Cancel</a></p>
    <p>For any questions or concerns, please contact us at 1-800-555-5555</p>`
};

sgMail
  .send(msg)
  .then(() => {
    console.log('Email sent')
  })
  .catch((error) => {
    console.error(error)
  })
}