// ============================================================
//  Utils: Helpers de fecha
//  Funciones para rangos de fecha del Dashboard
// ============================================================

/**
 * Retorna el inicio y fin del mes actual
 */
const rangoMesActual = () => {
  const ahora = new Date();
  const inicio = new Date(ahora.getFullYear(), ahora.getMonth(), 1);
  const fin = new Date(ahora.getFullYear(), ahora.getMonth() + 1, 0, 23, 59, 59, 999);
  return { inicio, fin };
};

/**
 * Retorna el inicio (lunes) y fin (domingo) de la semana actual
 */
const rangoSemanaActual = () => {
  const ahora = new Date();
  const diaSemana = ahora.getDay(); // 0=Dom, 1=Lun...
  const diffLunes = diaSemana === 0 ? -6 : 1 - diaSemana;
  
  const lunes = new Date(ahora);
  lunes.setDate(ahora.getDate() + diffLunes);
  lunes.setHours(0, 0, 0, 0);

  const domingo = new Date(lunes);
  domingo.setDate(lunes.getDate() + 6);
  domingo.setHours(23, 59, 59, 999);

  return { inicio: lunes, fin: domingo };
};

/**
 * Retorna inicio y fin de un rango de N meses hacia atrás
 */
const rangoUltimosMeses = (meses = 6) => {
  const ahora = new Date();
  const fin = new Date(ahora.getFullYear(), ahora.getMonth() + 1, 0, 23, 59, 59, 999);
  const inicio = new Date(ahora.getFullYear(), ahora.getMonth() - (meses - 1), 1);
  return { inicio, fin };
};

module.exports = {
  rangoMesActual,
  rangoSemanaActual,
  rangoUltimosMeses
};
