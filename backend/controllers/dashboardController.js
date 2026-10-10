const Employee = require("../models/Employee");
const Leave = require("../models/Leave");
const Absence = require("../models/Absence");

const getDashboardStats = async (req, res) => {
  try {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfNextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);

    const totalEmployees = await Employee.countDocuments();
    const activeEmployees = await Employee.countDocuments({ statut: "Actif" });
    const inactiveEmployees = await Employee.countDocuments({ statut: "Inactif" });
    
    const pendingLeaves = await Leave.countDocuments({ statut: "En attente" });
    const approvedLeaves = await Leave.countDocuments({ statut: "Approuvé" });

    const absencesThisMonth = await Absence.countDocuments({
      type: "Absence",
      date: { $gte: startOfMonth, $lt: startOfNextMonth },
    });

    const delaysThisMonth = await Absence.countDocuments({
      type: "Retard",
      date: { $gte: startOfMonth, $lt: startOfNextMonth },
    });

    const unjustifiedAbsences = await Absence.countDocuments({
      type: "Absence",
      justifiee: false,
      date: { $gte: startOfMonth, $lt: startOfNextMonth },
    });

    const employeesByDepartment = await Employee.aggregate([
      { $group: { _id: "$departement", total: { $sum: 1 } } },
      { $sort: { total: -1 } },
    ]);

    // 1. Récupérer les types d'absences du mois
    const absencesByType = await Absence.aggregate([
      { $match: { date: { $gte: startOfMonth, $lt: startOfNextMonth } } },
      { $group: { _id: "$type", total: { $sum: 1 } } },
    ]);

    // 2. Récupérer les types de congés du mois (ajustez "dateDebut" ou "createdAt" selon votre modèle Leave)
    const leavesByType = await Leave.aggregate([
      { $group: { _id: "$typeConge", total: { $sum: 1 } } },
    ]);

    // Fusionner les deux listes pour le graphique circulaire
    const combinedMap = {};
    
    [...absencesByType, ...leavesByType].forEach((item) => {
      const key = item._id || "Autre";
      combinedMap[key] = (combinedMap[key] || 0) + item.total;
    });

    const finalAbsencesByType = Object.keys(combinedMap).map((key) => ({
      name: key,
      value: combinedMap[key],
    }));

    res.status(200).json({
      cards: {
        totalEmployees,
        activeEmployees,
        inactiveEmployees,
        pendingLeaves,
        approvedLeaves,
        absencesThisMonth,
        delaysThisMonth,
        unjustifiedAbsences,
      },
      employeesByDepartment: employeesByDepartment.map((item) => ({
        name: item._id || "Non défini",
        value: item.total,
      })),
      absencesByType: finalAbsencesByType,
    });
  } catch (error) {
    res.status(500).json({
      message: "Impossible de charger le tableau de bord",
      error: error.message,
    });
  }
};

module.exports = { getDashboardStats };