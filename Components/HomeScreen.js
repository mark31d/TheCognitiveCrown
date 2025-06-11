// src/screens/Home/HomeScreen.js
import React from 'react'
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  StatusBar,
  Dimensions,
} from 'react-native'
import { useNavigation } from '@react-navigation/native'

const { width } = Dimensions.get('window')
const CARD_SPACING = 16
const CARD_SIZE = (width - CARD_SPACING * 3) / 2

// цвета из дизайна
const COLORS = {
  header: '#D9C28A',      // золотистый фон хедера
  background: '#000000',  // чёрный фон экрана
  card: '#1E1E1E',        // фон карточек
  title: '#FFFFFF',       // основной текст
  subtitle: '#C4C4C4',    // второстепенный текст
}

export default function HomeScreen() {
  const navigation = useNavigation()

  const zones = [
    {
      key: 'math',
      label: 'Mathematical Thinking',
      icon: require('../assets/ic_math.png'),
      screen: 'MathematicalThinking',
    },
    {
      key: 'abstract',
      label: 'Abstract Thinking',
      icon: require('../assets/ic_abstract.png'),
      screen: 'AbstractThinking',
    },
    {
      key: 'verbal',
      label: 'Verbal Thinking',
      icon: require('../assets/ic_verbal.png'),
      screen: 'VerbalThinking',
    },
    {
      key: 'friends',
      label: 'Think with Friends',
      icon: require('../assets/ic_friends.png'),
      screen: 'ThinkWithFriends',
    },
  ]

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="light-content"
        backgroundColor={COLORS.header}
        translucent={false}
      />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>The Cognitive Crown</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Settings')}>
          <Image
            source={require('../assets/ic_settings.png')}
            style={styles.settingsIcon}
          />
        </TouchableOpacity>
      </View>

      {/* Content */}
      <View style={styles.content}>
        {/* Logo */}
        <Image
          source={require('../assets/crown_puzzle.png')}
          style={styles.logo}
          resizeMode="contain"
        />

        {/* Zones grid */}
        <View style={styles.grid}>
          {zones.map((zone) => (
            <TouchableOpacity
              key={zone.key}
              style={styles.card}
              activeOpacity={0.8}
              onPress={() => navigation.navigate(zone.screen)}
            >
              <Image source={zone.icon} style={styles.icon} />
              <Text style={styles.cardText}>{zone.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    height: 66,
    backgroundColor: COLORS.header,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  headerTitle: {
    marginBottom:-15,
    flex: 1,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.title,
  },
  settingsIcon: {
    marginBottom:-15,
    width: 24,
    height: 24,
    tintColor: COLORS.background,
  },

  content: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 24,
  },
  logo: {
    marginTop:-50,
    width: 300,
    height: 220,
    marginBottom: -22,
  },

  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: CARD_SPACING,
  },
  card: {
    width: CARD_SIZE,
    height: CARD_SIZE,
    backgroundColor: COLORS.card,
    borderRadius: 16,
    marginBottom: CARD_SPACING,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 12,
  },
  icon: {
    width: 48,
    height: 48,
    marginBottom: 12,
    tintColor: undefined, // иконка уже цветная
  },
  cardText: {
    fontSize: 16,
    textAlign: 'center',
    color: COLORS.title,
    fontWeight: '500',
  },
})
