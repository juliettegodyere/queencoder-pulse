import { JOIN_CODE_LENGTH } from '../../utils/constants.js';

const ALPHANUM = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

export function randomToken(length = 24) {
  const bytes = new Uint8Array(length);
  crypto.getRandomValues(bytes);
  let out = '';
  for (let i = 0; i < length; i += 1) {
    out += ALPHANUM[bytes[i] % ALPHANUM.length];
  }
  return out;
}

export function generateJoinCode() {
  return randomToken(JOIN_CODE_LENGTH);
}
