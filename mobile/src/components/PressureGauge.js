// OWNER - HEET
// PURPOSE - Lightweight CPI/pressure gauge (0-100) without extra dependencies.

import React from 'react';
import { Text, View } from 'react-native';

import { palette } from '../theme';

function colorForScore(score) {
  const s = Number(score);
  if (s >= 75) return palette.danger;
  if (s >= 55) return palette.warning;
  if (s >= 35) return palette.primary;
  return palette.safe;
}

export function PressureGauge({ score, label }) {
  const value = Number.isFinite(Number(score)) ? Math.round(Number(score)) : 0;
  const color = colorForScore(value);

  return (
    <View style={{ alignItems: 'center', justifyContent: 'center', gap: 10 }}>
      <View
        style={{
          width: 160,
          height: 160,
          borderRadius: 80,
          borderWidth: 10,
          borderColor: color,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: palette.surface,
        }}
      >
        <Text style={{ color: palette.textMuted, fontSize: 12, fontWeight: '800' }}>{label || 'Pressure'}</Text>
        <Text style={{ color, fontSize: 44, fontWeight: '900', marginTop: 4 }}>{value}</Text>
        <Text style={{ color: palette.textSubtle, fontSize: 12, fontWeight: '700' }}>/ 100</Text>
      </View>
    </View>
  );
}

