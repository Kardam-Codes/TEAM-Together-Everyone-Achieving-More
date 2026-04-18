import React, { useMemo, useState } from 'react';
import {
  Pressable,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  useWindowDimensions,
  View,
} from 'react-native';

const theme = {
  colors: {
    primary: '#1F7A63',
    primaryDark: '#17614E',
    secondary: '#34C38F',
    accent: '#FF6B6B',
    background: '#F5F7F6',
    surface: '#FFFFFF',
    card: '#FFFFFF',
    border: '#E6EAE8',
    textPrimary: '#1A1D1C',
    textSecondary: '#6B7280',
    textMuted: '#9CA3AF',
    success: '#22C55E',
    warning: '#F59E0B',
    error: '#EF4444',
    tint: '#E8F5F0',
  },
  spacing: {
    xxs: 4,
    xs: 8,
    sm: 12,
    md: 16,
    lg: 20,
    xl: 24,
    xxl: 32,
    xxxl: 40,
    sectionGap: 32,
    containerPadding: 24,
  },
  radius: {
    small: 8,
    medium: 12,
    large: 20,
    pill: 999,
  },
  shadow: {
    light: {
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.06,
      shadowRadius: 6,
      elevation: 2,
    },
    medium: {
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.08,
      shadowRadius: 16,
      elevation: 4,
    },
    soft: {
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 10 },
      shadowOpacity: 0.1,
      shadowRadius: 30,
      elevation: 6,
    },
  },
  type: {
    h1: { fontSize: 28, lineHeight: 34, fontWeight: '700' },
    h2: { fontSize: 22, lineHeight: 28, fontWeight: '600' },
    h3: { fontSize: 18, lineHeight: 24, fontWeight: '600' },
    bodyLarge: { fontSize: 16, lineHeight: 24, fontWeight: '500' },
    bodyMedium: { fontSize: 14, lineHeight: 21, fontWeight: '400' },
    bodySmall: { fontSize: 12, lineHeight: 17, fontWeight: '400' },
    caption: { fontSize: 11, lineHeight: 14, fontWeight: '400' },
    button: { fontSize: 14, lineHeight: 18, fontWeight: '600', letterSpacing: 0.3 },
  },
};

const statCards = [
  { label: 'Win Projection', value: '74%', delta: '+8.2%', tone: 'success' },
  { label: 'Possession Value', value: '1.28', delta: '+0.12', tone: 'primary' },
  { label: 'High Press Rate', value: '63%', delta: '+5.4%', tone: 'warning' },
  { label: 'Conversion Risk', value: '12%', delta: '-2.1%', tone: 'accent' },
];

const rankingRows = [
  { name: 'North Harbor FC', form: 'WWDWW', rating: '92.4', xg: '2.18' },
  { name: 'Victory Eleven', form: 'WWWLW', rating: '89.7', xg: '1.94' },
  { name: 'Riverside Club', form: 'WDWLW', rating: '86.3', xg: '1.61' },
  { name: 'Capital Athletic', form: 'LWWDW', rating: '83.9', xg: '1.42' },
];

const fixtures = [
  { team: 'Victory Eleven', meta: 'Home • Sun 18:30', score: 'vs Metro Stars' },
  { team: 'North Harbor FC', meta: 'Away • Wed 20:00', score: 'vs Riverside Club' },
  { team: 'Capital Athletic', meta: 'Home • Fri 19:15', score: 'vs Red Summit' },
];

const feedItems = [
  { title: 'Set-piece efficiency spiked by 14%', time: '12 min ago' },
  { title: 'Defensive line recovered 8 loose balls in zone 14', time: '42 min ago' },
  { title: 'Training load flagged for two midfielders', time: '1 hr ago' },
  { title: 'Analyst note: wing overloads outperform baseline by 0.24 xG', time: '3 hr ago' },
];

const profileOptions = ['Matchday Dashboard', 'Performance Review', 'Scouting Pack'];

const getToneColor = tone => {
  switch (tone) {
    case 'success':
      return theme.colors.success;
    case 'warning':
      return theme.colors.warning;
    case 'accent':
      return theme.colors.accent;
    default:
      return theme.colors.primary;
  }
};

function App() {
  const { width } = useWindowDimensions();
  const [selectedProfile, setSelectedProfile] = useState(profileOptions[0]);
  const [formState, setFormState] = useState({
    club: 'Victory Eleven',
    analyst: 'A. Morgan',
    objective: 'Track transitions and identify efficient shot zones.',
  });

  const layout = useMemo(() => {
    const maxWidth = Math.min(width, 1200);
    const isDesktop = width >= 1080;
    const isTablet = width >= 720;
    return {
      contentWidth: maxWidth,
      isDesktop,
      isTablet,
      statColumns: isDesktop ? 4 : isTablet ? 2 : 1,
      lowerColumns: isDesktop ? 3 : 1,
    };
  }, [width]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" />
      <ScrollView style={styles.screen} contentContainerStyle={styles.scrollContent}>
        <View style={[styles.appShell, { width: layout.contentWidth }]}>
          <View style={styles.navbar}>
            <View style={styles.brandBlock}>
              <View style={styles.brandBadge}>
                <Text style={styles.brandBadgeText}>VE</Text>
              </View>
              <View>
                <Text style={styles.navEyebrow}>Victory Greens Premium Sports UI</Text>
                <Text style={styles.navTitle}>Match Intelligence Console</Text>
              </View>
            </View>
            <View style={styles.navActions}>
              <Pill label="Live Sync" tone="positive" />
              <Pressable style={({ pressed }) => [styles.ghostButton, pressed && styles.pressed]}>
                <Text style={styles.ghostButtonText}>Export</Text>
              </Pressable>
            </View>
          </View>

          <View style={[styles.heroGrid, layout.isDesktop && styles.heroGridDesktop]}>
            <Card style={[styles.heroCard, layout.isDesktop && styles.heroCardDesktop]}>
              <View style={styles.heroTopRow}>
                <Pill label="Matchday Ready" />
                <Text style={styles.heroMeta}>Updated 2 minutes ago</Text>
              </View>
              <Text style={styles.heroHeading}>Actionable team insights with clear rhythm, layered cards, and fast scan depth.</Text>
              <Text style={styles.heroDescription}>
                A premium, sports-analytics inspired workspace built for quick decisions across performance, scouting, and match preparation.
              </Text>

              <View style={[styles.heroStatsRow, !layout.isTablet && styles.heroStatsColumn]}>
                <View style={styles.heroMetric}>
                  <Text style={styles.heroMetricValue}>18</Text>
                  <Text style={styles.heroMetricLabel}>Active reports</Text>
                </View>
                <View style={styles.heroMetric}>
                  <Text style={styles.heroMetricValue}>92%</Text>
                  <Text style={styles.heroMetricLabel}>Data confidence</Text>
                </View>
                <View style={styles.heroMetric}>
                  <Text style={styles.heroMetricValue}>6.4h</Text>
                  <Text style={styles.heroMetricLabel}>Prep time saved</Text>
                </View>
              </View>

              <View style={styles.buttonRow}>
                <TactileButton label="Open Dashboard" kind="primary" />
                <TactileButton label="View Reports" kind="secondary" />
              </View>
            </Card>

            <Card style={styles.snapshotCard}>
              <Text style={styles.sectionLabel}>Performance Snapshot</Text>
              <Text style={styles.snapshotTitle}>Team momentum is building through compact transitions.</Text>
              <MiniBars />
              <View style={styles.snapshotList}>
                <SnapshotRow label="Counter Pressing" value="Elite" />
                <SnapshotRow label="Final Third Entries" value="+18%" />
                <SnapshotRow label="Defensive Shape" value="Stable" />
              </View>
            </Card>
          </View>

          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Core Metrics</Text>
            <Text style={styles.sectionCopy}>High-level indicators arranged on a strict 8pt rhythm for instant readability.</Text>
          </View>

          <View style={styles.gridWrap}>
            {statCards.map(item => (
              <View
                key={item.label}
                style={[
                  styles.gridItem,
                  {
                    width: layout.isDesktop
                      ? '24%'
                      : layout.isTablet
                        ? '48.5%'
                        : '100%',
                  },
                ]}
              >
                <Card interactive>
                  <Text style={styles.statLabel}>{item.label}</Text>
                  <Text style={styles.statValue}>{item.value}</Text>
                  <View style={styles.statFooter}>
                    <View style={[styles.deltaDot, { backgroundColor: getToneColor(item.tone) }]} />
                    <Text style={[styles.deltaText, { color: getToneColor(item.tone) }]}>{item.delta}</Text>
                  </View>
                </Card>
              </View>
            ))}
          </View>

          <View style={[styles.analyticsGrid, layout.isDesktop && styles.analyticsGridDesktop]}>
            <Card style={[styles.panelCard, layout.isDesktop && styles.analyticsLeadCard]} interactive>
              <View style={styles.panelHeader}>
                <View>
                  <Text style={styles.sectionLabel}>Trend Overview</Text>
                  <Text style={styles.panelTitle}>Shot quality vs defensive recovery</Text>
                </View>
                <Pill label="Last 5 Matches" />
              </View>
              <TrendChart />
              <View style={styles.inlineMetrics}>
                <InlineMetric label="Peak xG" value="2.36" />
                <InlineMetric label="Recoveries" value="48" />
                <InlineMetric label="Field Tilt" value="61%" />
              </View>
            </Card>

            <Card style={styles.panelCard} interactive>
              <View style={styles.panelHeader}>
                <View>
                  <Text style={styles.sectionLabel}>League Table</Text>
                  <Text style={styles.panelTitle}>Power rankings</Text>
                </View>
                <Text style={styles.panelHint}>Updated live</Text>
              </View>
              <View style={styles.tableHead}>
                <Text style={[styles.tableHeadText, styles.tableTeam]}>Club</Text>
                <Text style={styles.tableHeadText}>Rating</Text>
                <Text style={styles.tableHeadText}>xG</Text>
              </View>
              {rankingRows.map(row => (
                <View key={row.name} style={styles.tableRow}>
                  <View style={styles.tableTeamWrap}>
                    <View style={styles.rankBadge}>
                      <Text style={styles.rankBadgeText}>{rankingRows.indexOf(row) + 1}</Text>
                    </View>
                    <View>
                      <Text style={styles.tableTeamName}>{row.name}</Text>
                      <Text style={styles.tableMeta}>{row.form}</Text>
                    </View>
                  </View>
                  <Text style={styles.tableCell}>{row.rating}</Text>
                  <Text style={styles.tableCell}>{row.xg}</Text>
                </View>
              ))}
            </Card>
          </View>

          <View style={[styles.lowerGrid, layout.isDesktop && styles.lowerGridDesktop]}>
            <Card style={styles.panelCard} interactive>
              <View style={styles.panelHeader}>
                <View>
                  <Text style={styles.sectionLabel}>Upcoming Fixtures</Text>
                  <Text style={styles.panelTitle}>Schedule focus</Text>
                </View>
                <Pill label="3 Matches" />
              </View>
              {fixtures.map(item => (
                <View key={item.team} style={styles.listRow}>
                  <View>
                    <Text style={styles.listTitle}>{item.team}</Text>
                    <Text style={styles.listMeta}>{item.meta}</Text>
                  </View>
                  <Text style={styles.listValue}>{item.score}</Text>
                </View>
              ))}
            </Card>

            <Card style={styles.panelCard} interactive>
              <View style={styles.panelHeader}>
                <View>
                  <Text style={styles.sectionLabel}>Analyst Feed</Text>
                  <Text style={styles.panelTitle}>Latest notes</Text>
                </View>
                <Text style={styles.panelHint}>Team channel</Text>
              </View>
              {feedItems.map(item => (
                <View key={item.title} style={styles.feedItem}>
                  <View style={styles.feedDot} />
                  <View style={styles.feedContent}>
                    <Text style={styles.feedTitle}>{item.title}</Text>
                    <Text style={styles.feedTime}>{item.time}</Text>
                  </View>
                </View>
              ))}
            </Card>

            <Card style={styles.panelCard} interactive>
              <View style={styles.panelHeader}>
                <View>
                  <Text style={styles.sectionLabel}>Build Report</Text>
                  <Text style={styles.panelTitle}>Quick configuration</Text>
                </View>
                <Text style={styles.panelHint}>Ready to export</Text>
              </View>

              <Text style={styles.inputLabel}>Report profile</Text>
              <View style={styles.segmentedControl}>
                {profileOptions.map(option => {
                  const active = selectedProfile === option;
                  return (
                    <Pressable
                      key={option}
                      onPress={() => setSelectedProfile(option)}
                      style={({ pressed }) => [
                        styles.segment,
                        active && styles.segmentActive,
                        pressed && styles.pressed,
                      ]}
                    >
                      <Text style={[styles.segmentText, active && styles.segmentTextActive]}>{option}</Text>
                    </Pressable>
                  );
                })}
              </View>

              <Text style={styles.inputLabel}>Club name</Text>
              <StyledInput
                value={formState.club}
                onChangeText={club => setFormState(current => ({ ...current, club }))}
                placeholder="Enter club"
              />

              <Text style={styles.inputLabel}>Lead analyst</Text>
              <StyledInput
                value={formState.analyst}
                onChangeText={analyst => setFormState(current => ({ ...current, analyst }))}
                placeholder="Enter analyst"
              />

              <Text style={styles.inputLabel}>Objective</Text>
              <StyledInput
                value={formState.objective}
                onChangeText={objective => setFormState(current => ({ ...current, objective }))}
                placeholder="Summarize objective"
                multiline
              />

              <View style={styles.formActions}>
                <TactileButton label="Generate Pack" kind="primary" />
                <TactileButton label="Save Draft" kind="ghost" />
              </View>
            </Card>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function Card({ children, style, interactive = false }) {
  if (interactive) {
    return (
      <Pressable
        style={({ pressed, hovered }) => [
          styles.card,
          hovered && styles.cardHovered,
          pressed && styles.pressed,
          style,
        ]}
      >
        {children}
      </Pressable>
    );
  }

  return <View style={[styles.card, style]}>{children}</View>;
}

function TactileButton({ label, kind }) {
  const variantStyle =
    kind === 'primary'
      ? styles.buttonPrimary
      : kind === 'secondary'
        ? styles.buttonSecondary
        : styles.buttonGhost;

  const textStyle =
    kind === 'primary'
      ? styles.buttonPrimaryText
      : kind === 'secondary'
        ? styles.buttonSecondaryText
        : styles.buttonGhostText;

  return (
    <Pressable style={({ pressed, hovered }) => [styles.buttonBase, variantStyle, hovered && styles.buttonHover, pressed && styles.pressed]}>
      <Text style={[styles.buttonTextBase, textStyle]}>{label}</Text>
    </Pressable>
  );
}

function StyledInput({ multiline = false, ...props }) {
  return (
    <TextInput
      {...props}
      multiline={multiline}
      placeholderTextColor={theme.colors.textMuted}
      style={[styles.input, multiline && styles.inputMultiline]}
    />
  );
}

function Pill({ label, tone }) {
  return (
    <View style={[styles.pill, tone === 'positive' && styles.pillPositive]}>
      <Text style={[styles.pillText, tone === 'positive' && styles.pillTextPositive]}>{label}</Text>
    </View>
  );
}

function SnapshotRow({ label, value }) {
  return (
    <View style={styles.snapshotRow}>
      <Text style={styles.snapshotRowLabel}>{label}</Text>
      <Text style={styles.snapshotRowValue}>{value}</Text>
    </View>
  );
}

function InlineMetric({ label, value }) {
  return (
    <View style={styles.inlineMetric}>
      <Text style={styles.inlineMetricValue}>{value}</Text>
      <Text style={styles.inlineMetricLabel}>{label}</Text>
    </View>
  );
}

function MiniBars() {
  const bars = [58, 74, 66, 88, 70, 82, 64];

  return (
    <View style={styles.miniBarsWrap}>
      {bars.map((height, index) => (
        <View key={`${height}-${index}`} style={styles.miniBarTrack}>
          <View style={[styles.miniBarFill, { height: `${height}%` }]} />
        </View>
      ))}
    </View>
  );
}

function TrendChart() {
  const columns = [
    { label: 'M1', home: 72, away: 46 },
    { label: 'M2', home: 80, away: 52 },
    { label: 'M3', home: 64, away: 58 },
    { label: 'M4', home: 88, away: 61 },
    { label: 'M5', home: 76, away: 54 },
  ];

  return (
    <View style={styles.chartWrap}>
      <View style={styles.chartGrid}>
        {[0, 1, 2, 3].map(line => (
          <View key={line} style={styles.chartLine} />
        ))}
      </View>
      <View style={styles.chartColumns}>
        {columns.map(column => (
          <View key={column.label} style={styles.chartColumn}>
            <View style={styles.chartBarPair}>
              <View style={[styles.chartBarPrimary, { height: `${column.home}%` }]} />
              <View style={[styles.chartBarSecondary, { height: `${column.away}%` }]} />
            </View>
            <Text style={styles.chartLabel}>{column.label}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  screen: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollContent: {
    alignItems: 'center',
    paddingBottom: theme.spacing.xxxl,
  },
  appShell: {
    paddingHorizontal: theme.spacing.xl,
    paddingTop: theme.spacing.lg,
    gap: theme.spacing.sectionGap,
  },
  navbar: {
    minHeight: 64,
    backgroundColor: theme.colors.primary,
    borderRadius: theme.radius.large,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: theme.spacing.md,
    ...theme.shadow.medium,
  },
  brandBlock: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
    flexShrink: 1,
  },
  brandBadge: {
    width: 44,
    height: 44,
    borderRadius: theme.radius.medium,
    backgroundColor: 'rgba(255,255,255,0.14)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandBadgeText: {
    color: theme.colors.surface,
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 0.4,
  },
  navEyebrow: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: theme.type.caption.fontSize,
    lineHeight: theme.type.caption.lineHeight,
    fontWeight: '400',
  },
  navTitle: {
    color: theme.colors.surface,
    fontSize: 18,
    lineHeight: 24,
    fontWeight: '600',
  },
  navActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
    flexWrap: 'wrap',
    justifyContent: 'flex-end',
  },
  ghostButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: theme.radius.medium,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  ghostButtonText: {
    color: theme.colors.surface,
    fontSize: theme.type.button.fontSize,
    lineHeight: theme.type.button.lineHeight,
    fontWeight: theme.type.button.fontWeight,
    letterSpacing: theme.type.button.letterSpacing,
  },
  heroGrid: {
    gap: theme.spacing.lg,
  },
  heroGridDesktop: {
    flexDirection: 'row',
    alignItems: 'stretch',
  },
  heroCard: {
    backgroundColor: theme.colors.card,
    overflow: 'hidden',
  },
  heroCardDesktop: {
    flex: 1.6,
  },
  snapshotCard: {
    flex: 1,
  },
  heroTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: theme.spacing.md,
    marginBottom: theme.spacing.lg,
    flexWrap: 'wrap',
  },
  heroMeta: {
    color: theme.colors.textSecondary,
    fontSize: theme.type.bodySmall.fontSize,
    lineHeight: theme.type.bodySmall.lineHeight,
    fontWeight: '400',
  },
  heroHeading: {
    color: theme.colors.textPrimary,
    fontSize: theme.type.h1.fontSize,
    lineHeight: theme.type.h1.lineHeight,
    fontWeight: theme.type.h1.fontWeight,
    maxWidth: 640,
  },
  heroDescription: {
    color: theme.colors.textSecondary,
    fontSize: theme.type.bodyLarge.fontSize,
    lineHeight: theme.type.bodyLarge.lineHeight,
    fontWeight: theme.type.bodyLarge.fontWeight,
    marginTop: theme.spacing.md,
    maxWidth: 620,
  },
  heroStatsRow: {
    flexDirection: 'row',
    gap: theme.spacing.md,
    marginTop: theme.spacing.xxl,
    marginBottom: theme.spacing.xl,
    flexWrap: 'wrap',
  },
  heroStatsColumn: {
    flexDirection: 'column',
  },
  heroMetric: {
    flex: 1,
    minWidth: 120,
    backgroundColor: theme.colors.background,
    borderRadius: theme.radius.medium,
    padding: theme.spacing.md,
  },
  heroMetricValue: {
    color: theme.colors.textPrimary,
    fontSize: 24,
    lineHeight: 30,
    fontWeight: '700',
  },
  heroMetricLabel: {
    color: theme.colors.textSecondary,
    fontSize: theme.type.bodySmall.fontSize,
    lineHeight: theme.type.bodySmall.lineHeight,
    marginTop: theme.spacing.xs,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
    flexWrap: 'wrap',
  },
  sectionHeader: {
    gap: theme.spacing.xs,
  },
  sectionTitle: {
    color: theme.colors.textPrimary,
    fontSize: theme.type.h2.fontSize,
    lineHeight: theme.type.h2.lineHeight,
    fontWeight: theme.type.h2.fontWeight,
  },
  sectionCopy: {
    color: theme.colors.textSecondary,
    fontSize: theme.type.bodyMedium.fontSize,
    lineHeight: theme.type.bodyMedium.lineHeight,
    maxWidth: 660,
  },
  sectionLabel: {
    color: theme.colors.textMuted,
    fontSize: theme.type.caption.fontSize,
    lineHeight: theme.type.caption.lineHeight,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: theme.spacing.xs,
  },
  gridWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: theme.spacing.md,
  },
  gridItem: {
    minWidth: 0,
  },
  card: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.large,
    padding: theme.spacing.md,
    ...theme.shadow.medium,
  },
  cardHovered: {
    ...theme.shadow.soft,
  },
  statLabel: {
    color: theme.colors.textSecondary,
    fontSize: theme.type.bodySmall.fontSize,
    lineHeight: theme.type.bodySmall.lineHeight,
  },
  statValue: {
    color: theme.colors.textPrimary,
    fontSize: 30,
    lineHeight: 36,
    fontWeight: '700',
    marginTop: theme.spacing.xs,
  },
  statFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
    marginTop: theme.spacing.lg,
  },
  deltaDot: {
    width: 8,
    height: 8,
    borderRadius: 99,
  },
  deltaText: {
    fontSize: theme.type.bodySmall.fontSize,
    lineHeight: theme.type.bodySmall.lineHeight,
    fontWeight: '600',
  },
  analyticsGrid: {
    gap: theme.spacing.lg,
  },
  analyticsGridDesktop: {
    flexDirection: 'row',
  },
  analyticsLeadCard: {
    flex: 1.3,
  },
  panelCard: {
    flex: 1,
  },
  panelHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: theme.spacing.md,
    marginBottom: theme.spacing.md,
  },
  panelTitle: {
    color: theme.colors.textPrimary,
    fontSize: theme.type.h3.fontSize,
    lineHeight: theme.type.h3.lineHeight,
    fontWeight: theme.type.h3.fontWeight,
  },
  panelHint: {
    color: theme.colors.textMuted,
    fontSize: theme.type.bodySmall.fontSize,
    lineHeight: theme.type.bodySmall.lineHeight,
  },
  tableHead: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: theme.spacing.sm,
    marginBottom: theme.spacing.xs,
  },
  tableHeadText: {
    color: theme.colors.textMuted,
    fontSize: theme.type.caption.fontSize,
    lineHeight: theme.type.caption.lineHeight,
    fontWeight: '600',
    width: 64,
    textAlign: 'right',
  },
  tableTeam: {
    flex: 1,
    textAlign: 'left',
    width: 'auto',
  },
  tableRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: theme.spacing.sm,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  tableTeamWrap: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
    paddingRight: theme.spacing.sm,
  },
  rankBadge: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: theme.colors.tint,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rankBadgeText: {
    color: theme.colors.primary,
    fontSize: theme.type.bodySmall.fontSize,
    lineHeight: theme.type.bodySmall.lineHeight,
    fontWeight: '700',
  },
  tableTeamName: {
    color: theme.colors.textPrimary,
    fontSize: theme.type.bodyMedium.fontSize,
    lineHeight: theme.type.bodyMedium.lineHeight,
    fontWeight: '600',
  },
  tableMeta: {
    color: theme.colors.textMuted,
    fontSize: theme.type.caption.fontSize,
    lineHeight: theme.type.caption.lineHeight,
    marginTop: 2,
  },
  tableCell: {
    width: 64,
    textAlign: 'right',
    color: theme.colors.textPrimary,
    fontSize: theme.type.bodyMedium.fontSize,
    lineHeight: theme.type.bodyMedium.lineHeight,
    fontWeight: '500',
  },
  lowerGrid: {
    gap: theme.spacing.lg,
  },
  lowerGridDesktop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  listRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: theme.spacing.sm,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    gap: theme.spacing.md,
  },
  listTitle: {
    color: theme.colors.textPrimary,
    fontSize: theme.type.bodyMedium.fontSize,
    lineHeight: theme.type.bodyMedium.lineHeight,
    fontWeight: '600',
  },
  listMeta: {
    color: theme.colors.textMuted,
    fontSize: theme.type.bodySmall.fontSize,
    lineHeight: theme.type.bodySmall.lineHeight,
    marginTop: 2,
  },
  listValue: {
    color: theme.colors.primary,
    fontSize: theme.type.bodySmall.fontSize,
    lineHeight: theme.type.bodySmall.lineHeight,
    fontWeight: '600',
    textAlign: 'right',
  },
  feedItem: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
    paddingVertical: theme.spacing.sm,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  feedDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: theme.colors.secondary,
    marginTop: 6,
  },
  feedContent: {
    flex: 1,
  },
  feedTitle: {
    color: theme.colors.textPrimary,
    fontSize: theme.type.bodyMedium.fontSize,
    lineHeight: theme.type.bodyMedium.lineHeight,
  },
  feedTime: {
    color: theme.colors.textMuted,
    fontSize: theme.type.caption.fontSize,
    lineHeight: theme.type.caption.lineHeight,
    marginTop: theme.spacing.xs,
  },
  inputLabel: {
    color: theme.colors.textSecondary,
    fontSize: theme.type.bodySmall.fontSize,
    lineHeight: theme.type.bodySmall.lineHeight,
    fontWeight: '500',
    marginTop: theme.spacing.sm,
    marginBottom: theme.spacing.xs,
  },
  segmentedControl: {
    backgroundColor: theme.colors.background,
    borderRadius: theme.radius.large,
    padding: theme.spacing.xs,
    gap: theme.spacing.xs,
    marginBottom: theme.spacing.xs,
  },
  segment: {
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: theme.radius.medium,
  },
  segmentActive: {
    backgroundColor: theme.colors.surface,
    ...theme.shadow.light,
  },
  segmentText: {
    color: theme.colors.textSecondary,
    fontSize: theme.type.bodyMedium.fontSize,
    lineHeight: theme.type.bodyMedium.lineHeight,
    fontWeight: '500',
  },
  segmentTextActive: {
    color: theme.colors.primary,
    fontWeight: '600',
  },
  input: {
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    borderWidth: 1,
    borderRadius: theme.radius.medium,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: theme.type.bodyMedium.fontSize,
    lineHeight: theme.type.bodyMedium.lineHeight,
    color: theme.colors.textPrimary,
  },
  inputMultiline: {
    minHeight: 108,
    textAlignVertical: 'top',
  },
  formActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
    marginTop: theme.spacing.lg,
  },
  buttonBase: {
    minHeight: 44,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: theme.radius.medium,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonPrimary: {
    backgroundColor: theme.colors.primary,
    ...theme.shadow.light,
  },
  buttonSecondary: {
    backgroundColor: theme.colors.tint,
  },
  buttonGhost: {
    backgroundColor: 'transparent',
  },
  buttonHover: {
    opacity: 0.94,
  },
  buttonTextBase: {
    fontSize: theme.type.button.fontSize,
    lineHeight: theme.type.button.lineHeight,
    fontWeight: theme.type.button.fontWeight,
    letterSpacing: theme.type.button.letterSpacing,
  },
  buttonPrimaryText: {
    color: theme.colors.surface,
  },
  buttonSecondaryText: {
    color: theme.colors.primary,
  },
  buttonGhostText: {
    color: theme.colors.primary,
  },
  pressed: {
    transform: [{ scale: 0.97 }],
  },
  pill: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: theme.radius.pill,
    backgroundColor: theme.colors.tint,
  },
  pillPositive: {
    backgroundColor: 'rgba(255,255,255,0.14)',
  },
  pillText: {
    color: theme.colors.primary,
    fontSize: theme.type.caption.fontSize,
    lineHeight: theme.type.caption.lineHeight,
    fontWeight: '600',
  },
  pillTextPositive: {
    color: theme.colors.surface,
  },
  snapshotTitle: {
    color: theme.colors.textPrimary,
    fontSize: theme.type.h3.fontSize,
    lineHeight: theme.type.h3.lineHeight,
    fontWeight: theme.type.h3.fontWeight,
    marginBottom: theme.spacing.md,
  },
  miniBarsWrap: {
    height: 128,
    backgroundColor: theme.colors.background,
    borderRadius: theme.radius.large,
    padding: theme.spacing.md,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    gap: theme.spacing.xs,
  },
  miniBarTrack: {
    flex: 1,
    height: '100%',
    borderRadius: theme.radius.medium,
    backgroundColor: '#ECF1EF',
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },
  miniBarFill: {
    width: '100%',
    borderRadius: theme.radius.medium,
    backgroundColor: theme.colors.primary,
  },
  snapshotList: {
    marginTop: theme.spacing.md,
  },
  snapshotRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: theme.spacing.sm,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  snapshotRowLabel: {
    color: theme.colors.textSecondary,
    fontSize: theme.type.bodyMedium.fontSize,
    lineHeight: theme.type.bodyMedium.lineHeight,
  },
  snapshotRowValue: {
    color: theme.colors.textPrimary,
    fontSize: theme.type.bodySmall.fontSize,
    lineHeight: theme.type.bodySmall.lineHeight,
    fontWeight: '600',
  },
  chartWrap: {
    height: 240,
    borderRadius: theme.radius.large,
    backgroundColor: theme.colors.background,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.md,
    overflow: 'hidden',
    marginTop: theme.spacing.sm,
  },
  chartGrid: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'space-evenly',
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.md,
  },
  chartLine: {
    height: 1,
    backgroundColor: theme.colors.border,
  },
  chartColumns: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    gap: theme.spacing.sm,
  },
  chartColumn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  chartBarPair: {
    width: '100%',
    height: 170,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
    gap: 6,
  },
  chartBarPrimary: {
    width: 18,
    backgroundColor: theme.colors.primary,
    borderRadius: theme.radius.medium,
  },
  chartBarSecondary: {
    width: 18,
    backgroundColor: '#BDEAD6',
    borderRadius: theme.radius.medium,
  },
  chartLabel: {
    marginTop: theme.spacing.sm,
    color: theme.colors.textMuted,
    fontSize: theme.type.caption.fontSize,
    lineHeight: theme.type.caption.lineHeight,
  },
  inlineMetrics: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
    marginTop: theme.spacing.md,
  },
  inlineMetric: {
    minWidth: 92,
    backgroundColor: theme.colors.background,
    borderRadius: theme.radius.medium,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
  },
  inlineMetricValue: {
    color: theme.colors.textPrimary,
    fontSize: theme.type.bodyLarge.fontSize,
    lineHeight: theme.type.bodyLarge.lineHeight,
    fontWeight: '700',
  },
  inlineMetricLabel: {
    color: theme.colors.textMuted,
    fontSize: theme.type.caption.fontSize,
    lineHeight: theme.type.caption.lineHeight,
    marginTop: 2,
  },
});

export default App;
