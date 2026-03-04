import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import RootNavigator from './src/navigation/RootNavigator';
import { AuthProvider } from './src/hooks/useAuth';
import { ThemeProvider } from './src/theme/ThemeContext';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 2,
    },
  },
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <SafeAreaProvider>
        <ThemeProvider>
          <AuthProvider>
            <NavigationContainer>
              <RootNavigator />
              <StatusBar style="auto" />
            </NavigationContainer>
          </AuthProvider>
        </ThemeProvider>
      </SafeAreaProvider>
    </QueryClientProvider>
  );
}
