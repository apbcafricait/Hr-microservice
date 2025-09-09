import prisma from "../../db/prisma.js";
import { asyncHandler } from "../middleware/asyncHandler.js";

// Organisations
export const listOrganisations = asyncHandler(async (req, res) => {
  const organisations = await prisma.organisation.findMany({
    include: {
      creator: { select: { id: true, email: true, role: true } },
      _count: { select: { employees: true, Department: true, LeaveType: true } },
    },
    orderBy: { createdAt: "desc" },
  });
  res.json({ success: true, data: organisations });
});

export const getOrganisation = asyncHandler(async (req, res) => {
  const id = Number(req.params.id);
  const organisation = await prisma.organisation.findUnique({
    where: { id },
    include: {
      creator: { select: { id: true, email: true, role: true } },
      employees: { select: { id: true } },
    },
  });
  if (!organisation) return res.status(404).json({ message: "Organisation not found" });
  res.json({ success: true, data: organisation });
});

export const updateOrganisationSubscription = asyncHandler(async (req, res) => {
  const id = Number(req.params.id);
  const { subscriptionStatus, subscriptionEndDate } = req.body;

  const allowed = ["trial", "active", "inactive"];
  if (subscriptionStatus && !allowed.includes(subscriptionStatus)) {
    return res.status(400).json({ message: "Invalid subscription status" });
  }

  const updated = await prisma.organisation.update({
    where: { id },
    data: {
      ...(subscriptionStatus ? { subscriptionStatus } : {}),
      ...(subscriptionEndDate ? { subscriptionEndDate: new Date(subscriptionEndDate) } : {}),
    },
  });
  res.json({ success: true, data: updated });
});

export const cancelOrganisationSubscription = asyncHandler(async (req, res) => {
  const id = Number(req.params.id);
  const updated = await prisma.organisation.update({
    where: { id },
    data: { subscriptionStatus: "inactive", subscriptionEndDate: new Date() },
  });
  res.json({ success: true, data: updated, message: "Subscription cancelled" });
});

// Users
export const listUsers = asyncHandler(async (req, res) => {
  const users = await prisma.users.findMany({
    select: { id: true, email: true, role: true, is_active: true, created_at: true, last_login: true },
    orderBy: { created_at: "desc" },
  });
  res.json({ success: true, data: users });
});

export const updateUserRole = asyncHandler(async (req, res) => {
  const id = Number(req.params.id);
  const { role } = req.body;
  const allowed = ["employee", "manager", "admin", "superadmin"];
  if (!allowed.includes(role)) return res.status(400).json({ message: "Invalid role" });

  const updated = await prisma.users.update({ where: { id }, data: { role } });
  res.json({ success: true, data: { id: updated.id, email: updated.email, role: updated.role } });
});

export const updateUserStatus = asyncHandler(async (req, res) => {
  const id = Number(req.params.id);
  const { is_active } = req.body;
  if (typeof is_active !== "boolean") return res.status(400).json({ message: "is_active must be boolean" });

  const updated = await prisma.users.update({ where: { id }, data: { is_active } });
  res.json({ success: true, data: { id: updated.id, is_active: updated.is_active } });
});

