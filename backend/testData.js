// seed.js
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const Employee = require("./models/Employee");
const User = require("./models/User");
const Department = require("./models/Department");
const Position = require("./models/Position");
const Leave = require("./models/Leave");
const Absence = require("./models/Absence");

const MONGO_URI =
  process.env.MONGO_URI || "mongodb://127.0.0.1:27017/gestion_rhh";

const seedDatabase = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ MongoDB connecté");

    // Nettoyage
    await Promise.all([
      Employee.deleteMany({}),
      User.deleteMany({}),
      Department.deleteMany({}),
      Position.deleteMany({}),
      Leave.deleteMany({}),
      Absence.deleteMany({}),
    ]);

    console.log("🗑️ Anciennes données supprimées");

    // =========================================================
    // 1. DÉPARTEMENTS
    // =========================================================

    const departments = await Department.insertMany([
      {
        name: "Ressources Humaines",
        description: "Gestion du personnel et administration RH",
        active: true,
      },
      {
        name: "Informatique",
        description: "Développement, infrastructure et support informatique",
        active: true,
      },
      {
        name: "Finance",
        description: "Comptabilité, finance et contrôle de gestion",
        active: true,
      },
      {
        name: "Marketing",
        description: "Marketing, communication et développement commercial",
        active: true,
      },
      {
        name: "Administration",
        description: "Gestion administrative de l'entreprise",
        active: true,
      },
    ]);

    const getDepartment = (name) =>
      departments.find((department) => department.name === name);

    // =========================================================
    // 2. POSTES
    // =========================================================

    const positions = await Position.insertMany([
      {
        title: "Responsable RH",
        department: getDepartment("Ressources Humaines")._id,
        description: "Gestion des ressources humaines",
        minimumSalary: 2500,
        maximumSalary: 4500,
        active: true,
      },
      {
        title: "Développeur Full Stack",
        department: getDepartment("Informatique")._id,
        description: "Développement des applications web",
        minimumSalary: 2200,
        maximumSalary: 5000,
        active: true,
      },
      {
        title: "Administrateur Système",
        department: getDepartment("Informatique")._id,
        description: "Administration des serveurs et réseaux",
        minimumSalary: 2000,
        maximumSalary: 4000,
        active: true,
      },
      {
        title: "Comptable",
        department: getDepartment("Finance")._id,
        description: "Gestion comptable et financière",
        minimumSalary: 1600,
        maximumSalary: 3000,
        active: true,
      },
      {
        title: "Responsable Marketing",
        department: getDepartment("Marketing")._id,
        description: "Gestion des campagnes marketing",
        minimumSalary: 2200,
        maximumSalary: 4000,
        active: true,
      },
      {
        title: "Assistant Administratif",
        department: getDepartment("Administration")._id,
        description: "Support administratif",
        minimumSalary: 1200,
        maximumSalary: 2200,
        active: true,
      },
    ]);

    // =========================================================
    // 3. EMPLOYÉS
    // =========================================================

    const employees = await Employee.insertMany([
      {
        matricule: "EMP001",
        nom: "Ben Ali",
        prenom: "Ahmed",
        email: "ahmed.benali@example.com",
        telephone: "+216 20 123 456",
        adresse: "Sousse, Tunisie",
        poste: "Responsable RH",
        departement: "Ressources Humaines",
        typeContrat: "CDI",
        dateEmbauche: new Date("2021-03-15"),
        salaire: 3800,
        statut: "Actif",
      },
      {
        matricule: "EMP002",
        nom: "Trabelsi",
        prenom: "Mariem",
        email: "mariem.trabelsi@example.com",
        telephone: "+216 22 234 567",
        adresse: "Sahloul, Sousse",
        poste: "Développeur Full Stack",
        departement: "Informatique",
        typeContrat: "CDI",
        dateEmbauche: new Date("2022-06-01"),
        salaire: 3200,
        statut: "Actif",
      },
      {
        matricule: "EMP003",
        nom: "Ben Amor",
        prenom: "Yassine",
        email: "yassine.benamor@example.com",
        telephone: "+216 53 345 678",
        adresse: "Monastir, Tunisie",
        poste: "Développeur Full Stack",
        departement: "Informatique",
        typeContrat: "CDI",
        dateEmbauche: new Date("2023-01-10"),
        salaire: 2900,
        statut: "Actif",
      },
      {
        matricule: "EMP004",
        nom: "Jaziri",
        prenom: "Sarra",
        email: "sarra.jaziri@example.com",
        telephone: "+216 98 456 789",
        adresse: "Hammam Sousse, Tunisie",
        poste: "Administrateur Système",
        departement: "Informatique",
        typeContrat: "CDI",
        dateEmbauche: new Date("2020-09-20"),
        salaire: 3500,
        statut: "Actif",
      },
      {
        matricule: "EMP005",
        nom: "Mansouri",
        prenom: "Mohamed",
        email: "mohamed.mansouri@example.com",
        telephone: "+216 21 567 890",
        adresse: "Sousse, Tunisie",
        poste: "Comptable",
        departement: "Finance",
        typeContrat: "CDI",
        dateEmbauche: new Date("2021-11-05"),
        salaire: 2400,
        statut: "Actif",
      },
      {
        matricule: "EMP006",
        nom: "Gharbi",
        prenom: "Nour",
        email: "nour.gharbi@example.com",
        telephone: "+216 25 678 901",
        adresse: "Khezama, Sousse",
        poste: "Responsable Marketing",
        departement: "Marketing",
        typeContrat: "CDI",
        dateEmbauche: new Date("2022-02-14"),
        salaire: 3100,
        statut: "Actif",
      },
      {
        matricule: "EMP007",
        nom: "Ayari",
        prenom: "Amine",
        email: "amine.ayari@example.com",
        telephone: "+216 27 789 012",
        adresse: "Sousse, Tunisie",
        poste: "Assistant Administratif",
        departement: "Administration",
        typeContrat: "CDD",
        dateEmbauche: new Date("2024-04-01"),
        salaire: 1700,
        statut: "Actif",
      },
      {
        matricule: "EMP008",
        nom: "Khalfallah",
        prenom: "Ines",
        email: "ines.khalfallah@example.com",
        telephone: "+216 29 890 123",
        adresse: "M'saken, Tunisie",
        poste: "Développeur Full Stack",
        departement: "Informatique",
        typeContrat: "Stage",
        dateEmbauche: new Date("2025-01-15"),
        salaire: 1000,
        statut: "Actif",
      },
      {
        matricule: "EMP009",
        nom: "Chaabane",
        prenom: "Oussama",
        email: "oussama.chaabane@example.com",
        telephone: "+216 24 901 234",
        adresse: "Sousse, Tunisie",
        poste: "Comptable",
        departement: "Finance",
        typeContrat: "CDI",
        dateEmbauche: new Date("2019-08-12"),
        salaire: 2700,
        statut: "En congé",
      },
      {
        matricule: "EMP010",
        nom: "Brahmi",
        prenom: "Hela",
        email: "hela.brahmi@example.com",
        telephone: "+216 26 112 233",
        adresse: "Akouda, Tunisie",
        poste: "Assistant Administratif",
        departement: "Administration",
        typeContrat: "CDI",
        dateEmbauche: new Date("2023-07-03"),
        salaire: 1900,
        statut: "Actif",
      },
      {
        matricule: "EMP011",
        nom: "Saidi",
        prenom: "Walid",
        email: "walid.saidi@example.com",
        telephone: "+216 23 223 344",
        adresse: "Sousse, Tunisie",
        poste: "Administrateur Système",
        departement: "Informatique",
        typeContrat: "CDI",
        dateEmbauche: new Date("2022-10-17"),
        salaire: 3300,
        statut: "Actif",
      },
      {
        matricule: "EMP012",
        nom: "Bouzid",
        prenom: "Rim",
        email: "rim.bouzid@example.com",
        telephone: "+216 28 334 455",
        adresse: "Monastir, Tunisie",
        poste: "Responsable Marketing",
        departement: "Marketing",
        typeContrat: "CDI",
        dateEmbauche: new Date("2021-05-24"),
        salaire: 3000,
        statut: "Actif",
      },
    ]);

    const emp = (matricule) =>
      employees.find((employee) => employee.matricule === matricule);

    // =========================================================
    // 4. MANAGERS DES DÉPARTEMENTS
    // =========================================================

    await Department.updateOne(
      { name: "Ressources Humaines" },
      { manager: emp("EMP001")._id },
    );

    await Department.updateOne(
      { name: "Informatique" },
      { manager: emp("EMP004")._id },
    );

    await Department.updateOne(
      { name: "Finance" },
      { manager: emp("EMP005")._id },
    );

    await Department.updateOne(
      { name: "Marketing" },
      { manager: emp("EMP006")._id },
    );

    await Department.updateOne(
      { name: "Administration" },
      { manager: emp("EMP010")._id },
    );

    // =========================================================
    // 5. UTILISATEURS
    // =========================================================

    const hashedPassword = await bcrypt.hash("Password123", 10);

    const users = await User.insertMany([
      {
        name: "Administrateur RH",
        email: "admin@entreprise.tn",
        password: hashedPassword,
        employee: emp("EMP001")._id,
        role: "admin",
      },
      {
        name: "Ahmed Ben Ali",
        email: "ahmed.benali@example.com",
        password: hashedPassword,
        employee: emp("EMP001")._id,
        role: "employe",
      },
      {
        name: "Mariem Trabelsi",
        email: "mariem.trabelsi@example.com",
        password: hashedPassword,
        employee: emp("EMP002")._id,
        role: "employe",
      },
      {
        name: "Yassine Ben Amor",
        email: "yassine.benamor@example.com",
        password: hashedPassword,
        employee: emp("EMP003")._id,
        role: "employe",
      },
      {
        name: "Sarra Jaziri",
        email: "sarra.jaziri@example.com",
        password: hashedPassword,
        employee: emp("EMP004")._id,
        role: "employe",
      },
      {
        name: "Mohamed Mansouri",
        email: "mohamed.mansouri@example.com",
        password: hashedPassword,
        employee: emp("EMP005")._id,
        role: "employe",
      },
    ]);

    const admin = users.find(
      (user) => user.email === "admin@entreprise.tn",
    );

    // =========================================================
    // 6. CONGÉS
    // =========================================================

    await Leave.insertMany([
      {
        employee: emp("EMP002")._id,
        createdBy: admin._id,
        typeConge: "Congé annuel",
        dateDebut: new Date("2026-10-12"),
        dateFin: new Date("2026-10-16"),
        nombreJours: 5,
        motif: "Congé annuel",
        statut: "Approuvé",
        commentaireAdmin: "Congé approuvé.",
        reviewedBy: admin._id,
        reviewedAt: new Date("2026-09-28"),
      },
      {
        employee: emp("EMP003")._id,
        createdBy: admin._id,
        typeConge: "Congé maladie",
        dateDebut: new Date("2026-09-14"),
        dateFin: new Date("2026-09-16"),
        nombreJours: 3,
        motif: "Repos médical",
        statut: "Approuvé",
        commentaireAdmin: "Certificat médical reçu.",
        reviewedBy: admin._id,
        reviewedAt: new Date("2026-09-13"),
      },
      {
        employee: emp("EMP006")._id,
        createdBy: admin._id,
        typeConge: "Congé annuel",
        dateDebut: new Date("2026-11-02"),
        dateFin: new Date("2026-11-06"),
        nombreJours: 5,
        motif: "Congé personnel",
        statut: "En attente",
        commentaireAdmin: "",
        reviewedBy: null,
        reviewedAt: null,
      },
      {
        employee: emp("EMP009")._id,
        createdBy: admin._id,
        typeConge: "Congé annuel",
        dateDebut: new Date("2026-10-05"),
        dateFin: new Date("2026-10-09"),
        nombreJours: 5,
        motif: "Congé annuel",
        statut: "Approuvé",
        commentaireAdmin: "Validé par les RH.",
        reviewedBy: admin._id,
        reviewedAt: new Date("2026-09-20"),
      },
      {
        employee: emp("EMP010")._id,
        createdBy: admin._id,
        typeConge: "Congé sans solde",
        dateDebut: new Date("2026-12-01"),
        dateFin: new Date("2026-12-03"),
        nombreJours: 3,
        motif: "Raisons personnelles",
        statut: "En attente",
        commentaireAdmin: "",
        reviewedBy: null,
        reviewedAt: null,
      },
    ]);

    // =========================================================
    // 7. ABSENCES / RETARDS / TÉLÉTRAVAIL
    // =========================================================

    await Absence.insertMany([
      {
        employee: emp("EMP002")._id,
        date: new Date("2026-09-02"),
        type: "Retard",
        motif: "Embouteillage",
        justifiee: true,
        heureArrivee: "09:25",
        heureDepart: "18:00",
        retardMinutes: 25,
        commentaire: "Retard exceptionnel.",
        createdBy: admin._id,
      },
      {
        employee: emp("EMP003")._id,
        date: new Date("2026-09-05"),
        type: "Absence",
        motif: "Raison personnelle",
        justifiee: false,
        heureArrivee: "",
        heureDepart: "",
        retardMinutes: 0,
        commentaire: "",
        createdBy: admin._id,
      },
      {
        employee: emp("EMP004")._id,
        date: new Date("2026-09-08"),
        type: "Télétravail",
        motif: "Télétravail planifié",
        justifiee: true,
        heureArrivee: "08:30",
        heureDepart: "17:30",
        retardMinutes: 0,
        commentaire: "Journée en télétravail.",
        createdBy: admin._id,
      },
      {
        employee: emp("EMP005")._id,
        date: new Date("2026-09-10"),
        type: "Retard",
        motif: "Transport",
        justifiee: true,
        heureArrivee: "09:15",
        heureDepart: "18:00",
        retardMinutes: 15,
        commentaire: "Retard justifié.",
        createdBy: admin._id,
      },
      {
        employee: emp("EMP006")._id,
        date: new Date("2026-09-12"),
        type: "Départ anticipé",
        motif: "Rendez-vous médical",
        justifiee: true,
        heureArrivee: "08:30",
        heureDepart: "15:30",
        retardMinutes: 0,
        commentaire: "Départ autorisé par les RH.",
        createdBy: admin._id,
      },
      {
        employee: emp("EMP007")._id,
        date: new Date("2026-09-15"),
        type: "Absence",
        motif: "Maladie",
        justifiee: true,
        heureArrivee: "",
        heureDepart: "",
        retardMinutes: 0,
        commentaire: "Certificat médical fourni.",
        createdBy: admin._id,
      },
      {
        employee: emp("EMP008")._id,
        date: new Date("2026-09-18"),
        type: "Retard",
        motif: "Transport public",
        justifiee: false,
        heureArrivee: "09:40",
        heureDepart: "17:30",
        retardMinutes: 40,
        commentaire: "",
        createdBy: admin._id,
      },
      {
        employee: emp("EMP010")._id,
        date: new Date("2026-09-21"),
        type: "Télétravail",
        motif: "Télétravail exceptionnel",
        justifiee: true,
        heureArrivee: "08:30",
        heureDepart: "17:30",
        retardMinutes: 0,
        commentaire: "",
        createdBy: admin._id,
      },
      {
        employee: emp("EMP011")._id,
        date: new Date("2026-09-23"),
        type: "Retard",
        motif: "Circulation",
        justifiee: true,
        heureArrivee: "09:20",
        heureDepart: "18:00",
        retardMinutes: 20,
        commentaire: "Retard justifié.",
        createdBy: admin._id,
      },
      {
        employee: emp("EMP012")._id,
        date: new Date("2026-09-25"),
        type: "Départ anticipé",
        motif: "Obligation familiale",
        justifiee: true,
        heureArrivee: "08:30",
        heureDepart: "16:00",
        retardMinutes: 0,
        commentaire: "",
        createdBy: admin._id,
      },
    ]);

    console.log("✅ Données de test ajoutées avec succès");

    console.log("\n========================================");
    console.log("          COMPTES DE TEST");
    console.log("========================================");
    console.log("Admin :");
    console.log("Email    : admin@entreprise.tn");
    console.log("Password : Password123");
    console.log("----------------------------------------");
    console.log("Employé :");
    console.log("Email    : mariem.trabelsi@example.com");
    console.log("Password : Password123");
    console.log("========================================\n");

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error("❌ Erreur lors du seed :", error);

    await mongoose.disconnect();
    process.exit(1);
  }
};

seedDatabase();
