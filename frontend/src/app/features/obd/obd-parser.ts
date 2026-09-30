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

export function parseSpeed(response: string): number | null {
  const bytes = extractBytes(response, '410D', 1);
  if (bytes === null) {
    return null;
  }

  const [a] = bytes;
  return a;
}

export function parseRPM(response: string): number | null {
  const bytes = extractBytes(response, '410C', 2);
  if (bytes === null) {
    return null;
  }

  const [a, b] = bytes;
  return Math.round((256 * a + b) / 4);
}

export function parseCoolantTemp(response: string): number | null {
  const bytes = extractBytes(response, '4105', 1);
  if (bytes === null) {
    return null;
  }

  const [a] = bytes;
  return a - 40;
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
