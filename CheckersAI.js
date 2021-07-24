let MAXN = 5

class minMaxMove {
  constructor(si, sj, ei, ej) {
    this.si = si;
    this.sj = sj;
    this.ei = ei;
    this.ej = ej;
    this.pt = 0;
  }
}

function minmax(sourceBoard, thinkingPlayer, enemyPlayer, n = MAXN, alpha = -Infinity, beta = +Infinity) {
  let board = sourceBoard.copy()

  // console.log("Entered Level ",n," with (a/b) =",alpha,beta,"MaxP=",board.cPlayer == thinkingPlayer)
  
  if (n == 0) {
    return board.points(thinkingPlayer) - board.points(enemyPlayer)
  }

  let moveList = [];
  let startCells = board.getValidStartingCells(board.cPlayer)
  for (let sCell of startCells) {
    let endMoves = sCell.getAvailableMoves()
    for (let eMove of endMoves) {
      moveList.push(new minMaxMove(sCell.i, sCell.j, eMove.cell.i, eMove.cell.j))
    }
  }

  if (moveList.length == 0){
   let winner = board.getWinner()
   if (winner ==  thinkingPlayer){
     return 100;
   } else {
     return -100;
  }}
  
  // Space for a potential sorting heuristic (e.g. starting with cells closer to top)

  let maxVal = -Infinity;
  let minVal = +Infinity;
  let maxMove = null;
  for (let move of moveList) {
    let newBoard = board.copy()
    newBoard.directMove(move.si, move.sj, move.ei, move.ej)
    let pts = minmax(newBoard, thinkingPlayer, enemyPlayer, n - 1, alpha, beta)
    // console.log("Points",pts," Level ",n," with (a/b) =",alpha,beta)
    // set Max and Min
    if (pts >= maxVal) {
      maxVal = pts
      if (n == MAXN) {
        maxMove = move;
        maxMove.pt = pts;
      }
    }
    if (pts < minVal) {
      minVal = pts;
    }
    // set alpha/-beta
    if (board.cPlayer == thinkingPlayer) { // Maximizing player
      alpha = max(alpha, pts)
    } else {
      beta = min(beta, pts)
    }
    if (beta < alpha) {
      // console.log("Pruned")
      break;
    }
  }


  if (n == MAXN) {
    // console.log(maxVal)
    return maxMove;
  } else if (board.cPlayer == thinkingPlayer) { // Maximizing player
    return maxVal
  } else {
    return minVal
  }



}