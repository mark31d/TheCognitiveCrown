// App.js
import 'react-native-gesture-handler'
import React, { useEffect, useState } from 'react'
import { StatusBar, Platform } from 'react-native'
import { NavigationContainer, DefaultTheme } from '@react-navigation/native'
import { enableScreens } from 'react-native-screens'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { createStackNavigator } from '@react-navigation/stack'

/* ── common ── */
import Loader from './Components/Loader'

/* ── onboarding ── */
import Onboarding from './Components/Onboarding'

/* ── main menu ── */
import HomeScreen from './Components/HomeScreen'

/* ── training zones ── */
import MathematicalThinking from './Components/MathematicalThinking'
import AbstractThinking      from './Components/AbstractThinking'
import VerbalThinking        from './Components/VerbalThinking'

/* ── group mode ── */
import ThinkWithFriends      from './Components/ThinkWithFriends'

/* ── misc ── */
import SettingsScreen        from './Components/SettingsScreen'

enableScreens()

const Stack = createStackNavigator()

export default function App() {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const t = setTimeout(() => setIsLoading(false), 1_000)
    return () => clearTimeout(t)
  }, [])

  if (isLoading) {
    return <Loader />
  }

  const theme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      background: '#000000',
      card:       '#D9C28A',
      text:       '#FFFFFF',
    },
  }

  return (
    <SafeAreaProvider>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle={Platform.OS === 'ios' ? 'light-content' : 'dark-content'}
      />

      <NavigationContainer theme={theme}>
        <Stack.Navigator
          screenOptions={{ headerShown: false }}
          initialRouteName="Onboarding"
        >
          <Stack.Screen name="Onboarding"          component={Onboarding} />
          <Stack.Screen name="Home"                component={HomeScreen} />
          <Stack.Screen name="MathematicalThinking" component={MathematicalThinking} />
          <Stack.Screen name="AbstractThinking"     component={AbstractThinking} />
          <Stack.Screen name="VerbalThinking"       component={VerbalThinking} />
          <Stack.Screen name="ThinkWithFriends"     component={ThinkWithFriends} />
          <Stack.Screen name="Settings"             component={SettingsScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  )
}
