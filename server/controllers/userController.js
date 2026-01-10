const { prisma } = require("../config/db");
const bcrypt = require("bcryptjs");
const { hashPassword } = require("../utils/passwordUtils");

const getAllUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      include: {
        stores: {
          include: {
            ratings: {
              select: { value: true },
            },
          },
        },
      },
      orderBy: { name: "asc" },
    });

    const formattedUsers = users.map((user) => {
      let storeRating = null;

      if (user.role === "STORE_OWNER" && user.stores.length > 0) {
        const allRatings = user.stores.flatMap((store) => store.ratings);

        if (allRatings.length > 0) {
          const totalScore = allRatings.reduce((sum, r) => sum + r.value, 0);
          storeRating = totalScore / allRatings.length;
        } else {
          storeRating = 0;
        }
      }

      return {
        id: user.id,
        name: user.name,
        email: user.email,
        address: user.address,
        role: user.role,
        storeRating: storeRating,
      };
    });

    res.status(200).json({ users: formattedUsers });
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

const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const userRatings = await prisma.rating.findMany({
      where: { userId: id },
      select: { storeId: true },
    });

    await prisma.store.updateMany({
      where: { ownerId: id },
      data: { ownerId: null },
    });

    await prisma.rating.deleteMany({
      where: { userId: id },
    });

    await prisma.user.delete({
      where: { id },
    });

    for (const rating of userRatings) {
      const aggregations = await prisma.rating.aggregate({
        where: { storeId: rating.storeId },
        _avg: { value: true },
      });

      const newAverage = aggregations._avg.value || 0;

      await prisma.store.update({
        where: { id: rating.storeId },
        data: { averageRating: newAverage },
      });
    }

    res.status(200).json({ msg: "User deleted successfully" });
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

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

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
  deleteUser,
  getSystemStats,
  updateUserPassword,
};
