import { RequestHandler } from "express";
import jwt from "jsonwebtoken";
import { COOKIE_NAME } from "./constants.js";

// Function to create a JWT token with the given payload and expiration
export const createToken = (id: string, email: string, expiresIn: string) => {
  const payload = { id, email };
  const token = jwt.sign(payload, process.env.JWT_SECRET as string, {
    expiresIn,
  });
  return token;
};

// Interface for decoded token payload
interface DecodedToken {
  id: string;
  email: string;
  iat?: number; // issued at
  exp?: number; // expiration time
}

// Middleware to verify the JWT token
export const verifyToken: RequestHandler = async (req, res, next) => {
  const token = req.signedCookies[COOKIE_NAME];

  // Log the token for debugging purposes
  console.log("Token received:", token);

  if (!token || token.trim() === "") {
    console.error("Token not received");
    res.status(401).json({ message: "Token Not Received" });
    return; // End early to prevent further execution
  }

  jwt.verify(
    token,
    process.env.JWT_SECRET as string, // Ensure type safety with `as string`
    (err: jwt.VerifyErrors | null, decodedToken: DecodedToken | undefined) => {
      if (err) {
        console.error("Token verification failed:", err);
        res.status(401).json({ message: "Token Expired or Invalid" });
        return; // End early to prevent calling `next()` after an error
      }

      // Log the decoded token data for debugging purposes
      console.log("Decoded token data:", decodedToken);

      // Store decoded token data in `res.locals` to make it available in later middleware/handlers
      res.locals.jwtData = decodedToken;
      next(); // Call the next middleware/handler in the stack
    }
  );
};
