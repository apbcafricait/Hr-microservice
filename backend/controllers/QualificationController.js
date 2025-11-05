import { PrismaClient } from '@prisma/client';
import { validateQualification } from '../validators/qualificationValidator.js'; // ensure file has .js extension
const prisma = new PrismaClient();

// 🟢 Create
export const create = async (req, res) => {
  const errors = validateQualification(req.body);
  if (errors) return res.status(400).json({ errors });

  try {
    const qualification = await prisma.qualification.create({ data: req.body });
    res.status(201).json(qualification);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 🔵 Read All
export const getAll = async (req, res) => {
  try {
    const qualifications = await prisma.qualification.findMany();
    res.json(qualifications);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 🔵 Read One
export const getOne = async (req, res) => {
  try {
    const { id } = req.params;
    const qualification = await prisma.qualification.findUnique({
      where: { id: parseInt(id) },
    });
    if (!qualification) return res.status(404).json({ error: 'Not Found' });
    res.json(qualification);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 🟠 Update
export const update = async (req, res) => {
  const errors = validateQualification(req.body);
  if (errors) return res.status(400).json({ errors });

  try {
    const { id } = req.params;
    const updated = await prisma.qualification.update({
      where: { id: parseInt(id) },
      data: req.body,
    });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 🔴 Delete
export const remove = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.qualification.delete({ where: { id: parseInt(id) } });
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};