// OWNER - HEET
// PURPOSE - Static incident, zone, and action data for the mobile alert app.

export const incident = {
  status: 'Danger',
  statusLevel: 'danger',
  temple: 'Somnath Temple',
  corridor: 'Main Entry Gate',
  sector: 'Sector 4',
  title: 'Crowd density rising',
  predictedRiskIn: '08:00',
  density: 4.8,
  safeDensity: 3.5,
  flowImbalance: '+31 people/min',
  exitRoutes: '4 open',
  updatedAt: '04:23 live',
  reasons: [
    'Density is above safe limit.',
    'More people are entering than exiting.',
    'Walking speed is dropping.',
  ],
};

export const zones = [
  { label: 'Sector 4', area: 'Main Entry Gate', status: 'danger', density: 4.8 },
  { label: 'Corridor A', area: 'North corridor', status: 'warning', density: 3.7 },
  { label: 'Queue Lane', area: 'Holding area', status: 'safe', density: 2.4 },
];

export const actions = [
  {
    id: 'police',
    title: 'Dispatch police unit',
    target: 'Sector 4 / Main Entry Gate',
    owner: 'Police Control',
    note: 'Move crowd-control unit 04 to the entry checkpoint.',
    primary: true,
  },
  {
    id: 'entry',
    title: 'Pause entry',
    target: 'Main Entry Gate',
    owner: 'Temple Authority',
    note: 'Hold incoming visitors for 5 minutes.',
  },
  {
    id: 'transport',
    title: 'Hold shuttles',
    target: 'Transport queue',
    owner: 'Transport Control',
    note: 'Delay new arrivals until density drops.',
  },
];

export const trend = [2.7, 2.9, 3.2, 3.4, 3.8, 4.1, 4.5, 4.8];

export const tabs = [
  { id: 'alert', label: 'Alert' },
  { id: 'actions', label: 'Actions' },
  { id: 'metrics', label: 'Metrics' },
];
