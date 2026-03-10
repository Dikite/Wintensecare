import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import prisma from '../config/prisma.js';


async function register(req, res) {
  const { identifier, password, confirmPassword } = req.body;

  if (!identifier || !password || !confirmPassword) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  if (password !== confirmPassword) {
    return res.status(400).json({ message: 'Passwords do not match' });
  }

  let userData = {};

  if (isEmail(identifier)) {
    const exists = await prisma.user.findUnique({
      where: { email: identifier },
    });
    if (exists) {
      return res.status(400).json({ message: 'Email already registered' });
    }
    userData.email = identifier;
  } else if (isPhone(identifier)) {
    const exists = await prisma.user.findUnique({
      where: { phone: identifier },
    });
    if (exists) {
      return res.status(400).json({ message: 'Phone already registered' });
    }
    userData.phone = identifier;
  } else {
    return res.status(400).json({ message: 'Invalid email or phone number' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  await prisma.user.create({
    data: {
      ...userData,
      password: hashedPassword,
    },
  });

  return res.status(201).json({ message: 'User registered successfully' });
}

async function login(req, res) {
  const { identifier, password } = req.body;

  if (!identifier || !password) {
    return res.status(400).json({ message: 'Identifier and password required' });
  }

  const user = isEmail(identifier)
    ? await prisma.user.findUnique({ where: { email: identifier } })
    : await prisma.user.findUnique({ where: { phone: identifier } });

  if (!user) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }


  
  const token = jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '6h' }
  );

  return res.json({ accessToken: token });
}


async function logout(req, res) {
  // Stateless JWT → nothing to invalidate
  return res.status(200).json({
    message: 'Logged out successfully',
  });
}

function isEmail(value) {
  return value.includes('@');
}

function isPhone(value) {
  return /^\+?[0-9]{10,15}$/.test(value);
}

export default {
  register,
  login,
  logout,
};

export { register, login, logout };
