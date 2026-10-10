const Absence = require("../models/Absence");
const Employee = require("../models/Employee");
const getAbsences = async (req, res) => {
  try {
    const filter = {};
    if (req.user.role !== "admin") {
      if (!req.user.employee) {
        return res
          .status(403)
          .json({ message: "Aucune fiche employé associée à ce compte" });
      }
      filter.employee = req.user.employee;
    }
    if (req.query.type) {
      filter.type = req.query.type;
    }
    if (req.query.justifiee !== undefined) {
      filter.justifiee = req.query.justifiee === "true";
    }
    if (req.query.month) {
      const [year, month] = req.query.month.split("-");
      const startDate = new Date(Number(year), Number(month) - 1, 1);
      const endDate = new Date(Number(year), Number(month), 1);
      filter.date = { $gte: startDate, $lt: endDate };
    }
    const absences = await Absence.find(filter)
      .populate("employee", "matricule nom prenom email poste departement")
      .populate("createdBy", "name email")
      .sort({ date: -1 });
    res.status(200).json(absences);
  } catch (error) {
    res
      .status(500)
      .json({
        message: "Impossible de charger les absences",
        error: error.message,
      });
  }
};
const getAbsenceById = async (req, res) => {
  try {
    const absence = await Absence.findById(req.params.id).populate(
      "employee",
      "matricule nom prenom email poste departement",
    );
    if (!absence) {
      return res.status(404).json({ message: "Absence introuvable" });
    }
    res.status(200).json(absence);
  } catch (error) {
    res
      .status(400)
      .json({ message: "Identifiant invalide", error: error.message });
  }
};
const createAbsence = async (req, res) => {
  try {
    const {
      employee,
      date,
      type,
      motif,
      justifiee,
      heureArrivee,
      heureDepart,
      retardMinutes,
      commentaire,
    } = req.body;
    const existingEmployee = await Employee.findById(employee);
    if (!existingEmployee) {
      return res.status(404).json({ message: "Employé introuvable" });
    }
    const absence = await Absence.create({
      employee,
      date,
      type,
      motif,
      justifiee,
      heureArrivee,
      heureDepart,
      retardMinutes: Number(retardMinutes) || 0,
      commentaire,
      createdBy: req.user._id,
    });
    const result = await Absence.findById(absence._id).populate(
      "employee",
      "matricule nom prenom email poste departement",
    );
    res
      .status(201)
      .json({ message: "Absence enregistrée avec succès", absence: result });
  } catch (error) {
    res
      .status(400)
      .json({
        message: "Impossible d'enregistrer l'absence",
        error: error.message,
      });
  }
};
const updateAbsence = async (req, res) => {
  try {
    const absence = await Absence.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).populate("employee", "matricule nom prenom email poste departement");
    if (!absence) {
      return res.status(404).json({ message: "Absence introuvable" });
    }
    res.status(200).json({ message: "Absence modifiée avec succès", absence });
  } catch (error) {
    res
      .status(400)
      .json({
        message: "Impossible de modifier l'absence",
        error: error.message,
      });
  }
};
const deleteAbsence = async (req, res) => {
  try {
    const absence = await Absence.findByIdAndDelete(req.params.id);
    if (!absence) {
      return res.status(404).json({ message: "Absence introuvable" });
    }
    res.status(200).json({ message: "Absence supprimée avec succès" });
  } catch (error) {
    res
      .status(400)
      .json({
        message: "Impossible de supprimer l'absence",
        error: error.message,
      });
  }
};
module.exports = {
  getAbsences,
  getAbsenceById,
  createAbsence,
  updateAbsence,
  deleteAbsence,
};
