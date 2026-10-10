import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import Swal from "sweetalert2";
import api from "../api/axios";
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { Search, Plus, X, Edit3, Trash2, Users, CalendarOff, Clock, Building2, Briefcase, Grid, Moon, Bell, MessageSquare, Menu, KeySquare, UserCircle, Check, XCircle, Shield } from "lucide-react";

export default function Dashboard() {
  const location = useLocation();
  const [stats, setStats] = useState({ totalEmployees: 0, totalLeaves: 0, totalAbsences: 0, employeesByDepartment: [], absencesByType: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const [statsRes, employeesRes, leavesRes, absencesRes] = await Promise.all([
          api.get("/dashboard/stats").catch(() => ({ data: {} })),
          api.get("/employees").catch(() => ({ data: [] })),
          api.get("/leaves").catch(() => ({ data: [] })),
          api.get("/absences").catch(() => ({ data: [] }))
        ]);

        setStats({
          employeesByDepartment: statsRes.data.employeesByDepartment || [],
          absencesByType: statsRes.data.absencesByType || [],
          totalEmployees: Array.isArray(employeesRes.data) ? employeesRes.data.length : 0,
          totalLeaves: Array.isArray(leavesRes.data) ? leavesRes.data.length : 0,
          totalAbsences: Array.isArray(absencesRes.data) ? absencesRes.data.length : 0
        });
      } catch (err) {
        Swal.fire({ toast: true, position: 'top-end', icon: 'error', title: 'Erreur réseau', showConfirmButton: false, timer: 3000 });
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const PIE_COLORS = ["#00c292", "#0ea5e9", "#7c3aed", "#ff5c8e", "#f59e0b"];

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
            <Search className="w-5 h-5 cursor-pointer hover:text-gray-600" />
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-[#fff0f4] rounded-[20px] p-6 flex flex-col justify-between h-[160px]">
              <div className="flex justify-between items-start">
                <div className="w-12 h-12 bg-[#ff5c8e] rounded-full flex items-center justify-center text-white shadow-sm"><Users className="w-6 h-6" /></div>
                <div className="flex flex-col items-end"><span className="text-gray-600 font-medium text-sm">Total Employés</span><span className="text-gray-400 cursor-pointer">⋮</span></div>
              </div>
              <div>
                <h3 className="text-[32px] font-bold text-gray-900 leading-none">{loading ? "..." : stats.totalEmployees}</h3>
                <span className="text-[11px] font-medium text-[#ff5c8e] bg-white/50 px-2 py-0.5 rounded-full mt-2 inline-block">Effectif global</span>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-[#f3f0ff] rounded-[20px] p-6 flex flex-col justify-between h-[160px]">
              <div className="flex justify-between items-start">
                <div className="w-12 h-12 bg-[#7c3aed] rounded-full flex items-center justify-center text-white shadow-sm"><CalendarOff className="w-6 h-6" /></div>
                <div className="flex flex-col items-end"><span className="text-gray-600 font-medium text-sm">Total Congés</span><span className="text-gray-400 cursor-pointer">⋮</span></div>
              </div>
              <div>
                <h3 className="text-[32px] font-bold text-gray-900 leading-none">{loading ? "..." : stats.totalLeaves}</h3>
                <span className="text-[11px] font-medium text-[#7c3aed] bg-white/50 px-2 py-0.5 rounded-full mt-2 inline-block">Demandes enregistrées</span>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-[#e6fffa] rounded-[20px] p-6 flex flex-col justify-between h-[160px]">
              <div className="flex justify-between items-start">
                <div className="w-12 h-12 bg-[#00c292] rounded-full flex items-center justify-center text-white shadow-sm"><Clock className="w-6 h-6" /></div>
                <div className="flex flex-col items-end"><span className="text-gray-600 font-medium text-sm">Total Absences</span><span className="text-gray-400 cursor-pointer">⋮</span></div>
              </div>
              <div>
                <h3 className="text-[32px] font-bold text-gray-900 leading-none">{loading ? "..." : stats.totalAbsences}</h3>
                <span className="text-[11px] font-medium text-[#00c292] bg-white/50 px-2 py-0.5 rounded-full mt-2 inline-block">Pointages et retards</span>
              </div>
            </motion.div>
          </div>

          {!loading && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-white rounded-[20px] p-6 shadow-sm border border-gray-100">
                <div className="flex justify-between items-center mb-6"><h3 className="text-lg font-bold text-gray-900">Effectifs par département</h3><span className="text-gray-400 cursor-pointer">⋮</span></div>
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={stats.employeesByDepartment} margin={{ top: 10, right: 10, bottom: 0, left: -20 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="name" stroke="#94a3b8" tickLine={false} axisLine={false} fontSize={12} dy={10} />
                      <YAxis stroke="#94a3b8" tickLine={false} axisLine={false} fontSize={12} allowDecimals={false} />
                      <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }} />
                      <Bar dataKey="value" fill="#0ea5e9" radius={[4, 4, 4, 4]} barSize={30} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="bg-white rounded-[20px] p-6 shadow-sm border border-gray-100">
                <div className="flex justify-between items-center mb-6"><h3 className="text-lg font-bold text-gray-900">Répartition des absences</h3><span className="text-gray-400 cursor-pointer">⋮</span></div>
                <div className="h-64 w-full relative">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={stats.absencesByType} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={70} outerRadius={90} paddingAngle={5} stroke="none">
                        {stats.absencesByType?.map((entry, index) => <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />)}
                      </Pie>
                      <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </motion.div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}