const express = require('express');
const nodemailer = require('nodemailer');
const schedule = require('node-schedule');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON
app.use(express.json());

// Simulated task data (in a real setup, you'd pull this from a database or frontend)
let tasks = [
  { task: 'Task 1', time: '09:00', status: 'Pending' },
  { task: 'Task 2', time: '10:00', status: 'Completed' }
];

// Route to get tasks (in a real app, you'd have more routes to add/remove tasks)
app.get('/tasks', (req, res) => {
  res.json(tasks);
});

// Email configuration
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'your-email@gmail.com',
    pass: 'your-email-password'
  }
});

const sendEmail = () => {
  const mailOptions = {
    from: 'your-email@gmail.com',
    to: 'bijo.james@verbat.com',
    subject: 'Daily Task Report',
    text: `Here is your daily task report:\n\n${tasks.map(task => `${task.task} - ${task.time} - ${task.status}`).join('\n')}`
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
};

// Schedule email every minute
schedule.scheduleJob('*/1 * * * *', sendEmail);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
