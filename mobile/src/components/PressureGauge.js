// OWNER - HEET
// PURPOSE - Lightweight CPI/pressure gauge (0-100) without extra dependencies.

import React from 'react';
import { Text, View, Dimensions } from 'react-native';

import { palette } from '../theme';

function colorForScore(score) {
  const s = Number(score);
  if (s >= 75) return palette.danger;
  if (s >= 55) return palette.warning;
  if (s >= 35) return palette.primary;
  return palette.safe;
}

export function PressureGauge({ score, label, size, maxValue = 100 }) {
  const value = Number.isFinite(Number(score)) ? Math.round(Number(score)) : 0;
  const normalized = Math.min(100, Math.max(0, (value / maxValue) * 100));
  const color = colorForScore(normalized);

  const defaultSize = Math.min(Dimensions.get('window').width * 0.42, 180);
  const gaugeSize = size || defaultSize;
  const radius = gaugeSize / 2;

  return (
    <View style={{ alignItems: 'center', justifyContent: 'center', gap: 10 }}>
      <View
        style={{
          width: gaugeSize,
          height: gaugeSize,
          borderRadius: radius,
          borderWidth: Math.max(4, gaugeSize * 0.06),
          borderColor: color,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: palette.surface,
        }}
      >
        <Text style={{ color: palette.textMuted, fontSize: gaugeSize * 0.075, fontWeight: '800' }}>{label || 'Pressure'}</Text>
        <Text style={{ color, fontSize: gaugeSize * 0.27, fontWeight: '900', marginTop: 4 }}>{value}</Text>
        <Text style={{ color: palette.textSubtle, fontSize: gaugeSize * 0.075, fontWeight: '700' }}>/ {maxValue}</Text>
      </View>
    </View>
  );
}
