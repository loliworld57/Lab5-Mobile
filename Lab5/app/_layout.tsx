import { Stack } from 'expo-router';
import { useEffect, useState } from 'react';
import { getToken } from '../src/storage';
import { ActivityIndicator, View } from 'react-native';

export default function RootLayout() {
  const [loading, setLoading] = useState(true);
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const token = await getToken();
      setLoggedIn(!!token);
      setLoading(false);
    };
    checkAuth();
  }, []);

  if (loading) return (
    <View style={{ flex:1, justifyContent:'center', alignItems:'center' }}>
      <ActivityIndicator size="large" />
    </View>
  );

  return (
    <Stack>
      {loggedIn ? (
        <Stack.Screen name="(tabs)" options={{ headerShown: true }} />
      ) : (
        <Stack.Screen name="Login" options={{ headerShown: false }} />
      )}
    </Stack>
  );
}
