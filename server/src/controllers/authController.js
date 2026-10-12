import User from "../models/User.js";
import { signToken } from "../utils/token.js";
import { checkLogin, checkRegister } from "../utils/validators.js";

const publicUser = (user) => ({ id: user._id, name: user.name, email: user.email });

// POST /api/auth/register
export async function register(req, res, next) {
  try {
    const problem = checkRegister(req.body);
    if (problem) return res.status(400).json({ error: problem });

    const { name, email, password } = req.body;
    const normalizedEmail = email.trim().toLowerCase();

    if (await User.findOne({ email: normalizedEmail })) {
      return res.status(409).json({ error: "An account with this email already exists." });
    }

    const user = await User.create({ name: name.trim(), email: normalizedEmail, password });
    res.status(201).json({ token: signToken(user._id), user: publicUser(user) });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ error: "An account with this email already exists." });
    }
    next(err);
  }
}

// POST /api/auth/login
export async function login(req, res, next) {
  try {
    const problem = checkLogin(req.body);
    if (problem) return res.status(400).json({ error: problem });

    const { email, password } = req.body;
    const user = await User.findOne({ email: email.trim().toLowerCase() }).select("+password");

    // Same message for "no such user" and "wrong password" so the API doesn't reveal which emails exist.
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ error: "Invalid email or password." });
    }

    res.json({ token: signToken(user._id), user: publicUser(user) });
  } catch (err) {
    next(err);
  }
}

// GET /api/auth/me
export async function me(req, res, next) {
  try {
    const user = await User.findById(req.userId);
    if (!user) return res.status(401).json({ error: "Account not found. Please log in again." });
    res.json({ user: publicUser(user) });
  } catch (err) {
    next(err);
  }
}
