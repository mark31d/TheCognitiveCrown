// src/screens/Friends/ThinkWithFriends.js
import React, { useState } from 'react'
import {
  View,
  Text,
  StyleSheet,
  Image,
  TextInput,
  TouchableOpacity,
  StatusBar,
  Modal,
} from 'react-native'
import Slider from '@react-native-community/slider'
import { useNavigation } from '@react-navigation/native'

/* ─────────── assets ─────────── */
const ICON_BIG        = require('../assets/ic_friends.png')    // 96×96
const ICON_SETTINGS   = require('../assets/ic_settings.png')  // 24×24
const ICON_INFO       = require('../assets/ic_info.png')      // 24×24
const ICON_PLUS       = require('../assets/ic_plus.png')      // 24×24
const ICON_MINUS      = require('../assets/ic_minus.png')     // 24×24
const ICON_PAUSE      = require('../assets/ic_pause.png')     // 24×24
const ICON_PUZZLE     = require('../assets/crown_puzzle.png') // crown emblem
const ICON_ARROW_LEFT = require('../assets/ic_arrow_left.png')// 24×24

/* ─────────── colours ─────────── */
const GOLD       = '#F7F1CE'
const HEADER     = '#D9C28A'
const BLACK      = '#000'
const CARD_BG    = '#1E1E1E'
const TEXT_W     = '#FFFFFF'
const TEXT_G     = '#C4C4C4'
const SLIDER_COL = '#2E7D32'
const RED_ERROR  = '#B71C1C'

/* ─────────── questions ─────────── */
const QUESTIONS = [
  'If you could erase one concept from human thinking forever, what would it be and why?',
  'What would change in society if no one could lie anymore?',
  'If every person had to carry one visible word above their head, what would yours say?',
  'Is it better to be remembered or to be free?',
  'Which is more dangerous: silence or misunderstanding?',
  'If logic and emotion had to fight for control, who should win?',
  'What would happen if time suddenly stopped but your mind kept working?',
  'If love was a currency, what would be its most valuable form?',
  'Which law would you remove from the world — and what would happen?',
  'If you had to trade one of your memories for wisdom, would you do it?',
  'Which feeling should people learn to live without?',
  'Would you rather know everything or feel everything?',
  'What’s more real: what we see or what we imagine?',
  'If you could hear everyone’s thoughts for one day, what would you do?',
  'Should happiness be the goal of life?',
  'Would humanity survive if everyone thought the same way?',
  'What’s one invisible thing that controls the world?',
  'If animals could talk, which species would become leaders?',
  'Should every truth be told?',
  'If dreams were real for one night, what would you create?',
  'Is justice more important than forgiveness?',
  'What would you invent if you had no fear?',
  'What color is sadness? Why?',
  'Would the world be better without rules?',
  'If your mind was a building, what kind of architecture would it have?',
  'Is choice always a good thing?',
  'What’s something most people believe is real, but you secretly doubt?',
  'What would change if everyone could only speak 1000 words in a lifetime?',
  'If power was visible like light, who would shine brightest?',
  'What is something you’ve never seen, but deeply believe in?',
]

export default function ThinkWithFriends() {
  const navigation = useNavigation()
  const [stage, setStage] = useState('intro') // intro, rules, setup, quiz, result

  // setup
  const [players, setPlayers] = useState(['', ''])

  // quiz
  const [currentPlayer, setCurrentPlayer] = useState(0)
  const [rating, setRating] = useState(50)
  const [ratings, setRatings] = useState([])
  const [answered, setAnswered] = useState(false)
  const [showSlider, setShowSlider] = useState(false)
  const [paused, setPaused]     = useState(false)

  // result
  const [winner, setWinner] = useState({ name: '', score: 0 })

  /* ─── pause handlers ─── */
  const onPause   = () => setPaused(true)
  const closePause = () => setPaused(false)

  /* ─── navigation handlers ─── */
  const startSetup = () => setStage('setup')
  const showRules  = () => setStage('rules')
  const startQuiz  = () => {
    setStage('quiz')
    setCurrentPlayer(0)
    setRatings([])
    setAnswered(false)
    setShowSlider(false)
    setRating(50)
  }
  const markAnswered  = () => { setShowSlider(true); setAnswered(true) }
  const confirmRating = () => {
    const next = [...ratings, rating]
    setRatings(next)
    if (currentPlayer < players.length - 1) {
      setCurrentPlayer(currentPlayer + 1)
      setAnswered(false)
      setShowSlider(false)
      setRating(50)
    } else {
      const max = Math.max(...next)
      const idx = next.indexOf(max)
      setWinner({ name: players[idx], score: max })
      setStage('result')
    }
  }
  const goHome = () => navigation.navigate('Home')

  /* ─── player setup ─── */
  const addPlayer = () => {
    if (players.length < 5) setPlayers([...players, ''])
  }
  const removePlayer = idx => {
    if (players.length > 2) setPlayers(players.filter((_, i) => i !== idx))
  }
  const updatePlayer = (idx, value) => {
    const next = [...players]
    next[idx] = value
    setPlayers(next)
  }

  /* ─── render ─── */
  if (stage === 'intro') {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor={HEADER} />
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Image source={ICON_ARROW_LEFT} style={styles.iconSmall} />
          </TouchableOpacity>
          <Text style={styles.title}>Think with Friends</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Settings')}>
            <Image source={ICON_SETTINGS} style={styles.icon} />
          </TouchableOpacity>
        </View>
        <View style={styles.body}>
          <View style={styles.hero}>
            <Image source={ICON_BIG} style={styles.heroIcon} />
            <Text style={styles.heroText}>Think with Friends</Text>
          </View>
          <Text style={styles.introTitle}>Ready to challenge your mind?</Text>
          <Text style={styles.introBody}>
            This mini session includes a fresh set of quick tasks designed to boost your thinking speed and accuracy.
            Focus, tap the correct answers, and train like a true mind master.
          </Text>
          <TouchableOpacity style={styles.row} onPress={showRules}>
            <Text style={styles.rowText}>Rules</Text>
            <Image source={ICON_INFO} style={styles.iconInfo} />
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.cta} onPress={startSetup}>
          <Text style={styles.ctaText}>Start</Text>
        </TouchableOpacity>
      </View>
    )
  }

  if (stage === 'rules') {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor={HEADER} />
        <View style={styles.header}>
          <TouchableOpacity onPress={() => setStage('intro')}>
            <Image source={ICON_ARROW_LEFT} style={styles.iconSmall} />
          </TouchableOpacity>
          <Text style={styles.title}>Rules</Text>
          <View style={{ width: 24 }} />
        </View>
        <View style={styles.rulesBody}>
          <Text style={styles.rulesTitle}>How to Play</Text>
          <Text style={styles.rulesText}>
            Answer abstract or creative questions and, as a group, decide how close each answer is to the “perfect response.”
          </Text>
          <Text style={styles.rulesText}>🔄 Game Flow:</Text>
          {[
            'One player receives a question and reads it out loud.',
            'They give their answer — logical, emotional, funny, or completely unexpected.',
            'Everyone discusses the answer together.',
            'As a group, agree on a score from 0% to 100% based on how thoughtful or on-point the answer was.',
            'Hand the phone to the next player and repeat.',
          ].map((line, i) => (
            <Text key={i} style={styles.rulesText}>{i + 1}. {line}</Text>
          ))}
          <Text style={styles.rulesText}>👑 Once all players have answered, choose the one with the highest overall score — they win the Cognitive Crown!</Text>
          <Text style={styles.rulesText}>🧠 There are no wrong answers — just new ways to think.</Text>
        </View>
      </View>
    )
  }

  if (stage === 'setup') {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor={HEADER} />
        <View style={styles.header}>
          <TouchableOpacity onPress={() => setStage('intro')}>
            <Image source={ICON_ARROW_LEFT} style={styles.iconSmall} />
          </TouchableOpacity>
          <Text style={styles.title}>Set Up</Text>
          <View style={{ width: 24 }} />
        </View>
        <View style={styles.body}>
          <Text style={styles.introTitle}>Who’s playing?</Text>
          <Text style={styles.introBody}>
            Enter the names of all players. Pass the device after each turn and let the fun begin!
          </Text>
          {players.map((name, idx) => (
            <View key={idx} style={styles.playerRow}>
              <TextInput
                style={styles.input}
                value={name}
                onChangeText={v => updatePlayer(idx, v)}
                placeholder={`Player ${idx + 1}`}
                placeholderTextColor="#666"
              />
              {idx > 1 && (
                <TouchableOpacity onPress={() => removePlayer(idx)} style={styles.removeBtn}>
                  <Image source={ICON_MINUS} style={styles.removeIcon} />
                </TouchableOpacity>
              )}
            </View>
          ))}
          {players.length < 5 && (
            <TouchableOpacity onPress={addPlayer} style={styles.plusBtn}>
              <Image source={ICON_PLUS} style={styles.plusIcon} />
            </TouchableOpacity>
          )}
        </View>
        <TouchableOpacity style={styles.cta} onPress={startQuiz}>
          <Text style={styles.ctaText}>Start Game</Text>
        </TouchableOpacity>
      </View>
    )
  }

  if (stage === 'quiz') {
    const question = QUESTIONS[currentPlayer]
    return (
      <>
        <View style={styles.container}>
          <StatusBar barStyle="light-content" backgroundColor={HEADER} />
          <View style={styles.header}>
            <Text style={styles.headerLeft}>{currentPlayer + 1}/{players.length}</Text>
            <Text style={styles.title}>Your Question</Text>
            <TouchableOpacity onPress={onPause}>
              <Image source={ICON_PAUSE} style={styles.icon} />
            </TouchableOpacity>
          </View>
          <View style={styles.body}>
            <Text style={styles.playerName}>{players[currentPlayer]}</Text>
            <View style={styles.hero}>
              <Image source={ICON_BIG} style={styles.heroIcon} />
              <Text style={styles.heroCardText}>{question}</Text>
            </View>
            {!showSlider ? (
              <TouchableOpacity style={styles.cta} onPress={markAnswered}>
                <Text style={styles.ctaText}>I’ve Answered</Text>
              </TouchableOpacity>
            ) : (
              <>
                <Text style={styles.introTitle}>Discuss the Answer</Text>
                <Text style={styles.introBody}>Now talk together! Decide how close this answer was to the “perfect response”</Text>
                <Text style={styles.percentText}>{rating}%</Text>
                <Slider
                  style={{ width: '100%', height: 40 }}
                  minimumValue={1}
                  maximumValue={100}
                  step={1}
                  minimumTrackTintColor={SLIDER_COL}
                  maximumTrackTintColor="#444"
                  value={rating}
                  onValueChange={setRating}
                />
                <TouchableOpacity style={styles.cta} disabled={!answered} onPress={confirmRating}>
                  <Text style={styles.ctaText}>Confirm</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
        <Modal transparent visible={paused} animationType="fade">
          <View style={styles.pauseOverlay}>
            <View style={styles.pauseModal}>
              <Text style={styles.pauseTitle}>Session Paused</Text>
              <Text style={styles.pauseText}>
                Take a short break.{'\n'}Tap Resume when ready.
              </Text>
              <TouchableOpacity style={styles.pauseBtn} onPress={closePause}>
                <Text style={styles.pauseBtnText}>Resume</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.pauseBtn, styles.exitBtn]}
                onPress={() => {
                  closePause()
                  navigation.goBack()
                }}
              >
                <Text style={styles.exitBtnText}>Exit</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </>
    )
  }

  // result
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={HEADER} />   
      <View style={styles.header}>
        <View style={{ width: 24 }} />
        <Text style={styles.title}>Result</Text>
        <View style={{ width: 24 }} />
      </View>
      <View style={styles.body}>
        <View style={styles.resultCard}>
          <Image source={ICON_PUZZLE} style={styles.resultIcon} />
          <Text style={styles.resultText}>
            🏅 The Cognitive Crown goes to: {winner.name} — with {winner.score}%
          </Text>
        </View>
        <Text style={styles.introTitle}>Well played, thinkers!👏</Text>
      </View>
      <TouchableOpacity style={styles.cta} onPress={goHome}>
        <Text style={styles.ctaText}>Home</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container:   { flex: 1, backgroundColor: BLACK },
  iconSmall:   { width: 24, height: 24, tintColor: TEXT_W, resizeMode: 'contain', marginTop: 10 },
  icon:        { width: 24, height: 24, tintColor: BLACK, marginTop: 10 },
  header:      {
    height: 66,
    backgroundColor: HEADER,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
  },
  title:       { flex: 1, textAlign: 'center', fontSize: 18, fontWeight: '600', color: TEXT_W, marginTop: 10 },
  headerLeft:  { width: 24, color: TEXT_W, fontSize: 16, marginTop: 10 },

  body:        { flex: 1, paddingHorizontal: 16, paddingTop: 24 },
  hero:        {
    backgroundColor: CARD_BG,
    borderRadius: 20,
    padding: 45,
    alignItems: 'center',
    marginVertical: 16,
  },
  heroIcon:    { width: 48, height: 48, marginBottom: 12 },
  heroText:    { color: TEXT_W, fontSize: 16, textAlign: 'center' },
  heroCardText:{ color: TEXT_W, fontSize: 16, textAlign: 'center', marginTop: 12 },

  introTitle:  { fontSize: 20, fontWeight: '600', color: TEXT_W, textAlign: 'center' },
  introBody:   {
    fontSize: 16,
    lineHeight: 22,
    color: TEXT_G,
    textAlign: 'center',
    marginTop: 8,
  },

  row:         {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: CARD_BG,
    borderRadius: 16,
    padding: 16,
    marginTop: 24,
  },
  rowText:     { flex: 1, color: TEXT_W, fontSize: 16 },
  iconInfo:    { width: 24, height: 24, tintColor: GOLD },

  playerRow:   { position: 'relative', marginVertical: 8 },
  input:       {
    height: 56,
    backgroundColor: CARD_BG,
    borderRadius: 28,
    paddingHorizontal: 16,
    color: TEXT_W,
    fontSize: 16,
  },
  removeBtn:   {
    position: 'absolute',
    right: 16,
    top: 12,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: GOLD,
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeIcon:  { width: 16, height: 16 },
  plusBtn:     {
    alignSelf: 'center',
    marginTop: 24,
    width: 48,
    height: 48,
    borderRadius: 15,
    backgroundColor: CARD_BG,
    justifyContent: 'center',
    alignItems: 'center',
  },
  plusIcon:    { width: 24, height: 24, tintColor: TEXT_W },
  playerName:  { color: TEXT_W, fontSize: 18, textAlign: 'center', marginTop: 8 },
  percentText: { fontSize: 32, color: SLIDER_COL, textAlign: 'center', marginVertical: 8 },

  rulesBody:   { flex: 1, paddingHorizontal: 16, paddingTop: 24 },
  rulesTitle:  { fontSize: 20, fontWeight: '600', color: TEXT_W, marginBottom: 12 },
  rulesText:   { color: TEXT_W, marginBottom: 8, lineHeight: 20 },

  resultCard:  {
    backgroundColor: CARD_BG,
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    marginBottom: 16,
  },
  resultIcon:  { width: 130, height: 130, marginBottom: -12, marginTop: -20 },
  resultText:  { color: TEXT_W, fontSize: 16, textAlign: 'center' },

  cta: {
    height: 56,
    backgroundColor: '#DAC38D',
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 16,
    marginBottom: 24,
  },
  ctaText: { color: BLACK, fontSize: 18, fontWeight: '500' },

  /* Pause styles */
  pauseOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'center', alignItems: 'center' },
  pauseModal:   { width: '80%', backgroundColor: CARD_BG, borderRadius: 16, padding: 24, alignItems: 'center' },
  pauseTitle:   { fontSize: 20, fontWeight: '600', color: TEXT_W, marginBottom: 12 },
  pauseText:    { fontSize: 16, color: TEXT_G, textAlign: 'center', marginBottom: 24 },
  pauseBtn:     { width: '100%', backgroundColor: GOLD, borderRadius: 12, paddingVertical: 14, marginBottom: 12, alignItems: 'center' },
  pauseBtnText: { fontSize: 16, fontWeight: '500', color: BLACK },
  exitBtn:      { backgroundColor: RED_ERROR },
  exitBtnText:  { fontSize: 16, fontWeight: '500', color: TEXT_W },
})
