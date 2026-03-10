import prisma from "../config/prisma.js";

export async function getUserPermission(userId) {
  let permission = await prisma.userPermission.findUnique({
    where: { userId },
  });

  if (!permission) {
    permission = await prisma.userPermission.create({
      data: { userId },
    });
  }

  return permission;
}
