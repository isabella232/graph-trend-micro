export interface DeepSecurityApiKey {
  ID: number;
  keyName: string;
  description: string;
  locale: string;
  roleId: number;
  timeZone: string;
  active: boolean;
  created: number;
  unsuccessfulSignInAttempts: number;
  serviceAccount: boolean;
  unlockTime?: number;
  expiryDate?: number;
  lastSignIn?: number;
}
