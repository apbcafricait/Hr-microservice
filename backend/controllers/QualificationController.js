// // src/controllers/QualificationsController.js

// import { PrismaClient } from '@prisma/client';
// import { validateQualification } from '../validators/qualificationValidator.js'; // Custom validation function

// const prisma = new PrismaClient();

// export class QualificationsController {
//   // Get all qualifications with pagination, filtering, and searching
//   async getAllQualifications(req, res) {
//     try {
//       const page = parseInt(req.query.page) || 1;
//       const limit = parseInt(req.query.limit) || 10;
//       const employeeId = parseInt(req.query.employeeId); // Optional filtering by employeeId
//       const search = req.query.search; // Optional search query
//       const skip = (page - 1) * limit;

//       const whereClause = {};
//       if (employeeId) {
//         whereClause.employeeId = employeeId;
//       }
//       if (search) {
//         whereClause.OR = [
//           { institution: { contains: search, mode: 'insensitive' } },
//           { qualification: { contains: search, mode: 'insensitive' } },
//         ];
//       }

//       const [qualifications, total] = await Promise.all([
//         prisma.qualification.findMany({
//           skip,
//           take: limit,
//           where: whereClause,
//           include: {
//             educations: true,
//             workExperiences: true,
//             skills: true,
//             languages: true,
//           },
//           orderBy: {
//             createdAt: 'desc',
//           },
//         }),
//         prisma.qualification.count({ where: whereClause }),
//       ]);

//       return res.status(200).json({
//         status: 'success',
//         data: {
//           qualifications,
//           pagination: {
//             total,
//             pages: Math.ceil(total / limit),
//             page,
//             limit,
//           },
//         },
//       });
//     } catch (error) {
//       return res.status(500).json({
//         status: 'error',
//         message: 'Failed to fetch qualifications',
//         error: error.message,
//       });
//     }
//   }

//   // Get a single qualification by ID
//   async getQualificationById(req, res) {
//     try {
//       const { id } = req.params;
//       const qualification = await prisma.qualification.findUnique({
//         where: { id: parseInt(id, 10) },
//         include: {
//           educations: true,
//           workExperiences: true,
//           skills: true,
//           languages: true,
//         },
//       });

//       if (!qualification) {
//         return res.status(404).json({
//           status: 'error',
//           message: 'Qualification not found',
//         });
//       }

//       return res.status(200).json({
//         status: 'success',
//         data: { qualification },
//       });
//     } catch (error) {
//       return res.status(500).json({
//         status: 'error',
//         message: 'Failed to fetch qualification',
//         error: error.message,
//       });
//     }
//   }

//   // Create a new qualification
//   async createQualification(req, res) {
//     try {
//       const {
//         employeeId,
//         institution,
//         qualification,
//         startDate,
//         endDate,
//       } = req.body;

//       // Validate qualification data
//       const validationError = validateQualification({
//         employeeId,
//         institution,
//         qualification,
//         startDate,
//         endDate,
//       });
//       if (validationError) {
//         return res.status(400).json({
//           status: 'error',
//           message: validationError.join(', '),
//         });
//       }

//       // Create the qualification
//       const newQualification = await prisma.qualification.create({
//         data: {
//           employeeId: parseInt(employeeId),
//           institution,
//           qualification,
//           startDate: new Date(startDate),
//           endDate: new Date(endDate),
//         },
//         include: {
//           educations: true,
//           workExperiences: true,
//           skills: true,
//           languages: true,
//         },
//       });

//       return res.status(201).json({
//         status: 'success',
//         data: { qualification: newQualification },
//       });
//     } catch (error) {
//       return res.status(500).json({
//         status: 'error',
//         message: 'Failed to create qualification',
//         error: error.message,
//       });
//     }
//   }

//   // Update a qualification
//   async updateQualification(req, res) {
//     try {
//       const { id } = req.params;
//       const { institution, qualification, startDate, endDate } = req.body;

//       // Prepare update data
//       const updateData = {};
//       if (institution) updateData.institution = institution;
//       if (qualification) updateData.qualification = qualification;
//       if (startDate) updateData.startDate = new Date(startDate);
//       if (endDate) updateData.endDate = new Date(endDate);

//       // Update the qualification
//       const updatedQualification = await prisma.qualification.update({
//         where: { id: parseInt(id, 10) },
//         data: updateData,
//         include: {
//           educations: true,
//           workExperiences: true,
//           skills: true,
//           languages: true,
//         },
//       });

//       return res.status(200).json({
//         status: 'success',
//         data: { qualification: updatedQualification },
//       });
//     } catch (error) {
//       return res.status(500).json({
//         status: 'error',
//         message: 'Failed to update qualification',
//         error: error.message,
//       });
//     }
//   }

//   // Delete a qualification
//   async deleteQualification(req, res) {
//     try {
//       const { id } = req.params;
//       await prisma.qualification.delete({
//         where: { id: parseInt(id, 10) },
//       });

//       return res.status(200).json({
//         status: 'success',
//         message: 'Qualification deleted successfully',
//       });
//     } catch (error) {
//       return res.status(500).json({
//         status: 'error',
//         message: 'Failed to delete qualification',
//         error: error.message,
//       });
//     }
//   }
// }

// export default QualificationsController;