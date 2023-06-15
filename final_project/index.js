const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session')
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();

app.use(express.json());
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use("/customer",session({secret:"fingerprint_customer",resave: true, saveUninitialized: true}))

app.use("/customer/auth/*", function auth(req,res,next){
    const authorizationHeader = req.headers.authorization;

  if (!authorizationHeader || !authorizationHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const accessToken = authorizationHeader.split(" ")[1];

  if (!accessToken) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    // Verify the access token using your chosen method (e.g., JWT verification)
    // If the token is valid, proceed to the next middleware or route handler
    // Otherwise, throw an error to be caught by the error handling middleware
    // You can use a JWT library like jsonwebtoken to verify the token
    const decodedToken = jwt.verify(accessToken, 'access');
    next();
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized" });
  }

});
 
const PORT =5000;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT,()=>console.log("Server is running"));
