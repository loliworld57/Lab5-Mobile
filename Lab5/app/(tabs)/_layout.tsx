import { router, Tabs } from 'expo-router';
import React, { useEffect, useState } from 'react';

import { HapticTab } from '@/components/haptic-tab';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { removeToken } from '@/src/storage';
import { styles } from '@/src/style';
import Ionicons from '@expo/vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TouchableOpacity } from 'react-native';

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
          headerTitle: `Hi, ${userName}`,  // Top header
          tabBarLabel: 'Home', // Bottom tab 
          tabBarIcon: ({ color }) => (
            <Ionicons name="home-outline" size={28} color={color} />
          )
          ,
          headerRight: () => (
            <TouchableOpacity onPress={handleLogout} style={{ marginRight: 15 }}>
              <Ionicons name="exit-outline" size={28} color="#4d7688ff" />
            </TouchableOpacity>
          ),
        }}
      />
      <Tabs.Screen
        key={userName}
        name="transactions"
        options={{
          headerTitle: `Transactions`,  // Top header
          tabBarLabel: 'Transaction', // Bottom tab 
          tabBarIcon: ({ color }) => (
            <Ionicons name="card-outline" size={28} color={color} />
          )
          ,
          headerRight: () => (
            <TouchableOpacity onPress={handleLogout} style={{ marginRight: 15 }}>
              <Ionicons name="exit-outline" size={28} color="#4d7688ff" />
            </TouchableOpacity>
          ),
        }}
      />
      <Tabs.Screen
        key={userName}
        name="customers"
        options={{
          headerTitle: `Customers`,
          tabBarLabel: 'Customer', // Bottom tab 
          tabBarIcon: ({ color }) => (
            <Ionicons name="people-outline" size={28} color={color} />
          )
          ,
          headerRight: () => (
            <TouchableOpacity onPress={handleLogout} style={{ marginRight: 15 }}>
              <Ionicons name="exit-outline" size={28} color="#4d7688ff" />
            </TouchableOpacity>
          ),
        }}
      />
      <Tabs.Screen
        key={userName}
        name="settings"
        options={{
          headerTitle: `Settings`,
          tabBarLabel: 'Setting', // Bottom tab 
          tabBarIcon: ({ color }) => (
            <Ionicons name="settings-outline" size={28} color={color} />
          )
          ,
          headerRight: () => (
            <TouchableOpacity onPress={handleLogout} style={{ marginRight: 15 }}>
              <Ionicons name="exit-outline" size={28} color="#4d7688ff" />
            </TouchableOpacity>
          ),
        }}
      />
    </Tabs>
  );
}
