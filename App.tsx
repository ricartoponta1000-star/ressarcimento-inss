
import React, { useState, useCallback } from 'react';
import { LogoSettings, AIFeedback } from './types';
import LogoPreview from './components/LogoPreview';
import LogoControls from './components/LogoControls';
import { analyzeLogo } from './services/geminiService';

// Logo fornecida (Base64 representativa da imagem enviada)
const DEFAULT_LOGO = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMgAAADICAMAAACahl6sAAAAMFBMVEVHcEz/pAD/mQD/mwD/lgD/kwD/kQD/jwD/iwD/iQD/hwD/fwD/fAD/egD/eAD/dAD///86D80SAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH6AMKDAkrE9mU7QAAAbpJREFUeNrt20mSgjAQRmFf6AGU+99pT8ArN6C6ZpCofP8idpGvSgoAAMBkYq97X9fN4/S6FvO03+NlH3m/1+7Tfq3f9W4nAAAAwK2E4f8vEof/n0f/p8f8Xp0AAMCvTidWv08nAAAAwK3f87l8394nAgAAANyaT5eYy/15AgAAANz6vR7v008fAAAA4Nb579fT5zUCAAAA3Np9H9p9XyYCAAAA3Drf9u62fU8EAAAAuPV87B57LhMBAAAAbl3P9e6uPxMBAAAAbl3vxXf3yEQAAACAW8u1pOV68kQAAACAW+ul79ZrnQgAAABw6/d6fV6/TQQAAAC49Z6p7/YxEQAAAKDJsI+832v3ab/W73o3EwAAAGAy9rr3dd08Tq9rMU/7PV72kfd77T7t1/pdb3YCAAAATEYn/H+f+H899vfqBAAAAIDJxN6L7+6RiQAAAACTidVv724vEwEAAABu/Z7v5fP2PhEAAADg1mIu8+USc5kIAAAA0KR9uvSdPk0EAAAAuPV6fV5Pp4kAAAAAt86XvdNl70wEAAAAuHW+P+8vTwQAAACAW7v7S7u7PxMBAAAAbq0Xe/VfP66WicTq9/XfXkYCAAAA/E747/Dfb8R6H62jC81mAAAAAElFTkSuQmCC";

const App: React.FC = () => {
  const [logo, setLogo] = useState<string | null>(DEFAULT_LOGO);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [feedback, setFeedback] = useState<AIFeedback | null>(null);
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
        setLogo(e.target?.result as string);
        setFeedback(null);
        setIsConfirmed(false); // Resetar para ver a nova logo na tela de confirmação se desejar
      };
      reader.readAsDataURL(file);
    }
  };

  const getAIFeedback = useCallback(async () => {
    if (!logo) return;
    setIsAnalyzing(true);
    try {
      const result = await analyzeLogo(logo);
      if (result) setFeedback(result);
    } catch (err) {
      console.error(err);
    } finally {
      setIsAnalyzing(false);
    }
  }, [logo]);

  return (
    <div className="min-h-screen pb-20 bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h1 className="text-xl font-bold text-slate-800 tracking-tight">LogoStudio<span className="text-indigo-600">Pro</span></h1>
          </div>
          <div className="hidden md:flex items-center gap-4 text-sm font-medium text-slate-600">
            <button onClick={() => {setIsConfirmed(false); setLogo(DEFAULT_LOGO);}} className="hover:text-indigo-600 transition-colors">Resetar</button>
            <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors">Exportar</button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {!isConfirmed ? (
          <div className="flex flex-col items-center justify-center min-h-[70vh] text-center">
            {/* Logo acima do botão, especialmente no mobile */}
            <div className="w-full max-w-sm mx-auto mb-8 animate-in fade-in zoom-in duration-700">
              <div className="bg-white p-8 rounded-3xl shadow-2xl shadow-slate-200 border border-slate-100 relative group overflow-hidden">
                <img 
                  src={logo || DEFAULT_LOGO} 
                  alt="Sua Logo" 
                  className="w-full h-48 object-contain transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-indigo-600/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
              </div>
            </div>

            <h2 className="text-3xl font-extrabold text-slate-900 mb-2">Identidade Detectada</h2>
            <p className="text-slate-500 mb-10 max-w-md mx-auto">Esta é a logo atual do seu projeto. Deseja prosseguir com os ajustes ou carregar uma nova?</p>
            
            <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md mx-auto">
              <button 
                onClick={() => setIsConfirmed(true)}
                className="flex-1 bg-indigo-600 text-white px-8 py-4 rounded-2xl font-bold shadow-xl shadow-indigo-100 hover:bg-indigo-700 hover:-translate-y-1 transition-all active:scale-95"
              >
                Continuar para Edição
              </button>
              
              <label className="flex-1 cursor-pointer bg-white border-2 border-slate-200 text-slate-600 px-8 py-4 rounded-2xl font-bold hover:bg-slate-50 hover:border-slate-300 transition-all text-center">
                Trocar Logo
                <input type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
              </label>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in fade-in slide-in-from-right-8 duration-500">
            {/* Sidebar Controls */}
            <div className="lg:col-span-4 space-y-6">
              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-slate-800">Arquivo Ativo</h3>
                  <label className="text-xs font-semibold text-indigo-600 cursor-pointer hover:underline">
                    Substituir
                    <input type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
                  </label>
                </div>
                <div className="bg-slate-50 border rounded-lg p-4 flex items-center gap-4">
                  <div className="w-12 h-12 bg-white rounded border flex items-center justify-center overflow-hidden">
                    <img src={logo!} alt="Thumb" className="max-w-full max-h-full object-contain" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-slate-700 truncate">logotipo_projeto.png</p>
                    <p className="text-xs text-slate-400">Dimensões ideais</p>
                  </div>
                </div>
              </div>

              <LogoControls settings={settings} setSettings={setSettings} />

              <div className="bg-indigo-900 text-white p-6 rounded-xl shadow-xl overflow-hidden relative">
                <div className="relative z-10">
                  <h3 className="font-bold text-lg mb-2">Análise com IA</h3>
                  <p className="text-indigo-200 text-sm mb-4">Feedback profissional em segundos.</p>
                  <button 
                    onClick={getAIFeedback}
                    disabled={isAnalyzing}
                    className="w-full bg-white text-indigo-900 py-2 rounded-lg font-bold text-sm hover:bg-indigo-50 transition-colors disabled:opacity-50"
                  >
                    {isAnalyzing ? 'Analisando...' : 'Obter Dicas de Design'}
                  </button>
                </div>
                <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 bg-indigo-800 rounded-full blur-3xl opacity-50"></div>
              </div>

              {feedback && (
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-slate-800">Review da IA</h3>
                    <div className="flex items-center gap-1 bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-bold">
                      Nota: {feedback.score}
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Melhorias</h4>
                      <ul className="space-y-2">
                        {feedback.suggestions.map((s, idx) => (
                          <li key={idx} className="text-sm text-slate-600 flex gap-2">
                            <span className="text-indigo-500 font-bold">•</span> {s}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Preview Area */}
            <div className="lg:col-span-8 space-y-8">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-xl font-bold text-slate-800">Visualização</h2>
                <button onClick={() => setIsConfirmed(false)} className="text-xs font-medium text-slate-400 hover:text-indigo-600 transition-colors">Voltar ao Início</button>
              </div>

              <div className="space-y-12">
                <section>
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-4">Site / Navbar</label>
                  <LogoPreview image={logo!} settings={settings} type="navbar" />
                </section>

                <section>
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-4">Landing Page Hero</label>
                  <LogoPreview image={logo!} settings={settings} type="hero" />
                </section>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                   <section>
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-4">App Icon</label>
                    <div className="bg-slate-100 rounded-2xl p-8 flex items-center justify-center">
                      <LogoPreview image={logo!} settings={settings} type="icon" />
                    </div>
                  </section>
                  <section>
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-4">Dashboard Sidebar</label>
                    <div className="bg-slate-900 rounded-2xl p-8 flex items-center justify-center overflow-hidden">
                      <LogoPreview image={logo!} settings={settings} type="sidebar" />
                    </div>
                  </section>
                </div>
              </div>

              <div className="pt-8 flex justify-end gap-4 border-t border-slate-200">
                <button className="px-8 py-3 bg-indigo-600 text-white font-bold rounded-2xl shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all">
                  Confirmar Identidade Visual
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
