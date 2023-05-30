const User = require("../models/User");
const jwt = require('jsonwebtoken');
const MongoClient = require('mongodb').MongoClient;
const url = "mongodb+srv://censedpower8:coco1234@cluster1.hupl8dz.mongodb.net/";

// handle errors
const handleErrors = (err) => {
  console.log(err.message, err.code);
  let errors = { firstname: '', lastname: '', email: '', password: '' };

  // incorrect email
  if (err.message === 'incorrect email') {
    errors.email = 'That email is not registered';
  }

  // incorrect password
  if (err.message === 'incorrect password') {
    errors.password = 'That password is incorrect';
  }

  // duplicate email error
  if (err.code === 11000) {
    errors.email = 'that email is already registered';
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
    res.status(201).json({ user: user._id });
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
    res.status(200).json({ user: user._id });
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
  res.render('about');
}

module.exports.appointments_get = (req, res) => {
  const results = {
    appointments: [
      {
        email: "discord8680@gmail.com",
        date: "2021-04-30",
        time: "10:00",
        phone: "1234567890",
        serviceType: "Computer Repair",
        description: "My computer is broken",
        status: "Scheduled"
      },
    ]
  };
  res.render('appointments', { results });

}

//   module.exports.appointments_get = (req, res) => {

//     const client = new MongoClient(url, {
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//     });

//     try {
//       // Connect to the MongoDB server
//       client.connect(function(err, db) {
//         if (err) throw err;
//         var dbo = db.db("schedule");
//         dbo.collection("appointments").find({}).toArray(function(err, result) {
//           if (err) throw err;

// // Convert the time to AM/PM format
// result.forEach(appointment => {
//   const [hour, minute] = appointment.time.split(":");
//   const date = new Date();
//   date.setHours(hour, minute);
//   appointment.time = date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
// });

//           console.log(result);
//           res.render('appointments', {result});
//           db.close();
//         });
//       });
//     } catch (error) {
//       console.error("Error occurred while inserting data:", error);
//       throw error;
//     } finally {
//       // Close the client connection
//       client.close();
//     }
//   }


module.exports.schedule_post = async (req, res) => {
  const email = req.body.email;
  const date = req.body.date;
   const time = req.body.time;
   const phone = req.body.phone;
   const serviceType = req.body.serviceType;
   const description = req.body.description;
   const status = 'Scheduled';

   console.log(req.body.email, date, time, phone, serviceType, description);

   
   const dataToInsert = {
     email: email,
     date: date,
     time: time,
     phone: phone,
     serviceType: serviceType,
     description: description,
     status: status
   };
    

   insertData(dataToInsert, 'schedule','appointments')
   .catch(error => {
     console.error('An error occurred:', error);
   }
   );
     sendEmail(req.body.email, req.body.date, req.body.time);
   res.redirect('/');
  
};


async function insertData(data, dbName, collectionName) {
  // Create a new MongoClient
  const client = new MongoClient(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  try {
    // Connect to the MongoDB server
    await client.connect();

    // Access the database
    const db = client.db(dbName);

    // Access the collection
    const collection = db.collection(collectionName);

    // Insert the data
    await collection.insertOne(data);

    console.log("Data inserted successfully!");
  } catch (error) {
    console.error("Error occurred while inserting data:", error);
    throw error;
  } finally {
    // Close the client connection
    await client.close();
  }
}

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