'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Trophy, Gamepad2, Sparkles, Share2, Clock, AlertTriangle } from 'lucide-react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// 問題のデータベース（実際のアプリケーションではより多くの問題を用意します）
const questionDatabase = [
  {
    id: 1,
    question: 'ブルーアーカイブの舞台となる学園の名前は？',
    options: ['シャーレ学園', 'ミレニアム学園', 'トリニティ学園', 'ゲヘナ学園'],
    answer: 'シャーレ学園',
    explanation: 'ブルーアーカイブの主な舞台はシャーレ学園です。この学園は様々な問題を抱える特殊な学園都市の中心となっています。',
    difficulty: 'easy',
    correctRate: 0,
    totalAttempts: 0
  },
  {
    id: 2,
    question: 'ブルーアーカイブの主人公の名前は？',
    options: ['センセイ', 'ホシノ', 'シロコ', 'アル'],
    answer: 'センセイ',
    explanation: 'プレイヤーはゲーム内で「センセイ」と呼ばれる主人公として活動します。生徒たちから慕われる存在です。',
    difficulty: 'easy',
    correctRate: 0,
    totalAttempts: 0
  },
  {
    id: 3,
    question: 'ゲーム内の通貨の名前は？',
    options: ['クレジット', 'ピロリン', 'ジェム', 'コイン'],
    answer: 'クレジット',
    explanation: 'ブルーアーカイブでの主要な通貨は「クレジット」です。様々なアイテムの購入やキャラクターの育成に使用されます。',
    difficulty: 'medium',
    correctRate: 0,
    totalAttempts: 0
  },
  {
    id: 4,
    question: 'ブルーアーカイブの開発会社は？',
    options: ['Yostar', 'Nexon', 'miHoYo', 'Cygames'],
    answer: 'Nexon',
    explanation: 'ブルーアーカイブは韓国のゲーム会社Nexonによって開発されました。日本では株式会社Nexon Gamesが運営しています。',
    difficulty: 'medium',
    correctRate: 0,
    totalAttempts: 0
  },
  {
    id: 5,
    question: 'ゲーム内で学生たちが所属する組織の名前は？',
    options: ['SCHALE', 'Gehenna', 'Trinity', 'Millennium'],
    answer: 'SCHALE',
    explanation: 'SCHALEは主人公が率いる組織で、様々な問題を解決するために活動しています。名前の由来はドイツ語で「殻」を意味します。',
    difficulty: 'hard',
    correctRate: 0,
    totalAttempts: 0
  }
]

export function AdvancedGameQuiz() {
  const [gameState, setGameState] = useState('start') // 'start', 'quiz', 'result', 'explanation'
  const [questionCount, setQuestionCount] = useState(5)
  const [difficulty, setDifficulty] = useState('all')
  const [questions, setQuestions] = useState([])
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState('')
  const [score, setScore] = useState(0)
  const [progress, setProgress] = useState(0)
  const [timeLeft, setTimeLeft] = useState(0)
  const [answers, setAnswers] = useState([])
  const [quizDatabase, setQuizDatabase] = useState(questionDatabase)
  const [showLowCorrectRatePopup, setShowLowCorrectRatePopup] = useState(false)

  const startQuiz = () => {
    let filteredQuestions = quizDatabase
    if (difficulty !== 'all') {
      filteredQuestions = quizDatabase.filter(q => q.difficulty === difficulty)
    }
    const shuffled = [...filteredQuestions].sort(() => 0.5 - Math.random())
    const selectedQuestions = shuffled.slice(0, Math.min(questionCount, shuffled.length))
    setQuestions(selectedQuestions)
    setQuestionCount(selectedQuestions.length)
    setGameState('quiz')
    setCurrentQuestion(0)
    setScore(0)
    setProgress(0)
    setTimeLeft(selectedQuestions.length * 15) // 各問題に15秒
    setAnswers([])
  }

  useEffect(() => {
    let timer
    if (gameState === 'quiz' && timeLeft > 0) {
      timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
    } else if (timeLeft === 0 && gameState === 'quiz') {
      handleAnswer()
    }
    return () => clearTimeout(timer)
  }, [timeLeft, gameState])

  useEffect(() => {
    if (gameState === 'quiz') {
      setProgress((currentQuestion / questionCount) * 100)
    }
  }, [currentQuestion, questionCount, gameState])

  const handleAnswer = () => {
    const currentQ = questions[currentQuestion]
    const isCorrect = selectedAnswer === currentQ.answer
    setAnswers([...answers, { question: currentQuestion, answer: selectedAnswer, isCorrect }])
    
    // Update score
    const timeBonus = Math.floor(timeLeft / 3)
    const difficultyMultiplier = currentQ.difficulty === 'easy' ? 1 : currentQ.difficulty === 'medium' ? 2 : 3
    const questionScore = (isCorrect ? 100 : 0) + timeBonus * difficultyMultiplier
    setScore(score + questionScore)

    // Update question statistics
    const updatedDatabase = quizDatabase.map(q => {
      if (q.id === currentQ.id) {
        const newTotalAttempts = q.totalAttempts + 1
        const newCorrectRate = ((q.correctRate * q.totalAttempts + (isCorrect ? 1 : 0)) / newTotalAttempts) * 100
        return { ...q, totalAttempts: newTotalAttempts, correctRate: newCorrectRate }
      }
      return q
    })
    setQuizDatabase(updatedDatabase)

    const nextQuestion = currentQuestion + 1
    if (nextQuestion < questionCount) {
      setCurrentQuestion(nextQuestion)
      setSelectedAnswer('')
      setTimeLeft(15) // Reset timer for next question
    } else {
      setGameState('result')
    }
  }

  const restartQuiz = () => {
    setGameState('start')
    setSelectedAnswer('')
    setScore(0)
    setProgress(0)
  }

  const shareToX = () => {
    const text = `私はシャーレ学園クイズ部で${questionCount}問中${score}点を獲得しました！難易度: ${difficulty} あなたも挑戦してみませんか？ #ブルーアーカイブ #シャーレ学園クイズ部`
    const url = 'https://your-quiz-url.com' // クイズサイトのURLに置き換えてください
    const shareUrl = `https://x.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`
    window.open(shareUrl, '_blank')
  }

  const getBackgroundColor = () => {
    switch (difficulty) {
      case 'easy': return 'bg-gradient-to-br from-green-400 to-blue-500'
      case 'medium': return 'bg-gradient-to-br from-yellow-400 to-orange-500'
      case 'hard': return 'bg-gradient-to-br from-red-400 to-pink-500'
      default: return 'bg-gradient-to-br from-blue-400 to-indigo-600'
    }
  }

  const getLowCorrectRateQuestions = () => {
    return quizDatabase
      .filter(q => q.totalAttempts > 0)
      .sort((a, b) => a.correctRate - b.correctRate)
      .slice(0, 3)
  }

  const LowCorrectRatePopup = ({ questions, onClose }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full max-h-[80vh] overflow-y-auto">
        <h3 className="text-xl font-bold mb-4 flex items-center">
          <AlertTriangle className="w-6 h-6 mr-2 text-yellow-500" />
          正答率の低い問題
        </h3>
        {questions.map((q, index) => (
          <div key={index} className="mb-4 p-4 bg-yellow-50 rounded-lg">
            <p className="font-semibold">{q.question}</p>
            <p className="text-sm text-gray-600">正答率: {q.correctRate.toFixed(2)}%</p>
          </div>
        ))}
        <Button onClick={onClose} className="w-full mt-4 bg-indigo-600 hover:bg-indigo-700">
          閉じる
        </Button>
      </div>
    </div>
  )

  return (
    <div className={`min-h-screen flex items-center justify-center p-4 ${getBackgroundColor()}`}>
      <motion.div 
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full"
      >
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-indigo-700">シャーレ学園クイズ部</h1>
          <Gamepad2 className="text-indigo-500 w-8 h-8" />
        </div>
        <AnimatePresence mode='wait'>
          {gameState === 'start' && (
            <motion.div
              key="start"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-4"
            >
              <h2 className="text-2xl font-bold mb-4">クイズ設定</h2>
              <div>
                <Label htmlFor="questionCount">問題数</Label>
                <Select value={questionCount.toString()} onValueChange={(value) => setQuestionCount(Number(value))}>
                  <SelectTrigger id="questionCount">
                    <SelectValue placeholder="問題数を選択" />
                  </SelectTrigger>
                  <SelectContent>
                    {[5, 10, 25, 50, 100].map((count) => (
                      <SelectItem key={count} value={count.toString()}>{count}問</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="difficulty">難易度</Label>
                <Select value={difficulty} onValueChange={setDifficulty}>
                  <SelectTrigger id="difficulty">
                    <SelectValue placeholder="難易度を選択" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">すべて</SelectItem>
                    <SelectItem value="easy">易しい</SelectItem>
                    <SelectItem value="medium">普通</SelectItem>
                    <SelectItem value="hard">難しい</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={startQuiz} className="w-full bg-indigo-600 hover:bg-indigo-700">
                クイズを始める
              </Button>
            </motion.div>
          )}
          {gameState === 'quiz' && questions.length > 0 && (
            <motion.div
              key="quiz"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex justify-between items-center mb-4">
                <Progress value={progress} className="w-2/3" />
                <div className="flex items-center text-indigo-600">
                  <Clock className="w-4 h-4 mr-1" />
                  <span>{timeLeft}秒</span>
                </div>
              </div>
              <h2 className="text-xl font-semibold mb-4">{questions[currentQuestion].question}</h2>
              <RadioGroup value={selectedAnswer} onValueChange={setSelectedAnswer} className="mb-6">
                {questions[currentQuestion].options.map((option, index) => (
                  <div key={index} className="flex items-center space-x-2 mb-2">
                    <RadioGroupItem value={option} id={`option-${index}`} />
                    <Label htmlFor={`option-${index}`} className="flex-grow p-3 bg-indigo-100 rounded-md hover:bg-indigo-200 transition-colors cursor-pointer">
                      {option}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
              <Button 
                onClick={handleAnswer} 
                disabled={!selectedAnswer} 
                className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300"
              >
                {currentQuestion === questionCount - 1 ? '結果を見る' : '次の質問へ'}
              </Button>
            </motion.div>
          )}
          {gameState === 'result' && (
            <motion.div 
              key="result"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="text-center"
            >
              <Trophy className="w-24 h-24 mx-auto text-yellow-500 mb-4" />
              <h2 className="text-2xl font-bold mb-4">クイズ終了！</h2>
              <p className="text-xl mb-6">
                あなたのスコア: {score} 点
              </p>
              <div className="space-y-4">
                <Button onClick={() => setGameState('explanation')} className="w-full bg-indigo-600 hover:bg-indigo-700">
                  解説を見る
                </Button>
                <Button onClick={restartQuiz} className="w-full bg-indigo-600 hover:bg-indigo-700">
                  もう一度挑戦する
                </Button>
                <Button onClick={shareToX} className="w-full bg-blue-500 hover:bg-blue-600">
                  <Share2 className="w-4 h-4 mr-2" />
                  結果をXで共有
                </Button>
                <Button onClick={() => setShowLowCorrectRatePopup(true)} className="w-full bg-yellow-500 hover:bg-yellow-600">
                  <AlertTriangle className="w-4 h-4 mr-2" />
                  苦手な問題を確認
                </Button>
              </div>
            </motion.div>
          )}
          {gameState === 'explanation' && (
            <motion.div
              key="explanation"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <h2 className="text-2xl font-bold mb-4">解説</h2>
              {questions.map((q, index) => (
                <div key={index} className={`p-4 rounded-lg ${answers[index].isCorrect ? 'bg-green-100' : 'bg-red-100'}`}>
                  <h3 className="font-semibold mb-2">{index + 1}. {q.question}</h3>
                  <p>正解: {q.answer}</p>
                  <p>あなたの回答: {answers[index].answer}</p>
                  <p className="mt-2">{q.explanation}</p>
                </div>
              ))}
              <Button onClick={restartQuiz} className="w-full bg-indigo-600 hover:bg-indigo-700">
                もう一度挑戦する
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
      <Sparkles className="absolute top-4 right-4 text-yellow-300 w-8 h-8 animate-pulse" />
      {showLowCorrectRatePopup && (
        <LowCorrectRatePopup
          questions={getLowCorrectRateQuestions()}
          onClose={() => setShowLowCorrectRatePopup(false)}
        />
      )}
    </div>
  )
}