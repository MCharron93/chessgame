import { ProxyState } from '../AppState.js'
import { profileService } from '../Services/ProfileService.js'
// import $ from '../node_modules/jquery/dist/jquery'

const movesElement = document.getElementById('moves')
const statsElement = document.getElementById('stats')

// NOTE create draw function to draw the moves of play
function _drawMoves() {
  const moves = ProxyState.moves

  // NOTE consider adding this in as drawing hints to the page if player is stuck on possible moves
  movesElement.innerHTML = `<div>
  Available Moves: ${moves.length}
  </div>`

  // NOTE everytime the moves are made, the game should check to see if in check/checkmate
  _checkGame()
}

// NOTE this function checks the state of the game based on check, checkmate and stalemate
function _checkGame() {
  const chess = ProxyState.newChess
  const activeTurn = chess.turn()

  if (chess.in_check()) {
    if (chess.in_checkmate()) {
      _drawCheckmate(activeTurn)
      return chess.game_over()
    }
    return _drawCheck(activeTurn)
  }
  if (chess.in_stalemate()) {
    _drawStalemate()
    return chess.game_over()
  }
}

function _drawCheck(chessInfo) {
  if (chessInfo === 'w') {
    movesElement.innerHTML = `<div>
    Your King is in Check
  </div>`
  } else {
    movesElement.innerHTML = `<div>
    Computer King is in Check
    </div>`
  }
}

function _drawCheckmate(chessInfo) {
  if (chessInfo === 'w') {
    // NOTE refactor this to increment on the BE for better source control
    const lostGame = ProxyState.profile.losses++
    const results = { losses: lostGame }
    // console.log(lostGame)

    // NOTE draw sweet alert for winning?
    movesElement.innerHTML = `<div>
    Checkmate, the Computer wins
    </div>
    `
    return profileService.updateStats(results)
  } else {
    // NOTE refactor this to increment on the BE for better source control
    const wonGame = ProxyState.profile.wins++
    console.log(wonGame)
    const results = { wins: wonGame }
    movesElement.innerHTML = `<div>
    Checkmate, you win
    </div>
    `
    return profileService.updateStats(results)
  }

  // NOTE this function should then call to the profileService and update the schema on the BE for the profile stats, pass win/loss object to the service to Put on the profile schema
}

function _drawStalemate() {
  // NOTE refactor this to increment on the BE for better source control
  const tiedGame = ProxyState.profile.ties++
  const results = { ties: tiedGame }
  movesElement.innerHTML = `<div>
  The game is a tie due to neither team's victory
  </div>
  `
  // NOTE this function should then call to the profileService and update the schema on the BE for the profile stats,
  return profileService.updateStats(results)
}

// NOTE this redraws the stats based on the listener within the constructor, updates stats once the game has ended and the game relaunches
function _drawStats() {
  const wins = ProxyState.profile.wins
  const losses = ProxyState.profile.losses
  const ties = ProxyState.profile.ties
  const totalGamesPlayed = wins + losses + ties

  // NOTE look to integrate ratio for wins/losses
  // let gamesRatio = wins / losses
  // if (!gamesRatio) {
  //   gamesRatio = 0
  // }

  statsElement.innerHTML = `<div>
  Wins:  ${wins}
  <br>
  Losses:  ${losses}
  <br>
  Ties:  ${ties}
  <br>
  Total Games Played:  ${totalGamesPlayed}
  </div>`
}

// NOTE create function that draws the chessboard in play
function _drawChessboard() {
  // eslint-disable-next-line no-undef
  ProxyState.chessboard = Chessboard('board', {
    draggable: true,
    dropOffBoard: 'snapback',
    position: ProxyState.newChess.fen()
  })
}
// NOTE create controller that sets instances of the class ChessController
export default class ChessController {
  constructor() {
    // NOTE constructor should assign listeners forr drawing the moves and redrawing the chessboard
    ProxyState.on('newChess', _drawChessboard)
    ProxyState.on('moves', _drawMoves)
    ProxyState.on('profile', _drawStats)
    this.startGame()
  }

  // NOTE startGame should set the ProxyState of a newchess game to a new instance and set the chessboard properties to their default setup
  startGame() {
    // eslint-disable-next-line no-undef
    const newGame = new Chess()
    ProxyState.newChess = newGame
    profileService.getProfile()

    // eslint-disable-next-line no-undef
    ProxyState.chessboard = Chessboard('board', {
      draggable: true,
      dropOffBoard: 'snapback',
      position: ProxyState.newChess.fen(),
      dragStart,
      onDrop,
      onSnapEnd
    })
  }
}

// NOTE there should be event handlers for drag and drop as well as listeners to start the game, checking to see who's turn it is
function dragStart(source, piece, position, orientation) {
  // NOTE set pieces to immobile on game end when game === false
  if (ProxyState.newChess.game_over()) return false

  // NOTE only move pieces for the side to move, depending on who's turn it currently is
  if ((ProxyState.newChess.turn() === 'w' && piece.search(/^b/) !== -1) ||
  (ProxyState.newChess.turn() === 'b' && piece.search(/^w/) !== -1)) {
    return false
  }
}
function onDrop(source, target) {
  // NOTE console logging for when it is your turn, and then get turned over to the computer
  // console.log(ProxyState.newChess.turn(), "player turn")

  // NOTE check to see if moves are legal based on the space moved to/from
  const move = ProxyState.newChess.move({
    from: source,
    to: target
  })
  // NOTE if move is illegal, have the pieces snapback into their original places
  if (move === null) return 'snapback'

  // NOTE set moves to call all possible moves, and then call the computers turn
  ProxyState.moves = ProxyState.newChess.moves()
  computerTurn()
}

// NOTE there should be a way to update the board when pieces snap into place
// NOTE .fen() calls the current position of the board
function onSnapEnd() {
  ProxyState.chessboard.position(ProxyState.newChess.fen())
}

// NOTE there should be a function to call the computers turn and calculate a random move *this could be optimized for a harder AI
// NOTE then calls check game to track the turns and see if the computer or player are in check
function computerTurn() {
  // NOTE logging to see the turn of the computer, helps understand whether player or computer will be in check

  const moves = ProxyState.newChess.moves()
  const move = moves[Math.floor(Math.random() * moves.length)]
  ProxyState.newChess.move(move)
  // makeBestMove()
  _checkGame()
}
