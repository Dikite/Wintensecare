import prisma from '../config/prisma.js';

export async function getAlerts(req, res) {
  const alerts = await prisma.alert.findMany({
    where: { userId: req.user.id },
    orderBy: { createdAt: 'desc' },
  });

  return res.json(alerts);
}

export async function acknowledgeAlert(req, res) {
  const { id } = req.params;

  const alert = await prisma.alert.findFirst({
    where: {
      id,
      userId: req.user.id,
    },
  });

  if (!alert) {
    return res.status(404).json({ message: 'Alert not found' });
  }

  await prisma.alert.update({
    where: { id },
    data: { acknowledged: true },
  });

  return res.json({ message: 'Alert acknowledged' });
}
