// OWNER - HEET
// PURPOSE - Shared colors and status helpers for the mobile alert app.

export const palette = {
  background: '#F8FAFC',
  surface: '#FFFFFF',
  surfaceMuted: '#F1F5F9',
  surfaceDark: '#0F172A',
  text: '#0F172A',
  textMuted: '#64748B',
  textSubtle: '#94A3B8',
  border: '#E2E8F0',
  danger: '#DC2626',
  dangerSoft: '#FEF2F2',
  dangerBg: '#FEF2F2',
  warning: '#D97706',
  warningSoft: '#FEF3C7',
  warningBg: '#FFFBEB',
  safe: '#16A34A',
  safeSoft: '#DCFCE7',
  safeBg: '#F0FDF4',
  inactive: '#94A3B8',
  inactiveSoft: '#F1F5F9',
  primary: '#2563EB',
  primarySoft: '#DBEAFE',
};

export function colorForStatus(status) {
  if (status === 'danger') {
    return palette.danger;
  }

  if (status === 'warning') {
    return palette.warning;
  }

  if (status === 'safe') {
    return palette.safe;
  }

  return palette.inactive;
}

export function softColorForStatus(status) {
  if (status === 'danger') {
    return palette.dangerSoft;
  }

  if (status === 'warning') {
    return palette.warningSoft;
  }

  if (status === 'safe') {
    return palette.safeSoft;
  }

  return palette.inactiveSoft;
}

export function bgColorForStatus(status) {
  if (status === 'danger') {
    return palette.dangerBg;
  }

  if (status === 'warning') {
    return palette.warningBg;
  }

  if (status === 'safe') {
    return palette.safeBg;
  }

  return palette.surfaceMuted;
}
