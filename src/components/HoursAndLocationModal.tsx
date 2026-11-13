import React from 'react';
import { X, Clock, MapPin, Phone, Heart, CheckCircle2, XCircle, ExternalLink } from 'lucide-react';
import { RESTAURANT_WHATSAPP, RESTAURANT_LOGO } from '../data/menuData';
import { useRestaurantStatus } from '../utils/hours';

interface HoursAndLocationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HoursAndLocationModal: React.FC<HoursAndLocationModalProps> = ({
  isOpen,
  onClose,
}) => {
  const status = useRestaurantStatus();

  if (!isOpen) return null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-150"
    >
      <div
        className="w-full max-w-md bg-white dark:bg-[#121215] text-zinc-950 dark:text-zinc-50 rounded-2xl p-5 sm:p-6 shadow-2xl border border-zinc-200 dark:border-zinc-800 space-y-5 animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-3.5">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl overflow-hidden border border-zinc-200 dark:border-zinc-800 bg-white shrink-0">
              <img
                src={RESTAURANT_LOGO}
                alt="Logo Hot Dog's El Carballito"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h3 className="font-black text-base font-serif">Hot Dog&apos;s El Carballito</h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">Estilo Sinaloa 100% Original</p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Cerrar información"
            className="p-2 rounded-lg text-zinc-400 hover:text-zinc-950 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Visual Open / Closed Status Indicator */}
        <div
          className={`flex items-center gap-3 px-4 py-3 rounded-xl border ${
            status.isOpen
              ? 'bg-emerald-50/90 dark:bg-emerald-950/35 border-emerald-200 dark:border-emerald-800/60'
              : 'bg-rose-50/90 dark:bg-rose-950/30 border-rose-200 dark:border-rose-900/60'
          }`}
        >
          {status.isOpen ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
          ) : (
            <XCircle className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0" />
          )}
          <div className="min-w-0">
            <span
              className={`text-xs font-extrabold uppercase tracking-wide block ${
                status.isOpen
                  ? 'text-emerald-800 dark:text-emerald-300'
                  : 'text-rose-800 dark:text-rose-300'
              }`}
            >
              {status.label}
            </span>
            <p
              className={`text-[11px] font-medium truncate ${
                status.isOpen
                  ? 'text-emerald-700 dark:text-emerald-400'
                  : 'text-rose-700/90 dark:text-rose-300/80'
              }`}
            >
              {status.detailText}
            </p>
          </div>
        </div>

        {/* Schedule & Details */}
        <div className="space-y-3">
          <div className="flex items-start gap-3 p-3.5 rounded-xl bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800">
            <Clock className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
            <div className="text-xs space-y-1 flex-1">
              <div className="flex items-center justify-between gap-2">
                <span className="font-bold text-zinc-950 dark:text-zinc-50">
                  Horario de Servicio
                </span>
                <span
                  className={`text-[11px] font-bold ${
                    status.isOpen
                      ? 'text-emerald-700 dark:text-emerald-400'
                      : 'text-rose-600 dark:text-rose-400'
                  }`}
                >
                  {status.isOpen ? 'Abierto' : 'Cerrado'}
                </span>
              </div>
              <p className="text-zinc-600 dark:text-zinc-400">
                Miércoles a Lunes: <span className="font-semibold text-zinc-950 dark:text-zinc-50">7:00 PM – 12:00 AM</span>
              </p>
              <p className="text-[11px] font-medium text-rose-600 dark:text-rose-400">
                Martes: Cerrado (descansamos para preparar los mejores ingredientes)
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3.5 rounded-xl bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800">
            <MapPin className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
            <div className="text-xs space-y-2 flex-1">
              <span className="font-bold block text-zinc-950 dark:text-zinc-50">
                Ubicación
              </span>
              <p className="font-medium text-zinc-950 dark:text-zinc-50 leading-relaxed">
                Estamos ubicados en Reforma y Pasadena, en la pura esquina en las canteras
              </p>
              <p className="text-zinc-600 dark:text-zinc-400">
                Servicio en mesa, para llevar y a domicilio.
              </p>
              <a
                href="https://www.google.com/maps/search/?api=1&query=Reforma+y+Pasadena,+Las+Canteras,+Los+Mochis,+Sinaloa"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-3.5 py-2 rounded-xl bg-zinc-950 hover:bg-amber-500 hover:text-zinc-950 dark:bg-amber-500 dark:hover:bg-amber-400 text-white dark:text-zinc-950 text-xs font-bold transition-colors shadow-xs"
              >
                <MapPin className="w-3.5 h-3.5" />
                <span>Ver en Google Maps</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3.5 rounded-xl bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800">
            <Phone className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
            <div className="text-xs space-y-1">
              <span className="font-bold block text-zinc-950 dark:text-zinc-50">
                WhatsApp de Pedidos
              </span>
              <a
                href={`https://wa.me/${RESTAURANT_WHATSAPP}`}
                target="_blank"
                rel="noopener noreferrer"
                className="font-bold text-emerald-600 dark:text-emerald-400 hover:underline block text-sm tabular-nums"
              >
                +52 668 173 2492
              </a>
              <p className="text-[11px] text-zinc-500">
                Respuesta inmediata en horario laboral.
              </p>
            </div>
          </div>
        </div>

        <div className="pt-1 text-center text-xs text-zinc-500 flex items-center justify-center gap-1">
          <span>Hecho con</span>
          <Heart className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
          <span>para los amantes del auténtico sabor sinaloense</span>
        </div>
      </div>
    </div>
  );
};
