// NOTE I want to integrate a smarter AI that functions separately from the regular chessgame
// NOTE look at ways to integrate a smart AI and refactor the functionality separation of the game in smaller parts

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
