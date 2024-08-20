const jwt = require("jsonwebtoken");
const express = require("express");
const router = express.Router();
const jwksRsa = require("jwks-rsa");
const User = require("../models/userModel");

function getKey(header, callback) {
  client.getSigningKey(header.kid, function (err, key) {
    const signingKey = key.getPublicKey(); // Extract the actual public key
    callback(null, signingKey);
  });
}

const client = jwksRsa({
  jwksUri: process.env.jwksUrl,
});

function verifyToken(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ message: "Authorization header missing or malformed" });
  }

  const token = authHeader.split(" ")[1];

  jwt.verify(token, getKey, { algorithms: ["RS256"] }, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Invalid or expired token" });
    }

    req.user = decoded;
    next();
  });
}

router.post("/api/users",  async (req, res) => {
    console.log(req.body);
  const { auth0_id, email, name } = req.body;

  try {
    let user = await User.findOne({ auth0_id });

    if (!user) {
      user = new User({ auth0_id, email, name });
      await user.save();
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
