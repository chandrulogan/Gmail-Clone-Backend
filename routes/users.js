const express = require('express');
const router = express.Router();
const nodemailer = require("nodemailer");
const { MongoClient } = require('mongodb');
const { ObjectId } = require('mongodb');
const { dbdUrl, dbdName } = require('../dbConfig');
const mongoose = require('mongoose');
const userSchema = require('../dataSchema');

const usersModel = mongoose.model('users', userSchema);

router.post('/sendmail', async (req, res) => {
  try {
    const { to, subject, text } = req.body;

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: 'chandrufsdtesting@gmail.com',
        pass: 'owwqomsbknsqowye'
      }
    });

    async function main() {
      // send mail with defined transport object
      const info = await transporter.sendMail({
        from: '"Fred Foo 👻" <chandrufsdtesting@gmail.com>',
        to: to,
        subject: subject,
        text: text,
      });

      console.log("Message sent: %s", info.messageId);

      // Insert the sent mail into the "Mails" collection
      const client = await MongoClient.connect(dbdUrl, { useUnifiedTopology: true });
      const db = client.db(dbdName);

      const mail = {
        from: info.envelope.from,
        to: info.envelope.to,
        subject: info.envelope.subject,
        text: info.envelope.text,
        html: info.envelope.html,
        sentAt: new Date()
      };

      const result = await db.collection('Mails').insertOne(mail);
      console.log("Sent mail inserted into MongoDB. Inserted ID:", result.insertedId);

      // Close the MongoDB connection
      client.close();
    }

    await main();

    res.send("Mail sent and inserted into MongoDB.");
  } catch (error) {
    console.log('====================================');
    console.log(error);
    console.log('====================================');
    res.status(500).send("An error occurred.");
  }
});

router.get('/mails', async (req, res) => {
  try {
    // Connect to the MongoDB database
    const client = await MongoClient.connect(dbdUrl, { useUnifiedTopology: true });
    const db = client.db(dbdName);

    // Fetch all the mails from the "Mails" collection
    const mails = await db.collection('Mails').find().toArray();

    // Close the MongoDB connection
    client.close();

    res.json(mails);
  } catch (error) {
    console.log('====================================');
    console.log(error);
    console.log('====================================');
    res.status(500).send("An error occurred.");
  }
});

// DELETE route to delete a specific email by ID
router.delete('/mails/:id', async (req, res) => {
  try {
    const mailId = req.params.id;

    // Check if the provided mailId is a valid ObjectId
    if (!ObjectId.isValid(mailId)) {
      return res.status(400).send('Invalid mail ID');
    }

    // Connect to the MongoDB database
    const client = await MongoClient.connect(dbdUrl, { useUnifiedTopology: true });
    const db = client.db(dbdName);

    // Delete the mail with the given ObjectId
    const result = await db.collection('Mails').deleteOne({ _id: new ObjectId(mailId) });

    // Close the MongoDB connection
    client.close();

    if (result.deletedCount === 1) {
      return res.send('Mail deleted successfully.');
    } else {
      return res.status(404).send('Mail not found.');
    }
  } catch (error) {
    console.log('====================================');
    console.log(error);
    console.log('====================================');
    res.status(500).send("An error occurred.");
  }
});

module.exports = router;
