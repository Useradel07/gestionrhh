const Department = require("../models/Department");
const getDepartments = async (req, res) => {
  try {
    const departments = await Department.find()
      .populate("manager", "matricule nom prenom email")
      .sort({ name: 1 });
    res.json(departments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const createDepartment = async (req, res) => {
  try {
    const existing = await Department.findOne({ name: req.body.name });
    if (existing) {
      return res.status(409).json({ message: "Ce departement existe deja" });
    }
    const department = await Department.create(req.body);
    res.status(201).json({ message: "Departement cree", department });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
const updateDepartment = async (req, res) => {
  try {
    const department = await Department.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true },
    );
    if (!department) {
      return res.status(404).json({ message: "Departement introuvable" });
    }
    res.json({ message: "Departement modifie", department });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
const deleteDepartment = async (req, res) => {
  try {
    const department = await Department.findByIdAndDelete(req.params.id);
    if (!department) {
      return res.status(404).json({ message: "Departement introuvable" });
    }
    res.json({ message: "Departement supprime" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
module.exports = {
  getDepartments,
  createDepartment,
  updateDepartment,
  deleteDepartment,
};
