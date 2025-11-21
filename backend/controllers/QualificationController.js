import { PrismaClient } from '@prisma/client';
// import { validateQualification } from '../validators/qualificationValidator.js';
const prisma = new PrismaClient();

//Create - Only employees can create their own, admins can create for anyone
export const create = async (req, res) => {
  try {
    const userRole = req.user.role;
    
    let targetEmployeeId;

    if (userRole === 'admin') {
      targetEmployeeId = req.body.employeeId || req.user.employeeId;
    } else {
      targetEmployeeId = req.user.employeeId;
    }

    if (!targetEmployeeId) {
      return res.status(400).json({ error: 'Employee ID not found' });
    }
    const qualificationData = {
      ...req.body,
      employeeId: targetEmployeeId,
      dateObtained: new Date(req.body.dateObtained) 
    };
    
    console.log("Qualification data:", qualificationData); 

    const qualification = await prisma.qualification.create({ 
      data: qualificationData 
    });
    res.status(201).json(qualification);
  } catch (err) {
    console.error("Create qualification error:", err);
    res.status(500).json({ error: err.message });
  }
};

export const getAll = async (req, res) => {
  try {
    const employeeId = req.user.employeeId;
    
    const qualifications = await prisma.qualification.findMany({
      where: { employeeId },
      include: {
        employee: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            user: {
              select: { email: true }
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json({ data: { qualifications } });
  } catch (err) {
    console.error("GetAll qualification error:", err);
    res.status(500).json({ error: err.message });
  }
};

//Read One - Get specific qualification
export const getOne = async (req, res) => {
  try {
    const { id } = req.params;
    const qualification = await prisma.qualification.findUnique({
      where: { id: parseInt(id) },
      include: {
        employee: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            user: { 
              select: { 
                email: true 
              } 
            }
          }
        }
      }
    });
    
    if (!qualification) {
      return res.status(404).json({ error: 'Qualification not found' });
    }
    
    res.json(qualification);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const update = async (req, res) => {
  try {
    const { id } = req.params;
    const { employeeId, ...updateData } = req.body;
    if (updateData.dateObtained) {
      updateData.dateObtained = new Date(updateData.dateObtained);
    }
    
    const updated = await prisma.qualification.update({
      where: { id: parseInt(id) },
      data: updateData,
      include: {
        employee: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            user: { 
              select: { 
                email: true 
              } 
            }
          }
        }
      }
    });
    
    res.json(updated);
  } catch (err) {
    if (err.code === 'P2025') {
      return res.status(404).json({ error: 'Qualification not found' });
    }
    console.error("Update qualification error:", err);
    res.status(500).json({ error: err.message });
  }
};

// Delete - Remove qualification
export const remove = async (req, res) => {
  try {
    const { id } = req.params;
    
    await prisma.qualification.delete({ 
      where: { id: parseInt(id) } 
    });
    
    res.json({ message: 'Qualification deleted successfully' });
  } catch (err) {
    if (err.code === 'P2025') {
      return res.status(404).json({ error: 'Qualification not found' });
    }
    res.status(500).json({ error: err.message });
  }
};