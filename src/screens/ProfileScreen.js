// GainStreak Profile Screen
// User profile, settings, and onboarding

import React, { useState } from 'react';
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

import { useAppStore } from '../hooks/useStore';
import { colors } from '../utils/colors';
import { Equipment, FitnessGoals, Difficulty } from '../types';
import { getLevelProgress } from '../utils/calculations';

const ProfileScreen = ({ navigation }) => {
  const {
    isInitialized,
    userProfile,
    settings,
    streakData,
    workouts,
    createProfile,
    updateProfile,
    updateSettings,
    clearAllData,
  } = useAppStore();

  // If not initialized, show onboarding
  if (!isInitialized) {
    return <OnboardingScreen onCreate={createProfile} />;
  }

  const levelProgress = getLevelProgress(userProfile?.totalXP || 0);

  const handleResetData = () => {
    Alert.alert(
      'Reset All Data',
      'This will delete all your workouts, progress, and settings. This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: clearAllData,
        },
      ]
    );
  };

  const handleToggleNotifications = async (value) => {
    await updateSettings({
      notifications: {
        ...settings?.notifications,
        streakReminder: value,
        workoutReminder: value,
      },
    });
  };

  const handleChangeWeightUnit = async () => {
    const newUnit = settings?.weightUnit === 'kg' ? 'lbs' : 'kg';
    await updateSettings({ weightUnit: newUnit });
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Profile</Text>
        </View>

        {/* User Info Card */}
        <View style={styles.profileCard}>
          <View style={styles.avatarContainer}>
            <Text style={styles.avatarText}>
              {userProfile?.name?.charAt(0).toUpperCase() || 'A'}
            </Text>
          </View>
          <Text style={styles.userName}>{userProfile?.name || 'Athlete'}</Text>
          <Text style={styles.userLevel}>Level {levelProgress.currentLevel}</Text>

          {/* XP Progress */}
          <View style={styles.xpContainer}>
            <View style={styles.xpBarContainer}>
              <View
                style={[
                  styles.xpBarFill,
                  { width: `${levelProgress.progressPercent}%` },
                ]}
              />
            </View>
            <Text style={styles.xpText}>
              {levelProgress.xpInCurrentLevel} / {levelProgress.xpNeededForLevel} XP
            </Text>
          </View>

          {/* Stats Row */}
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{workouts.length}</Text>
              <Text style={styles.statLabel}>Workouts</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{streakData?.currentStreak || 0}</Text>
              <Text style={styles.statLabel}>Day Streak</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{userProfile?.totalXP || 0}</Text>
              <Text style={styles.statLabel}>Total XP</Text>
            </View>
          </View>
        </View>

        {/* Settings Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Settings</Text>

          <View style={styles.settingsCard}>
            {/* Notifications */}
            <View style={styles.settingRow}>
              <View style={styles.settingLeft}>
                <Text style={styles.settingIcon}>🔔</Text>
                <View>
                  <Text style={styles.settingLabel}>Notifications</Text>
                  <Text style={styles.settingDescription}>Streak reminders</Text>
                </View>
              </View>
              <Switch
                value={settings?.notifications?.streakReminder ?? true}
                onValueChange={handleToggleNotifications}
                trackColor={{ false: colors.gray300, true: colors.primary + '60' }}
                thumbColor={settings?.notifications?.streakReminder ? colors.primary : colors.gray400}
              />
            </View>

            {/* Weight Unit */}
            <TouchableOpacity style={styles.settingRow} onPress={handleChangeWeightUnit}>
              <View style={styles.settingLeft}>
                <Text style={styles.settingIcon}>⚖️</Text>
                <View>
                  <Text style={styles.settingLabel}>Weight Unit</Text>
                  <Text style={styles.settingDescription}>
                    {settings?.weightUnit === 'kg' ? 'Kilograms (kg)' : 'Pounds (lbs)'}
                  </Text>
                </View>
              </View>
              <Text style={styles.settingValue}>{settings?.weightUnit || 'kg'}</Text>
            </TouchableOpacity>

            {/* Fitness Level */}
            <View style={styles.settingRow}>
              <View style={styles.settingLeft}>
                <Text style={styles.settingIcon}>💪</Text>
                <View>
                  <Text style={styles.settingLabel}>Fitness Level</Text>
                  <Text style={styles.settingDescription}>
                    {userProfile?.fitnessLevel || 'intermediate'}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* Account Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>

          <View style={styles.settingsCard}>
            <TouchableOpacity style={styles.settingRow}>
              <View style={styles.settingLeft}>
                <Text style={styles.settingIcon}>📤</Text>
                <Text style={styles.settingLabel}>Export Data</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={styles.settingRow} onPress={handleResetData}>
              <View style={styles.settingLeft}>
                <Text style={styles.settingIcon}>🗑️</Text>
                <Text style={[styles.settingLabel, { color: colors.error }]}>
                  Reset All Data
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* App Info */}
        <View style={styles.appInfo}>
          <Text style={styles.appName}>GainStreak</Text>
          <Text style={styles.appVersion}>Version 1.0.0</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

// Onboarding screen for new users
const OnboardingScreen = ({ onCreate }) => {
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [age, setAge] = useState('25');
  const [fitnessLevel, setFitnessLevel] = useState(Difficulty.INTERMEDIATE);
  const [goals, setGoals] = useState([FitnessGoals.BUILD_MUSCLE]);
  const [equipment, setEquipment] = useState(Object.values(Equipment));

  const handleComplete = async () => {
    if (!name.trim()) {
      Alert.alert('Name Required', 'Please enter your name to continue');
      return;
    }

    await onCreate({
      name: name.trim(),
      age: parseInt(age) || 25,
      fitnessLevel,
      goals,
      availableEquipment: equipment,
    });
  };

  const toggleEquipment = (item) => {
    if (equipment.includes(item)) {
      setEquipment(equipment.filter(e => e !== item));
    } else {
      setEquipment([...equipment, item]);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.onboardingContent}
      >
        <Text style={styles.onboardingTitle}>Welcome to GainStreak!</Text>
        <Text style={styles.onboardingSubtitle}>
          Let's set up your profile to personalize your experience
        </Text>

        {step === 1 && (
          <View style={styles.onboardingStep}>
            <Text style={styles.stepTitle}>What's your name?</Text>
            <TextInput
              style={styles.nameInput}
              value={name}
              onChangeText={setName}
              placeholder="Enter your name"
              placeholderTextColor={colors.textSecondary}
              autoFocus
            />

            <Text style={styles.stepTitle}>Your age</Text>
            <TextInput
              style={styles.nameInput}
              value={age}
              onChangeText={setAge}
              placeholder="25"
              placeholderTextColor={colors.textSecondary}
              keyboardType="numeric"
            />
          </View>
        )}

        {step === 2 && (
          <View style={styles.onboardingStep}>
            <Text style={styles.stepTitle}>Fitness Level</Text>
            {Object.values(Difficulty).map((level) => (
              <TouchableOpacity
                key={level}
                style={[
                  styles.optionButton,
                  fitnessLevel === level && styles.optionButtonSelected,
                ]}
                onPress={() => setFitnessLevel(level)}
              >
                <Text style={[
                  styles.optionText,
                  fitnessLevel === level && styles.optionTextSelected,
                ]}>
                  {level.charAt(0).toUpperCase() + level.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {step === 3 && (
          <View style={styles.onboardingStep}>
            <Text style={styles.stepTitle}>Available Equipment</Text>
            <View style={styles.equipmentGrid}>
              {Object.values(Equipment).map((item) => (
                <TouchableOpacity
                  key={item}
                  style={[
                    styles.equipmentChip,
                    equipment.includes(item) && styles.equipmentChipSelected,
                  ]}
                  onPress={() => toggleEquipment(item)}
                >
                  <Text style={[
                    styles.equipmentText,
                    equipment.includes(item) && styles.equipmentTextSelected,
                  ]}>
                    {item.charAt(0).toUpperCase() + item.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* Navigation */}
        <View style={styles.onboardingNav}>
          {step > 1 && (
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => setStep(step - 1)}
            >
              <Text style={styles.backButtonText}>Back</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={styles.nextButton}
            onPress={() => {
              if (step < 3) {
                setStep(step + 1);
              } else {
                handleComplete();
              }
            }}
          >
            <Text style={styles.nextButtonText}>
              {step === 3 ? 'Get Started' : 'Next'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },

  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: colors.text,
  },

  profileCard: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatarText: {
    fontSize: 36,
    fontWeight: '800',
    color: colors.surface,
  },
  userName: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
  },
  userLevel: {
    fontSize: 16,
    color: colors.primary,
    fontWeight: '600',
    marginTop: 4,
  },
  xpContainer: {
    width: '100%',
    marginTop: 16,
  },
  xpBarContainer: {
    height: 8,
    backgroundColor: colors.gray200,
    borderRadius: 4,
    overflow: 'hidden',
  },
  xpBarFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 4,
  },
  xpText: {
    fontSize: 13,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 8,
  },
  statsRow: {
    flexDirection: 'row',
    marginTop: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: colors.gray200,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statDivider: {
    width: 1,
    backgroundColor: colors.gray200,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.text,
  },
  statLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 4,
  },

  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 12,
  },

  settingsCard: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    overflow: 'hidden',
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray100,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
  },
  settingDescription: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 2,
  },
  settingValue: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.primary,
  },

  appInfo: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  appName: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textSecondary,
  },
  appVersion: {
    fontSize: 13,
    color: colors.textLight,
    marginTop: 4,
  },

  // Onboarding styles
  onboardingContent: {
    padding: 24,
    paddingTop: 60,
  },
  onboardingTitle: {
    fontSize: 32,
    fontWeight: '800',
    color: colors.text,
    textAlign: 'center',
  },
  onboardingSubtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 40,
  },
  onboardingStep: {
    marginBottom: 32,
  },
  stepTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 16,
  },
  nameInput: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 16,
    fontSize: 18,
    color: colors.text,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: colors.gray200,
  },
  optionButton: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: colors.gray200,
  },
  optionButtonSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primary + '10',
  },
  optionText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    textAlign: 'center',
  },
  optionTextSelected: {
    color: colors.primary,
  },
  equipmentGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  equipmentChip: {
    backgroundColor: colors.surface,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: colors.gray200,
  },
  equipmentChipSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primary + '10',
  },
  equipmentText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  equipmentTextSelected: {
    color: colors.primary,
  },
  onboardingNav: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 24,
  },
  backButton: {
    flex: 1,
    backgroundColor: colors.gray100,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  nextButton: {
    flex: 2,
    backgroundColor: colors.primary,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  nextButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.surface,
  },
});

export default ProfileScreen;
