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
exports.userLogout = exports.verifyUser = exports.userLogin = exports.userSignup = void 0;
const bcrypt_1 = require("bcrypt");
const userModel_1 = __importDefault(require("../models/userModel"));
const constants_js_1 = require("../utils/constants.js");
const token_managar_js_1 = require("../utils/token-managar.js");
const userSignup = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log(req.body);
        const { name, email, password } = req.body;
        const existingUser = yield userModel_1.default.findOne({ email });
        if (existingUser) {
            res.status(401).send("User already registered");
            return; // End the function early to avoid further execution
        }
        const hashedPassword = yield (0, bcrypt_1.hash)(password, 10);
        const user = new userModel_1.default({ name, email, password: hashedPassword });
        yield user.save();
        res.clearCookie(constants_js_1.COOKIE_NAME, {
            httpOnly: true,
            domain: "localhost",
            signed: true,
            path: "/",
        });
        const token = (0, token_managar_js_1.createToken)(user._id.toString(), user.email, "7d");
        const expires = new Date();
        expires.setDate(expires.getDate() + 7);
        res.cookie(constants_js_1.COOKIE_NAME, token, {
            path: "/",
            domain: "localhost",
            expires,
            httpOnly: true,
            signed: true,
        });
        res.status(201).json({ message: "OK", name: user.name, email: user.email });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "ERROR", cause: error.message });
    }
});
exports.userSignup = userSignup;
const userLogin = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const user = yield userModel_1.default.findOne({ email });
        if (!user) {
            res.status(401).send("User not registered");
            return; // End early to prevent further execution
        }
        const isPasswordCorrect = yield (0, bcrypt_1.compare)(password, user.password);
        if (!isPasswordCorrect) {
            res.status(403).send("Incorrect Password");
            return;
        }
        res.clearCookie(constants_js_1.COOKIE_NAME, {
            httpOnly: true,
            domain: "localhost",
            signed: true,
            path: "/",
        });
        const token = (0, token_managar_js_1.createToken)(user._id.toString(), user.email, "7d");
        const expires = new Date();
        expires.setDate(expires.getDate() + 7);
        res.cookie(constants_js_1.COOKIE_NAME, token, {
            path: "/",
            domain: "localhost",
            expires,
            httpOnly: true,
            signed: true,
        });
        res.status(200).json({ message: "OK", name: user.name, email: user.email });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "ERROR", cause: error.message });
    }
});
exports.userLogin = userLogin;
const verifyUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield userModel_1.default.findById(res.locals.jwtData.id);
        if (!user) {
            res.status(401).send("User not registered OR Token malfunctioned");
            return;
        }
        if (user._id.toString() !== res.locals.jwtData.id) {
            res.status(401).send("Permissions didn't match");
            return;
        }
        res.status(200).json({ message: "OK", name: user.name, email: user.email });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "ERROR", cause: error.message });
    }
});
exports.verifyUser = verifyUser;
const userLogout = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield userModel_1.default.findById(res.locals.jwtData.id);
        if (!user) {
            res.status(401).send("User not registered OR Token malfunctioned");
            return;
        }
        if (user._id.toString() !== res.locals.jwtData.id) {
            res.status(401).send("Permissions didn't match");
            return;
        }
        res.clearCookie(constants_js_1.COOKIE_NAME, {
            httpOnly: true,
            domain: "localhost",
            signed: true,
            path: "/",
        });
        res.status(200).json({ message: "OK", name: user.name, email: user.email });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "ERROR", cause: error.message });
    }
});
exports.userLogout = userLogout;
