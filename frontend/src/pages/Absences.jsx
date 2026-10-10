import React, { useState, useEffect, useCallback } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Swal from "sweetalert2";
import api from "../api/axios";
import { Search, Plus, X, Edit3, Trash2, Users, CalendarOff, Clock, Building2, Briefcase, Grid, Moon, Bell, MessageSquare, Menu, KeySquare, UserCircle, Check, XCircle, Shield } from "lucide-react";

export default function Absences() {
  const location = useLocation();
  const [absences, setAbsences] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [filterType, setFilterType] = useState("");
  const [loading, setLoading] = useState(true);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const initialForm = {
    employee: "", date: "", type: "Absence", motif: "", justifiee: false, heureArrivee: "", retardMinutes: 0, commentaire: "",
  };
  const [form, setForm] = useState(initialForm);

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const isAdmin = user.role === "admin";

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const [absRes, empRes] = await Promise.all([
        api.get("/absences", { params: { type: filterType || undefined } }),
        isAdmin ? api.get("/employees") : Promise.resolve({ data: [] })
      ]);
      setAbsences(absRes.data);
      if (isAdmin) setEmployees(empRes.data);
    } catch (err) {
      Swal.fire({ toast: true, position: 'top-end', icon: 'error', title: 'Erreur réseau', showConfirmButton: false, timer: 3000 });
    } finally {
      setLoading(false);
    }
  }, [filterType, isAdmin]);

  useEffect(() => { loadData(); }, [loadData]);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const payload = { ...form, retardMinutes: Number(form.retardMinutes) || 0 };
      if (editingId) await api.put(`/absences/${editingId}`, payload);
      else await api.post("/absences", payload);
      
      Swal.fire({ toast: true, position: 'top-end', icon: 'success', title: 'Enregistré', showConfirmButton: false, timer: 2000 });
      setForm(initialForm);
      setEditingId(null);
      setIsDrawerOpen(false);
      loadData();
    } catch (err) {
      Swal.fire({ icon: 'error', title: 'Erreur', text: 'Impossible de sauvegarder', confirmButtonColor: '#0ea5e9' });
    }
  };

  const startEditing = (absence) => {
    setForm({
      employee: absence.employee?._id || absence.employee || "",
      date: absence.date ? absence.date.split("T")[0] : "",
      type: absence.type || "Absence",
      motif: absence.motif || "",
      justifiee: Boolean(absence.justifiee),
      heureArrivee: absence.heureArrivee || "",
      retardMinutes: absence.retardMinutes || 0,
      commentaire: absence.commentaire || "",
    });
    setEditingId(absence._id || absence.id);
    setIsDrawerOpen(true);
  };

  const deleteAbsence = async (id) => {
    Swal.fire({
      title: 'Supprimer ?',
      text: "Voulez-vous supprimer cet enregistrement ?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ff5c8e',
      cancelButtonColor: '#94a3b8',
      confirmButtonText: 'Supprimer',
      cancelButtonText: 'Annuler'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await api.delete(`/absences/${id}`);
          loadData();
        } catch (err) {
          Swal.fire('Erreur', 'Suppression impossible', 'error');
        }
      }
    });
  };

  const getTypeBadge = (type) => {
    const styles = {
      "Absence": "bg-[#fff0f4] text-[#ff5c8e]",
      "Retard": "bg-[#fff5e6] text-[#f59e0b]",
      "Départ anticipé": "bg-[#f3f0ff] text-[#7c3aed]",
      "Télétravail": "bg-[#e6fffa] text-[#00c292]"
    };
    return <span className={`px-3 py-1 rounded-full text-[11px] font-bold ${styles[type] || "bg-gray-100 text-gray-500"}`}>{type}</span>;
  };

  const NavItem = ({ to, icon: Icon, label }) => {
    const isActive = location.pathname === to;
    return (
      <Link to={to} className={`flex items-center gap-3 px-4 py-2.5 rounded-full mb-1 transition-colors ${isActive ? "bg-[#e6f4ff] text-[#0ea5e9] font-medium" : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"}`}>
        <Icon className="w-5 h-5" />
        <span className="text-sm">{label}</span>
      </Link>
    );
  };

  return (
    <div className="flex h-screen bg-[#f4f7fb] font-sans overflow-hidden">
      {/* SIDEBAR */}
      <aside className="w-[260px] bg-white border-r border-gray-100 flex flex-col h-full flex-shrink-0">
        <div className="h-[70px] flex items-center px-6 border-b border-gray-100">
          <div className="flex items-center gap-2 text-[#0ea5e9] font-bold text-xl tracking-tight">
            <div className="flex gap-0.5">
              <div className="w-2 h-6 bg-[#0ea5e9] rounded-full transform rotate-12"></div>
              <div className="w-2 h-6 bg-[#0ea5e9] rounded-full transform -rotate-12"></div>
              <div className="w-2 h-6 bg-[#0ea5e9] rounded-full transform rotate-12"></div>
            </div>
            MaterialM
          </div>
        </div>
        <div className="flex-1 overflow-y-auto py-6 px-4">
          <div className="text-xs font-bold text-gray-800 uppercase tracking-wider mb-4 px-4">Dashboards</div>
          <NavItem to="/dashboard" icon={Grid} label="Dashboard" />
          <div className="text-xs font-bold text-gray-800 uppercase tracking-wider mt-8 mb-4 px-4">Modules RH</div>
          <NavItem to="/employees" icon={Users} label="Employés" />
          <NavItem to="/leaves" icon={CalendarOff} label="Congés" />
          <NavItem to="/absences" icon={Clock} label="Absences" />
          <NavItem to="/departments" icon={Building2} label="Départements" />
          <NavItem to="/positions" icon={Briefcase} label="Postes" />
          <div className="text-xs font-bold text-gray-800 uppercase tracking-wider mt-8 mb-4 px-4">Administration</div>
          <NavItem to="/users" icon={KeySquare} label="Accès Utilisateurs" />
          <NavItem to="/profile" icon={UserCircle} label="Mon Profil" />
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <header className="h-[70px] bg-white border-b border-gray-100 flex items-center justify-between px-6 flex-shrink-0">
          <div className="flex items-center gap-4 text-gray-400">
            <Menu className="w-5 h-5 cursor-pointer hover:text-gray-600" />
            <div className="relative">
              <Search className="w-5 h-5 absolute left-0 top-1 text-gray-400" />
              <input type="text" placeholder="Rechercher..." className="pl-8 bg-transparent outline-none text-sm w-48 text-gray-700" />
            </div>
          </div>
          <div className="flex items-center gap-5 text-gray-400">
            <Moon className="w-5 h-5 cursor-pointer hover:text-gray-600" />
            <Bell className="w-5 h-5 cursor-pointer hover:text-gray-600" />
            <Link to="/profile">
              <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#0ea5e9] to-[#00c292] text-white flex items-center justify-center font-bold text-sm shadow-sm cursor-pointer ml-2">P</div>
            </Link>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6 md:p-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-[22px] font-bold text-gray-900">Absences & Pointages</h1>
            <div className="flex gap-3">
              <select value={filterType} onChange={(e) => setFilterType(e.target.value)} className="h-10 px-4 bg-white border border-gray-200 text-gray-600 text-sm font-medium rounded-full shadow-sm outline-none">
                <option value="">Tous les types</option>
                <option value="Absence">Absences</option>
                <option value="Retard">Retards</option>
                <option value="Départ anticipé">Départs anticipés</option>
                <option value="Télétravail">Télétravail</option>
              </select>
              <button onClick={() => { setForm(initialForm); setEditingId(null); setIsDrawerOpen(true); }} className="h-10 px-5 bg-[#0ea5e9] hover:bg-[#0284c7] text-white text-sm font-medium rounded-full flex items-center gap-2 shadow-sm transition-colors">
                <Plus className="w-4 h-4" /> Ajouter
              </button>
            </div>
          </div>

          <div className="bg-white rounded-[20px] shadow-[0_0_20px_rgba(0,0,0,0.02)] border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-white border-b border-gray-100">
                  <tr>
                    <th className="px-6 py-5 text-xs font-semibold text-gray-500 uppercase">Employé</th>
                    <th className="px-6 py-5 text-xs font-semibold text-gray-500 uppercase">Type & Date</th>
                    <th className="px-6 py-5 text-xs font-semibold text-gray-500 uppercase">Détails</th>
                    <th className="px-6 py-5 text-xs font-semibold text-gray-500 uppercase">Motif</th>
                    <th className="px-6 py-5 text-right text-xs font-semibold text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {!loading && absences.map((item) => (
                    <tr key={item._id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4 font-semibold text-gray-900">{item.employee?.prenom} {item.employee?.nom}</td>
                      <td className="px-6 py-4">
                        <div className="mb-1">{getTypeBadge(item.type)}</div>
                        <div className="text-xs text-gray-500">{item.date ? item.date.split("T")[0] : "-"}</div>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        {item.type === "Retard" ? (
                          <div className="text-gray-700">Arrivée: {item.heureArrivee} <span className="text-[#ff5c8e] font-semibold ml-1">+{item.retardMinutes}m</span></div>
                        ) : <span className="text-gray-400">-</span>}
                        <div className="mt-1">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${item.justifiee ? "bg-[#e6fffa] text-[#00c292]" : "bg-gray-100 text-gray-500"}`}>
                            {item.justifiee ? "Justifié" : "Non justifié"}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-800 truncate max-w-[200px]">{item.motif || "-"}</div>
                        <div className="text-xs text-gray-400 truncate max-w-[200px] mt-0.5">{item.commentaire}</div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button onClick={() => startEditing(item)} className="p-2 text-gray-400 hover:text-[#0ea5e9] bg-gray-50 hover:bg-[#e6f4ff] rounded-full transition-colors"><Edit3 className="w-4 h-4"/></button>
                          <button onClick={() => deleteAbsence(item._id || item.id)} className="p-2 text-gray-400 hover:text-[#ff5c8e] bg-gray-50 hover:bg-[#fff0f4] rounded-full transition-colors"><Trash2 className="w-4 h-4"/></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>

      {/* Drawer */}
      <AnimatePresence>
        {isDrawerOpen && (
          <div className="fixed inset-0 z-50 flex justify-end">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-gray-900/20 backdrop-blur-sm" onClick={() => setIsDrawerOpen(false)} />
            <motion.div initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "spring", bounce: 0, duration: 0.4 }} className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col border-l border-gray-100">
              <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center bg-white">
                <h2 className="text-lg font-bold text-gray-900">{editingId ? "Modifier" : "Nouvel enregistrement"}</h2>
                <button onClick={() => setIsDrawerOpen(false)} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full"><X className="w-5 h-5"/></button>
              </div>
              
              <div className="flex-1 overflow-y-auto p-6">
                <form id="absence-form" onSubmit={handleSubmit} className="space-y-5">
                  {isAdmin && (
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1.5">Employé</label>
                      <select name="employee" required value={form.employee} onChange={handleChange} className="w-full h-11 px-4 rounded-xl border border-gray-200 text-sm focus:border-[#0ea5e9] outline-none bg-white text-gray-700">
                        <option value="">Sélectionner</option>
                        {employees.map(emp => <option key={emp._id} value={emp._id}>{emp.prenom} {emp.nom}</option>)}
                      </select>
                    </div>
                  )}
                  <div className="grid grid-cols-2 gap-4">
                    <div><label className="block text-xs font-semibold text-gray-600 mb-1.5">Type</label><select name="type" value={form.type} onChange={handleChange} className="w-full h-11 px-4 rounded-xl border border-gray-200 text-sm focus:border-[#0ea5e9] outline-none bg-white"><option>Absence</option><option>Retard</option><option>Départ anticipé</option><option>Télétravail</option></select></div>
                    <div><label className="block text-xs font-semibold text-gray-600 mb-1.5">Date</label><input type="date" name="date" required value={form.date} onChange={handleChange} className="w-full h-11 px-4 rounded-xl border border-gray-200 text-sm focus:border-[#0ea5e9] outline-none" /></div>
                  </div>
                  {form.type === "Retard" && (
                    <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-xl">
                      <div><label className="block text-xs font-semibold text-gray-600 mb-1.5">Arrivée</label><input type="time" name="heureArrivee" value={form.heureArrivee} onChange={handleChange} className="w-full h-11 px-4 rounded-xl border border-gray-200 text-sm focus:border-[#0ea5e9] outline-none bg-white" /></div>
                      <div><label className="block text-xs font-semibold text-gray-600 mb-1.5">Retard (min)</label><input type="number" name="retardMinutes" value={form.retardMinutes} onChange={handleChange} className="w-full h-11 px-4 rounded-xl border border-gray-200 text-sm focus:border-[#0ea5e9] outline-none bg-white" /></div>
                    </div>
                  )}
                  <div><label className="block text-xs font-semibold text-gray-600 mb-1.5">Motif</label><input type="text" name="motif" value={form.motif} onChange={handleChange} className="w-full h-11 px-4 rounded-xl border border-gray-200 text-sm focus:border-[#0ea5e9] outline-none" placeholder="Ex: Rendez-vous..." /></div>
                  <div><label className="block text-xs font-semibold text-gray-600 mb-1.5">Commentaire interne</label><textarea name="commentaire" rows="3" value={form.commentaire} onChange={handleChange} className="w-full p-4 rounded-xl border border-gray-200 text-sm focus:border-[#0ea5e9] outline-none resize-none" /></div>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input type="checkbox" name="justifiee" checked={form.justifiee} onChange={handleChange} className="w-4 h-4 rounded border-gray-300 text-[#0ea5e9] focus:ring-[#0ea5e9]" />
                    <span className="text-sm font-medium text-gray-700">Absence / Retard justifié</span>
                  </label>
                </form>
              </div>
              
              <div className="p-6 border-t border-gray-100 flex justify-end gap-3 bg-white">
                <button type="button" onClick={() => setIsDrawerOpen(false)} className="h-11 px-6 font-medium text-gray-600 bg-white border border-gray-200 rounded-full hover:bg-gray-50">Annuler</button>
                <button type="submit" form="absence-form" className="h-11 px-8 font-medium text-white bg-[#0ea5e9] hover:bg-[#0284c7] rounded-full shadow-md shadow-sky-500/20">Sauvegarder</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}