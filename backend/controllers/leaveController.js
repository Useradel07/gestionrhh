const Leave = require("../models/Leave");
const Employee = require("../models/Employee");
const calculateDays = (startDate, endDate) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  return Math.floor((end - start) / 86400000) + 1;
};
const getLeaves = async (req, res) => {
  const filter = {};
  if (req.query.statut) filter.statut = req.query.statut;
  if (req.user.role !== "admin") {
    if (!req.user.employee) {
      return res
        .status(403)
        .json({ message: "Aucune fiche employé associée à ce compte" });
    }
    filter.employee = req.user.employee;
  }
  const leaves = await Leave.find(filter)
    .populate("employee", "matricule nom prenom email departement poste")
    .populate("createdBy", "name email role")
    .populate("reviewedBy", "name email")
    .sort({ createdAt: -1 });
  res.status(200).json(leaves);
};
const createLeave = async (req, res) => {
  try {
    const { employee, typeConge, dateDebut, dateFin, motif } = req.body;
    const employeeId = req.user.role === "admin" ? employee : req.user.employee;
    if (!employeeId) {
      return res.status(400).json({ message: "L'employé est obligatoire" });
    }
    const existingEmployee = await Employee.findById(employeeId);
    if (!existingEmployee) {
      return res.status(404).json({ message: "Employé introuvable" });
    }
    const start = new Date(dateDebut);
    const end = new Date(dateFin);
    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
      return res.status(400).json({ message: "Dates invalides" });
    }
    if (end < start) {
      return res
        .status(400)
        .json({ message: "La date de fin doit suivre la date de début" });
    }
    const overlap = await Leave.findOne({
      employee: employeeId,
      statut: { $in: ["En attente", "Approuvé"] },
      dateDebut: { $lte: end },
      dateFin: { $gte: start },
    });
    if (overlap) {
      return res
        .status(409)
        .json({ message: "Une demande existe déjà pour cette période" });
    }
    const leave = await Leave.create({
      employee: employeeId,
      createdBy: req.user._id,
      typeConge,
      dateDebut: start,
      dateFin: end,
      nombreJours: calculateDays(start, end),
      motif,
    });
    res.status(201).json({ message: "Demande créée avec succès", leave });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
const approveLeave = async (req, res) => {
  const leave = await Leave.findById(req.params.id);
  if (!leave) return res.status(404).json({ message: "Demande introuvable" });
  if (leave.statut !== "En attente") {
    return res.status(400).json({ message: "Demande déjà traitée" });
  }
  leave.statut = "Approuvé";
  leave.commentaireAdmin = req.body.commentaireAdmin || "";
  leave.reviewedBy = req.user._id;
  leave.reviewedAt = new Date();
  await leave.save();
  res.json({ message: "Demande approuvée", leave });
};
const rejectLeave = async (req, res) => {
  const leave = await Leave.findById(req.params.id);
  if (!leave) return res.status(404).json({ message: "Demande introuvable" });
  if (leave.statut !== "En attente") {
    return res.status(400).json({ message: "Demande déjà traitée" });
  }
  leave.statut = "Refusé";
  leave.commentaireAdmin = req.body.commentaireAdmin || "Demande refusée";
  leave.reviewedBy = req.user._id;
  leave.reviewedAt = new Date();
  await leave.save();
  res.json({ message: "Demande refusée", leave });
};
const cancelLeave = async (req, res) => {
  const leave = await Leave.findById(req.params.id);
  if (!leave) return res.status(404).json({ message: "Demande introuvable" });
  const isAdmin = req.user.role === "admin";
  const isOwner = leave.createdBy.toString() === req.user._id.toString();
  if (!isAdmin && !isOwner) {
    return res.status(403).json({ message: "Action interdite" });
  }
  if (leave.statut !== "En attente") {
    return res.status(400).json({ message: "Demande déjà traitée" });
  }
  leave.statut = "Annulé";
  await leave.save();
  res.json({ message: "Demande annulée", leave });
};
module.exports = {
  getLeaves,
  createLeave,
  approveLeave,
  rejectLeave,
  cancelLeave,
};