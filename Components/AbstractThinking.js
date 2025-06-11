// src/screens/Abstract/AbstractThinking.js

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

const ICON_PAUSE       = require('../assets/ic_pause.png')
const ICON_SETTINGS    = require('../assets/ic_settings.png')
const ICON_ARROW_LEFT  = require('../assets/ic_arrow_left.png')

// Цвета
const BLACK      = '#000'
const HEADER_BG  = '#D9C28A'
const OPT_BG     = '#1E1E1E'
const OPT_SEL    = '#333'
const OPT_COR    = '#2E7D32'
const OPT_WR     = '#B71C1C'

export default function AbstractThinking() {
  const navigation = useNavigation()
  const data       = QUESTIONS.abstractThinking

  const [stage, setStage]           = useState('intro')  // 'intro' | 'quiz'
  const [currentIdx, setCurrentIdx] = useState(0)
  const [selectedIdx, setSelectedIdx] = useState(null)
  const [answered, setAnswered]     = useState(false)
  const [paused, setPaused]         = useState(false)

  const question = data[currentIdx]

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
    if (currentIdx < data.length - 1) {
      setCurrentIdx(currentIdx + 1)
      setSelectedIdx(null)
      setAnswered(false)
    } else {
      navigation.goBack()
    }
  }

  const onPause = () => setPaused(true)
  const closePause = () => setPaused(false)

  /* Общий Header */
  const Header = () => (
    <View style={styles.header}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backHit}>
        <Image source={ICON_ARROW_LEFT} style={styles.backArrow} />
      </TouchableOpacity>

      <Text style={styles.headerTitle}>Abstract Thinking</Text>

      {stage === 'quiz' ? (
        <TouchableOpacity onPress={onPause}>
          <Image source={ICON_PAUSE} style={styles.iconRight} />
        </TouchableOpacity>
      ) : (
        <TouchableOpacity onPress={() => navigation.navigate('Settings')}>
          <Image source={ICON_SETTINGS} style={styles.iconRight} />
        </TouchableOpacity>
      )}
    </View>
  )

  /* Intro Screen */
  if (stage === 'intro') {
    return (
      <View style={styles.container}>
        <StatusBar
          barStyle="light-content"
          backgroundColor={styles.header.backgroundColor}
        />
        <Header />

        <View style={styles.body}>
          <View style={styles.heroCard}>
            <Image
              source={require('../assets/ic_abstract.png')}
              style={styles.heroIcon}
            />
            <Text style={styles.heroText}>Abstract Thinking</Text>
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

  /* Quiz Screen */
  const renderOption = ({ item, index }) => {
    let bg = styles.optBg
    if (answered) {
      if (index === question.correctIndex) bg = styles.optCorrect
      else if (index === selectedIdx)       bg = styles.optWrong
    } else if (index === selectedIdx) {
      bg = styles.optSelected
    }

    return (
      <TouchableOpacity
        style={[styles.option, bg]}
        onPress={() => onSelect(index)}
        activeOpacity={0.8}
      >
        <Text style={styles.optText}>{item}</Text>
      </TouchableOpacity>
    )
  }

  return (
    <>
      <View style={styles.container}>
        <StatusBar
          barStyle="light-content"
          backgroundColor={styles.header.backgroundColor}
        />
        <Header />

        <View style={styles.body}>
          {/* progress */}
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { flex: currentIdx + 1 }]} />
            <View style={{ flex: data.length - (currentIdx + 1) }} />
          </View>

          <Text style={styles.qNumber}>
            Question {currentIdx + 1} / {data.length}
          </Text>

          <Text style={styles.qText}>{question.question}</Text>

          <FlatList
            data={question.options}
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
      <Modal
        transparent
        visible={paused}
        animationType="fade"
        onRequestClose={closePause}
      >
        <View style={styles.pauseOverlay}>
          <View style={styles.pauseModal}>
            <Text style={styles.pauseTitle}>Session Paused</Text>
            <Text style={styles.pauseText}>
              Your mind deserves a short break.{'\n'}
              When you're ready, jump back in and keep training
            </Text>
            <TouchableOpacity
              style={styles.pauseBtn}
              onPress={closePause}
            >
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
  container: { flex: 1, backgroundColor: BLACK },

  header: {
    height: 66,
    backgroundColor: HEADER_BG,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
  },
  backHit: {},
  backArrow: { width: 24, height: 24, tintColor: '#fff'  , resizeMode:'contain' , marginTop:10,},
  headerTitle: { flex: 1, textAlign: 'center', fontSize: 18, fontWeight: '600', color: '#fff' ,marginTop:10, },
  iconRight: { width: 24, height: 24, tintColor: '#000',marginTop:10, },

  body: { flex: 1, paddingHorizontal: 16, paddingTop: 16 },

  heroCard: {
    backgroundColor: OPT_BG,
    borderRadius: 20,
    paddingVertical: 32,
    alignItems: 'center',
    marginBottom: 24,
  },
  heroIcon: { width: 96, height: 96, marginBottom: 12 },
  heroText: { fontSize: 20, fontWeight: '600', color: '#fff' },

  introTitle: { fontSize: 20, fontWeight: '600', color: '#fff', textAlign: 'center' },
  introBody: {
    fontSize: 16,
    lineHeight: 22,
    color: '#C4C4C4',
    textAlign: 'center',
    marginTop: 12,
    paddingHorizontal: 12,
  },

  startBtn: {
    height: 60,
    backgroundColor: HEADER_BG,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  startTxt: { fontSize: 18, fontWeight: '500', color: BLACK },

  progressBar: { flexDirection: 'row', height: 4, marginTop: 8 },
  progressFill: { backgroundColor: HEADER_BG },

  qNumber: { color: '#fff', fontSize: 18, marginTop: 12 },
  qText: {
    color: '#C4C4C4',
    fontSize: 16,
    textAlign: 'center',
    marginVertical: 24,
  },

  optsList: { paddingBottom: 24 },
  option: {
    backgroundColor: OPT_BG,
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  optBg: {},
  optSelected: { backgroundColor: OPT_SEL },
  optCorrect: { backgroundColor: OPT_COR },
  optWrong: { backgroundColor: OPT_WR },
  optText: { color: '#fff', fontSize: 16, textAlign: 'center' },

  nextBtn: {
    height: 60,
    backgroundColor: HEADER_BG,
    marginHorizontal: 16,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  nextBtnDisabled: { opacity: 0.5 },
  nextTxt: { fontSize: 18, fontWeight: '500', color: BLACK },

  /* Pause modal */
  pauseOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pauseModal: {
    width: '80%',
    backgroundColor: OPT_BG,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
  },
  pauseTitle: { fontSize: 20, fontWeight: '600', color: '#fff', marginBottom: 12 },
  pauseText: { textAlign: 'center', color: '#C4C4C4', marginBottom: 24 },
  pauseBtn: {
    width: '100%',
    backgroundColor: HEADER_BG,
    borderRadius: 12,
    paddingVertical: 14,
    marginBottom: 12,
    alignItems: 'center',
  },
  pauseBtnText: { color: BLACK, fontSize: 16, fontWeight: '500' },
  exitBtn: { backgroundColor: OPT_WR },
  exitBtnText: { color: '#fff' },
})
