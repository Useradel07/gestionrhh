import React, { useCallback, useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Swal from "sweetalert2";
import api from "../api/axios";
import { Search, Plus, X, Edit3, Trash2, Users as UsersIcon, CalendarOff, Clock, Building2, Briefcase, Grid, Moon, Bell, MessageSquare, Menu, KeySquare, UserCircle, Check, XCircle, Shield } from "lucide-react";

export default function Users() {
  const location = useLocation();
  const [users, setUsers] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [form, setForm] = useState({ employeeId: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [usersRes, employeesRes] = await Promise.all([api.get("/users"), api.get("/employees")]);
      setUsers(Array.isArray(usersRes.data) ? usersRes.data : usersRes.data.users || []);
      setEmployees(Array.isArray(employeesRes.data) ? employeesRes.data : employeesRes.data.employees || []);
    } catch (err) {
      Swal.fire({ toast: true, position: 'top-end', icon: 'error', title: 'Erreur réseau', showConfirmButton: false, timer: 3000 });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/users/employee", form);
      Swal.fire({ toast: true, position: 'top-end', icon: 'success', title: 'Compte créé', showConfirmButton: false, timer: 2000 });
      setForm({ employeeId: "", password: "" });
      setIsDrawerOpen(false);
      fetchData();
    } catch (err) {
      Swal.fire({ icon: 'error', title: 'Erreur', text: err.response?.data?.message || 'Impossible de créer le compte', confirmButtonColor: '#0ea5e9' });
    }
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
          <NavItem to="/employees" icon={UsersIcon} label="Employés" />
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
            <h1 className="text-[22px] font-bold text-gray-900">Accès Utilisateurs</h1>
            <button onClick={() => setIsDrawerOpen(true)} className="h-10 px-5 bg-[#0ea5e9] hover:bg-[#0284c7] text-white text-sm font-medium rounded-full flex items-center gap-2 shadow-sm transition-colors">
              <Plus className="w-4 h-4" /> Créer un compte
            </button>
          </div>

          <div className="bg-white rounded-[20px] shadow-[0_0_20px_rgba(0,0,0,0.02)] border border-gray-100 overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-white border-b border-gray-100">
                <tr>
                  <th className="px-6 py-5 text-xs font-semibold text-gray-500 uppercase">Nom d'utilisateur</th>
                  <th className="px-6 py-5 text-xs font-semibold text-gray-500 uppercase">Email</th>
                  <th className="px-6 py-5 text-xs font-semibold text-gray-500 uppercase">Rôle Système</th>
                  <th className="px-6 py-5 text-xs font-semibold text-gray-500 uppercase">Lien Employé</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {!loading && users.map((user) => (
                  <tr key={user._id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 flex items-center gap-3 font-semibold text-gray-900">
                      <div className="w-8 h-8 rounded-full bg-[#f4f7fb] flex items-center justify-center text-[#0ea5e9]"><KeySquare className="w-4 h-4"/></div>
                      {user.name}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{user.email}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-[11px] font-bold ${user.role === "admin" ? "bg-[#f3f0ff] text-[#7c3aed]" : "bg-[#e6f4ff] text-[#0ea5e9]"}`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-700">
                      {user.employee ? user.employee.matricule : <span className="text-gray-400 italic">Non lié</span>}
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
                <h2 className="text-lg font-bold text-gray-900">Nouveau Compte</h2>
                <button onClick={() => setIsDrawerOpen(false)} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full"><X className="w-5 h-5"/></button>
              </div>
              
              <div className="flex-1 overflow-y-auto p-6">
                <form id="user-form" onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5">Dossier Employé *</label>
                    <select required value={form.employeeId} onChange={e=>setForm({...form, employeeId: e.target.value})} className="w-full h-11 px-4 rounded-xl border border-gray-200 text-sm bg-white focus:border-[#0ea5e9] outline-none text-gray-700">
                      <option value="">-- Choisir un employé --</option>
                      {employees.map((emp) => <option key={emp._id || emp.id} value={emp._id || emp.id}>{emp.nom} {emp.prenom} ({emp.email})</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5">Mot de passe provisoire *</label>
                    <input type="password" required minLength="6" value={form.password} onChange={e=>setForm({...form, password: e.target.value})} className="w-full h-11 px-4 rounded-xl border border-gray-200 text-sm focus:border-[#0ea5e9] outline-none" />
                  </div>
                </form>
              </div>
              
              <div className="p-6 border-t border-gray-100 flex justify-end gap-3 bg-white">
                <button type="button" onClick={() => setIsDrawerOpen(false)} className="h-11 px-6 font-medium text-gray-600 bg-white border border-gray-200 rounded-full hover:bg-gray-50">Annuler</button>
                <button type="submit" form="user-form" className="h-11 px-8 font-medium text-white bg-[#0ea5e9] hover:bg-[#0284c7] rounded-full shadow-md shadow-sky-500/20">Créer l'accès</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}