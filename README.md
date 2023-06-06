# TechSolutions-Website-V1.3.1

The TechSolutions Website is for a Project 

The TechSolutions Website has a login/signup functionality and a an appointment booking functionality

To get started
You will need to have a IDE installed on your system some options are Visual Studio Code, Atom, and WebStorm

Go here to download VS Code: https://code.visualstudio.com.

Go to the terminal you can find it on the top navigation bar labeled Terminal and select the first option labeled
"New Terminal" or "CTRL+Alt+T" to open the new terminal.

Now follow the following instructions:

You will need to have Node.js installed on your system use the following command to see if it is installed
node -v

Example:
v18.7.0

If that doesn't work follow these steps:

1. Visit the official Node.js website at https://nodejs.org.

2. On the homepage, you will find the "Downloads" section. Click on the appropriate download button for your operating system.

3. Follow the installation instructions specific to your operating system. The installer will include npm as part of the Node.js installation process.

4. Once the installation is complete, you can repeat the steps mentioned above to check if node is installed.


You will have to have npm installed use the following command to check if it is installed 
npm --v

In my case 9.6.0 is the current version

If not go back up and follow how to download Node.js

Following the previous steps above you must now initialize a new project using

npm init or npm init -y

So in this case npm init -y should be the command used.

Then you have to install the dependencies

You can use this to install dependencies:

 npm install @sendgrid/mail bcrypt body-parser cookie-parser ejs express jsonwebtoken mongodb mongoose session validator

Then you have to run the program with the following command:

node app.js or node app

It will log out the following:
Server is running on port 3000 http://localhost:3000/

You can use the link to go to http://localhost:3000/ or use a browser and put in http://localhost:3000/


You should be able to now access the website.

The home page will show a navigation bar with the following book an appointment, about us, services, login and sign up links. 

Clicking the sign up link shows a form with a first name, last name, email and password fields.

Then it will redirect you to the home page.

You will be able to book appointments.
You can also access booked appointments, logout and  access your profile with the ability to delete your account when you click the profile icon in the navigation bar. 

If you attempt to access any of the routes that are dependent on you being logged in you will be redirected to the login page.

There is a app.test.js file that test some of the routes.
Had trouble creating some tests before submitting the project and ran out of time so I just left the one I did do.

I used jest to test the routes.
I installed it as a dev dependency npm i jest --save-dev
as well as super-test npm i supertest --save-dev
