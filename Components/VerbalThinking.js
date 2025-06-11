// src/screens/Verbal/VerbalThinking.js

import React, { useState } from 'react'
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,

  StatusBar,
  FlatList,
  Modal,
} from 'react-native'
import { useNavigation } from '@react-navigation/native'
import QUESTIONS from '../Components/questions'

/* ─────────── assets ─────────── */
const ICON_VERBAL_BIG    = require('../assets/ic_verbal.png')        // 96×96
const ICON_WORD_FLEX     = require('../assets/ic_word_flex.png')     // 48×48
const ICON_VERBAL_LOGIC  = require('../assets/ic_verbal_logic.png')  // 48×48
const ICON_ARROW_RIGHT   = require('../assets/ic_arrow_right.png')   // 24×24
const ICON_SETTINGS      = require('../assets/ic_settings.png')      // 24×24
const ICON_PAUSE         = require('../assets/ic_pause.png')         // 24×24
const ICON_ARROW_LEFT    = require('../assets/ic_arrow_left.png')    // 24×24

/* ─────────── colours ─────────── */
const GOLD_HEADER    = '#D9C28A'
const BLACK_BG       = '#000'
const CARD_BG        = '#1E1E1E'
const TEXT_PRIMARY   = '#FFFFFF'
const TEXT_SECONDARY = '#C4C4C4'
const OPT_BG         = '#1E1E1E'
const OPT_SEL        = '#333'
const OPT_CORRECT    = '#2E7D32'
const OPT_WRONG      = '#B71C1C'

export default function VerbalThinking() {
  const navigation = useNavigation()

  const [stage, setStage]           = useState('menu')       // 'menu' | 'intro' | 'quiz'
  const [selectedKey, setSelectedKey] = useState(null)      // 'wordFlex' | 'verbalLogic'
  const [currentIdx, setCurrentIdx]   = useState(0)
  const [selectedIdx, setSelectedIdx] = useState(null)
  const [answered, setAnswered]       = useState(false)
  const [paused, setPaused]           = useState(false)

  const MINIGAMES = [
    { key: 'wordFlex',    title: 'Word Flex',    icon: ICON_WORD_FLEX },
    { key: 'verbalLogic', title: 'Verbal Logic', icon: ICON_VERBAL_LOGIC },
  ]

  const onPause = () => setPaused(true)
  const closePause = () => setPaused(false)

  const Header = () => (
    <View style={styles.header}>
      <TouchableOpacity
        onPress={() => {
          if (stage === 'menu') navigation.goBack()
          else {
            setStage('menu')
            setSelectedKey(null)
          }
        }}
        style={styles.backHit}
      >
        <Image source={ICON_ARROW_LEFT} style={styles.iconSmall} />
      </TouchableOpacity>

      <Text style={styles.headerTitle}>Verbal Thinking</Text>

      {stage === 'quiz' ? (
        <TouchableOpacity onPress={onPause}>
          <Image source={ICON_PAUSE} style={styles.iconSmall2} />
        </TouchableOpacity>
      ) : (
        <TouchableOpacity onPress={() => navigation.navigate('Settings')}>
          <Image source={ICON_SETTINGS} style={styles.iconSmall2} />
        </TouchableOpacity>
      )}
    </View>
  )

  const openIntro = key => {
    setSelectedKey(key)
    setStage('intro')
  }

  const startSession = () => {
    setStage('quiz')
    setCurrentIdx(0)
    setSelectedIdx(null)
    setAnswered(false)
  }

  const onSelect = idx => {
    if (answered) return
    setSelectedIdx(idx)
    setAnswered(true)
  }

  const onNext = () => {
    const data = QUESTIONS[selectedKey]
    if (currentIdx < data.length - 1) {
      setCurrentIdx(currentIdx + 1)
      setSelectedIdx(null)
      setAnswered(false)
    } else {
      navigation.goBack()
    }
  }

  const renderOption = ({ item, index }) => {
    let bg = styles.optBg
    const correctIndex = QUESTIONS[selectedKey][currentIdx].correctIndex
    if (answered) {
      if (index === correctIndex) bg = styles.optCorrect
      else if (index === selectedIdx) bg = styles.optWrong
    } else if (index === selectedIdx) {
      bg = styles.optSelected
    }
    return (
      <TouchableOpacity style={[styles.option, bg]} onPress={() => onSelect(index)}>
        <Text style={styles.optText}>{item}</Text>
      </TouchableOpacity>
    )
  }

  /* MENU */
  if (stage === 'menu') {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor={styles.header.backgroundColor} />
        <Header />
        <View style={styles.body}>
          <View style={styles.heroCard}>
            <Image source={ICON_VERBAL_BIG} style={styles.heroIcon} />
            <Text style={styles.heroText}>Verbal Thinking</Text>
          </View>
          {MINIGAMES.map(game => (
            <TouchableOpacity key={game.key} style={styles.row} onPress={() => openIntro(game.key)}>
              <Image source={game.icon} style={styles.rowIcon} />
              <Text style={styles.rowText}>{game.title}</Text>
              <Image source={ICON_ARROW_RIGHT} style={styles.rowArrow} />
            </TouchableOpacity>
          ))}
        </View>
      </View>
    )
  }

  /* INTRO */
  if (stage === 'intro') {
    const game = MINIGAMES.find(g => g.key === selectedKey)
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor={styles.header.backgroundColor} />
        <Header />
        <View style={styles.body}>
          <View style={styles.heroCard}>
            <Image source={game.icon} style={styles.heroIcon} />
            <Text style={styles.heroText}>{game.title}</Text>
          </View>
          <Text style={styles.introTitle}>Ready to challenge your mind?</Text>
          <Text style={styles.introBody}>
            This mini session includes a fresh set of quick tasks designed to boost
            your thinking speed and accuracy. Focus, tap the correct answers, and
            train like a true mind master.
          </Text>
        </View>
        <TouchableOpacity style={styles.startBtn} onPress={startSession}>
          <Text style={styles.startTxt}>Start Session</Text>
        </TouchableOpacity>
      </View>
    )
  }

  /* QUIZ */
  const data = QUESTIONS[selectedKey]
  return (
    <>
      <View style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor={styles.header.backgroundColor} />
        <Header />
        <View style={styles.body}>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { flex: currentIdx + 1 }]} />
            <View style={{ flex: data.length - (currentIdx + 1) }} />
          </View>
          <Text style={styles.qNumber}>
            Question {currentIdx + 1} / {data.length}
          </Text>
          <Text style={styles.qText}>{data[currentIdx].question}</Text>
          <FlatList
            data={data[currentIdx].options}
            keyExtractor={(_, i) => String(i)}
            renderItem={renderOption}
            contentContainerStyle={styles.optsList}
          />
        </View>
        <TouchableOpacity
          style={[styles.nextBtn, !answered && styles.nextBtnDisabled]}
          onPress={onNext}
          disabled={!answered}
        >
          <Text style={styles.nextTxt}>Next Question</Text>
        </TouchableOpacity>
      </View>

      {/* Pause Modal */}
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

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: BLACK_BG },

  header: {
    height: 66,
    backgroundColor: GOLD_HEADER,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
  },
  backHit: { width: 44 },
  iconSmall: { width: 24, height: 24, tintColor: TEXT_PRIMARY , marginTop:10, resizeMode:'contain' },
  iconSmall2: { width: 24, height: 24, tintColor: '#000' , marginTop:10, resizeMode:'contain' },
  headerTitle: { flex: 1, textAlign: 'center', fontSize: 18, fontWeight: '600', color: TEXT_PRIMARY ,  marginTop:10,},
  
  body: { flex: 1, paddingHorizontal: 16, paddingTop: 24 },

  heroCard: {
    backgroundColor: CARD_BG,
    borderRadius: 20,
    paddingVertical: 32,
    alignItems: 'center',
    marginBottom: 24,
  },
  heroIcon: { width: 96, height: 96, marginBottom: 12 },
  heroText: { fontSize: 20, fontWeight: '600', color: TEXT_PRIMARY },

  row: {
    backgroundColor: CARD_BG,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 18,
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  rowIcon: { width: 40, height: 40, marginRight: 16 },
  rowText: { flex: 1, fontSize: 16, color: TEXT_PRIMARY },
  rowArrow: { width: 20, height: 20, tintColor: TEXT_SECONDARY },

  introTitle: { fontSize: 20, fontWeight: '600', color: TEXT_PRIMARY, textAlign: 'center', marginBottom: 12 },
  introBody: { fontSize: 16, lineHeight: 22, color: TEXT_SECONDARY, textAlign: 'center', paddingHorizontal: 12 },

  startBtn: { height: 60, backgroundColor: GOLD_HEADER, borderRadius: 18, justifyContent: 'center', alignItems: 'center' },
  startTxt: { fontSize: 18, fontWeight: '500', color: BLACK_BG },

  progressBar: { flexDirection: 'row', height: 4, marginTop: 8 },
  progressFill: { backgroundColor: GOLD_HEADER },

  qNumber: { color: TEXT_PRIMARY, fontSize: 18, marginTop: 12 },
  qText: { color: TEXT_SECONDARY, fontSize: 16, textAlign: 'center', marginVertical: 24 },

  optsList: { paddingBottom: 24 },
  option: { backgroundColor: OPT_BG, borderRadius: 12, paddingVertical: 14, paddingHorizontal: 16, marginBottom: 16 },
  optBg: {},
  optSelected: { backgroundColor: OPT_SEL },
  optCorrect: { backgroundColor: OPT_CORRECT },
  optWrong: { backgroundColor: OPT_WRONG },
  optText: { color: TEXT_PRIMARY, fontSize: 16, textAlign: 'center' },

  nextBtn: { height: 60, backgroundColor: GOLD_HEADER, marginHorizontal: 16, borderRadius: 18, justifyContent: 'center', alignItems: 'center', marginBottom: 24 },
  nextBtnDisabled: { opacity: 0.5 },
  nextTxt: { fontSize: 18, fontWeight: '500', color: BLACK_BG },

  pauseOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'center', alignItems: 'center' },
  pauseModal: { width: '80%', backgroundColor: CARD_BG, borderRadius: 16, padding: 24, alignItems: 'center' },
  pauseTitle: { fontSize: 20, fontWeight: '600', color: TEXT_PRIMARY, marginBottom: 12 },
  pauseText: { fontSize: 16, color: TEXT_SECONDARY, textAlign: 'center', marginBottom: 24 },
  pauseBtn: { width: '100%', backgroundColor: GOLD_HEADER, borderRadius: 12, paddingVertical: 14, marginBottom: 12, alignItems: 'center' },
  pauseBtnText: { fontSize: 16, fontWeight: '500', color: BLACK_BG },
  exitBtn: { backgroundColor: OPT_WRONG },
  exitBtnText: { color: TEXT_PRIMARY },
})
