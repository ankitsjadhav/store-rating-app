const { prisma } = require("../config/db");

const createStore = async (req, res) => {
  try {
    const store = await prisma.store.create({
      data: req.body,
    });
    res.status(201).json({ msg: "Store created successfully", store });
  } catch (error) {
    res.status(500).json({ msg: "server error" });
  }
};

const getAllStores = async (req, res) => {
  try {
    const stores = await prisma.store.findMany({
      orderBy: { averageRating: "desc" },
      include: { owner: { select: { name: true, email: true } } },
    });
    res.status(200).json({ stores });
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

    res
      .status(200)
      .json({
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

module.exports = { createStore, getAllStores, submitRating, getMyStores };
