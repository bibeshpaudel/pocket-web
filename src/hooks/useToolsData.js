import { useState, useEffect, useCallback } from 'react';

const FAVORITES_KEY = 'pocket_favorites';
const RECENT_KEY = 'pocket_recent';
const SETTINGS_KEY = 'pocket_settings';
const MAX_RECENT = 5;

const DEFAULT_SETTINGS = {
  showFavorites: true,
  showRecent: true
};

export function useToolsData() {
  const [favorites, setFavorites] = useState(() => {
    try {
      const item = window.localStorage.getItem(FAVORITES_KEY);
      return item ? JSON.parse(item) : [];
    } catch (error) {
      console.warn('Error reading favorites from localStorage', error);
      return [];
    }
  });

  const [recent, setRecent] = useState(() => {
    try {
      const item = window.localStorage.getItem(RECENT_KEY);
      return item ? JSON.parse(item) : [];
    } catch (error) {
      console.warn('Error reading recent from localStorage', error);
      return [];
    }
  });

  const [settings, setSettings] = useState(() => {
    try {
      const item = window.localStorage.getItem(SETTINGS_KEY);
      return item ? { ...DEFAULT_SETTINGS, ...JSON.parse(item) } : DEFAULT_SETTINGS;
    } catch (error) {
      console.warn('Error reading settings from localStorage', error);
      return DEFAULT_SETTINGS;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
    } catch (error) {
      console.warn('Error saving favorites to localStorage', error);
    }
  }, [favorites]);

  useEffect(() => {
    try {
      window.localStorage.setItem(RECENT_KEY, JSON.stringify(recent));
    } catch (error) {
      console.warn('Error saving recent to localStorage', error);
    }
  }, [recent]);

  useEffect(() => {
    try {
      window.localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    } catch (error) {
      console.warn('Error saving settings to localStorage', error);
    }
  }, [settings]);

  const toggleFavorite = useCallback((toolId) => {
    if (!toolId) return;
    setFavorites(prev => {
      if (prev.includes(toolId)) {
        return prev.filter(id => id !== toolId);
      } else {
        return [...prev, toolId];
      }
    });
  }, []);

  const addRecent = useCallback((toolId) => {
    if (!toolId) return;
    if (!settings.showRecent) return; // Don't track if disabled

    setRecent(prev => {
      // Remove it if it already exists to move it to the front
      const filtered = prev.filter(id => id !== toolId);
      // Add to front, keep to MAX_RECENT
      const newRecent = [toolId, ...filtered].slice(0, MAX_RECENT);
      
      // Optimization: Only update state if it actually changed
      if (JSON.stringify(prev) === JSON.stringify(newRecent)) {
        return prev;
      }
      return newRecent;
    });
  }, [settings.showRecent]);

  const clearRecent = useCallback(() => {
    setRecent([]);
    try {
      window.localStorage.removeItem(RECENT_KEY);
    } catch (e) {}
  }, []);

  const clearFavorites = useCallback(() => {
    setFavorites([]);
    try {
      window.localStorage.removeItem(FAVORITES_KEY);
    } catch (e) {}
  }, []);

  const updateSetting = useCallback((key, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  }, []);

  return {
    favorites,
    recent,
    settings,
    toggleFavorite,
    addRecent,
    clearRecent,
    clearFavorites,
    updateSetting
  };
}
