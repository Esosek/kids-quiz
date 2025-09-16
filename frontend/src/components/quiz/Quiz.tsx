import Image from 'next/image'
import { useMemo, useState } from 'react'

import { Subcategory } from '@/types/subcategory'
import { generateQuiz } from '@/utils/quiz_generator'
import QuizProgressTracker from './QuizProgressTracker'
import AnswerButton from './AnswerButton'
import iconChevron from '@/assets/icon_chevron.svg'
import IconButton from '../common/IconButton'
import QuizResult from './QuizResult'
import { useCurrencyStore } from '@/stores/currency_store'
import { useCategoryStore } from '@/stores/category_store'
import HintButton from './HintButton'

const QUIZ_COMPLETION_REWARD = 2
const CORRECT_ANSWER_REWARD = 1

type QuizProps = {
  subcategory: Subcategory
}

export default function Quiz({ subcategory }: QuizProps) {
  const generatedQuiz = useMemo(() => generateQuiz(subcategory.questions), [subcategory.questions])
  const userCurrency = useCurrencyStore((state) => state.currency)
  const [quizQuestions, setQuizQuestions] = useState(generatedQuiz)
  const [userAnswers, setUserAnswers] = useState<Array<boolean | undefined>>(
    Array(quizQuestions.length).fill(undefined)
  )
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [userSelectedOption, setUserSelectedOption] = useState<string | null>(null)
  const [isQuizFinished, setIsQuizFinished] = useState(false)
  const [currencyEarned, setCurrencyEarned] = useState(0)
  const addCurrency = useCurrencyStore((state) => state.addCurrency)
  const answerQuestion = useCategoryStore((state) => state.answerQuestion)

  const [currentQuestion, setCurrentQuestion] = useState(quizQuestions[currentQuestionIndex])

  async function submitAnswer(value: string) {
    const isAnswerCorrect = value === currentQuestion.correctAnswer
    const updatedAnswers = [...userAnswers]
    updatedAnswers[currentQuestionIndex] = isAnswerCorrect
    setUserAnswers(updatedAnswers)
    setUserSelectedOption(value)
    if (isAnswerCorrect) {
      await answerQuestion(subcategory.id, quizQuestions[currentQuestionIndex].id)
      setCurrencyEarned((cur) => cur + CORRECT_ANSWER_REWARD) // Currently each answer earns +1 currency
      addCurrency(CORRECT_ANSWER_REWARD) // Currently each answer earns +1 currency
    }
  }

  function handleNextQuestion() {
    // Check if last question
    if (currentQuestionIndex + 1 >= quizQuestions.length) {
      setIsQuizFinished(true)
      setCurrencyEarned((cur) => cur + QUIZ_COMPLETION_REWARD) // Finishing quiz earns +5 currency
      addCurrency(QUIZ_COMPLETION_REWARD)
    } else {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
      setCurrentQuestion(quizQuestions[currentQuestionIndex + 1])
    }
    setUserSelectedOption(null)
  }

  function handleReplay() {
    const generatedQuiz = generateQuiz(subcategory.questions)
    setQuizQuestions(generatedQuiz)
    setUserAnswers(Array(quizQuestions.length).fill(undefined))
    setCurrentQuestionIndex(0)
    setCurrentQuestion(generatedQuiz[0])
    setCurrencyEarned(0)
    setIsQuizFinished(false)
  }

  function handleHintAccept() {
    const hintedAnswers = currentQuestion.answers.filter(
      (answer) => !currentQuestion.hintRemovedAnswers.includes(answer)
    )
    const updatedQuestion = { ...currentQuestion, answers: hintedAnswers, hasUserAnswered: true }
    setCurrentQuestion(updatedQuestion)
  }

  let content = (
    <>
      {currentQuestion.text && (
        <p className='uppercase text-lg my-4 text-center sm:my-8 sm:text-2xl'>{currentQuestion.text}</p>
      )}
      {currentQuestion.imgUrl && (
        <div className='relative w-4/5 aspect-[3_/_2] mb-4 sm:w-2/3'>
          <Image
            src={currentQuestion.imgUrl}
            alt='Image for quiz question'
            width={600}
            height={200}
            className='h-auto rounded-2xl'
          />
          <div className='absolute top-3 left-3 sm:-left-20 sm:bottom-0 sm:top-0 sm:flex sm:items-center'>
            {!currentQuestion.hasUserAnswered && userCurrency > 1 && <HintButton onAccept={handleHintAccept} />}
          </div>
        </div>
      )}
      <ul className='relative w-full grid grid-cols-2 grid-rows-3 gap-2 gap-y-3 mb-10 sm:grid-cols-1 sm:gap-3'>
        {currentQuestion.answers.map((answer) => {
          let colorTheme: 'correct' | 'user-correct' | 'user' | undefined
          if (userSelectedOption) {
            if (answer === currentQuestion.correctAnswer) {
              colorTheme = 'correct'
            }
            if (answer === userSelectedOption) {
              colorTheme = 'user'
            }
            if (userSelectedOption === currentQuestion.correctAnswer && answer === userSelectedOption) {
              colorTheme = 'user-correct'
            }
          }
          return (
            <li key={answer}>
              <AnswerButton
                disabled={!!userSelectedOption}
                value={answer}
                colorTheme={colorTheme}
                onClick={() => submitAnswer(answer)}
              />
            </li>
          )
        })}
        {userSelectedOption && (
          <div className='flex items-center self-center justify-self-center sm:absolute sm:-right-24 sm:top-0 sm:bottom-0'>
            <IconButton iconSrc={iconChevron} onClick={handleNextQuestion} alt='Ikona pro pokračování' />{' '}
          </div>
        )}
      </ul>
    </>
  )

  if (isQuizFinished) {
    content = (
      <QuizResult
        userAnswers={userAnswers as boolean[]}
        currencyEarned={currencyEarned}
        onReplay={handleReplay}
        subcategoryId={subcategory.id}
      />
    )
  }

  return (
    <div className='flex flex-col items-center'>
      <h1 className='absolute top-11 text-2xl uppercase mb-6 sm:top-16'>{subcategory.label}</h1>
      <QuizProgressTracker currentIndex={currentQuestionIndex} answers={userAnswers} />
      {content}
    </div>
  )
}
