import { router, Tabs } from 'expo-router';
import React, { useEffect, useState } from 'react';

import { HapticTab } from '@/components/haptic-tab';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { removeToken } from '@/src/storage';
import { Button, Text, TouchableOpacity } from 'react-native';
import { styles } from '@/src/style';
import Ionicons from '@expo/vector-icons/Ionicons';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  const [userName, setUserName] = useState('');

  useEffect(() => {
    const loadUserName = async () => {
      const name = await AsyncStorage.getItem('userName');
      if (name) setUserName(name);
    };
    loadUserName();
  }, []);

  const handleLogout = async () => {
    await removeToken();
    await AsyncStorage.removeItem('userName');
    router.replace('/Login');
  };


  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        tabBarButton: HapticTab,
        tabBarStyle: styles.tabBar,
        headerStyle: styles.tabBar,
        headerTitleAlign: 'center',
        headerTitleStyle: styles.headerTitle,
      }}
    >
      <Tabs.Screen
        key={userName}
        name="index"
        options={{
          headerTitle:`Hi, ${userName}`,  // Top header
          tabBarLabel: 'Home', // Bottom tab 
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />,
          headerRight: () => (
            <TouchableOpacity  onPress={handleLogout} style={{ marginRight: 15 }}>
              <Ionicons name="exit-outline" size={28} color="#4d7688ff" />
            </TouchableOpacity>
          ),
        }}
      />
    </Tabs>
  );
}
