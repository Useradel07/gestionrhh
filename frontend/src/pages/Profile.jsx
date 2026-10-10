import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import Swal from "sweetalert2";
import api from "../api/axios";
import { Search, Plus, X, ArrowLeft, Check, XCircle, Users, CalendarOff, Clock, Building2, Briefcase, Grid, Moon, Bell, MessageSquare, Menu, KeySquare, UserCircle, Shield } from "lucide-react";

export default function Profile() {
  const location = useLocation();
  const [profile, setProfile] = useState(null);
  const [passForm, setPassForm] = useState({ currentPassword: "", newPassword: "" });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get("/auth/profile");
        setProfile(response.data);
      } catch (err) {
        Swal.fire({ toast: true, position: 'top-end', icon: 'error', title: 'Erreur réseau', showConfirmButton: false, timer: 3000 });
      }
    };
    fetchProfile();
  }, []);

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.put("/auth/change-password", passForm);
      Swal.fire({
        icon: 'success',
        title: 'Mot de passe sécurisé !',
        confirmButtonColor: '#0ea5e9'
      });
      setPassForm({ currentPassword: "", newPassword: "" });
    } catch (err) {
      Swal.fire({ icon: 'error', title: 'Erreur', text: err.response?.data?.message || 'Mot de passe incorrect', confirmButtonColor: '#0ea5e9' });
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

  if (!profile) return null;

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
                <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#0ea5e9] to-[#00c292] text-white flex items-center justify-center font-bold text-sm shadow-sm">P</div>
            </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6 md:p-8">
          <div className="mb-6">
            <h1 className="text-[22px] font-bold text-gray-900">Paramètres du profil</h1>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Main Info Card */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-[20px] p-8 shadow-[0_0_20px_rgba(0,0,0,0.02)] border border-gray-100 relative overflow-hidden group">
              <div className="relative z-10">
                <div className="w-16 h-16 bg-[#e6f4ff] rounded-2xl flex items-center justify-center mb-6 text-[#0ea5e9] text-2xl font-bold">
                  {profile.name.charAt(0).toUpperCase()}
                </div>
                <h2 className="text-xl font-bold text-gray-900">{profile.name}</h2>
                <p className="text-gray-500 text-sm mb-6">{profile.email}</p>
                
                <div className="inline-block px-4 py-1.5 bg-[#f3f0ff] text-[#7c3aed] font-semibold rounded-full text-xs uppercase tracking-wider mb-8">
                  Rôle : {profile.role}
                </div>

                {profile.employee && (
                  <div className="bg-gray-50 p-5 rounded-2xl border border-gray-100">
                    <h3 className="text-sm font-bold text-gray-600 mb-4 flex items-center gap-2"><Briefcase className="w-4 h-4 text-[#0ea5e9]"/> Dossier Employé</h3>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between"><span className="text-gray-500">Matricule</span><span className="font-semibold text-gray-900">{profile.employee.matricule}</span></div>
                      <div className="flex justify-between"><span className="text-gray-500">Poste</span><span className="font-semibold text-gray-900">{profile.employee.poste}</span></div>
                      <div className="flex justify-between"><span className="text-gray-500">Département</span><span className="font-semibold text-gray-900">{profile.employee.departement}</span></div>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Security Card */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white rounded-[20px] p-8 shadow-[0_0_20px_rgba(0,0,0,0.02)] border border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2"><Shield className="w-5 h-5 text-[#00c292]"/> Sécurité</h2>
              
              <form onSubmit={handlePasswordSubmit} className="space-y-5">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">Mot de passe actuel</label>
                  <input type="password" required value={passForm.currentPassword} onChange={e=>setPassForm({...passForm, currentPassword: e.target.value})} className="w-full h-11 px-4 rounded-xl border border-gray-200 text-sm focus:border-[#0ea5e9] outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">Nouveau mot de passe</label>
                  <input type="password" required minLength="6" value={passForm.newPassword} onChange={e=>setPassForm({...passForm, newPassword: e.target.value})} className="w-full h-11 px-4 rounded-xl border border-gray-200 text-sm focus:border-[#0ea5e9] outline-none" />
                </div>
                
                <button type="submit" className="w-full h-11 mt-4 bg-[#0ea5e9] hover:bg-[#0284c7] text-white font-medium rounded-full transition-colors">
                  Mettre à jour
                </button>
              </form>
            </motion.div>
          </div>
        </main>
      </div>
    </div>
  );
}