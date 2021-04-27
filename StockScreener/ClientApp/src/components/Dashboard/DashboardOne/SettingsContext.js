import React from 'react';

export const SettingsContext = React.createContext({
    saveSettings: false,
    toggleSettings: () => {},
  });