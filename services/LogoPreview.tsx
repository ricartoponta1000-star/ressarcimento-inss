import React from 'react';
import { LogoSettings } from '../types';
export const LogoPreview: React.FC<{settings:LogoSettings}> = ({settings}) => <div>{settings.name}</div>;
import React from 'react';
import { LogoSettings } from '../types';

interface LogoPreviewProps {
  image: string;
  settings: LogoSettings;
  type: 'navbar' | 'icon' | 'hero' | 'sidebar';
}

const LogoPreview: React.FC<LogoPreviewProps> = ({ image, settings, type }) => {
  const filterString = `brightness(${settings.brightness}%) contrast(${settings.contrast}%) grayscale(${settings.grayscale}%) hue-rotate(${settings.hueRotate}deg)`;
  const scaleStyle = { transform: `scale(${settings.scale / 100})` };

  const renderContent = () => {
    switch (type) {
      case 'navbar':
        return (
          <div className="w-full bg-white p-4 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="h-8 w-auto overflow-hidden flex items-center">
                <img 
                  src={image} 
                  alt="Logo" 
                  className="h-full w-auto object-contain transition-all" 
                  style={{ filter: filterString, ...scaleStyle }} 
                />
              </div>
              <span className="font-black text-slate-900 text-sm tracking-tighter uppercase">Meu App</span>
            </div>
            <div className="flex space-x-6 text-[10px] font-black uppercase tracking-widest text-slate-400">
              <span className="text-blue-600">Dashboard</span>
              <span>Relatórios</span>
              <span>Ajustes</span>
            </div>
          </div>
        );
      case 'icon':
        return (
          <div className="flex flex-col items-center">
            <div className="w-24 h-24 bg-blue-600 rounded-[2rem] shadow-xl shadow-blue-100 flex items-center justify-center p-5 mb-4 overflow-hidden relative group">
               <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity"></div>
               <img 
                src={image} 
                alt="Logo" 
                className="w-full h-full object-contain drop-shadow-md" 
                style={{ filter: filterString, ...scaleStyle }} 
              />
            </div>
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em]">Ícone Mobile</span>
          </div>
        );
      case 'sidebar':
        return (
          <div className="w-full h-64 p-8 flex flex-col">
            <div className="mb-10 flex items-center gap-4">
              <div className="h-7 w-auto overflow-hidden flex items-center">
                <img 
                  src={image} 
                  alt="Logo" 
                  className="h-full w-auto object-contain brightness-0 invert" 
                  style={{ filter: filterString, ...scaleStyle }} 
                />
              </div>
              <span className="text-white font-black text-xs tracking-widest uppercase">Console</span>
            </div>
            <div className="space-y-5">
              <div className="h-1.5 w-full bg-slate-800 rounded-full"></div>
              <div className="h-1.5 w-3/4 bg-slate-800 rounded-full"></div>
              <div className="h-1.5 w-5/6 bg-blue-900/40 rounded-full"></div>
              <div className="h-1.5 w-1/2 bg-slate-800 rounded-full"></div>
            </div>
          </div>
        );
      case 'hero':
        return (
          <div className="w-full bg-gradient-to-br from-blue-600 to-blue-800 p-16 flex flex-col items-center text-center relative overflow-hidden">
             <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                <div className="absolute top-10 right-10 w-64 h-64 bg-white rounded-full blur-[100px]"></div>
                <div className="absolute bottom-10 left-10 w-64 h-64 bg-amber-400 rounded-full blur-[100px]"></div>
             </div>
             <img 
                src={image} 
                alt="Logo" 
                className="h-28 w-auto object-contain mb-10 drop-shadow-[0_20px_40px_rgba(0,0,0,0.2)]" 
                style={{ filter: filterString, ...scaleStyle }} 
              />
            <h1 className="text-4xl font-black text-white mb-4 tracking-tighter uppercase italic">Nova Identidade Visual</h1>
            <p className="text-blue-100/80 text-xs font-bold uppercase tracking-[0.2em] max-w-md mx-auto leading-relaxed">
              Visualização de alta performance para marcas modernas e dinâmicas.
            </p>
          </div>
        );
    }
  };

  return <div className="transition-all duration-300 h-full">{renderContent()}</div>;
};

export default LogoPreview;
