import prisma from '../config/prisma.js';

export async function addDoctor(req, res) {
  const userId = req.user.id;
  const { doctorId, doctorName } = req.body;

  if (!doctorId || !doctorName) {
    return res.status(400).json({ message: "doctorId and name required" });
  }

  const exists = await prisma.userDoctorAccess.findFirst({
    where: { userId, doctorId, status: "ACTIVE" },
  });

  if (exists) {
    return res.status(400).json({ message: "Doctor already added" });
  }

  const record = await prisma.userDoctorAccess.create({
    data: {
      userId,
      doctorId,
      doctorName,
    },
  });

  res.json(record);
}


export async function getDoctors(req, res) {
  try {
    const userId = req.user.id;

    const list = await prisma.userDoctorAccess.findMany({
      where: { userId, status: 'ACTIVE' },
    });

    res.json(list);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching doctors' });
  }
}
export async function revokeDoctor(req, res) {
  const userId = req.user.id;
  const id = req.params.id;

  const record = await prisma.userDoctorAccess.findFirst({
    where: { id, userId }
  });

  if (!record) {
    return res.status(404).json({ message: "Not found" });
  }

  await prisma.userDoctorAccess.update({
    where: { id },
    data: { status: "REVOKED" }
  });

  res.json({ message: "Doctor revoked" });
}

export async function changeAccess(req, res) {
  try {
    const userId = req.user.id;
    const id = req.params.id;
    const { access } = req.body;

    if (!access) {
      return res.status(400).json({ message: "access required" });
    }

    // FIRST: check ownership
    const record = await prisma.userDoctorAccess.findFirst({
      where: { id, userId, status: "ACTIVE" }
    });

    if (!record) {
      return res.status(404).json({ message: "Doctor not found for this user" });
    }

    // SECOND: update using ONLY id
    const updated = await prisma.userDoctorAccess.update({
      where: { id: record.id },   // only id here
      data: { access }
    });

    res.json(updated);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Update failed" });
  }
}


export async function getDoctorHistory(req, res) {
  try {
    const userId = req.user.id;

    const list = await prisma.userDoctorAccess.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" }
    });

    res.json(list);

  } catch (err) {
    res.status(500).json({ message: "Error fetching history" });
  }
}

export async function restoreDoctor(req, res) {
  try {
    const userId = req.user.id;
    const id = req.params.id;

    const record = await prisma.userDoctorAccess.findFirst({
      where: { id, userId, status: "REVOKED" }
    });

    if (!record) {
      return res.status(404).json({ message: "Revoked doctor not found" });
    }

    const restored = await prisma.userDoctorAccess.update({
      where: { id: record.id },
      data: { status: "ACTIVE" }
    });

    res.json(restored);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Restore failed" });
  }
}


export async function deleteDoctorPermanent(req, res) {
  try {
    const userId = req.user.id;
    const id = req.params.id;

    const record = await prisma.userDoctorAccess.findFirst({
      where: { id, userId }
    });

    if (!record) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    await prisma.userDoctorAccess.delete({
      where: { id: record.id }
    });

    res.json({ message: "Doctor permanently deleted" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Delete failed" });
  }
}
