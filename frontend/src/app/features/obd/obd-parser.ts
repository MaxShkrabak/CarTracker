import { CanSignal } from './can-signals';

function extractBytes(response: string, header: string, byteCount: number): number[] | null {
  const clean = response.replace(/\s/g, '');
  const found = clean.indexOf(header);

  if (found === -1) {
    return null;
  }

  const start = found + header.length;
  const hex = clean.slice(start, start + byteCount * 2);

  if (!new RegExp(`^[0-9A-F]{${byteCount * 2}}$`, 'i').test(hex)) {
    return null;
  }

  const bytes: number[] = [];
  for (let i = 0; i < hex.length; i += 2) {
    bytes.push(parseInt(hex.slice(i, i + 2), 16));
  }

  return bytes;
}

export function parseFuelLevel(response: string): number | null {
  const bytes = extractBytes(response, '412F', 1);
  if (bytes === null) {
    return null;
  }

  const [a] = bytes;
  return Math.round((100 * a) / 255);
}

export function parseBatteryVoltage(response: string): number | null {
  const match = response.match(/(\d+\.\d+)V/);

  if (match === null) {
    return null;
  }

  return parseFloat(match[1]);
}

export function decodeCanSignal(signal: CanSignal, hex: string): number | null {
  let raw = 0;

  for (let i = 0; i < signal.bitLength; i++) {
    const bit = signal.startBit + i;
    const byteIndex = Math.floor(bit / 8);
    const byte = parseInt(hex.slice(byteIndex * 2, byteIndex * 2 + 2), 16);

    if (Number.isNaN(byte)) return null;

    raw = raw * 2 + ((byte >> (7 - (bit % 8))) & 1);
  }

  if (signal.signed && raw >= 2 ** (signal.bitLength - 1)) {
    raw -= 2 ** signal.bitLength;
  }
  return raw * signal.scale + signal.offset;
}
