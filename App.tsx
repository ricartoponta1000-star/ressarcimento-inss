import React, { useState, useCallback } from 'react';
import { LogoSettings, AIFeedback } from './types';
import LogoPreview from './components/LogoPreview';
import LogoControls from './components/LogoControls';
import { analyzeLogo } from './services/geminiService';

// NOVA LOGO
const DEFAULT_LOGO = "https://xatimg.com/image/2ZhD42Le0MmD.jpg";

const App: React.FC = () => {
  const [logo, setLogo] = useState<string | null>(DEFAULT_LOGO);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [feedback, setFeedback] = useState<AIFeedback | null>({
    score: 92,
    suggestions: [
      "O design modular no centro simboliza dinamismo e tecnologia, mantenha esta clareza.",
      "As curvas externas amarelas e verdes criam um enquadramento que foca o olhar no centro.",
      "Considere uma versão monocromática para aplicações em fundos complexos.",
      "A proporção áurea está bem aplicada na elipse principal.",
      "Excelente contraste entre o azul corporativo e o amarelo vibrante."
    ],
    accessibilityNote: "Excelente legibilidade cromática. O contraste entre azul e branco atende aos padrões WCAG AAA."
  });
  const [settings, setSettings] = useState<LogoSettings>({
    brightness: 100,
    contrast: 100,
    grayscale: 0,
    scale: 100,
    hueRotate: 0,
  });

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setLogo(result);
        setIsConfirmed(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const getAIFeedback = useCallback(async () => {
    if (!logo) return;
    setIsAnalyzing(true);
    try {
      const cleanBase64 = logo.includes(',') ? logo : logo; 
      const result = await analyzeLogo(cleanBase64);
      if (result) setFeedback(result);
    } catch (err) {
      console.error("Erro na análise da IA:", err);
    } finally {
      setIsAnalyzing(false);
    }
  }, [logo]);

  return (
    <div className="min-h-screen pb-10 bg-slate-50 flex flex-col font-sans overflow-x-hidden">
      {/* Header Fixo */}
      <header className="bg-white/95 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-200">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h1 className="text-base font-black text-slate-900 uppercase tracking-tighter">LogoStudio <span className="text-blue-600">Pro</span></h1>
          </div>
          {isConfirmed && (
            <button 
              onClick={() => setIsConfirmed(false)} 
              className="text-[11px] font-bold text-slate-500 hover:text-blue-600 transition-all uppercase tracking-widest px-4 py-2 bg-slate-100 rounded-full hover:bg-blue-50"
            >
              Trocar Logo
            </button>
          )}
        </div>
      </header>

      <main className="flex-1 flex flex-col max-w-7xl mx-auto px-4 w-full py-4">
        {!isConfirmed ? (
          <div className="flex-1 flex flex-col items-center justify-center min-h-[80vh] w-full max-w-2xl mx-auto space-y-12">
            
            <div className="text-center space-y-2">
              <span className="text-blue-600 font-black text-[10px] uppercase tracking-[0.4em]">Identidade Visual Carregada</span>
              <h2 className="text-3xl font-black text-slate-900 leading-tight tracking-tighter sm:text-4xl">Studio de Visualização</h2>
            </div>

            {/* LOGO CENTRALIZADA COM DESTAQUE */}
            <div className="w-full flex justify-center animate-in fade-in zoom-in duration-700">
              <div className="bg-white p-10 sm:p-20 rounded-[3rem] shadow-[0_32px_64px_-15px_rgba(0,0,0,0.1)] border border-slate-100 flex items-center justify-center w-full max-w-lg aspect-square relative group">
                <div className="absolute inset-0 bg-gradient-to-tr from-blue-50/50 to-transparent rounded-[3rem] pointer-events-none"></div>
                <img 
                  src={logo || DEFAULT_LOGO} 
                  alt="Identidade Visual Principal" 
                  className="w-full h-full object-contain drop-shadow-[0_10px_20px_rgba(0,0,0,0.08)] transition-transform duration-500 group-hover:scale-110"
                  onError={(e) => { 
                    (e.target as HTMLImageElement).src = DEFAULT_LOGO; 
                  }}
                />
              </div>
            </div>

            {/* AÇÕES */}
            <div className="w-full max-w-sm space-y-4 pt-4">
              <button 
                onClick={() => setIsConfirmed(true)}
                className="w-full bg-blue-600 text-white py-5 rounded-2xl font-black text-lg shadow-xl shadow-blue-200 hover:bg-blue-700 active:scale-[0.98] transition-all uppercase tracking-widest"
              >
                Gerar Aplicações
              </button>
              
              <label className="w-full flex items-center justify-center cursor-pointer bg-white border border-slate-200 text-slate-500 py-4 rounded-2xl font-bold text-xs hover:bg-slate-50 hover:border-blue-200 transition-all uppercase tracking-widest shadow-sm">
                <svg className="w-4 h-4 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                Fazer Upload de Outra
                <input type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
              </label>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 w-full animate-in fade-in slide-in-from-bottom-8 duration-500">
            {/* Painel Lateral */}
            <div className="lg:col-span-4 space-y-6">
              <div className="bg-white p-6 rounded-[2.5rem] border border-slate-200 shadow-sm">
                <h3 className="font-black text-[10px] uppercase tracking-[0.2em] text-slate-400 mb-6 flex items-center gap-2">
                  <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                  Configurações de Render
                </h3>
                <LogoControls settings={settings} setSettings={setSettings} />
              </div>

              <div className="bg-slate-900 text-white p-8 rounded-[2.5rem] shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/20 blur-[60px]"></div>
                <div className="relative z-10">
                  <div className="flex items-center gap-2 mb-6">
                    <span className="px-2 py-0.5 bg-blue-600 rounded text-[9px] font-black uppercase">AI Engine</span>
                    <h3 className="font-black text-[10px] uppercase tracking-[0.2em] text-slate-400">Análise de Brand Equity</h3>
                  </div>
                  <div className="space-y-5">
                    {feedback?.suggestions.map((s, idx) => (
                      <div key={idx} className="flex gap-4 items-start group">
                        <div className="w-6 h-6 bg-slate-800 rounded-lg flex items-center justify-center flex-shrink-0 text-[10px] font-black text-blue-400 border border-slate-700 transition-all group-hover:border-blue-500">{idx + 1}</div>
                        <p className="text-xs text-slate-300 leading-relaxed font-medium">{s}</p>
                      </div>
                    ))}
                  </div>
                  <button 
                    onClick={getAIFeedback}
                    disabled={isAnalyzing}
                    className="mt-10 w-full bg-white text-slate-900 py-4 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-blue-50 transition-all disabled:opacity-50"
                  >
                    {isAnalyzing ? 'Processando Imagem...' : 'Atualizar Diagnóstico'}
                  </button>
                </div>
              </div>
            </div>

            {/* Grid de Mockups */}
            <div className="lg:col-span-8 space-y-10">
              <div className="flex items-center justify-between border-b border-slate-200 pb-6">
                <div>
                  <h2 className="text-2xl font-black text-slate-900 tracking-tighter">PREVIEW DE CONTEXTO</h2>
                  <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mt-1">Como sua marca se comporta no mundo real</p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-12">
                <section>
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-[0.4em] block mb-4">Plataforma Digital / Navbar</label>
                  <div className="rounded-2xl overflow-hidden shadow-xl border border-slate-100 bg-white">
                    <LogoPreview image={logo!} settings={settings} type="navbar" />
                  </div>
                </section>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                   <section>
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-[0.4em] block mb-4">App Launcher Icon</label>
                    <div className="bg-white rounded-[3rem] p-12 flex flex-col items-center justify-center border border-slate-200 shadow-sm group">
                      <LogoPreview image={logo!} settings={settings} type="icon" />
                    </div>
                  </section>
                  <section>
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-[0.4em] block mb-4">Sistema Operacional / Sidebar</label>
                    <div className="bg-slate-950 rounded-[3rem] p-8 flex items-center justify-center overflow-hidden border border-slate-800 shadow-2xl">
                      <LogoPreview image={logo!} settings={settings} type="sidebar" />
                    </div>
                  </section>
                </div>

                <section>
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-[0.4em] block mb-4">Marketing / Hero Section</label>
                  <div className="rounded-[3.5rem] overflow-hidden shadow-2xl border border-white">
                    <LogoPreview image={logo!} settings={settings} type="hero" />
                  </div>
                </section>
              </div>

              <div className="pt-10 flex flex-col sm:flex-row gap-4 items-center justify-between">
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">© 2024 Design Studio Export</p>
                <button className="w-full sm:w-auto px-12 py-5 bg-blue-600 text-white font-black text-xs uppercase rounded-2xl shadow-xl shadow-blue-100 hover:bg-blue-700 transition-all tracking-[0.2em] flex items-center justify-center gap-3">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                  Exportar Kit de Marca
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      <footer className="text-center py-12 opacity-30">
        <p className="text-[9px] font-black uppercase tracking-[0.6em] text-slate-900">LogoStudio Pro • High Fidelity Preview</p>
      </footer>
    </div>
  );
};

export default App;
