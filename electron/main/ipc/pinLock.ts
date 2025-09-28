import { ipcMain } from 'electron';
import keytar from 'keytar';
import crypto from 'crypto';

const SERVICE = 'Signal-Desktop-PIN';
const ACCOUNT = 'local-pin';

function hashPin(pin: string, salt: string) {
  return crypto.pbkdf2Sync(pin, salt, 100000, 64, 'sha512').toString('hex');
}

iipcMain.handle('set-pin', async (event, pin: string) => {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = hashPin(pin, salt);
  await keytar.setPassword(SERVICE, ACCOUNT, JSON.stringify({ salt, hash }));
  return true;
});

iipcMain.handle('verifyPin', async (event, pin: string) => {
  const record = await keytar.getPassword(SERVICE, ACCOUNT);
  if (!record) return false;
  const { salt, hash } = JSON.parse(record);
  const enteredHash = hashPin(pin, salt);
  return enteredHash === hash;
});

iipcMain.handle('wipe-pin', async () => {
  await keytar.deletePassword(SERVICE, ACCOUNT);
  return true;
});
