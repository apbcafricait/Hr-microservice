// src/components/EmployeeSettings.jsx
import React, { useState } from 'react';
import {
  Cog6ToothIcon,
  BellIcon,
  SunIcon,
  MoonIcon,
  ShieldCheckIcon,
} from '@heroicons/react/24/outline';
import { useSettings } from '../../../context/SettingsContext.jsx';

const EmployeeSettings = () => {
  const { settings, setSetting, resetSettings, t } = useSettings();
  const [isSaving, setIsSaving] = useState(false);

  const handleToggle = (key) => (e) => {
    const value = e?.target
      ? e.target.type === 'checkbox'
        ? e.target.checked
        : e.target.value
      : e;
    setSetting(key, value);
  };

  const handleSave = async (e) => {
    e && e.preventDefault();
    setIsSaving(true);
    await new Promise((r) => setTimeout(r, 600));
    setIsSaving(false);
    alert(t('settingsSaved'));
  };

  const handleReset = () => {
    resetSettings();
    alert(t('reset'));
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 transition-colors duration-300">
      <div className="max-w-4xl mx-auto px-6">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 mb-8 transition-colors">
          <div className="flex items-center mb-4">
            <Cog6ToothIcon className="w-8 h-8 text-blue-600 mr-3" />
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{t('settingsTitle')}</h1>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-6">
          {/* Notifications */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 transition-colors">
            <div className="flex items-center mb-4">
              <BellIcon className="w-6 h-6 text-blue-600 mr-3" />
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{t('notificationPreferences')}</h2>
            </div>

            <div className="space-y-4">
              <label className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-gray-900 dark:text-gray-100">{t('emailNotifications')}</div>
                  <div className="text-sm text-gray-500 dark:text-gray-300">Receive important updates via email</div>
                </div>
                <input
                  type="checkbox"
                  checked={!!settings.emailNotifications}
                  onChange={handleToggle('emailNotifications')}
                />
              </label>

              <label className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-gray-900 dark:text-gray-100">{t('pushNotifications')}</div>
                  <div className="text-sm text-gray-500 dark:text-gray-300">Get instant alerts in your browser</div>
                </div>
                <input
                  type="checkbox"
                  checked={!!settings.pushNotifications}
                  onChange={handleToggle('pushNotifications')}
                />
              </label>
            </div>
          </div>

          {/* Appearance */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 transition-colors">
            <div className="flex items-center mb-4">
              <SunIcon className="w-6 h-6 text-amber-500 mr-3" />
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{t('appearance')}</h2>
            </div>

            <div className="space-y-4">
              <label className="block text-gray-900 dark:text-gray-100 mb-2">{t('theme')}</label>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setSetting('theme', 'light')}
                  className={`px-3 py-2 rounded-lg border transition-colors duration-200 ${
                    settings.theme === 'light'
                      ? 'bg-blue-500 text-white border-blue-500'
                      : 'bg-transparent text-gray-900 dark:text-gray-100 border-gray-400'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <SunIcon className="w-5 h-5" />
                    <span className="text-sm">{t('light')}</span>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setSetting('theme', 'dark')}
                  className={`px-3 py-2 rounded-lg border transition-colors duration-200 ${
                    settings.theme === 'dark'
                      ? 'bg-blue-500 text-white border-blue-500'
                      : 'bg-transparent text-gray-900 dark:text-gray-100 border-gray-400'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <MoonIcon className="w-5 h-5" />
                    <span className="text-sm">{t('dark')}</span>
                  </div>
                </button>
              </div>
            </div>
          </div>

          {/* Language & Privacy */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 transition-colors">
            <div className="flex items-center mb-4">
              <ShieldCheckIcon className="w-6 h-6 text-green-600 mr-3" />
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{t('privacyLevel')}</h2>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">{t('language')}</label>
                <select
                  value={settings.language}
                  onChange={(e) => setSetting('language', e.target.value)}
                  className="w-full px-3 py-2 border rounded-md bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                >
                  <option value="en">English</option>
                  <option value="fr">Français</option>
                  <option value="es">Español</option>
                  <option value="sw">Kiswahili</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">{t('privacyLevel')}</label>
                <select
                  value={settings.privacyLevel}
                  onChange={(e) => setSetting('privacyLevel', e.target.value)}
                  className="w-full px-3 py-2 border rounded-md bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                >
                  <option value="standard">{t('standard')}</option>
                  <option value="enhanced">{t('enhanced')}</option>
                  <option value="strict">{t('strict')}</option>
                </select>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 transition-colors flex justify-end gap-3">
            <button
              type="button"
              onClick={handleReset}
              className="px-4 py-2 rounded-md bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            >
              {t('reset')}
            </button>

            <button
              type="submit"
              disabled={isSaving}
              className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
            >
              {isSaving ? '...' : t('saveSettings')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EmployeeSettings;
