import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Swal from "sweetalert2";
import { Loader2 } from "lucide-react";
import api from "../api/axios";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    
    try {
      const response = await api.post("/auth/login", { email, password });
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      
      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "success",
        title: "Connexion réussie",
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
      });
      
      navigate("/dashboard");
    } catch (requestError) {
      Swal.fire({
        icon: "error",
        title: "Accès refusé",
        text: requestError.response?.data?.message || "Identifiants incorrects",
        confirmButtonColor: "#0ea5e9",
        background: "#fff",
        color: "#1e293b",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen w-full flex font-sans bg-white overflow-hidden">
      {/* LEFT PANEL */}
      <div className="hidden lg:flex w-[45%] bg-[#0B132B] relative flex-col justify-center px-16 overflow-hidden">
        <div className="absolute top-0 right-0 w-full h-full pointer-events-none">
          <div className="absolute -top-[20%] -right-[10%] w-[80%] h-[60%] rounded-full bg-[#111F3E] opacity-50" />
          <div className="absolute top-[40%] right-[10%] w-[120px] h-[500px] rounded-full bg-[#0E4B82] -rotate-45 translate-x-1/2 opacity-80" />
          <div className="absolute top-[50%] right-[25%] w-[120px] h-[500px] rounded-full bg-[#0078D4] -rotate-45 translate-x-1/2 opacity-90" />
          <div className="absolute bottom-[5%] left-[10%] w-32 h-32 rounded-full bg-[#005A9E]" />
        </div>
        <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.2 }} className="relative z-10 text-white max-w-md">
          <h1 className="text-5xl font-bold leading-tight mb-6">Bienvenue sur <br /> le Portail RH</h1>
          <p className="text-slate-300 text-lg mb-10 leading-relaxed">
            Notre système aide les gestionnaires à construire une organisation solide grâce à des modules performants, clairs et bien pensés.
          </p>
          <button className="px-8 py-3.5 bg-[#0ea5e9] hover:bg-[#0284c7] text-white font-semibold rounded-full transition-colors shadow-lg shadow-sky-500/20">
            En savoir plus
          </button>
        </motion.div>
      </div>

      {/* RIGHT PANEL */}
      <div className="w-full lg:w-[55%] flex flex-col justify-center items-center p-8 sm:p-12 relative bg-white">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="w-full max-w-[420px]">
          <div className="flex flex-col items-start mb-10">
            <div className="flex items-center gap-1.5 mb-6">
              <div className="flex gap-1">
                <div className="w-2.5 h-6 bg-[#0ea5e9] rounded-full transform rotate-12"></div>
                <div className="w-2.5 h-6 bg-[#0ea5e9] rounded-full transform -rotate-12"></div>
                <div className="w-2.5 h-6 bg-[#0ea5e9] rounded-full transform rotate-12"></div>
              </div>
            </div>
            <h2 className="text-[32px] font-bold text-gray-900 tracking-tight">Connexion</h2>
            <p className="text-gray-500 text-sm mt-1">Votre tableau de bord administrateur</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-800">Email professionnel</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full px-5 py-3.5 rounded-[100px] border border-gray-200 text-gray-900 bg-white placeholder-gray-400 focus:outline-none focus:border-[#0ea5e9] focus:ring-1 focus:ring-[#0ea5e9] transition-all" placeholder="jean.dupont@entreprise.com" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-800">Mot de passe</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full px-5 py-3.5 rounded-[100px] border border-gray-200 text-gray-900 bg-white placeholder-gray-400 focus:outline-none focus:border-[#0ea5e9] focus:ring-1 focus:ring-[#0ea5e9] transition-all" placeholder="••••••••" />
            </div>
            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-[#0ea5e9] focus:ring-[#0ea5e9]" />
                <span className="text-sm text-gray-600 group-hover:text-gray-900 transition-colors">Se souvenir de cet appareil</span>
              </label>
              <a href="#" className="text-sm text-[#0ea5e9] font-medium hover:underline">Mot de passe oublié ?</a>
            </div>
            <motion.button whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }} type="submit" disabled={loading} className="w-full py-3.5 mt-2 bg-[#0ea5e9] hover:bg-[#0284c7] text-white font-semibold rounded-[100px] flex items-center justify-center transition-all shadow-md shadow-sky-500/20 disabled:opacity-70">
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Se connecter"}
            </motion.button>
          </form>
        </motion.div>
      </div>
    </main>
  );
}