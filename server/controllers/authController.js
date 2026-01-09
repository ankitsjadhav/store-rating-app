const { prisma } = require("../config/db");
const { hashPassword, comparePassword } = require("../utils/passwordUtils");
const { createJWT } = require("../utils/tokenUtils");

const register = async (req, res) => {
  try {
    const isFirstAccount = (await prisma.user.count()) === 0;
    const role = isFirstAccount ? "ADMIN" : "USER";

    const hashedPassword = await hashPassword(req.body.password);

    const user = await prisma.user.create({
      data: { ...req.body, password: hashedPassword, role },
    });

    res.status(201).json({ msg: "User created successfully" });
  } catch (error) {
    res.status(500).json({ msg: "server error", error: error.message });
  }
};

const login = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { email: req.body.email },
    });

    const isValidUser =
      user && (await comparePassword(req.body.password, user.password));

    if (!isValidUser) {
      return res.status(401).json({ msg: "invalid credentials" });
    }

    const token = createJWT({ userId: user.id, role: user.role });

    res.status(200).json({ token, user: { name: user.name, role: user.role } });
  } catch (error) {
    res.status(500).json({ msg: "server error" });
  }
};

module.exports = { register, login };
