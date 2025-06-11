// src/screens/Onboarding/Onboarding.js

import React, { useRef, useState } from 'react'
import {
  View,
  Text,
  StyleSheet,
  Image,
  Dimensions,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
} from 'react-native'
import { useNavigation } from '@react-navigation/native'

const { width, height } = Dimensions.get('window')

const SLIDES = [
  {
    key: 'welcome',
    image: require('../assets/slide_01.png'),
    title: 'Welcome to The Cognitive Crown',
    subtitle:
      'Train your mind with powerful challenges\nin logic, memory, and language.\nThink sharp. Shine bright. Claim the crown.',
    cta: 'Next',
  },
  {
    key: 'zones',
    title: '💡Think. Solve. Improve.',
    cta: 'Next',
  },
  {
    key: 'friends',
    image: require('../assets/slide_03.png'),
    title: 'Think with Friends',
    subtitle:
      'Answer bold questions together.\nDiscuss. Rate. Crown the sharpest mind of the group.\nPerfect for parties or late-night debates',
    cta: 'Start Thinking',
  },
]

export default function Onboarding() {
  const navigation = useNavigation()
  const flatListRef = useRef(null)
  const [index, setIndex] = useState(0)

  const skip = () => navigation.replace('Home')
  const next = () =>
    index < SLIDES.length - 1
      ? flatListRef.current.scrollToIndex({ index: index + 1 })
      : skip()

  const onViewableItemsChanged = useRef(({ viewableItems }) => {
    if (viewableItems.length) setIndex(viewableItems[0].index)
  }).current

  const viewConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current

  const renderItem = ({ item }) => (
    <View style={[styles.slide, { width }]}>
      {item.key === 'zones' ? (
        <View style={styles.cardsWrap}>
          <Image
            source={require('../assets/box1.png')}
            style={[styles.card, styles.cardLeft]}
          />
          <Image
            source={require('../assets/box2.png')}
            style={[styles.card, styles.cardTop]}
          />
          <Image
            source={require('../assets/box3.png')}
            style={[styles.card, styles.cardRight]}
          />
        </View>
      ) : item.key === 'friends' ? (
        <View style={styles.doubleCardWrap}>
          <Image
            source={require('../assets/slide_03.png')}
            style={[
              styles.backgroundCard,
              { transform: [{ rotate: '-19deg' }], opacity: 0.7 },
            ]}
          />
          <Image
            source={require('../assets/slide_03.png')}
            style={styles.foregroundCard}
          />
        </View>
      ) : (
        <Image source={item.image} style={styles.illustration} />
      )}

      <View style={styles.textBlock}>
        <Text style={styles.title}>{item.title}</Text>

        {item.key === 'zones' ? (
          <View style={styles.bullets}>
            <Text style={styles.bulletItem}>Explore 3 unique training zones:</Text>
            <Text style={styles.bulletItem}>    • 🧮 Mathematical Thinking</Text>
            <Text style={styles.bulletItem}>    • 🔷 Abstract Thinking</Text>
            <Text style={styles.bulletItem}>    • 🗣️ Verbal Thinking</Text>
            <Text style={styles.bulletItem}>
              Each session brings fresh, thought-provoking tasks.
            </Text>
          </View>
        ) : (
          <Text style={styles.subtitle}>{item.subtitle}</Text>
        )}
      </View>
    </View>
  )

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />

      <TouchableOpacity style={styles.skipBtn} onPress={skip}>
        <Text style={styles.skipTxt}>Skip</Text>
      </TouchableOpacity>

      <FlatList
        ref={flatListRef}
        data={SLIDES}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        renderItem={renderItem}
        keyExtractor={(item) => item.key}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewConfig}
      />

      <TouchableOpacity style={styles.ctaBtn} onPress={next}>
        <Text style={styles.ctaTxt}>{SLIDES[index].cta}</Text>
        <Image
          source={require('../assets/ic_arrow_right.png')}
          style={styles.arrowIcon}
        />
      </TouchableOpacity>
    </SafeAreaView>
  )
}

const GOLD = '#F7F1CE'
const BLACK = '#000'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BLACK,
  },
  slide: {
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom: 140,
  },
  illustration: {
    width,
    height: height * 0.45,
    resizeMode: 'contain',
  },
  textBlock: {
    paddingHorizontal: 32,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    lineHeight: 32,
    fontWeight: '600',
    color: '#fff',
    textAlign: 'center',
    marginBottom: -10,
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 22,
    color: '#C4C4C4',
    textAlign: 'center',
  },

  skipBtn: {
    position: 'absolute',
    top: 30,
    left: 20,
    zIndex: 10,
    backgroundColor: '#1E1E1E',
    borderRadius: 12,
    paddingVertical: 20,
    paddingHorizontal: 24,
  },
  skipTxt: {
    fontSize: 18,
    color: '#fff',
  },

  ctaBtn: {
    position: 'absolute',
    bottom: 40,
    left: 20,
    right: 20,
    height: 60,
    backgroundColor: GOLD,
    borderRadius: 18,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  ctaTxt: {
    fontSize: 18,
    fontWeight: '500',
    color: BLACK,
  },
  arrowIcon: {
    width: 24,
    height: 24,
    tintColor: BLACK,
    resizeMode: 'contain',
  },

  /* zones slide */
  cardsWrap: {
    width,
    height: height * 0.38,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    position: 'absolute',
    width: 165,
    aspectRatio: 3 / 4,
    resizeMode: 'contain',
  },
  cardLeft: {
    transform: [{ rotate: '-7deg' }],
    left: -width * -0.0015,
    top: -375,
    zIndex:1,
  },
  cardTop: {
    transform: [{ rotate: '-10deg' }],
    top: 50,
    left: 140,
  },
  cardRight: {
    transform: [{ rotate: '-1deg' }],
    right: -width * 0.18,
    top: -110,
    left: 200,
  },
  bullets: {
    marginTop: 10,
    alignItems: 'flex-start',
    paddingHorizontal: 32,
  },
  bulletItem: {

    fontSize: 16,
    lineHeight: 22,
    color: '#C4C4C4',
    marginBottom: 4,
  },

  /* friends slide */
  doubleCardWrap: {
    width,
    height: height * 0.45,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  backgroundCard: {
    position: 'absolute',
    top: -9,
    left: 6,
    width: 350,
    height: 200,
    resizeMode: 'contain',
  },
  foregroundCard: {
    position: 'absolute',
    left: 20,
    marginBottom: -100,
    width: 350,
    height: 200,
    resizeMode: 'contain',
    zIndex: 2,
  },
})
