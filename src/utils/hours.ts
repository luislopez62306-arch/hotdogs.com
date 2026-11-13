import { useState, useEffect } from 'react';

export interface RestaurantStatus {
  isOpen: boolean;
  isClosedDay: boolean;
  label: string;
  detailText: string;
  scheduleText: string;
  closedDayText: string;
}

const OPEN_HOUR_MINUTES = 19 * 60; // 7:00 PM (19:00)
const CLOSE_HOUR_MINUTES = 24 * 60; // 12:00 AM / medianoche (24:00)
const CLOSED_DAY_INDEX = 2; // 0 = Domingo, 1 = Lunes, 2 = Martes

export function getRestaurantStatus(now: Date = new Date()): RestaurantStatus {
  const day = now.getDay();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  const isTuesday = day === CLOSED_DAY_INDEX;

  const scheduleText = 'Miércoles a Lunes: 7:00 PM – 12:00 AM';
  const closedDayText = 'Martes: Cerrado';

  if (isTuesday) {
    return {
      isOpen: false,
      isClosedDay: true,
      label: 'Cerrado hoy',
      detailText: 'Los martes descansamos · Abrimos mañana miércoles a las 7:00 PM',
      scheduleText,
      closedDayText,
    };
  }

  if (currentMinutes >= OPEN_HOUR_MINUTES && currentMinutes < CLOSE_HOUR_MINUTES) {
    const minutesRemaining = CLOSE_HOUR_MINUTES - currentMinutes;
    return {
      isOpen: true,
      isClosedDay: false,
      label: 'Abierto ahora',
      detailText:
        minutesRemaining <= 60
          ? `Cierra pronto (en ${minutesRemaining} min · 12:00 AM)`
          : 'En servicio hasta las 12:00 AM',
      scheduleText,
      closedDayText,
    };
  }

  return {
    isOpen: false,
    isClosedDay: false,
    label: 'Cerrado ahora',
    detailText: 'Abrimos hoy a las 7:00 PM',
    scheduleText,
    closedDayText,
  };
}

export function useRestaurantStatus(): RestaurantStatus {
  const [status, setStatus] = useState<RestaurantStatus>(() => getRestaurantStatus());

  useEffect(() => {
    const update = () => setStatus(getRestaurantStatus());
    update();
    const interval = setInterval(update, 30_000);
    return () => clearInterval(interval);
  }, []);

  return status;
}
