// Globals
let BOARD;
let savedBoard;

// Constants
let N = 8;
let boardPad = 15;
let cellSize;
let badPieceTimer = 10;
let pieceMovingTime = 12;

// State Variables
let selectedCell;
let badPieceCount;
let goodPieceSelected;
let drawAgain;
let pieceMovingCount;
let movingPiece;
let finishedGame;
let winMsg;


// SETUP
function setup() {
  let canvasSize = floor(min(windowWidth, windowHeight));
  createCanvas(canvasSize, canvasSize);
  cellSize = floor((min(width, height) - 2 * boardPad) / N)
  loadColors();
  resetGame();

}

// RESET GAME
function resetGame() {
  // Generate board.
  BOARD = new Board(N, REDPlayer, WHITEPlayer);
  BOARD.resetBoard();
  // BOARD.cells[1][4].addPiece(REDPlayer);
  // BOARD.cells[3][4].addPiece(REDPlayer);
  // BOARD.cells[2][5].addPiece(REDPlayer);
  // BOARD.cells[2][3].addPiece(WHITEPlayer);
  // BOARD.cells[3][2].addPiece(WHITEPlayer);
  savedBoard = null;

  // Reset state variables.
  selectedCell = null;
  badPieceCount = 0;
  goodPieceSelected = false;
  drawAgain = true;
  pieceMovingCount = -2;
  movingPiece = null;
  finishedGame = false;
}



function draw() {

  if (drawAgain) {
    background(220);
    BOARD.draw();
    drawAgain = false
    if (finishedGame) {
      fill(color(120, 10, 30));
      stroke(color(0));
      strokeWeight(5);
      textSize(width / 7);
      textStyle(BOLD);
      textAlign(CENTER, CENTER);
      text(winMsg, width / 2, height / 2);
    }
  }

  if (pieceMovingCount == -1) {
      checkWinner()
      if ((!finishedGame) && (BOARD.cPlayer == WHITEPlayer)){
          let mmMove = minmax(BOARD, BOARD.cPlayer, BOARD.oPlayer)
          BOARD.startMove(BOARD.cells[mmMove.si][mmMove.sj])
          BOARD.clearHighlights()
          BOARD.finishMove(BOARD.cells[mmMove.ei][mmMove.ej])
          BOARD.highlightEat()
          drawAgain = true;
      }
      pieceMovingCount--;
    }
  
  if (badPieceCount > 0) {
    if (badPieceCount == 1) {
      selectedCell.highlight = null;
      drawAgain = true
    }
    badPieceCount--;
  }

  if (pieceMovingCount >= 0) {
    if (pieceMovingCount == 0) {
      movingPiece.isMoving = false;
      checkWinner();
    }
    movingPiece.move();
    drawAgain = true;
    pieceMovingCount--;
  }

}



// Mouse-press Function
function mousePressed() {
  if (mouseButton === LEFT || touches.length == 1) {
    let iClick = x2n(mouseX);
    let jClick = x2n(mouseY);
    let cell = BOARD.cells[iClick][jClick]

    if (finishedGame) {
      resetGame();
      return false;
    }

    if (pieceMovingCount > 0) {
      return false;
    }

    BOARD.clearHighlights()

    let moved = false;
    if (goodPieceSelected) {
      moved = BOARD.finishMove(cell)
      BOARD.highlightEat()
    }

    if (moved) {
      // checkWinner()

      // mmMove = minmax(BOARD,BOARD.cPlayer,BOARD.oPlayer)
      // BOARD.cells[mmMove.si][mmMove.sj].highlight = boardColorSet.suggestion;
      // BOARD.cells[mmMove.ei][mmMove.ej].highlight = boardColorSet.suggestion;
      // console.log(mmMove.pt)


    } else {
      BOARD.startMove(cell)
    }

    drawAgain = true;
    return false;
  }

  if (mouseButton === CENTER || touches.length == 2) {

    if (savedBoard == null) {
      savedBoard = BOARD.copy();
    } else {
      let tempBoard = BOARD.copy();
      BOARD = savedBoard.copy();
      savedBoard = tempBoard;
      drawAgain = true;
    }
  }
}

function checkWinner() {
  let winner = BOARD.getWinner();
  if (winner != null) {
    if (winner == REDPlayer) {
      winMsg = "You Won !!!"
    } else {
      winMsg = "You Lost ..."
    }
    finishedGame = true;
  }

}



//