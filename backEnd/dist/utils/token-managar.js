"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = exports.createToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const constants_js_1 = require("./constants.js");
// Function to create a JWT token with the given payload and expiration
const createToken = (id, email, expiresIn) => {
    const payload = { id, email };
    const token = jsonwebtoken_1.default.sign(payload, process.env.JWT_SECRET, {
        expiresIn,
    });
    return token;
};
exports.createToken = createToken;
// Middleware to verify the JWT token
const verifyToken = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const token = req.signedCookies[constants_js_1.COOKIE_NAME];
    // Log the token for debugging purposes
    console.log("Token received:", token);
    if (!token || token.trim() === "") {
        console.error("Token not received");
        res.status(401).json({ message: "Token Not Received" });
        return; // End early to prevent further execution
    }
    jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET, // Ensure type safety with `as string`
    (err, decodedToken) => {
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
    });
});
exports.verifyToken = verifyToken;
