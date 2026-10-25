// CAN bus signals for a 2012 Honda Accord

export type CanSignalName =
  'speed' | 'rpm' | 'coolant' | 'steering' | 'wheelFL' | 'wheelFR' | 'wheelBL' | 'wheelBR';

export interface CanSignal {
  name: CanSignalName;
  id: string; // frame ID, 3 hex digits
  startBit: number;
  bitLength: number;
  scale: number; // multiply raw value by the scale
  offset: number; // add to multiple
  unit: string; // unit of the result (e.g., C or KM/h)
  signed?: boolean;
}

export const CAN_SIGNALS: CanSignal[] = [
  // vehicle speed
  { name: 'speed', id: '158', startBit: 0, bitLength: 16, scale: 0.01, offset: 0, unit: 'km/h' },
  // rpm
  { name: 'rpm', id: '17C', startBit: 16, bitLength: 16, scale: 1, offset: 0, unit: 'rpm' },
  // coolant temp
  { name: 'coolant', id: '324', startBit: 0, bitLength: 8, scale: 1, offset: -40, unit: '°C' },
  // steering angle
  {
    name: 'steering',
    id: '1B0',
    startBit: 16,
    bitLength: 16,
    scale: 1,
    offset: 0,
    unit: 'deg',
    signed: true,
  },
  // wheel speeds
  { name: 'wheelFL', id: '1D0', startBit: 0, bitLength: 15, scale: 0.01, offset: 0, unit: 'km/h' },
  { name: 'wheelFR', id: '1D0', startBit: 15, bitLength: 15, scale: 0.01, offset: 0, unit: 'km/h' },
  { name: 'wheelBL', id: '1D0', startBit: 30, bitLength: 15, scale: 0.01, offset: 0, unit: 'km/h' },
  { name: 'wheelBR', id: '1D0', startBit: 45, bitLength: 15, scale: 0.01, offset: 0, unit: 'km/h' },
];

export interface CanGroup {
  name: string;
  filter: string;
  mask: string;
  ids: string[];
  intervalMs: number;
}

export const CAN_GROUPS: CanGroup[] = [
  { name: 'engine', filter: '158', mask: '7DB', ids: ['158', '17C'], intervalMs: 500 },
  { name: 'coolant', filter: '324', mask: '7FF', ids: ['324'], intervalMs: 10000 },
  { name: 'wheel', filter: '1B0', mask: '79F', ids: ['1B0', '1D0'], intervalMs: 1000 },
];
