import React from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Stack } from 'expo-router';

import { useColorScheme } from '@/components/useColorScheme';
import { useClientOnlyValue } from '@/components/useClientOnlyValue';

// You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
export function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>['name'];
  color: string;
}) {
  return <FontAwesome size={40} style={{ position: 'absolute', top: 50, left: 20 }} {...props} />;
}

export default function UsersLayout() {
  const colorScheme = useColorScheme();

  return (
    
    <Stack
      screenOptions={{
        headerShown: useClientOnlyValue(false, true),
      }}>

        <Stack.Screen
          name="scan"
          options={{
            headerShown: false
          }}
        />

      
    </Stack>
  );
}
