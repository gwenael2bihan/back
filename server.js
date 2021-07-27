const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const stripe = require('stripe')('sk_test_51JGK7hGTlphSK8w6UwFGP26FJTcvaWkf7MQc9KatEca8Me92u6wchQ3sf2RrYTONYhXrV6Byr10nPM0sURteYPRD001zwbQH25')
const dotenv = require('dotenv');
dotenv.config();

const app = express();

app.use(cors());

// parse requests of content-type - application/json
app.use(bodyParser.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

const db = require("./models");
const Role = db.role;
const dbConfig = require('./config/db.config');

db.mongoose
  .connect(`mongodb+srv://authentcluster.6yatd.mongodb.net/osteo`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    user: process.env.DB_USER,
    pass: process.env.DB_PASS
  })
  .then(() => {
    console.log("Successfully connect to MongoDB.");
    initial();
  })
  .catch(err => {
    console.error("Connection error", err);
    process.exit();
  });

function initial() {
  Role.estimatedDocumentCount((err, count) => {
    if (!err && count === 0) {
      new Role({
        name: "user"
      }).save(err => {
        if (err) {
          console.log("error", err);
        }

        console.log("added 'user' to roles collection");
      });

      new Role({
        name: "moderator"
      }).save(err => {
        if (err) {
          console.log("error", err);
        }

        console.log("added 'moderator' to roles collection");
      });

      new Role({
        name: "admin"
      }).save(err => {
        if (err) {
          console.log("error", err);
        }

        console.log("added 'admin' to roles collection");
      });
    }
  });
}
// simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to gwen application." });
});

require('./routes/auth.routes')(app);
require('./routes/user.routes')(app);

app.post('/create-checkout-session', async (req, res) => {
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [
      {
        price_data: {
          currency: 'usd',
          product_data: {
            name: 'T-shirt',
          },
          unit_amount: 2000,
        },
        quantity: 1,
      },
    ],
    mode: 'payment',
    success_url: 'https://example.com/success',
    cancel_url: 'https://example.com/cancel',
  });

  res.redirect(303, session.url);
});

app.post('/api/charge', async (req, res) => {
  const { id, amount } = req.body;
  console.log("TEST");
  const payment = await stripe.paymentIntents.create({
    amount,
    currency: 'USD',
    description: 'patate',
    payment_methode: id,
    confirm: true
  });
  console.log(payment);
  return res.status(200).json({ confirm: '1232' })
});
// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});