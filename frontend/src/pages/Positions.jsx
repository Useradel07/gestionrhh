import React, { useCallback, useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Swal from "sweetalert2";
import api from "../api/axios";
import { Search, Plus, X, Edit3, Trash2, Users, CalendarOff, Clock, Building2, Briefcase, Grid, Moon, Bell, MessageSquare, Menu, KeySquare, UserCircle, Check, XCircle, Shield } from "lucide-react";

const initialForm = { title: "", department: "", description: "", minimumSalary: "", maximumSalary: "" };

export default function Positions() {
  const location = useLocation();
  const [positions, setPositions] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [posRes, depRes] = await Promise.all([api.get("/positions"), api.get("/departments")]);
      setPositions(posRes.data);
      setDepartments(depRes.data);
    } catch (err) {
      Swal.fire({ toast: true, position: 'top-end', icon: 'error', title: 'Erreur réseau', showConfirmButton: false, timer: 3000 });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...form, minimumSalary: Number(form.minimumSalary), maximumSalary: Number(form.maximumSalary) };
      if (editingId) await api.put(`/positions/${editingId}`, payload);
      else await api.post("/positions", payload);
      
      Swal.fire({ toast: true, position: 'top-end', icon: 'success', title: 'Sauvegardé', showConfirmButton: false, timer: 2000 });
      setForm(initialForm);
      setEditingId(null);
      setIsDrawerOpen(false);
      fetchData();
    } catch (err) {
      Swal.fire({ icon: 'error', title: 'Erreur', text: 'Impossible de sauvegarder', confirmButtonColor: '#0ea5e9' });
    }
  };

  const handleEdit = (position) => {
    setEditingId(position._id);
    setForm({
      title: position.title || "",
      department: position.department ? position.department._id : "",
      description: position.description || "",
      minimumSalary: position.minimumSalary || "",
      maximumSalary: position.maximumSalary || "",
    });
    setIsDrawerOpen(true);
  };

  const handleDelete = async (id) => {
    Swal.fire({
      title: 'Supprimer ?',
      text: "Voulez-vous supprimer ce poste ?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ff5c8e',
      cancelButtonColor: '#94a3b8',
      confirmButtonText: 'Supprimer',
      cancelButtonText: 'Annuler'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await api.delete(`/positions/${id}`);
          fetchData();
        } catch (err) {
          Swal.fire('Erreur', 'Suppression impossible', 'error');
        }
      }
    });
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
            Gestion RH
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
            
          </div>
          <div className="flex items-center gap-5 text-gray-400">
            
            <Link to="/profile">
              <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#0ea5e9] to-[#00c292] text-white flex items-center justify-center font-bold text-sm shadow-sm cursor-pointer ml-2">P</div>
            </Link>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6 md:p-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-[22px] font-bold text-gray-900">Postes & Grille</h1>
            <button onClick={() => { setForm(initialForm); setEditingId(null); setIsDrawerOpen(true); }} className="h-10 px-5 bg-[#0ea5e9] hover:bg-[#0284c7] text-white text-sm font-medium rounded-full flex items-center gap-2 shadow-sm transition-colors">
              <Plus className="w-4 h-4" /> Ajouter
            </button>
          </div>

          <div className="bg-white rounded-[20px] shadow-[0_0_20px_rgba(0,0,0,0.02)] border border-gray-100 overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-white border-b border-gray-100">
                <tr>
                  <th className="px-6 py-5 text-xs font-semibold text-gray-500 uppercase">Titre</th>
                  <th className="px-6 py-5 text-xs font-semibold text-gray-500 uppercase">Département</th>
                  <th className="px-6 py-5 text-xs font-semibold text-gray-500 uppercase">Fourchette Salariale</th>
                  <th className="px-6 py-5 text-xs font-semibold text-gray-500 uppercase">Statut</th>
                  <th className="px-6 py-5 text-right text-xs font-semibold text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {!loading && positions.map((pos) => (
                  <tr key={pos._id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 font-semibold text-gray-900">{pos.title}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{pos.department?.name || "-"}</td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-700">
                      {pos.minimumSalary || pos.maximumSalary ? `${pos.minimumSalary || 0} - ${pos.maximumSalary || 0} DT` : "-"}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-[11px] font-bold ${pos.active !== false ? "bg-[#e6fffa] text-[#00c292]" : "bg-gray-100 text-gray-500"}`}>
                        {pos.active !== false ? "Actif" : "Inactif"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button onClick={() => handleEdit(pos)} className="p-2 text-gray-400 hover:text-[#0ea5e9] bg-gray-50 hover:bg-[#e6f4ff] rounded-full transition-colors"><Edit3 className="w-4 h-4"/></button>
                        <button onClick={() => handleDelete(pos._id)} className="p-2 text-gray-400 hover:text-[#ff5c8e] bg-gray-50 hover:bg-[#fff0f4] rounded-full transition-colors"><Trash2 className="w-4 h-4"/></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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
                <h2 className="text-lg font-bold text-gray-900">{editingId ? "Modifier le poste" : "Nouveau poste"}</h2>
                <button onClick={() => setIsDrawerOpen(false)} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full"><X className="w-5 h-5"/></button>
              </div>
              
              <div className="flex-1 overflow-y-auto p-6">
                <form id="pos-form" onSubmit={handleSubmit} className="space-y-5">
                  <div><label className="block text-xs font-semibold text-gray-600 mb-1.5">Titre du poste *</label><input type="text" name="title" required value={form.title} onChange={handleChange} className="w-full h-11 px-4 rounded-xl border border-gray-200 text-sm focus:border-[#0ea5e9] outline-none" /></div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5">Département *</label>
                    <select name="department" required value={form.department} onChange={handleChange} className="w-full h-11 px-4 rounded-xl border border-gray-200 text-sm bg-white focus:border-[#0ea5e9] outline-none text-gray-700">
                      <option value="">Sélectionner</option>
                      {departments.map((dept) => <option key={dept._id} value={dept._id}>{dept.name}</option>)}
                    </select>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div><label className="block text-xs font-semibold text-gray-600 mb-1.5">Salaire Min</label><input type="number" name="minimumSalary" value={form.minimumSalary} onChange={handleChange} className="w-full h-11 px-4 rounded-xl border border-gray-200 text-sm focus:border-[#0ea5e9] outline-none" /></div>
                    <div><label className="block text-xs font-semibold text-gray-600 mb-1.5">Salaire Max</label><input type="number" name="maximumSalary" value={form.maximumSalary} onChange={handleChange} className="w-full h-11 px-4 rounded-xl border border-gray-200 text-sm focus:border-[#0ea5e9] outline-none" /></div>
                  </div>
                  <div><label className="block text-xs font-semibold text-gray-600 mb-1.5">Description</label><textarea name="description" rows="3" value={form.description} onChange={handleChange} className="w-full p-4 rounded-xl border border-gray-200 text-sm focus:border-[#0ea5e9] outline-none resize-none" /></div>
                </form>
              </div>
              
              <div className="p-6 border-t border-gray-100 flex justify-end gap-3 bg-white">
                <button type="button" onClick={() => setIsDrawerOpen(false)} className="h-11 px-6 font-medium text-gray-600 bg-white border border-gray-200 rounded-full hover:bg-gray-50">Annuler</button>
                <button type="submit" form="pos-form" className="h-11 px-8 font-medium text-white bg-[#0ea5e9] hover:bg-[#0284c7] rounded-full shadow-md shadow-sky-500/20">Sauvegarder</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}