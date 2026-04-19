// OWNER - HEET
// PURPOSE - Persist small app preferences (role, selected temple/corridor).

import AsyncStorage from '@react-native-async-storage/async-storage';

const KEYS = {
  role: 'role',
  templeId: 'templeId',
  tableName: 'tableName',
  token: 'jwt_token',
};

export async function getStoredToken() {
  return AsyncStorage.getItem(KEYS.token);
}

export async function setStoredToken(token) {
  if (!token) return AsyncStorage.removeItem(KEYS.token);
  return AsyncStorage.setItem(KEYS.token, token);
}

export async function getStoredRole() {
  return AsyncStorage.getItem(KEYS.role);
}

export async function setStoredRole(role) {
  if (!role) return AsyncStorage.removeItem(KEYS.role);
  return AsyncStorage.setItem(KEYS.role, role);
}

export async function getStoredTempleId() {
  return AsyncStorage.getItem(KEYS.templeId);
}

export async function setStoredTempleId(templeId) {
  if (!templeId) return AsyncStorage.removeItem(KEYS.templeId);
  return AsyncStorage.setItem(KEYS.templeId, templeId);
}

export async function getStoredTableName() {
  return AsyncStorage.getItem(KEYS.tableName);
}

export async function setStoredTableName(tableName) {
  if (!tableName) return AsyncStorage.removeItem(KEYS.tableName);
  return AsyncStorage.setItem(KEYS.tableName, tableName);
}

