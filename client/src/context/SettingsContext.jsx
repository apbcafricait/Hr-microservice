// src/context/SettingsContext.jsx
import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';

const SETTINGS_KEY = 'employee_settings_v1';

const defaultSettings = {
  emailNotifications: true,
  pushNotifications: false,
  theme: 'light',      // 'light' | 'dark'
  language: 'en',      // 'en' | 'fr' | 'es' | 'sw'
  privacyLevel: 'standard', // 'standard' | 'enhanced' | 'strict'
};

const translations = {
  en: {
    settingsTitle: 'Employee Settings',
    notificationPreferences: 'Notification Preferences',
    emailNotifications: 'Email Notifications',
    pushNotifications: 'Push Notifications',
    appearance: 'Appearance',
    theme: 'Theme',
    light: 'Light',
    dark: 'Dark',
    language: 'Language',
    privacyLevel: 'Privacy Level',
    standard: 'Standard',
    enhanced: 'Enhanced',
    strict: 'Strict',
    saveSettings: 'Save Settings',
    reset: 'Reset',
    settingsSaved: 'Settings saved successfully!',
  },
  fr: {
    settingsTitle: 'Paramètres',
    notificationPreferences: 'Préférences de notification',
    emailNotifications: 'Notifications par e-mail',
    pushNotifications: 'Notifications push',
    appearance: 'Apparence',
    theme: 'Thème',
    light: 'Clair',
    dark: 'Sombre',
    language: 'Langue',
    privacyLevel: 'Niveau de confidentialité',
    standard: 'Standard',
    enhanced: 'Amélioré',
    strict: 'Strict',
    saveSettings: 'Enregistrer',
    reset: 'Réinitialiser',
    settingsSaved: 'Paramètres enregistrés avec succès!',
  },
  es: {
    settingsTitle: 'Ajustes',
    notificationPreferences: 'Preferencias de notificación',
    emailNotifications: 'Notificaciones por correo',
    pushNotifications: 'Notificaciones push',
    appearance: 'Apariencia',
    theme: 'Tema',
    light: 'Claro',
    dark: 'Oscuro',
    language: 'Idioma',
    privacyLevel: 'Nivel de privacidad',
    standard: 'Estándar',
    enhanced: 'Mejorado',
    strict: 'Estricto',
    saveSettings: 'Guardar',
    reset: 'Restablecer',
    settingsSaved: '¡Ajustes guardados!',
  },
  sw: {
    settingsTitle: 'Mipangilio',
    notificationPreferences: 'Mapendeleo ya arifa',
    emailNotifications: 'Arifa za barua pepe',
    pushNotifications: 'Arifa za push',
    appearance: 'Mwonekano',
    theme: 'Mandhari',
    light: 'Nuru',
    dark: 'Giza',
    language: 'Lugha',
    privacyLevel: 'Kiwango cha faragha',
    standard: 'Kawaida',
    enhanced: 'Boresha',
    strict: 'Mkali',
    saveSettings: 'Hifadhi Mipangilio',
    reset: 'Weka upya',
    settingsSaved: 'Mipangilio imehifadhiwa!',
  },
};

const SettingsContext = createContext(null);

export const SettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState(() => {
    try {
      const raw = localStorage.getItem(SETTINGS_KEY);
      if (raw) return JSON.parse(raw);
    } catch (e) {}
    return defaultSettings;
  });

  // Persist to localStorage whenever settings change
  useEffect(() => {
    try {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    } catch (e) {}
  }, [settings]);

  // Apply theme to <html>
  useEffect(() => {
    document.documentElement.classList.toggle('dark', settings.theme === 'dark');
  }, [settings.theme]);

  // helper to set a single key
  const setSetting = useCallback((key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  }, []);

  const resetSettings = useCallback(() => {
    setSettings(defaultSettings);
    // apply theme instantly after reset
    document.documentElement.classList.toggle('dark', defaultSettings.theme === 'dark');
  }, []);

  const t = useCallback(
    (key) => {
      const lang = settings.language || 'en';
      return (translations[lang] && translations[lang][key]) || translations.en[key] || key;
    },
    [settings.language]
  );

  return (
    <SettingsContext.Provider value={{ settings, setSetting, setSettings, resetSettings, t }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error('useSettings must be used within SettingsProvider');
  return ctx;
};
