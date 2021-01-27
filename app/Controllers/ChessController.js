import { ProxyState } from '../AppState.js'
import { profileService } from '../Services/ProfileService.js'
// import $ from 'jquery'

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
      return _drawCheckmate(activeTurn)
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
    const results = { losses: 1 }
    movesElement.innerHTML = `<div>
    Checkmate, the Computer wins
    </div>
    `
    return profileService.updateStats(results)
    // NOTE draw sweet alert for winning?
  } else {
    // NOTE refactor this to increment on the BE for better source control
    const results = { wins: 1 }
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
  const results = { ties: 1 }
  movesElement.innerHTML = `<div>
  The game is a tie due to neither team's victory
  </div>
  `
  // NOTE this function should then call to the profileService and update the schema on the BE for the profile stats,
  return profileService.updateStats(results)
}

function _drawStats() {
  const wins = ProxyState.profile.wins
  const losses = ProxyState.profile.losses
  const ties = ProxyState.profile.ties

  statsElement.innerHTML = `<div>
  Wins: ${wins}
  <br>
  Losses: ${losses}
  <br>
  Ties: ${ties}
  </div>`
}

// NOTE create function that draws the chessboard in play
function _drawChessboard() {
  ProxyState.chessboard = new Chessboard('board', {
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
    // NOTE should also have function to draw the initial board with this.startGame()
  }

  // NOTE startGame should set the ProxyState of a chess game to a new instance and set the chessboard properties
  startGame() {
    const newGame = new Chess()
    ProxyState.newChess = newGame

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
  // set pieces to immobile on game end when game = false
  if (ProxyState.newChess.game_over()) return false

  // only pick up pieces for the side to move, depending on who's turn it currently is
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
  // if move is illegal, have the pieces snapback into their original places
  if (move === null) return 'snapback'

  // set moves to call all possible moves, and then call the computers turn
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
  console.log(ProxyState.newChess.turn(), ' it is the computer turn')
  const moves = ProxyState.newChess.moves()
  const move = moves[Math.floor(Math.random() * moves.length)]
  ProxyState.newChess.move(move)
  // makeBestMove()
  _checkGame()
}

// const minimaxRoot = function(depth, isMaximisingPlayer) {
//   const game = ProxyState.newChess
//   const newGameMoves = game.moves()
//   let bestMove = -9999
//   let bestMoveFound

//   for (let i = 0; i < newGameMoves.length; i++) {
//     const newGameMove = newGameMoves[i]
//     game.move(newGameMove)
//     const value = minimax(depth - 1, game, !isMaximisingPlayer)
//     game.undo()
//     if (value >= bestMove) {
//       bestMove = value
//       bestMoveFound = newGameMove
//     }
//   }
//   return bestMoveFound
// }

// const minimax = function(depth, isMaximisingPlayer) {
//   const game = ProxyState.newChess
//   // positionCount++
//   if (depth === 0) {
//     return -evaluateBoard(game.board())
//   }

//   const newGameMoves = game.moves()

//   if (isMaximisingPlayer) {
//     let bestMove = -9999
//     for (let i = 0; i < newGameMoves.length; i++) {
//       game.move(newGameMoves[i])
//       bestMove = Math.max(bestMove, minimax(depth - 1, game, !isMaximisingPlayer))
//       game.undo()
//     }
//     return bestMove
//   } else {
//     let bestMove = 9999
//     for (let i = 0; i < newGameMoves.length; i++) {
//       game.move(newGameMoves[i])
//       bestMove = Math.min(bestMove, minimax(depth - 1, game, !isMaximisingPlayer))
//       game.undo()
//     }
//     return bestMove
//   }
// }

// const evaluateBoard = function() {
//   const board = ProxyState.chessboard
//   let totalEvaluation = 0
//   for (let i = 0; i < 8; i++) {
//     for (let j = 0; j < 8; j++) {
//       totalEvaluation = totalEvaluation + getPieceValue(board[i][j])
//     }
//   }
//   return totalEvaluation
// }

// const getPieceValue = function(piece) {
//   if (piece === null) {
//     return 0
//   }
//   const getAbsoluteValue = function(piece) {
//     if (piece.type === 'p') {
//       return 10
//     } else if (piece.type === 'r') {
//       return 50
//     } else if (piece.type === 'n') {
//       return 30
//     } else if (piece.type === 'b') {
//       return 30
//     } else if (piece.type === 'q') {
//       return 90
//     } else if (piece.type === 'k') {
//       return 900
//     }
//     throw 'Unknown piece type: ' + piece.type
//   }

//   const absoluteValue = getAbsoluteValue(piece, piece.color === 'w')
//   return piece.color === 'w' ? absoluteValue : -absoluteValue
// }

// const dragStart = function(source, piece, position, orientation) {
//   const game = ProxyState.newChess
//   if (game.in_checkmate() === true || game.in_draw() === true ||
//       piece.search(/^b/) !== -1) {
//     return false
//   }
// }

// const makeBestMove = function() {
//   const game = ProxyState.newChess
//   const board = ProxyState.chessboard
//   const bestMove = getBestMove(game)
//   game.ugly_move(bestMove)
//   board.position(game.fen())
//   // renderMoveHistory(game.history())
//   // if (game.game_over()) {
//   //   alert('Game over')
//   // }
// }

// const getBestMove = function() {
//   const game = ProxyState.newChess
//   if (game.game_over()) {
//     window.alert('Game over')
//   }

//   const positionCount = 0
//   const depth = parseInt($('#search-depth').find(':selected').text())

//   const d = new Date().getTime()
//   const bestMove = minimaxRoot(depth, game, true)
//   const d2 = new Date().getTime()
//   const moveTime = (d2 - d)
//   const positionsPerS = (positionCount * 1000 / moveTime)

//   $('#position-count').text(positionCount)
//   $('#time').text(moveTime / 1000 + 's')
//   $('#positions-per-s').text(positionsPerS)
//   return bestMove
// }
