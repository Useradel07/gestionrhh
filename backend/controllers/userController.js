const User = require("../models/User");
const Employee = require("../models/Employee");
const getUsers = async (req, res) => {
  try {
    const users = await User.find()
      .select("-password")
      .populate("employee", "matricule nom prenom email poste departement");
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const createEmployeeUser = async (req, res) => {
  try {
    const { employeeId, password } = req.body;
    const employee = await Employee.findById(employeeId);
    if (!employee) {
      return res.status(404).json({ message: "Employe introuvable" });
    }
    const existingUser = await User.findOne({ email: employee.email });
    if (existingUser) {
      return res
        .status(409)
        .json({ message: "Un compte existe deja pour cet employe" });
    }
    const user = await User.create({
      name: `${employee.prenom} ${employee.nom}`,
      email: employee.email,
      password,
      role: "employe",
      employee: employee._id,
    });
    res
      .status(201)
      .json({
        message: "Compte employe cree avec succes",
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          employee: user.employee,
        },
      });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
module.exports = { getUsers, createEmployeeUser };
