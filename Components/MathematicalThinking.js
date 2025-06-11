// src/screens/Mathematical/MathematicalThinking.js

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
const ICON_MATH       = require('../assets/ic_math.png')        // 96×96
const ICON_SPEED      = require('../assets/ic_math.png')        // 48×48
const ICON_SEQUENCE   = require('../assets/ic_sequence.png')
const ICON_LOGIC      = require('../assets/ic_logic.png')
const ICON_FRACTION   = require('../assets/ic_fraction.png')
const ICON_ARROW      = require('../assets/ic_arrow_right.png')// 24×24
const ICON_ARROW_LEFT = require('../assets/ic_arrow_left.png') // 24×24
const ICON_SETTINGS   = require('../assets/ic_settings.png')
const ICON_PAUSE      = require('../assets/ic_pause.png')      // ваша иконка паузы
// Подставьте сюда ваш файл с короной (пазлы в форме короны)
const ICON_CROWN      = require('../assets/crown_puzzle.png')      

/* ─────────── colours / sizes ─────────── */
const GOLD_HEADER    = '#D9C28A'
const BLACK          = '#000'
const CARD_BG        = '#1E1E1E'
const TEXT_PRIMARY   = '#FFFFFF'
const TEXT_SECONDARY = '#C4C4C4'
const PROG_CORRECT   = '#D9C28A'
const OPT_BG         = '#1E1E1E'
const OPT_SELECTED   = '#333'
const OPT_CORRECT    = '#2E7D32'
const OPT_WRONG      = '#B71C1C'
const GOLD           = '#F7F1CE'

/* ─────────── mini-games config ─────────── */
const MINI_GAMES = [
  { key: 'speed',    title: 'Arithmetic Speed',        icon: ICON_SPEED,    dataKey: 'arithmeticSpeed' },
  { key: 'sequence', title: 'Number Sequences',        icon: ICON_SEQUENCE, dataKey: 'numberSequences' },
  { key: 'logic',    title: 'Logic & Word Problems',   icon: ICON_LOGIC,    dataKey: 'logicWordProblems' },
  { key: 'fraction', title: 'Fractions & Percentages', icon: ICON_FRACTION, dataKey: 'fractionsPercentages' },
]

export default function MathematicalThinking() {
  const navigation     = useNavigation()
  const [stage, setStage]           = useState('menu')       // 'menu' | 'intro' | 'quiz' | 'result'
  const [selected, setSelected]     = useState(null)
  const [qIdx, setQIdx]             = useState(0)
  const [selIdx, setSelIdx]         = useState(null)
  const [answered, setAnswered]     = useState(false)
  const [paused, setPaused]         = useState(false)
  const [correctCount, setCorrectCount] = useState(0)

  /** Возврат назад из состояния */
  const goBack = () => {
    if (paused) {
      setPaused(false)
      return
    }
    if (stage === 'quiz')  return setStage('intro')
    if (stage === 'intro') return setStage('menu')
    navigation.goBack()
  }

  /** Начать вводное окно */
  const openIntro = game => {
    setSelected(game)
    setStage('intro')
  }

  /** Запустить викторину */
  const startQuiz = () => {
    setCorrectCount(0)
    setQIdx(0)
    setSelIdx(null)
    setAnswered(false)
    setStage('quiz')
  }

  /** Выбор варианта */
  const onSelect = idx => {
    if (answered) return
    setSelIdx(idx)
    setAnswered(true)
  }

  /** Переход к следующему вопросу или на результат */
  const onNext = () => {
    const questions    = QUESTIONS[selected.dataKey]
    const correctIndex = questions[qIdx].correctIndex

    // если правильно — прибавляем счётчик
    if (selIdx === correctIndex) {
      setCorrectCount(c => c + 1)
    }

    if (qIdx < questions.length - 1) {
      setQIdx(qIdx + 1)
      setSelIdx(null)
      setAnswered(false)
    } else {
      setStage('result')
    }
  }

  /** Опции в вопросе */
  const renderOption = ({ item, index }) => {
    let bg = styles.optBg
    const correctIndex = QUESTIONS[selected.dataKey][qIdx].correctIndex

    if (answered) {
      if (index === correctIndex)       bg = styles.optCorrect
      else if (index === selIdx)        bg = styles.optWrong
    } else if (index === selIdx) {
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

  /** Заголовок */
  const Header = () => (
    <View style={styles.header}>
      <TouchableOpacity onPress={goBack} style={styles.backHit}>
        <Image source={ICON_ARROW_LEFT} style={styles.iconSmall} />
      </TouchableOpacity>
      <Text style={styles.headerTitle}>Mathematical Thinking</Text>
      {stage === 'quiz' ? (
        <TouchableOpacity onPress={() => setPaused(true)}>
          <Image source={ICON_PAUSE} style={styles.iconSmall3} />
        </TouchableOpacity>
      ) : (
        <TouchableOpacity onPress={() => navigation.navigate('Settings')}>
          <Image source={ICON_SETTINGS} style={styles.iconSmall2} />
        </TouchableOpacity>
      )}
    </View>
  )

  /** Главное меню с выбором мини-игры */
  const Menu = () => (
    <>
      <View style={styles.heroCard}>
        <Image source={ICON_MATH} style={styles.heroIcon} />
        <Text style={styles.heroText}>Mathematical Thinking</Text>
      </View>
      <FlatList
        data={MINI_GAMES}
        keyExtractor={item => item.key}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.row} onPress={() => openIntro(item)}>
            <Image source={item.icon} style={styles.rowIcon} />
            <Text style={styles.rowText}>{item.title}</Text>
            <Image source={ICON_ARROW} style={styles.rowArrow} />
          </TouchableOpacity>
        )}
      />
    </>
  )

  /** Экран-интро перед запуском викторины */
  const Intro = () => (
    <>
      <View style={styles.heroCard}>
        <Image source={selected.icon} style={styles.heroIcon} />
        <Text style={styles.heroText}>{selected.title}</Text>
      </View>
      <Text style={styles.introTitle}>Ready to challenge your mind?</Text>
      <Text style={styles.introBody}>
        This mini session includes a fresh set of quick tasks designed to boost
        your thinking speed and accuracy. Focus, tap an answer, and train like a mind master.
      </Text>
      <TouchableOpacity style={styles.startBtn} onPress={startQuiz}>
        <Text style={styles.startTxt}>Start Session</Text>
      </TouchableOpacity>
    </>
  )

  /** Экран викторины */
  const Quiz = () => {
    const questions = QUESTIONS[selected.dataKey]
    const q = questions[qIdx]

    return (
      <>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { flex: qIdx + 1 }]} />
          <View style={{ flex: questions.length - (qIdx + 1) }} />
        </View>
        <Text style={styles.qNumber}>
          Question {qIdx + 1} / {questions.length}
        </Text>
        <Text style={styles.qText}>{q.question}</Text>
        <FlatList
          data={q.options}
          keyExtractor={(_, i) => String(i)}
          renderItem={renderOption}
          contentContainerStyle={styles.optsList}
        />
        <TouchableOpacity
          style={[styles.nextBtn, !answered && styles.nextBtnDisabled]}
          onPress={onNext}
          disabled={!answered}
        >
          <Text style={styles.nextTxt}>Next Question</Text>
        </TouchableOpacity>
      </>
    )
  }

  /** Экран результата */
  const Result = () => {
    const total = QUESTIONS[selected.dataKey].length
    return (
      <View style={styles.resultContainer}>
        <View style={styles.resultCard}>
          <Image source={ICON_CROWN} style={styles.resultIcon} />
          <Text style={styles.resultTitle}>
            🏅 You've got a Cognitive Crown for this session
          </Text>
        </View>
        <Text style={styles.congrats}>You Did It! 👏</Text>
        <Text style={styles.score}>{correctCount} / {total}</Text>
        <Text style={styles.resultBody}>
          You’ve completed this cognitive challenge with focus and brilliance.
          Your mind just got sharper
        </Text>
        <TouchableOpacity
          style={styles.homeBtn}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.homeBtnText}>Home</Text>
        </TouchableOpacity>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={GOLD_HEADER} />
      <Header />
      <View style={styles.body}>
        {stage === 'menu'   && <Menu />}
        {stage === 'intro'  && <Intro />}
        {stage === 'quiz'   && <Quiz />}
        {stage === 'result' && <Result />}
      </View>

      {/* Pause Modal */}
      <Modal transparent visible={paused} animationType="fade">
        <View style={styles.pauseOverlay}>
          <View style={styles.pauseModal}>
            <Text style={styles.pauseTitle}>Session Paused</Text>
            <Text style={styles.pauseText}>
              Your mind deserves a short break.{'\n'}
              When you're ready, jump back in and keep training
            </Text>
            <TouchableOpacity
              style={styles.pauseBtn}
              onPress={() => setPaused(false)}
            >
              <Text style={styles.pauseBtnText}>Resume</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.pauseBtn, styles.exitBtn]}
              onPress={() => {
                setPaused(false)
                setStage('menu')
                setSelected(null)
              }}
            >
              <Text style={styles.exitBtnText}>Exit</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  )
}

const styles = StyleSheet.create({
  /* — неиспользуемые стили модального окна (по необходимости можно удалить) */
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '80%',
    backgroundColor: CARD_BG,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: TEXT_PRIMARY,
    marginBottom: 16,
  },
  modalBtn: {
    width: '100%',
    paddingVertical: 12,
    backgroundColor: GOLD,
    borderRadius: 12,
    alignItems: 'center',
  },
  modalBtnText: {
    color: BLACK,
    fontSize: 16,
    fontWeight: '500',
  },

  container: { flex: 1, backgroundColor: BLACK },
  header: {
    height: 66,
    backgroundColor: GOLD_HEADER,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    justifyContent: 'space-between',
  },
  backHit: { width: 44 },
  iconSmall:  { width: 24, height: 24, tintColor: TEXT_PRIMARY, resizeMode: 'contain', marginTop: 10 },
  iconSmall2: { width: 24, height: 24, tintColor: BLACK, resizeMode: 'contain', marginTop: 10 },
  iconSmall3: { width: 24, height: 24, tintColor: BLACK, resizeMode: 'contain', marginTop: 10 },
  headerTitle: { flex: 1, textAlign: 'center', fontSize: 18, fontWeight: '600', color: TEXT_PRIMARY, marginTop: 10 },

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

  list: { paddingBottom: 24 },
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
  rowArrow: { width: 20, height: 20, tintColor: '#8E8E93', resizeMode: 'contain' },

  introTitle: { fontSize: 20, fontWeight: '600', color: TEXT_PRIMARY, textAlign: 'center', marginBottom: 12 },
  introBody: { fontSize: 16, lineHeight: 22, color: TEXT_SECONDARY, textAlign: 'center', paddingHorizontal: 12 },
  startBtn: { marginTop: 'auto', marginBottom: 40, height: 60, backgroundColor: GOLD_HEADER, borderRadius: 18, justifyContent: 'center', alignItems: 'center' },
  startTxt: { fontSize: 18, fontWeight: '500', color: BLACK },

  progressBar: { flexDirection: 'row', height: 4, marginTop: 8, marginHorizontal: 16 },
  progressFill: { backgroundColor: PROG_CORRECT },
  qNumber: { color: TEXT_PRIMARY, fontSize: 18, marginTop: 12, marginLeft: 16 },
  qText: { color: TEXT_SECONDARY, fontSize: 16, textAlign: 'center', marginHorizontal: 16, marginTop: 24 },
  optsList: { paddingHorizontal: 16, paddingTop: 24 },

  option: { backgroundColor: OPT_BG, borderRadius: 12, paddingVertical: 14, paddingHorizontal: 16, marginBottom: 16 },
  optBg: {},
  optSelected: { backgroundColor: OPT_SELECTED },
  optCorrect: { backgroundColor: OPT_CORRECT },
  optWrong: { backgroundColor: OPT_WRONG },
  optText: { color: TEXT_PRIMARY, fontSize: 16, textAlign: 'center' },

  nextBtn: { height: 60, backgroundColor: GOLD_HEADER, marginHorizontal: 16, borderRadius: 18, justifyContent: 'center', alignItems: 'center', marginBottom: 24 },
  nextBtnDisabled: { opacity: 0.5 },
  nextTxt: { fontSize: 18, fontWeight: '500', color: BLACK },

  /* Pause Modal styles */
  pauseOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pauseModal: {
    width: '80%',
    backgroundColor: CARD_BG,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
  },
  pauseTitle: { fontSize: 20, fontWeight: '600', color: TEXT_PRIMARY, marginBottom: 12 },
  pauseText: { fontSize: 16, color: TEXT_SECONDARY, textAlign: 'center', marginBottom: 24 },
  pauseBtn: {
    width: '100%',
    backgroundColor: GOLD_HEADER,
    borderRadius: 12,
    paddingVertical: 14,
    marginBottom: 12,
    alignItems: 'center',
  },
  pauseBtnText: { fontSize: 16, fontWeight: '500', color: BLACK },
  exitBtn: { backgroundColor: OPT_WRONG },
  exitBtnText: { color: TEXT_PRIMARY },

  /* Result screen styles */
  resultContainer: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 24,
    backgroundColor: BLACK,
  },
  resultCard: {
    width: '100%',
    backgroundColor: CARD_BG,
    borderRadius: 20,
    paddingVertical: 32,
    paddingHorizontal: 16,
    alignItems: 'center',
    marginBottom: 24,
  },
  resultIcon: {
    width: 160,
    height: 160,
    marginBottom: -12,
   
    resizeMode: 'contain',
  },
  resultTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: TEXT_PRIMARY,
    textAlign: 'center',
  },
  congrats: {
    fontSize: 22,
    fontWeight: '600',
    color: TEXT_PRIMARY,
    marginBottom: 4,
  },
  score: {
    fontSize: 28,
    fontWeight: '600',
    color: TEXT_PRIMARY,
    marginBottom: 12,
  },
  resultBody: {
    fontSize: 16,
    color: TEXT_SECONDARY,
    textAlign: 'center',
    paddingHorizontal: 12,
    marginBottom: 40,
  },
  homeBtn: {
    width: '100%',
    height: 60,
    backgroundColor: GOLD,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  homeBtnText: {
    fontSize: 18,
    fontWeight: '500',
    color: BLACK,
  },
})
