import React from 'react';
import { X, Settings, Type, Check, Sun, Moon } from 'lucide-react';
import { FontPreset } from '../types';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  fontPreset: FontPreset;
  onChangeFontPreset: (preset: FontPreset) => void;
  darkMode: boolean;
  onToggleDarkMode: (value: boolean) => void;
}

interface FontOption {
  id: FontPreset;
  name: string;
  tag: string;
  pairLabel: string;
  description: string;
  titleClass: string;
  bodyClass: string;
}

const FONT_OPTIONS: FontOption[] = [
  {
    id: 'moderna',
    name: 'Moderna',
    tag: 'Por defecto',
    pairLabel: 'Outfit + Plus Jakarta Sans',
    description: 'Tipografía geométrica contemporánea, directa y ligera para lectura rápida en pantalla.',
    titleClass: 'preview-font-moderna-title',
    bodyClass: 'preview-font-moderna-body',
  },
  {
    id: 'clasica',
    name: 'Clásica',
    tag: 'Editorial',
    pairLabel: 'Playfair Display + Lora',
    description: 'Estilo tradicional tipo carta impresa con serifas de alto contraste y lectura pausada.',
    titleClass: 'preview-font-clasica-title',
    bodyClass: 'preview-font-clasica-body',
  },
];

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  fontPreset,
  onChangeFontPreset,
  darkMode,
  onToggleDarkMode,
}) => {
  if (!isOpen) return null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-150"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full sm:max-w-lg bg-white dark:bg-[#161616] text-neutral-900 dark:text-neutral-100 rounded-t-3xl sm:rounded-2xl max-h-[90vh] flex flex-col overflow-hidden shadow-2xl border border-neutral-200 dark:border-neutral-800 animate-in slide-in-from-bottom sm:zoom-in-95 duration-200"
      >
        {/* Header */}
        <div className="p-5 border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50/80 dark:bg-neutral-900/80 flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-black text-base sm:text-lg leading-tight">Configuración</h2>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                Personaliza la tipografía y apariencia del menú
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Cerrar configuración"
            className="p-2 rounded-xl text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 hover:bg-neutral-200 dark:hover:bg-neutral-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-5 flex-1">
          {/* Typography Preset Selector */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 flex items-center gap-1.5">
                <Type className="w-3.5 h-3.5 text-amber-500" />
                <span>Combinación de fuentes</span>
              </label>
              <span className="text-[11px] text-neutral-400">2 estilos</span>
            </div>

            <div className="grid grid-cols-1 gap-3">
              {FONT_OPTIONS.map((option) => {
                const isSelected = fontPreset === option.id;
                return (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => onChangeFontPreset(option.id)}
                    className={`w-full p-4 rounded-2xl border text-left transition-all space-y-3 ${
                      isSelected
                        ? 'border-amber-500 bg-amber-50/70 dark:bg-amber-950/25 ring-2 ring-amber-500/20'
                        : 'border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/60 hover:border-zinc-300 dark:hover:border-zinc-700'
                    }`}
                  >
                    {/* Title Row */}
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-black text-sm sm:text-base text-zinc-950 dark:text-zinc-50">
                            {option.name}
                          </span>
                          <span className="text-[11px] font-medium text-zinc-500 dark:text-zinc-400">
                            · {option.tag}
                          </span>
                        </div>
                        <span className="text-[11px] font-semibold text-amber-700 dark:text-amber-400 block mt-0.5">
                          {option.pairLabel}
                        </span>
                      </div>

                      <span
                        className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 transition-colors ${
                          isSelected
                            ? 'bg-amber-500 text-zinc-950'
                            : 'border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900'
                        }`}
                      >
                        {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                      </span>
                    </div>

                    <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                      {option.description}
                    </p>

                    {/* Live Font Preview Card */}
                    <div className="p-3 rounded-xl bg-white dark:bg-[#121215] border border-zinc-200 dark:border-zinc-800 space-y-1">
                      <div className="flex items-center justify-between gap-2">
                        <span className={`${option.titleClass} font-bold text-sm text-zinc-950 dark:text-zinc-50`}>
                          Hot Dog Ranchero Especial
                        </span>
                        <span className={`${option.bodyClass} text-xs font-black text-amber-700 dark:text-amber-400 tabular-nums`}>
                          $115 MXN
                        </span>
                      </div>
                      <p className={`${option.bodyClass} text-xs text-zinc-500 dark:text-zinc-400 leading-snug`}>
                        Salchicha, jamón, queso, chile anaheim, tocino y carne asada.
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Theme Appearance Toggle */}
          <div className="space-y-2.5 pt-3 border-t border-neutral-200/80 dark:border-neutral-800">
            <label className="text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 block">
              Tema visual
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => onToggleDarkMode(false)}
                className={`p-3 rounded-xl border flex items-center justify-center gap-2 text-xs font-bold transition-all ${
                  !darkMode
                    ? 'border-amber-500 bg-amber-50/70 dark:bg-amber-950/30 text-amber-950 dark:text-amber-200 ring-2 ring-amber-500/20'
                    : 'border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400'
                }`}
              >
                <Sun className="w-4 h-4 text-amber-600" />
                <span>Modo Claro</span>
              </button>

              <button
                type="button"
                onClick={() => onToggleDarkMode(true)}
                className={`p-3 rounded-xl border flex items-center justify-center gap-2 text-xs font-bold transition-all ${
                  darkMode
                    ? 'border-amber-500 bg-amber-950/30 text-amber-300 ring-2 ring-amber-500/20'
                    : 'border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400'
                }`}
              >
                <Moon className="w-4 h-4 text-amber-400" />
                <span>Modo Oscuro</span>
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 sm:p-5 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/60 flex items-center justify-between gap-3 shrink-0">
          <span className="text-[11px] text-zinc-500">
            Preferencia guardada automáticamente
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-zinc-950 hover:bg-amber-500 hover:text-zinc-950 dark:bg-amber-500 dark:hover:bg-amber-400 text-white dark:text-zinc-950 font-bold text-xs sm:text-sm transition-colors shadow-xs"
          >
            Listo
          </button>
        </div>
      </div>
    </div>
  );
};
