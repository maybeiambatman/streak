// FitStreak Navigation
// Main app navigation with bottom tabs and stack navigators

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { colors } from '../theme/colors';

// Import screens
import HomeScreen from '../screens/HomeScreen';
import WorkoutScreen from '../screens/WorkoutScreen';
import MuscleStatusScreen from '../screens/MuscleStatusScreen';
import HistoryScreen from '../screens/HistoryScreen';
import ProgressScreen from '../screens/ProgressScreen';
import ProfileScreen from '../screens/ProfileScreen';

// Tab icons (simple text-based for now)
const TabIcon = ({ name, focused }) => {
  const icons = {
    Home: '🏠',
    Workout: '💪',
    Muscles: '🎯',
    History: '📅',
    Progress: '📊',
    Profile: '👤',
  };

  return (
    <View style={styles.tabIconContainer}>
      <Text style={[styles.tabIcon, { opacity: focused ? 1 : 0.6 }]}>
        {icons[name] || '•'}
      </Text>
    </View>
  );
};

// Create navigators
const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

// Home stack (includes workout flow)
const HomeStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="HomeMain" component={HomeScreen} />
      <Stack.Screen
        name="Workout"
        component={WorkoutScreen}
        options={{
          gestureEnabled: false,
        }}
      />
      <Stack.Screen name="MuscleDetail" component={MuscleStatusScreen} />
    </Stack.Navigator>
  );
};

// History stack
const HistoryStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="HistoryMain" component={HistoryScreen} />
    </Stack.Navigator>
  );
};

// Progress stack
const ProgressStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="ProgressMain" component={ProgressScreen} />
    </Stack.Navigator>
  );
};

// Profile stack
const ProfileStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="ProfileMain" component={ProfileScreen} />
    </Stack.Navigator>
  );
};

// Main tab navigator
const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused }) => (
          <TabIcon name={route.name} focused={focused} />
        ),
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.gray500,
        tabBarStyle: styles.tabBar,
        tabBarLabelStyle: styles.tabBarLabel,
        headerShown: false,
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeStack}
        options={{ tabBarLabel: 'Home' }}
      />
      <Tab.Screen
        name="History"
        component={HistoryStack}
        options={{ tabBarLabel: 'History' }}
      />
      <Tab.Screen
        name="Progress"
        component={ProgressStack}
        options={{ tabBarLabel: 'Progress' }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileStack}
        options={{ tabBarLabel: 'Profile' }}
      />
    </Tab.Navigator>
  );
};

// Main app navigator
const AppNavigator = () => {
  return (
    <NavigationContainer>
      <TabNavigator />
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.gray200,
    paddingTop: 8,
    paddingBottom: 8,
    height: 70,
  },
  tabBarLabel: {
    fontSize: 12,
    fontWeight: '400',
    marginBottom: 4,
  },
  tabIconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabIcon: {
    fontSize: 24,
  },
});

export default AppNavigator;
