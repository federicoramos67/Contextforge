const synonymMap = {
  automatizar: 'automatizacion',
  corregir: 'debug',
  grafica: 'grafico',
};

export function normalizeText(value) {
  let normalized = String(value || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9ñ\s]/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  // Reemplazos simples para reducir variaciones comunes.
  Object.entries(synonymMap).forEach(([alias, canonical]) => {
    normalized = normalized.replaceAll(alias, canonical);
  });

  return normalized;
}

export function unique(items) {
  return [...new Set(items.filter(Boolean))];
}
