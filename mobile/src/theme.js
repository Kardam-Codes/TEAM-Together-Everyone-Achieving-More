// OWNER - HEET
// PURPOSE - Shared colors and status helpers for the mobile alert app.

export const palette = {
  background: '#F4F6F8',
  surface: '#FFFFFF',
  surfaceMuted: '#EEF2F5',
  surfaceDark: '#17202A',
  text: '#16202A',
  textMuted: '#5B6773',
  textSubtle: '#7A8793',
  border: '#D8DEE5',
  danger: '#C62828',
  dangerSoft: '#FDECEC',
  warning: '#B26A00',
  warningSoft: '#FFF4DE',
  safe: '#1B7F4C',
  safeSoft: '#EAF7EF',
  inactive: '#98A2AD',
  inactiveSoft: '#EDF0F2',
  primary: '#2457A6',
  primarySoft: '#E8F0FE',
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
