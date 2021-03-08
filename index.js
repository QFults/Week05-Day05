const { prompt } = require('inquirer')
const { green, red } = require('chalk')
const words = require('./words.js')
let guessedLetters = []
let guesses = 10

let word = words[Math.floor(Math.random() * words.length)]

const renderWord = () => {
  let win = true
  let underscores = ''
  for (let i = 0; i < word.length; i++) {
    if (!word[i].match(/^[a-z0-9]+$/i) ||guessedLetters.indexOf(word[i].toLowerCase()) !== -1) {
      underscores += word[i]
    } else {
      win = false
      underscores += '_'
    }
  }
  if (win) {
    console.log(green(word))
    console.log(green('You won! Congrats!'))
    mainMenu()
  } else {
    console.log(underscores)
    round()
  }
}

const round = () => {
  prompt({
    type: 'input',
    name: 'letter',
    message: 'Guess a letter',
    validate(guess) {
      if (guess.match(/^[a-z0-9]+$/i)) {
        if (guess.length === 1) {
          if (guessedLetters.indexOf(guess) === -1) {
            return true
          } else {
            return 'you already guessed that letter'
          }
        } else {
          return 'must be one character only'
        }
      } else {
        return 'must be a letter or number'
      }
    }
  })
    .then(({ letter }) => {
      guessedLetters.push(letter.toLowerCase())

      if (word.indexOf(letter.toLowerCase()) !== -1 || word.indexOf(letter.toUpperCase()) !== -1) {
        console.log(green('Correct Guess!'))
        renderWord()
      } else {
        guesses--
        console.log(red(`Incorrect Guess! ${guesses} guesses remaining`))
        if (guesses <= 0) {
          console.log(red(`You lose! The answer was: ${word}`))
          mainMenu()
        } else {
          renderWord()
        }
      }
    })
    .catch(err => console.log(err))
}

const mainMenu = () => {
  prompt({
    type: 'confirm',
    name: 'choice',
    message: 'Would you like to play again?'
  })
    .then(({ choice }) => {
      if (choice) {
        word = words[Math.floor(Math.random() * words.length)]
        guesses = 10
        guessedLetters = []
        renderWord()
      } else {
        process.exit()
      }
    })
}

renderWord()