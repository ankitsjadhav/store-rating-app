const { prisma } = require("../config/db");
const { hashPassword } = require("../utils/passwordUtils");

const getAllUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        address: true,
        role: true,
        _count: { select: { stores: true } },
      },
      orderBy: { name: "asc" },
    });
    res.status(200).json({ users });
  } catch (error) {
    res.status(500).json({ msg: "server error" });
  }
};

const createUser = async (req, res) => {
  try {
    const hashedPassword = await hashPassword(req.body.password);
    const role = req.body.role || "USER";

    const user = await prisma.user.create({
      data: { ...req.body, password: hashedPassword, role },
    });

    res.status(201).json({
      msg: "User created successfully",
      user: { id: user.id, name: user.name, role: user.role },
    });
  } catch (error) {
    res.status(500).json({ msg: "server error", error: error.message });
  }
};

const updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;
    const { id } = req.params;

    if (!["ADMIN", "USER", "STORE_OWNER"].includes(role)) {
      return res.status(400).json({ msg: "Invalid role" });
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: { role },
      select: { id: true, name: true, role: true },
    });

    res.status(200).json({ msg: "Role updated", user: updatedUser });
  } catch (error) {
    res.status(500).json({ msg: "server error" });
  }
};

const getSystemStats = async (req, res) => {
  try {
    const totalUsers = await prisma.user.count();
    const totalStores = await prisma.store.count();
    const totalRatings = await prisma.rating.count();

    res.status(200).json({ stats: { totalUsers, totalStores, totalRatings } });
  } catch (error) {
    res.status(500).json({ msg: "server error" });
  }
};

const updateUserPassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    if (!oldPassword || !newPassword) {
      return res.status(400).json({ msg: "Please provide both values" });
    }

    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
    });
    const isPasswordCorrect = await bcrypt.compare(oldPassword, user.password);

    if (!isPasswordCorrect) {
      return res.status(401).json({ msg: "Invalid old password" });
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({
      where: { id: req.user.userId },
      data: { password: hashedNewPassword },
    });

    res.status(200).json({ msg: "Password updated successfully" });
  } catch (error) {
    res.status(500).json({ msg: "Server error" });
  }
};

module.exports = {
  getAllUsers,
  createUser,
  updateUserRole,
  getSystemStats,
  updateUserPassword,
};
