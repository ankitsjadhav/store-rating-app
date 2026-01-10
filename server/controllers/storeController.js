const { prisma } = require("../config/db");

const createStore = async (req, res) => {
  try {
    const { name, email, address, ownerEmail } = req.body;
    let ownerId = null;
    if (ownerEmail) {
      const user = await prisma.user.findUnique({
        where: { email: ownerEmail },
      });

      if (!user) {
        return res
          .status(404)
          .json({ msg: "No user found with this Owner Email" });
      }

      if (user.role !== "STORE_OWNER") {
        return res
          .status(400)
          .json({ msg: "This user is not registered as a Store Owner" });
      }

      ownerId = user.id;
    }

    const store = await prisma.store.create({
      data: {
        name,
        email,
        address,
        ownerId,
      },
    });

    res.status(201).json({ msg: "Store created successfully", store });
  } catch (error) {
    if (error.code === "P2002") {
      return res
        .status(400)
        .json({ msg: "Store with this email already exists" });
    }
    res.status(500).json({ msg: "server error" });
  }
};

const getAllStores = async (req, res) => {
  try {
    const stores = await prisma.store.findMany({
      orderBy: { averageRating: "desc" },
      include: { owner: { select: { name: true, email: true } } },
    });

    let storesWithUserRating = stores;

    if (req.user && req.user.userId) {
      const myRatings = await prisma.rating.findMany({
        where: { userId: req.user.userId },
      });

      storesWithUserRating = stores.map((store) => {
        const myRating = myRatings.find((r) => r.storeId === store.id);
        return {
          ...store,
          userRating: myRating ? myRating.value : null,
        };
      });
    }

    res.status(200).json({ stores: storesWithUserRating });
  } catch (error) {
    res.status(500).json({ msg: "server error" });
  }
};

const deleteStore = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.rating.deleteMany({ where: { storeId: id } });
    await prisma.store.delete({ where: { id } });
    res.status(200).json({ msg: "Store deleted successfully" });
  } catch (error) {
    res.status(500).json({ msg: "server error" });
  }
};

const submitRating = async (req, res) => {
  const { storeId } = req.params;
  const { value } = req.body;
  const userId = req.user.userId;

  try {
    const existingRating = await prisma.rating.findUnique({
      where: { userId_storeId: { userId, storeId } },
    });

    if (existingRating) {
      await prisma.rating.update({
        where: { id: existingRating.id },
        data: { value },
      });
    } else {
      await prisma.rating.create({
        data: { value, userId, storeId },
      });
    }

    const aggregations = await prisma.rating.aggregate({
      where: { storeId },
      _avg: { value: true },
    });

    const newAverage = aggregations._avg.value || 0;

    await prisma.store.update({
      where: { id: storeId },
      data: { averageRating: newAverage },
    });

    res.status(200).json({
      msg: "Rating submitted successfully",
      averageRating: newAverage,
    });
  } catch (error) {
    res.status(500).json({ msg: "server error", error: error.message });
  }
};

const getMyStores = async (req, res) => {
  try {
    const stores = await prisma.store.findMany({
      where: { ownerId: req.user.userId },
      include: {
        ratings: {
          select: { value: true, user: { select: { name: true } } },
        },
      },
    });
    res.status(200).json({ stores });
  } catch (error) {
    res.status(500).json({ msg: "server error" });
  }
};

module.exports = {
  createStore,
  getAllStores,
  deleteStore,
  submitRating,
  getMyStores,
};
