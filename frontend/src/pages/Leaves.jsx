import React, { useState, useEffect, useCallback } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Swal from "sweetalert2";
import api from "../api/axios";
import { Search, Plus, X, Edit3, Trash2, Users, CalendarOff, Clock, Building2, Briefcase, Grid, Moon, Bell, MessageSquare, Menu, KeySquare, UserCircle, Check, XCircle, Shield } from "lucide-react";

export default function Leaves() {
    const location = useLocation();
    const [leaves, setLeaves] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [form, setForm] = useState({ employee: "", typeConge: "Congé annuel", dateDebut: "", dateFin: "", motif: "" });

    const fetchData = useCallback(async () => {
        try {
            const [lRes, eRes] = await Promise.all([api.get("/leaves"), api.get("/employees")]);
            setLeaves(lRes.data);
            setEmployees(eRes.data);
        } catch (err) {
            Swal.fire({ toast: true, position: 'top-end', icon: 'error', title: 'Erreur réseau', showConfirmButton: false, timer: 3000 });
        }
    }, []);

    useEffect(() => { fetchData(); }, [fetchData]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post("/leaves", form);
            Swal.fire({ toast: true, position: 'top-end', icon: 'success', title: 'Demande envoyée', showConfirmButton: false, timer: 2000 });
            fetchData();
            setIsDrawerOpen(false);
        } catch (err) {
            Swal.fire({ icon: 'error', title: 'Erreur', text: err.response?.data?.message || 'Dates invalides', confirmButtonColor: '#0ea5e9' });
        }
    };

    const handleAction = async (id, action) => {
        const isApprove = action === "approve";
        Swal.fire({
            title: isApprove ? 'Approuver ?' : 'Refuser ?',
            input: 'text',
            inputPlaceholder: 'Commentaire optionnel...',
            icon: isApprove ? 'success' : 'error',
            showCancelButton: true,
            confirmButtonColor: isApprove ? '#00c292' : '#ff5c8e',
            confirmButtonText: 'Confirmer',
            cancelButtonText: 'Annuler'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await api.put(`/leaves/${id}/${action}`, { commentaireAdmin: result.value });
                    Swal.fire({ toast: true, position: 'top-end', icon: 'success', title: 'Statut mis à jour', showConfirmButton: false, timer: 2000 });
                    fetchData();
                } catch (err) {
                    Swal.fire('Erreur', 'Action impossible', 'error');
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
                    </div>
                    <div className="flex items-center gap-5 text-gray-400">
                        <Link to="/profile">
                            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#0ea5e9] to-[#00c292] text-white flex items-center justify-center font-bold text-sm shadow-sm cursor-pointer ml-2">P</div>
                        </Link>
                    </div>
                </header>

                <main className="flex-1 overflow-y-auto p-6 md:p-8">
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-[22px] font-bold text-gray-900">Demandes de Congés</h1>
                        <button onClick={() => setIsDrawerOpen(true)} className="h-10 px-5 bg-[#0ea5e9] hover:bg-[#0284c7] text-white text-sm font-medium rounded-full flex items-center gap-2 shadow-sm transition-colors">
                            <Plus className="w-4 h-4" /> Saisir une demande
                        </button>
                    </div>

                    <div className="bg-white rounded-[20px] shadow-[0_0_20px_rgba(0,0,0,0.02)] border border-gray-100 overflow-hidden">
                        <table className="w-full text-left">
                            <thead className="bg-white border-b border-gray-100">
                                <tr>
                                    <th className="px-6 py-5 text-xs font-semibold text-gray-500 uppercase">Employé</th>
                                    <th className="px-6 py-5 text-xs font-semibold text-gray-500 uppercase">Période</th>
                                    <th className="px-6 py-5 text-xs font-semibold text-gray-500 uppercase">Motif</th>
                                    <th className="px-6 py-5 text-xs font-semibold text-gray-500 uppercase">Statut</th>
                                    <th className="px-6 py-5 text-right text-xs font-semibold text-gray-500 uppercase">Validation</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {leaves.map((leave) => (
                                    <tr key={leave._id} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="px-6 py-4 font-semibold text-gray-900">{leave.employee?.prenom} {leave.employee?.nom}</td>
                                        <td className="px-6 py-4 text-sm text-gray-600">
                                            {leave.dateDebut?.split('T')[0]} <span className="mx-1 text-gray-300">→</span> {leave.dateFin?.split('T')[0]}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm text-gray-800 font-medium">{leave.typeConge}</div>
                                            <div className="text-xs text-gray-400 truncate max-w-[200px] mt-0.5">{leave.motif || "-"}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-3 py-1 rounded-full text-[11px] font-bold ${
                                                leave.statut === "Approuvé" ? "bg-[#e6fffa] text-[#00c292]" : 
                                                leave.statut === "Refusé" ? "bg-[#fff0f4] text-[#ff5c8e]" : "bg-[#f3f0ff] text-[#7c3aed]"
                                            }`}>
                                                {leave.statut}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            {leave.statut === "En attente" && (
                                                <div className="flex justify-end gap-2">
                                                    <button onClick={() => handleAction(leave._id, "approve")} className="p-2 text-[#00c292] bg-[#e6fffa] hover:bg-[#00c292] hover:text-white rounded-full transition-colors"><Check className="w-4 h-4" /></button>
                                                    <button onClick={() => handleAction(leave._id, "reject")} className="p-2 text-[#ff5c8e] bg-[#fff0f4] hover:bg-[#ff5c8e] hover:text-white rounded-full transition-colors"><XCircle className="w-4 h-4" /></button>
                                                </div>
                                            )}
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
                                <h2 className="text-lg font-bold text-gray-900">Nouvelle Demande</h2>
                                <button onClick={() => setIsDrawerOpen(false)} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full"><X className="w-5 h-5" /></button>
                            </div>
                            <div className="flex-1 overflow-y-auto p-6">
                                <form id="leave-form" onSubmit={handleSubmit} className="space-y-5">
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-600 mb-1.5">Employé</label>
                                        <select required value={form.employee} onChange={e => setForm({ ...form, employee: e.target.value })} className="w-full h-11 px-4 rounded-xl border border-gray-200 text-sm focus:border-[#0ea5e9] outline-none bg-white text-gray-700">
                                            <option value="">Sélectionnez...</option>
                                            {employees.map(emp => <option key={emp._id} value={emp._id}>{emp.prenom} {emp.nom}</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-600 mb-1.5">Motif de l'absence</label>
                                        <textarea rows="4" required value={form.motif} onChange={e => setForm({ ...form, motif: e.target.value })} className="w-full p-4 rounded-xl border border-gray-200 text-sm focus:border-[#0ea5e9] outline-none text-gray-700 resize-none" placeholder="Description..."></textarea>
                                    </div>
                                </form>
                            </div>
                            <div className="p-6 border-t border-gray-100 flex justify-end gap-3 bg-white">
                                <button onClick={() => setIsDrawerOpen(false)} className="h-11 px-6 font-medium text-gray-600 bg-white border border-gray-200 rounded-full hover:bg-gray-50">Annuler</button>
                                <button type="submit" form="leave-form" className="h-11 px-8 font-medium text-white bg-[#0ea5e9] hover:bg-[#0284c7] rounded-full shadow-md shadow-sky-500/20">Envoyer</button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}