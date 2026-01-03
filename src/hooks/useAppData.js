// useAppData Hook
// Manages app-wide data loading and state

import { useState, useEffect, useCallback } from 'react';
import storage from '../storage/asyncStorage';
import dataManager from '../storage/dataManager';

export const useAppData = () => {
  const [user, setUser] = useState(null);
  const [muscleStatus, setMuscleStatus] = useState(null);
  const [workouts, setWorkouts] = useState([]);
  const [settings, setSettings] = useState({});
  const [personalRecords, setPersonalRecords] = useState({});
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const appData = await dataManager.loadAppData();

      if (!appData.isInitialized) {
        // Initialize new user
        const newUser = await dataManager.initializeNewUser('Athlete');
        setUser(newUser);
        setMuscleStatus(await storage.getMuscleStatus());
        setWorkouts([]);
        setSettings(await storage.getSettings());
        setPersonalRecords({});
        setAchievements([]);
      } else {
        setUser(appData.user);
        setMuscleStatus(appData.muscleStatus);
        setWorkouts(appData.workouts || []);
        setSettings(appData.settings || {});
        setPersonalRecords(appData.personalRecords || {});
        setAchievements(appData.achievements || []);
      }
    } catch (err) {
      console.error('Error loading app data:', err);
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  const refreshMuscleStatus = useCallback(async () => {
    const updated = await dataManager.updateMuscleRecovery();
    setMuscleStatus(updated);
    return updated;
  }, []);

  const refreshUser = useCallback(async () => {
    const userData = await storage.getUser();
    setUser(userData);
    return userData;
  }, []);

  const updateSettings = useCallback(async (newSettings) => {
    const updated = { ...settings, ...newSettings };
    await storage.setSettings(updated);
    setSettings(updated);
    return updated;
  }, [settings]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  return {
    user,
    muscleStatus,
    workouts,
    settings,
    personalRecords,
    achievements,
    loading,
    error,
    refresh: loadData,
    refreshMuscleStatus,
    refreshUser,
    updateSettings,
  };
};

export default useAppData;
