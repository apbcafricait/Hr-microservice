import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export const createLeaveType = async (req, res) => {
  try {
    const { name, duration,start_date, organisationId } = req.body

    const leaveType = await prisma.leaveType.create({
      data: {
        name,
        duration: parseInt(duration),
        start_date: new Date(start_date),
        organisationId: parseInt(organisationId)
      }
    })

    res.status(201).json(leaveType)
  } catch (error) {
    res
      .status(500)
      .json({ error: 'Failed to create leave type', details: error.message })
  }
}

export const getLeaveTypes = async (req, res) => {
  try {
    const { organisationId } = req.query; // Using query param for filtering

    if (!organisationId) {
      return res.status(400).json({ error: 'organisationId is required' });
    }

    const leaveTypes = await prisma.leaveType.findMany({
      where: {
        organisationId: parseInt(organisationId)
      },
      include: {
        organisation: true // ⬅ changed from Organisation to organisation
      }
    });

    res.json(leaveTypes);
  } catch (error) {
    res
      .status(500)
      .json({ error: 'Failed to fetch leave types', details: error.message });
  }
};


export const getLeaveType = async (req, res) => {
  try {
    const { id } = req.params;
    const { organisationId } = req.query;

    if (!organisationId) {
      return res.status(400).json({
        status: 'error',
        message: 'organisationId is required'
      });
    }

    const leaveType = await prisma.leaveType.findFirst({
      where: {
        id: parseInt(id),
        organisationId: parseInt(organisationId)
      },
      include: {
        leaveRequests: true,
        organisation: {
          select: {
            id: true,
            name: true
          }
        }
      }
    });

    if (!leaveType) {
      return res.status(404).json({
        status: 'error',
        message: 'Leave type not found or not in specified organisation'
      });
    }

    res.status(200).json({
      status: 'success',
      data: leaveType
    });

  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch leave type',
      error: error.message
    });
  }
};

export const getAllLeaveTypes = async (req, res) => {
  try {
    const leaveTypes = await prisma.leaveType.findMany({
      include: {
        organisation: {
          select: {
            id: true,
            name: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    res.status(200).json({ status: 'success', data: leaveTypes });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch all leave types',
      error: error.message
    });
  }
};
