import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Search, X, ChevronRight, ChevronLeft, Heart, Mic, MicOff, Star } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { CategoryFilter } from '../types';
import { CATEGORIES } from '../data/menuData';

interface SpeechRecognitionAlternativeLike {
  transcript: string;
  confidence: number;
}

interface SpeechRecognitionResultLike {
  isFinal: boolean;
  length: number;
  [index: number]: SpeechRecognitionAlternativeLike;
}

interface SpeechRecognitionEventLike {
  resultIndex: number;
  results: {
    length: number;
    [index: number]: SpeechRecognitionResultLike;
  };
}

interface SpeechRecognitionErrorEventLike {
  error: string;
}

interface SpeechRecognitionInstance {
  lang: string;
  interimResults: boolean;
  continuous: boolean;
  maxAlternatives: number;
  onstart: (() => void) | null;
  onresult: ((event: SpeechRecognitionEventLike) => void) | null;
  onerror: ((event: SpeechRecognitionErrorEventLike) => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
  abort: () => void;
}

type SpeechRecognitionConstructor = new () => SpeechRecognitionInstance;

interface WindowWithSpeech extends Window {
  SpeechRecognition?: SpeechRecognitionConstructor;
  webkitSpeechRecognition?: SpeechRecognitionConstructor;
}

function getSpeechRecognitionConstructor(): SpeechRecognitionConstructor | null {
  if (typeof window === 'undefined') return null;
  const w = window as WindowWithSpeech;
  return w.SpeechRecognition || w.webkitSpeechRecognition || null;
}

function normalizeSpokenQuery(raw: string): string {
  return raw
    .trim()
    .replace(/[.,!?¿¡]+$/g, '')
    .replace(/^(?:busca|buscar|búscame|quiero|muéstrame|mostrar|ver|filtra|filtrar|dame)\s+(?:por\s+|un\s+|una\s+|unos\s+|unas\s+)?/i, '')
    .trim();
}

interface CategoryNavProps {
  selectedCategory: CategoryFilter;
  onSelectCategory: (category: CategoryFilter) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  totalFilteredCount: number;
  favoritesCount: number;
}

export const CategoryNav: React.FC<CategoryNavProps> = ({
  selectedCategory,
  onSelectCategory,
  searchQuery,
  onSearchChange,
  totalFilteredCount,
  favoritesCount,
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);
  const onSearchChangeRef = useRef(onSearchChange);
  const onSelectCategoryRef = useRef(onSelectCategory);
  onSearchChangeRef.current = onSearchChange;
  onSelectCategoryRef.current = onSelectCategory;

  const [isSpeechSupported] = useState<boolean>(() => Boolean(getSpeechRecognitionConstructor()));
  const [isListening, setIsListening] = useState(false);
  const [voiceFeedback, setVoiceFeedback] = useState<string | null>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const offset = direction === 'left' ? -220 : 220;
      scrollContainerRef.current.scrollBy({ left: offset, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    const activeButton = tabRefs.current[selectedCategory];
    if (activeButton) {
      activeButton.scrollIntoView({
        behavior: 'smooth',
        inline: 'center',
        block: 'nearest',
      });
    }
  }, [selectedCategory]);

  useEffect(() => {
    if (!voiceFeedback) return;
    const timer = window.setTimeout(() => setVoiceFeedback(null), 3500);
    return () => window.clearTimeout(timer);
  }, [voiceFeedback]);

  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch {
          // Ignore cleanup errors
        }
        recognitionRef.current = null;
      }
    };
  }, []);

  const applyVoiceCommand = useCallback((transcript: string, isFinal: boolean) => {
    const cleaned = normalizeSpokenQuery(transcript);
    const lower = cleaned.toLowerCase();

    if (
      isFinal &&
      (lower === 'limpiar' ||
        lower === 'borrar' ||
        lower === 'borrar búsqueda' ||
        lower === 'ver todo' ||
        lower === 'todo el menú' ||
        lower === 'todos')
    ) {
      onSearchChangeRef.current('');
      onSelectCategoryRef.current('all');
      setVoiceFeedback('Mostrando todo el menú');
      return;
    }

    if (isFinal && (lower === 'favoritos' || lower === 'mis favoritos')) {
      onSearchChangeRef.current('');
      onSelectCategoryRef.current('favorites');
      setVoiceFeedback('Mostrando Mis Favoritos');
      return;
    }

    if (cleaned) {
      onSearchChangeRef.current(cleaned);
    }
  }, []);

  const handleToggleVoiceSearch = () => {
    const SpeechRecognitionCtor = getSpeechRecognitionConstructor();
    if (!SpeechRecognitionCtor) {
      setVoiceFeedback('Tu navegador no soporta búsqueda por voz.');
      return;
    }

    if (isListening && recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {
        setIsListening(false);
      }
      return;
    }

    setVoiceFeedback(null);

    try {
      const recognition = new SpeechRecognitionCtor();
      recognition.lang = 'es-MX';
      recognition.interimResults = true;
      recognition.continuous = false;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        setIsListening(true);
        setVoiceFeedback(null);
      };

      recognition.onresult = (event) => {
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; i += 1) {
          const result = event.results[i];
          const text = result[0]?.transcript || '';
          if (result.isFinal) {
            finalTranscript += text;
          } else {
            interimTranscript += text;
          }
        }

        if (finalTranscript) {
          applyVoiceCommand(finalTranscript, true);
        } else if (interimTranscript) {
          applyVoiceCommand(interimTranscript, false);
        }
      };

      recognition.onerror = (event) => {
        setIsListening(false);
        if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
          setVoiceFeedback('Activa el permiso del micrófono para buscar por voz.');
        } else if (event.error === 'no-speech') {
          setVoiceFeedback('No te escuché. Intenta hablar de nuevo cerca del micrófono.');
        } else if (event.error !== 'aborted') {
          setVoiceFeedback('No se pudo completar el dictado de voz. Intenta de nuevo.');
        }
      };

      recognition.onend = () => {
        setIsListening(false);
        recognitionRef.current = null;
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch {
      setIsListening(false);
      setVoiceFeedback('No se pudo iniciar el micrófono.');
    }
  };

  return (
    <div className="sticky top-[52px] sm:top-16 z-20 bg-[#F9FAFB]/95 dark:bg-[#09090B]/95 backdrop-blur-md border-b border-zinc-200 dark:border-zinc-800 transition-colors">
      <div className="max-w-6xl mx-auto px-4 py-2.5 sm:py-3 space-y-2.5">
        {/* Clean Search Field with Web Speech Voice Filter */}
        <div className="space-y-1.5">
          <div className="relative flex items-center">
            <Search className="absolute left-3.5 w-4 h-4 text-zinc-400 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setVoiceFeedback(null);
                onSearchChange(e.target.value);
              }}
              placeholder={
                isListening
                  ? 'Escuchando... di un platillo o ingrediente'
                  : 'Buscar platillo o ingrediente (ej. camarón, pastor, ranchero, bbq)...'
              }
              className={`w-full pl-10 ${
                searchQuery ? 'pr-20' : 'pr-14 sm:pr-36'
              } py-2 sm:py-2.5 text-sm rounded-xl bg-white dark:bg-[#121215] border ${
                isListening
                  ? 'border-amber-500 ring-2 ring-amber-500/25'
                  : 'border-zinc-200 dark:border-zinc-800'
              } text-zinc-950 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 transition-all`}
            />

            <div className="absolute right-2 flex items-center gap-1.5">
              {searchQuery ? (
                <button
                  type="button"
                  onClick={() => {
                    setVoiceFeedback(null);
                    onSearchChange('');
                  }}
                  className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-950 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                  title="Borrar búsqueda"
                  aria-label="Borrar búsqueda"
                >
                  <X className="w-4 h-4" />
                </button>
              ) : (
                <span className="text-[11px] text-zinc-500 dark:text-zinc-400 font-medium hidden sm:inline tabular-nums pr-1">
                  {totalFilteredCount} {totalFilteredCount === 1 ? 'platillo' : 'platillos'}
                </span>
              )}

              <button
                type="button"
                onClick={handleToggleVoiceSearch}
                disabled={!isSpeechSupported}
                aria-label={isListening ? 'Detener búsqueda por voz' : 'Buscar por voz'}
                aria-pressed={isListening}
                title={
                  !isSpeechSupported
                    ? 'Búsqueda por voz no disponible en este navegador'
                    : isListening
                    ? 'Detener dictado'
                    : 'Buscar por voz (ej. "camarón", "ranchero")'
                }
                className={`relative p-1.5 sm:p-2 rounded-lg transition-all flex items-center justify-center ${
                  !isSpeechSupported
                    ? 'text-zinc-300 dark:text-zinc-600 cursor-not-allowed'
                    : isListening
                    ? 'bg-amber-500 text-zinc-950 shadow-sm'
                    : 'text-zinc-500 dark:text-zinc-400 hover:text-amber-600 dark:hover:text-amber-400 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                }`}
              >
                {isListening && (
                  <span
                    aria-hidden="true"
                    className="absolute inset-0 rounded-lg bg-amber-500 animate-ping opacity-35"
                  />
                )}
                {isSpeechSupported ? (
                  <Mic className={`w-4 h-4 relative z-10 ${isListening ? 'animate-pulse' : ''}`} />
                ) : (
                  <MicOff className="w-4 h-4 relative z-10" />
                )}
              </button>
            </div>
          </div>

          {/* Voice Status / Feedback Strip */}
          <AnimatePresence>
            {(isListening || voiceFeedback) && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="flex items-center justify-between gap-2 px-2.5 py-1 rounded-lg bg-zinc-100 dark:bg-zinc-900 text-[11px]">
                  {isListening ? (
                    <span className="flex items-center gap-2 font-semibold text-amber-700 dark:text-amber-400">
                      <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse shrink-0" />
                      <span>Escuchando... di un platillo, ingrediente o &ldquo;limpiar&rdquo;</span>
                    </span>
                  ) : (
                    <span className="font-medium text-zinc-600 dark:text-zinc-400">
                      {voiceFeedback}
                    </span>
                  )}

                  {!isListening && voiceFeedback && (
                    <button
                      type="button"
                      onClick={() => setVoiceFeedback(null)}
                      className="text-[10px] font-bold text-zinc-500 hover:text-zinc-950 dark:hover:text-white shrink-0"
                    >
                      Ocultar
                    </button>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Mobile / Tablet Horizontal Category Tabs (lg+ uses sticky left sidebar rail) */}
        <div className="relative flex items-center lg:hidden">
          <button
            type="button"
            onClick={() => scroll('left')}
            aria-label="Desplazar categorías a la izquierda"
            className="hidden sm:flex shrink-0 items-center justify-center w-8 h-8 mr-1.5 rounded-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-500 hover:text-zinc-950 dark:hover:text-white transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <div
            ref={scrollContainerRef}
            className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5 scroll-smooth w-full"
          >
            {/* "Todos" Tab */}
            <button
              type="button"
              ref={(el) => {
                tabRefs.current['all'] = el;
              }}
              onClick={() => onSelectCategory('all')}
              className={`relative shrink-0 px-3.5 py-2 rounded-xl text-xs font-semibold transition-colors whitespace-nowrap ${
                selectedCategory === 'all'
                  ? 'text-white dark:text-zinc-950'
                  : 'text-zinc-600 dark:text-zinc-300 hover:text-zinc-950 dark:hover:text-white bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800'
              }`}
            >
              {selectedCategory === 'all' && (
                <motion.span
                  layoutId="activeCategoryPill"
                  transition={{ type: 'spring', stiffness: 420, damping: 32 }}
                  className="absolute inset-0 rounded-xl bg-zinc-950 dark:bg-amber-500"
                />
              )}
              <span className="relative z-10 flex items-center gap-1.5">
                <span>Todos</span>
                <span className="text-[11px] opacity-75 tabular-nums">({CATEGORIES.length})</span>
              </span>
            </button>

            {/* "Mis Favoritos" Tab */}
            <button
              type="button"
              ref={(el) => {
                tabRefs.current['favorites'] = el;
              }}
              onClick={() => onSelectCategory('favorites')}
              className={`relative shrink-0 px-3.5 py-2 rounded-xl text-xs font-semibold transition-colors whitespace-nowrap ${
                selectedCategory === 'favorites'
                  ? 'text-white'
                  : 'text-zinc-600 dark:text-zinc-300 hover:text-rose-700 dark:hover:text-rose-300 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800'
              }`}
            >
              {selectedCategory === 'favorites' && (
                <motion.span
                  layoutId="activeCategoryPill"
                  transition={{ type: 'spring', stiffness: 420, damping: 32 }}
                  className="absolute inset-0 rounded-xl bg-rose-600"
                />
              )}
              <span className="relative z-10 flex items-center gap-1.5">
                <Heart
                  className={`w-3.5 h-3.5 ${
                    selectedCategory === 'favorites'
                      ? 'fill-white text-white'
                      : favoritesCount > 0
                      ? 'fill-rose-500 text-rose-500'
                      : 'text-rose-500'
                  }`}
                />
                <span>Mis Favoritos</span>
                {favoritesCount > 0 && (
                  <span className="text-[11px] font-bold tabular-nums opacity-90">
                    ({favoritesCount})
                  </span>
                )}
              </span>
            </button>

            {/* "Mejor calificados" Tab */}
            <button
              type="button"
              ref={(el) => {
                tabRefs.current['top-rated'] = el;
              }}
              onClick={() => onSelectCategory('top-rated')}
              className={`relative shrink-0 px-3.5 py-2 rounded-xl text-xs font-semibold transition-colors whitespace-nowrap ${
                selectedCategory === 'top-rated'
                  ? 'text-zinc-950 font-bold'
                  : 'text-zinc-600 dark:text-zinc-300 hover:text-amber-700 dark:hover:text-amber-300 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800'
              }`}
            >
              {selectedCategory === 'top-rated' && (
                <motion.span
                  layoutId="activeCategoryPill"
                  transition={{ type: 'spring', stiffness: 420, damping: 32 }}
                  className="absolute inset-0 rounded-xl bg-amber-400"
                />
              )}
              <span className="relative z-10 flex items-center gap-1.5">
                <Star
                  className={`w-3.5 h-3.5 ${
                    selectedCategory === 'top-rated'
                      ? 'fill-zinc-950 text-zinc-950'
                      : 'fill-amber-400 text-amber-500'
                  }`}
                />
                <span>Mejor calificados</span>
              </span>
            </button>

            {CATEGORIES.map((cat) => {
              const isSelected = selectedCategory === cat.id;
              return (
                <button
                  type="button"
                  key={cat.id}
                  ref={(el) => {
                    tabRefs.current[cat.id] = el;
                  }}
                  onClick={() => onSelectCategory(cat.id)}
                  className={`relative shrink-0 px-3.5 py-2 rounded-xl text-xs font-semibold transition-colors whitespace-nowrap ${
                    isSelected
                      ? 'text-zinc-950 font-bold'
                      : 'text-zinc-600 dark:text-zinc-300 hover:text-zinc-950 dark:hover:text-white bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800'
                  }`}
                >
                  {isSelected && (
                    <motion.span
                      layoutId="activeCategoryPill"
                      transition={{ type: 'spring', stiffness: 420, damping: 32 }}
                      className="absolute inset-0 rounded-xl bg-amber-400"
                    />
                  )}
                  <span className="relative z-10 flex items-center gap-1.5">
                    <span className="text-sm leading-none">{cat.icon}</span>
                    <span>{cat.name}</span>
                  </span>
                </button>
              );
            })}
          </div>

          <button
            type="button"
            onClick={() => scroll('right')}
            aria-label="Desplazar categorías a la derecha"
            className="hidden sm:flex shrink-0 items-center justify-center w-8 h-8 ml-1.5 rounded-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-500 hover:text-zinc-950 dark:hover:text-white transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
