import prisma from '../config/prisma.js';

export async function canDoctorAccess(userId, doctorId) {
  const record = await prisma.userDoctorAccess.findFirst({
    where: {
      userId,
      doctorId,
      status: 'ACTIVE',
    },
  });

  return !!record;
}
