const User = require("../models/User");
const jwt = require('jsonwebtoken');
const MongoClient = require('mongodb').MongoClient;
const url = "mongodb+srv://censedpower8:coco1234@cluster1.hupl8dz.mongodb.net/";

module.exports.schedule_get = (req, res) => {
    res.render('schedule');
  }
  
  module.exports.about_get = (req, res) => {
    res.render('about');
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

     if(date >= Date.now()) {
      console.log("Date is valid");
     const dataToInsert = {
       email: email,
       date: date,
       time: time,
       phone: phone,
       serviceType: serviceType,
       description: description
     };
      

     insertData(dataToInsert, 'schedule','appointments')
     .catch(error => {
       console.error('An error occurred:', error);
     }
     );
      // sendEmail(req.body.email, req.body.date, req.body.time);
     res.redirect('/');
    } else {
      console.log("Date is not valid");
      res.redirect('/schedule');
    }
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