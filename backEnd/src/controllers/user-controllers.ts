import { compare, hash } from "bcrypt";
import User from "../models/userModel";
import { COOKIE_NAME } from "../utils/constants.js";
import { createToken } from "../utils/token-managar.js";

// export const getAllUsers = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   try {
//     //get all users
//     const users = await User.find();
//     return res.status(200).json({ message: "OK", users });
//   } catch (error) {
//     console.log(error);
//     return res.status(200).json({ message: "ERROR", cause:(error as Error).message });
//   }
// };
import { RequestHandler } from "express";

export const userSignup: RequestHandler = async (req, res, next) => {
  try {
    console.log(req.body);

    const { name, email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(401).send("User already registered");
      return; // End the function early to avoid further execution
    }

    const hashedPassword = await hash(password, 10);
    const user = new User({ name, email, password: hashedPassword });
    await user.save();

    res.clearCookie(COOKIE_NAME, {
      httpOnly: true,
      domain: "localhost",
      signed: true,
      path: "/",
    });

    const token = createToken(user._id.toString(), user.email, "7d");
    const expires = new Date();
    expires.setDate(expires.getDate() + 7);
    res.cookie(COOKIE_NAME, token, {
      path: "/",
      domain: "localhost",
      expires,
      httpOnly: true,
      signed: true,
    });

    res.status(201).json({ message: "OK", name: user.name, email: user.email });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "ERROR", cause: (error as Error).message });
  }
};

export const userLogin: RequestHandler = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      res.status(401).send("User not registered");
      return; // End early to prevent further execution
    }

    const isPasswordCorrect = await compare(password, user.password);
    if (!isPasswordCorrect) {
      res.status(403).send("Incorrect Password");
      return;
    }

    res.clearCookie(COOKIE_NAME, {
      httpOnly: true,
      domain: "localhost",
      signed: true,
      path: "/",
    });

    const token = createToken(user._id.toString(), user.email, "7d");
    const expires = new Date();
    expires.setDate(expires.getDate() + 7);

    res.cookie(COOKIE_NAME, token, {
      path: "/",
      domain: "localhost",
      expires,
      httpOnly: true,
      signed: true,
    });

    res.status(200).json({ message: "OK", name: user.name, email: user.email });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "ERROR", cause: (error as Error).message });
  }
};

export const verifyUser: RequestHandler = async (req, res, next) => {
  try {
    const user = await User.findById(res.locals.jwtData.id);

    if (!user) {
      res.status(401).send("User not registered OR Token malfunctioned");
      return;
    }

    if (user._id.toString() !== res.locals.jwtData.id) {
      res.status(401).send("Permissions didn't match");
      return;
    }

    res.status(200).json({ message: "OK", name: user.name, email: user.email });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "ERROR", cause: (error as Error).message });
  }
};

export const userLogout: RequestHandler = async (req, res, next) => {
  try {
    const user = await User.findById(res.locals.jwtData.id);

    if (!user) {
      res.status(401).send("User not registered OR Token malfunctioned");
      return;
    }

    if (user._id.toString() !== res.locals.jwtData.id) {
      res.status(401).send("Permissions didn't match");
      return;
    }

    res.clearCookie(COOKIE_NAME, {
      httpOnly: true,
      domain: "localhost",
      signed: true,
      path: "/",
    });

    res.status(200).json({ message: "OK", name: user.name, email: user.email });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "ERROR", cause: (error as Error).message });
  }
};
