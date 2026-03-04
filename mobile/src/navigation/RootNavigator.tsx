import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../hooks/useAuth';
import { useTheme } from '../theme/ThemeContext';

// Screens
import LoginScreen from '../screens/LoginScreen';
import HomeScreen from '../screens/HomeScreen';
import DocumentsScreen from '../screens/DocumentsScreen';
import DocumentSignScreen from '../screens/DocumentSignScreen';
import ProfileScreen from '../screens/ProfileScreen';

// ============================================================================
// Navigation Types
// ============================================================================

export type RootStackParamList = {
  Auth: undefined;
  Main: undefined;
  DocumentSign: { documentId: string };
};

export type AuthStackParamList = {
  Login: undefined;
};

export type MainTabParamList = {
  Home: undefined;
  Documents: undefined;
  Profile: undefined;
};

// ============================================================================
// Navigators
// ============================================================================

const RootStack = createNativeStackNavigator<RootStackParamList>();
const AuthStack = createNativeStackNavigator<AuthStackParamList>();
const MainTab = createBottomTabNavigator<MainTabParamList>();

// ============================================================================
// Auth Navigator
// ============================================================================

function AuthNavigator() {
  return (
    <AuthStack.Navigator screenOptions={{ headerShown: false }}>
      <AuthStack.Screen name="Login" component={LoginScreen} />
    </AuthStack.Navigator>
  );
}

// ============================================================================
// Main Tab Navigator
// ============================================================================

function MainTabNavigator() {
  const theme = useTheme();

  return (
    <MainTab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap;

          switch (route.name) {
            case 'Home':
              iconName = focused ? 'home' : 'home-outline';
              break;
            case 'Documents':
              iconName = focused ? 'document-text' : 'document-text-outline';
              break;
            case 'Profile':
              iconName = focused ? 'person' : 'person-outline';
              break;
            default:
              iconName = 'ellipse';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: theme.colors.brand.primary,
        tabBarInactiveTintColor: theme.colors.text.muted,
        tabBarStyle: {
          backgroundColor: theme.colors.background.primary,
          borderTopColor: theme.colors.border.light,
          paddingBottom: 8,
          paddingTop: 8,
          height: 60,
        },
        tabBarLabelStyle: {
          fontFamily: theme.typography.body.fontFamily,
          fontSize: 12,
        },
      })}
    >
      <MainTab.Screen 
        name="Home" 
        component={HomeScreen}
        options={{ tabBarLabel: 'Home' }}
      />
      <MainTab.Screen 
        name="Documents" 
        component={DocumentsScreen}
        options={{ tabBarLabel: 'Documents' }}
      />
      <MainTab.Screen 
        name="Profile" 
        component={ProfileScreen}
        options={{ tabBarLabel: 'Profile' }}
      />
    </MainTab.Navigator>
  );
}

// ============================================================================
// Root Navigator
// ============================================================================

export default function RootNavigator() {
  const { isAuthenticated, isLoading } = useAuth();
  const theme = useTheme();

  if (isLoading) {
    // You could return a splash screen here
    return null;
  }

  return (
    <RootStack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: theme.colors.background.primary },
      }}
    >
      {isAuthenticated ? (
        <>
          <RootStack.Screen name="Main" component={MainTabNavigator} />
          <RootStack.Screen 
            name="DocumentSign" 
            component={DocumentSignScreen}
            options={{
              presentation: 'modal',
              headerShown: true,
              headerTitle: 'Sign Document',
              headerStyle: { backgroundColor: theme.colors.background.primary },
              headerTintColor: theme.colors.text.primary,
            }}
          />
        </>
      ) : (
        <RootStack.Screen name="Auth" component={AuthNavigator} />
      )}
    </RootStack.Navigator>
  );
}
