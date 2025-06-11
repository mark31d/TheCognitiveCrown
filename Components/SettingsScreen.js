// src/screens/Settings/SettingsScreen.js

import React, { useState } from 'react'
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  Switch,
  Share,
  Image,
  Alert,              // <-- добавили
} from 'react-native'
import { useNavigation } from '@react-navigation/native'

/* локальные иконки */
const ICON_BACK  = require('../assets/ic_arrow_left.png')
const ICON_SHARE = require('../assets/ic_share.png')

export default function SettingsScreen() {
  const navigation = useNavigation()
  const [notificationsEnabled, setNotificationsEnabled] = useState(false)

  const onToggleNotifications = () =>
    setNotificationsEnabled(prev => !prev)

  const onShareApp = async () => {
    try {
      await Share.share({
        message: 'Check out The Cognitive Crown – a brain-training app to challenge your mind!',
        title: 'The Cognitive Crown',
      })
    } catch (e) {
      console.warn(e)
    }
  }

  // Вместо навигации показываем алерт
  const onOpenTerms = () => {
    Alert.alert(
      'Coming Soon',
      'Terms of Use will be added soon.',
      [{ text: 'OK', style: 'default' }]
    )
  }

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor={styles.header.backgroundColor}
      />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image source={ICON_BACK} style={styles.iconSmall} />
        </TouchableOpacity>
        <Text style={styles.title}>Settings</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.body}>
        {/* Notifications */}
        <View style={styles.row}>
          <Text style={styles.rowText}>Notifications</Text>
          <Switch
            value={notificationsEnabled}
            onValueChange={onToggleNotifications}
            thumbColor={notificationsEnabled ? '#D9C28A' : '#FFF'}
            trackColor={{ false: '#555', true: '#BBB' }}
          />
        </View>

        {/* Share the app */}
        <TouchableOpacity style={styles.row} onPress={onShareApp}>
          <Text style={styles.rowText}>Share the app</Text>
          <Image source={ICON_SHARE} style={styles.iconSmall2} />
        </TouchableOpacity>

        {/* Terms of Use */}
        <TouchableOpacity style={styles.row} onPress={onOpenTerms}>
          <Text style={styles.rowText}>Terms of Use</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    height: 56,
    backgroundColor: '#D9C28A',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
  },
  iconSmall: {
    marginTop: 10,
    width: 24,
    height: 24,
    color: '#FFFF',
    resizeMode: 'contain',
  },
  iconSmall2: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
  },
  title: {
    marginTop: 10,
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFF',
  },
  body: {
    flex: 1,
    padding: 16,
  },
  row: {
    flexDirection: 'row',
    backgroundColor: '#1E1E1E',
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  rowText: {
    fontSize: 16,
    color: '#FFF',
  },
})
