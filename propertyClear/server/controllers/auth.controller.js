import User from "../models/user.model";
import jwt from "jsonwebtoken";
import { expressjwt } from "express-jwt";
import config from "../config/config";

// User Sign-in
const signin = async (req, res) => {
    try {
        const { email, password } = req.body;
        let user = await User.findOne({ email });

        if (!user || !user.authenticate(password)) {
            return res.status(401).json({ error: "Invalid email or password" });
        }

        // Check email patterns to assign roles automatically
        if (email === "admin@gmail.com") {
            user.role = "Administrator";
        } else if (email === "broker@gmail.com") {
            user.role = "MortgageBroker";
        } else if (email === "agent@gmail.com") {
            user.role = "RealEstateAgent";
        } else if (email.endsWith("@homebuyer.com")) {
            user.role = "HomeBuyer";
        } else if (email.endsWith("@investor.com")) {
            user.role = "Investor";
        } else {
            return res.status(403).json({ error: "Unauthorized role" });
        }

        // Generate token and respond
        const token = jwt.sign({ _id: user._id, role: user.role }, config.jwtSecret);
        res.cookie("t", token, { expire: new Date() + 9999 });
        return res.json({
            token,
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
        });
    } catch (err) {
        return res.status(401).json({ error: "Could not sign in" });
    }
};

// User Sign-out
const signout = (req, res) => {
    res.clearCookie("t");
    return res.status(200).json({ message: "signed out" });
};

// Authorization middleware
const requireSignin = expressjwt({
    secret: config.jwtSecret,
    algorithms: ["HS256"],
    userProperty: "auth",
});

const authorizeRoles = (roles) => (req, res, next) => {
    if (!roles.includes(req.auth.role)) {
        return res.status(403).json({ error: "User is not authorized" });
    }
    next();
};

export default { signin, signout, requireSignin, authorizeRoles };