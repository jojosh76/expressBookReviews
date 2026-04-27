const express = require('express');
const session = require('express-session');
const jwt = require('jsonwebtoken');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session({
  secret: "fingerprint_customer",
  resave: true,
  saveUninitialized: true
}));

const public_users = require('./router/general').general;
const authenticated = require('./router/auth_users').authenticated;

// Middleware JWT pour routes authentifiées
app.use("/customer/auth/*", (req, res, next) => {
  if (req.session.authorization) {
    const token = req.session.authorization.accessToken;
    jwt.verify(token, "secret_key", (err, user) => {
      if (err) return res.status(403).json({ message: "User not authenticated" });
      req.user = user;
      next();
    });
  } else {
    return res.status(403).json({ message: "User not logged in" });
  }
});

app.use("/customer", authenticated);
app.use("/", public_users);

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));