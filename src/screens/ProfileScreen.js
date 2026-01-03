// ProfileScreen
// User profile, settings, and preferences

import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Switch,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { spacing, borderRadius, shadows } from '../theme/spacing';

// Components
import { LevelDisplay } from '../components/XPCounter';
import Button, { ChipButton } from '../components/Button';

// Storage
import storage from '../storage/asyncStorage';
import dataManager from '../storage/dataManager';
import { EQUIPMENT_TYPES } from '../data/exercises';
import { formatNumber } from '../utils/formatters';

const ProfileScreen = ({ navigation }) => {
  const [user, setUser] = useState(null);
  const [settings, setSettings] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState('');
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [])
  );

  const loadData = async () => {
    try {
      const [userData, settingsData] = await Promise.all([
        storage.getUser(),
        storage.getSettings(),
      ]);

      setUser(userData);
      setSettings(settingsData);
      setEditedName(userData?.name || '');
    } catch (error) {
      console.error('Error loading profile data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveName = async () => {
    if (editedName.trim()) {
      await storage.updateUser({ name: editedName.trim() });
      setUser(prev => ({ ...prev, name: editedName.trim() }));
    }
    setIsEditing(false);
  };

  const handleToggleEquipment = async (equipmentId) => {
    const currentEquipment = settings.equipment || ['none'];
    let newEquipment;

    if (currentEquipment.includes(equipmentId)) {
      // Remove (but keep at least 'none')
      newEquipment = currentEquipment.filter(e => e !== equipmentId);
      if (newEquipment.length === 0) newEquipment = ['none'];
    } else {
      // Add
      newEquipment = [...currentEquipment, equipmentId];
    }

    const newSettings = { ...settings, equipment: newEquipment };
    await storage.updateSettings(newSettings);
    setSettings(newSettings);
  };

  const handleToggleSetting = async (key, value) => {
    const newSettings = { ...settings, [key]: value };
    await storage.updateSettings(newSettings);
    setSettings(newSettings);
  };

  const handleSetDuration = async (duration) => {
    const newSettings = { ...settings, workoutDuration: duration };
    await storage.updateSettings(newSettings);
    setSettings(newSettings);
  };

  const handleSetExperience = async (level) => {
    const newSettings = { ...settings, experienceLevel: level };
    await storage.updateSettings(newSettings);
    setSettings(newSettings);
  };

  const handleClearData = () => {
    Alert.alert(
      'Clear All Data',
      'This will permanently delete all your workout history, progress, and settings. This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear Data',
          style: 'destructive',
          onPress: async () => {
            await storage.clearAllData();
            await dataManager.initializeNewUser('Athlete');
            loadData();
            Alert.alert('Done', 'All data has been cleared.');
          },
        },
      ]
    );
  };

  const stats = user?.stats || {};

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.loadingText}>Loading...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <Text style={styles.headerTitle}>Profile</Text>

        {/* Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.avatarContainer}>
            <Text style={styles.avatarEmoji}>💪</Text>
          </View>

          {isEditing ? (
            <View style={styles.editNameContainer}>
              <TextInput
                style={styles.nameInput}
                value={editedName}
                onChangeText={setEditedName}
                autoFocus
                placeholder="Your name"
                placeholderTextColor={colors.gray400}
              />
              <TouchableOpacity onPress={handleSaveName} style={styles.saveButton}>
                <Text style={styles.saveButtonText}>Save</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity
              style={styles.nameContainer}
              onPress={() => setIsEditing(true)}
            >
              <Text style={styles.userName}>{user?.name || 'Athlete'}</Text>
              <Text style={styles.editHint}>Tap to edit</Text>
            </TouchableOpacity>
          )}

          <LevelDisplay totalXP={stats.totalXP || 0} />

          <View style={styles.profileStats}>
            <View style={styles.profileStat}>
              <Text style={styles.profileStatValue}>{formatNumber(stats.totalWorkouts || 0)}</Text>
              <Text style={styles.profileStatLabel}>Workouts</Text>
            </View>
            <View style={styles.profileStatDivider} />
            <View style={styles.profileStat}>
              <Text style={styles.profileStatValue}>{stats.longestStreak || 0}</Text>
              <Text style={styles.profileStatLabel}>Best Streak</Text>
            </View>
            <View style={styles.profileStatDivider} />
            <View style={styles.profileStat}>
              <Text style={styles.profileStatValue}>{formatNumber(stats.totalXP || 0)}</Text>
              <Text style={styles.profileStatLabel}>Total XP</Text>
            </View>
          </View>
        </View>

        {/* Equipment */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Available Equipment</Text>
          <Text style={styles.sectionDescription}>
            Select the equipment you have access to
          </Text>
          <View style={styles.chipGrid}>
            {Object.values(EQUIPMENT_TYPES).map(equipment => (
              <ChipButton
                key={equipment.id}
                title={equipment.name}
                selected={settings.equipment?.includes(equipment.id)}
                onPress={() => handleToggleEquipment(equipment.id)}
              />
            ))}
          </View>
        </View>

        {/* Workout Duration */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preferred Workout Duration</Text>
          <View style={styles.chipGrid}>
            {[15, 30, 45, 60].map(duration => (
              <ChipButton
                key={duration}
                title={`${duration} min`}
                selected={settings.workoutDuration === duration}
                onPress={() => handleSetDuration(duration)}
              />
            ))}
          </View>
        </View>

        {/* Experience Level */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Experience Level</Text>
          <View style={styles.chipGrid}>
            {['beginner', 'intermediate', 'advanced'].map(level => (
              <ChipButton
                key={level}
                title={level.charAt(0).toUpperCase() + level.slice(1)}
                selected={settings.experienceLevel === level}
                onPress={() => handleSetExperience(level)}
              />
            ))}
          </View>
        </View>

        {/* Settings Toggles */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Settings</Text>

          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>Notifications</Text>
              <Text style={styles.settingDescription}>Workout reminders and streak alerts</Text>
            </View>
            <Switch
              value={settings.notificationsEnabled === true}
              onValueChange={(value) => handleToggleSetting('notificationsEnabled', value)}
              trackColor={{ false: colors.gray300, true: colors.primary + '60' }}
              thumbColor={settings.notificationsEnabled === true ? colors.primary : colors.gray400}
            />
          </View>

          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>Sound Effects</Text>
              <Text style={styles.settingDescription}>Play sounds for timers and completions</Text>
            </View>
            <Switch
              value={settings.soundEnabled === true}
              onValueChange={(value) => handleToggleSetting('soundEnabled', value)}
              trackColor={{ false: colors.gray300, true: colors.primary + '60' }}
              thumbColor={settings.soundEnabled === true ? colors.primary : colors.gray400}
            />
          </View>

          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>Units</Text>
            </View>
            <View style={styles.unitToggle}>
              <TouchableOpacity
                style={[
                  styles.unitButton,
                  settings.units === 'lbs' && styles.unitButtonActive,
                ]}
                onPress={() => handleToggleSetting('units', 'lbs')}
              >
                <Text style={[
                  styles.unitButtonText,
                  settings.units === 'lbs' && styles.unitButtonTextActive,
                ]}>lbs</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.unitButton,
                  settings.units === 'kg' && styles.unitButtonActive,
                ]}
                onPress={() => handleToggleSetting('units', 'kg')}
              >
                <Text style={[
                  styles.unitButtonText,
                  settings.units === 'kg' && styles.unitButtonTextActive,
                ]}>kg</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Danger Zone */}
        <View style={styles.dangerSection}>
          <Text style={styles.dangerTitle}>Danger Zone</Text>
          <Button
            title="Clear All Data"
            onPress={handleClearData}
            variant="danger"
            size="medium"
            fullWidth
          />
        </View>

        {/* App Info */}
        <View style={styles.appInfo}>
          <Text style={styles.appName}>FitStreak</Text>
          <Text style={styles.appVersion}>Version 1.0.0</Text>
          <Text style={styles.appTagline}>Consistency beats intensity.</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundSecondary,
  },
  loadingText: {
    ...typography.styles.body,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: spacing.xl,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.md,
    paddingBottom: spacing.xl,
  },

  headerTitle: {
    ...typography.styles.h3,
    color: colors.text,
    marginBottom: spacing.lg,
  },

  profileCard: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    alignItems: 'center',
    marginBottom: spacing.lg,
    ...shadows.md,
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primary + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  avatarEmoji: {
    fontSize: 40,
  },
  nameContainer: {
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  userName: {
    ...typography.styles.h3,
    color: colors.text,
  },
  editHint: {
    ...typography.styles.caption,
    color: colors.textMuted,
    marginTop: 2,
  },
  editNameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  nameInput: {
    ...typography.styles.h4,
    color: colors.text,
    backgroundColor: colors.gray100,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
    minWidth: 150,
    textAlign: 'center',
  },
  saveButton: {
    marginLeft: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  saveButtonText: {
    ...typography.styles.button,
    color: colors.primary,
  },
  profileStats: {
    flexDirection: 'row',
    marginTop: spacing.md,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.gray100,
  },
  profileStat: {
    flex: 1,
    alignItems: 'center',
  },
  profileStatDivider: {
    width: 1,
    backgroundColor: colors.gray200,
    marginVertical: spacing.xs,
  },
  profileStatValue: {
    ...typography.styles.h4,
    color: colors.primary,
  },
  profileStatLabel: {
    ...typography.styles.caption,
    color: colors.textMuted,
    marginTop: 2,
  },

  section: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
    ...shadows.sm,
  },
  sectionTitle: {
    ...typography.styles.h6,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  sectionDescription: {
    ...typography.styles.caption,
    color: colors.textMuted,
    marginBottom: spacing.sm,
  },
  chipGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },

  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray100,
  },
  settingInfo: {
    flex: 1,
  },
  settingLabel: {
    ...typography.styles.body,
    color: colors.text,
  },
  settingDescription: {
    ...typography.styles.caption,
    color: colors.textMuted,
    marginTop: 2,
  },
  unitToggle: {
    flexDirection: 'row',
    backgroundColor: colors.gray100,
    borderRadius: borderRadius.full,
    padding: 2,
  },
  unitButton: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
  },
  unitButtonActive: {
    backgroundColor: colors.white,
  },
  unitButtonText: {
    ...typography.styles.label,
    color: colors.textSecondary,
  },
  unitButtonTextActive: {
    color: colors.text,
    fontWeight: '600',
  },

  dangerSection: {
    marginTop: spacing.md,
    marginBottom: spacing.lg,
  },
  dangerTitle: {
    ...typography.styles.h6,
    color: colors.danger,
    marginBottom: spacing.sm,
  },

  appInfo: {
    alignItems: 'center',
    paddingVertical: spacing.lg,
  },
  appName: {
    ...typography.styles.h4,
    color: colors.primary,
  },
  appVersion: {
    ...typography.styles.caption,
    color: colors.textMuted,
    marginTop: spacing.xs,
  },
  appTagline: {
    ...typography.styles.body,
    color: colors.textSecondary,
    fontStyle: 'italic',
    marginTop: spacing.sm,
  },
});

export default ProfileScreen;
