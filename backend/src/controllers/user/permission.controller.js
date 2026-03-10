import prisma from "../../config/prisma.js";

// GET /api/permissions
export async function getPermissions(req, res) {
  try {
    const userId = req.user.id;

    let permission = await prisma.userPermission.findUnique({
      where: { userId },
    });

    if (!permission) {
      permission = await prisma.userPermission.create({
        data: { userId },
      });
    }

    res.json(permission);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "failed to fetch permissions" });
  }
}


// PATCH /api/permissions
export async function updatePermissions(req, res) {
  try {
    const userId = req.user.id;

    const updated = await prisma.userPermission.upsert({
      where: { userId },
      update: req.body,
      create: {
        userId,
        ...req.body,
      },
    });

    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "failed to update permissions" });
  }
}
