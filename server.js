const express = require('express');
const simpleGit = require('simple-git');
const nodemailer = require('nodemailer');

const app = express();
const git = simpleGit();
app.use(express.json());

const EMAIL = 'your-email@example.com'; // The email you want to send data to

// Endpoint to save task data and push to Git
app.post('/save-task', async (req, res) => {
    const { task, time, status } = req.body;

    // Save task data in a file or database
    const taskData = `Task: ${task}, Time: ${time}, Status: ${status}\n`;

    try {
        // Save to a local file (example: tasks.txt)
        require('fs').appendFileSync('tasks.txt', taskData);

        // Commit the changes to the Git repo
        await git.add('./tasks.txt');
        await git.commit('Added new task');
        await git.push('origin', 'main');  // Assuming you have a remote repo set up

        // Send email notification
        sendEmailNotification(task, time, status);

        res.status(200).json({ message: 'Task saved and email sent!' });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Failed to save task or send email' });
    }
});

// Email notification function
function sendEmailNotification(task, time, status) {
    const transporter = nodemailer.createTransport({
        service: 'gmail', // or use another email provider
        auth: {
            user: 'your-email@example.com',
            pass: 'your-email-password',  // or use OAuth2 for security
        },
    });

    const mailOptions = {
        from: 'your-email@example.com',
        to: EMAIL,
        subject: 'New Task Added',
        text: `Task: ${task}\nTime: ${time}\nStatus: ${status}`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log('Error sending email:', error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
}

app.listen(3000, () => {
    console.log('Server running on port 3000');
});
