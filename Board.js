class Board {
  constructor(nCells, cPlayer, oPlayer, fillCells = true) {
    this.N = nCells;
    this.cells = [];
    this.cPlayer = cPlayer;
    this.oPlayer = oPlayer;

    if (fillCells) {
      for (let i = 0; i < this.N; i++) {
        this.cells[i] = [];
        for (let j = 0; j < this.N; j++) {
          this.cells[i][j] = new Cell(this, i, j);
          if ((i + j) % 2 == 0) {
            this.cells[i][j].color = boardColorSet.lightSquare;
          } else {
            this.cells[i][j].color = boardColorSet.darkSquare;
          }
        }
      }
    }
  }

  copy() {
    let newBoard = new Board(this.N, this.cPlayer, this.oPlayer, false);
    for (let i = 0; i < this.N; i++) {
      newBoard.cells[i] = [];
      for (let j = 0; j < this.N; j++) {
        newBoard.cells[i][j] = this.cells[i][j].copy();
        newBoard.cells[i][j].board = newBoard;
      }
    }
    return newBoard;
  }


  resetBoard() {
    for (let i = 0; i < this.N; i++) {
      if (i % 2 == 0) {
        this.cells[i][1].addPiece(WHITEPlayer)
        this.cells[i][this.N - 1].addPiece(REDPlayer)
        this.cells[i][this.N - 3].addPiece(REDPlayer)
      } else {
        this.cells[i][0].addPiece(WHITEPlayer)
        this.cells[i][2].addPiece(WHITEPlayer)
        this.cells[i][this.N - 2].addPiece(REDPlayer)
      }
    }
  }

  getValidStartingCells(player) {
    let eaCells = this.getEaterCells(player)
    if (eaCells.length > 0) {
      return eaCells
    }

    let plCells = this.getPlayerCells(player);
    let validCells = [];
    for (let cell of plCells) {
      if (cell.hasAvailableMoves()) {
        validCells.push(cell);
      }
    }
    return validCells;
  }


  startMove(cell) {
    let validCells = this.getValidStartingCells(this.cPlayer)

    let isValid = false;
    for (let possCell of validCells) {
      if (cell == possCell) {
        isValid = true;
      }
    }

    if (isValid) {
      cell.highlight = boardColorSet.selectedGood;
      cell.highlightMoves()
      goodPieceSelected = true;
    } else {
      cell.highlight = boardColorSet.selectedBad;
      badPieceCount = badPieceTimer;
      goodPieceSelected = false;
    }
    selectedCell = cell;
  }


  finishMove(targetCell) {
    //Check availabele moves of the selected cell
    let moved = false;
    for (let possMove of selectedCell.getAvailableMoves()) {
      // Check if target cell is one of the possible moves
      if (targetCell == possMove.cell) {
        moved = true;
        // Move the piece (eat and make queen is needed)
        let atePiece = selectedCell.movePieceTo(targetCell)
        // 
        if (!atePiece || !targetCell.hasEatMove()) {
          this.swapPlayers();
        }
        goodPieceSelected = false;
      }
    }
    return moved
  }

  swapPlayers() {
    let t = this.cPlayer;
    this.cPlayer = this.oPlayer;
    this.oPlayer = t;
  }


  // Assumes no checks needed. For AI
  directMove(si,sj, ei,ej) {
    let sCell = this.cells[si][sj];
    let eCell = this.cells[ei][ej];
    let atePiece = sCell.movePieceTo(eCell,false)
    // 
    if (!atePiece || !eCell.hasEatMove()) {
      this.swapPlayers();
    }
  }


  points(player) {
    let playerCells = this.getPlayerCells(player);
    let totalPoints = 0;
    for (let cell of playerCells) {
      totalPoints += 1;
      if (cell.object.queen) {
        totalPoints += 1; //Queen worth 1 additional points
      }
    }
    return totalPoints
  }

  clearHighlights() {
    for (let i = 0; i < this.N; i++) {
      for (let j = 0; j < this.N; j++) {
        this.cells[i][j].highlight = null;
      }
    }

  }

  draw() {
    for (let i = 0; i < this.N; i++) {
      for (let j = 0; j < this.N; j++) {
        this.cells[i][j].draw_self();
      }
    }

    for (let i = 0; i < this.N; i++) {
      for (let j = 0; j < this.N; j++) {
        this.cells[i][j].draw_object();
      }
    }
  }

  getPlayerCells(player) {
    let playerCells = []
    for (let i = 0; i < this.N; i++) {
      for (let j = 0; j < this.N; j++) {
        if (this.cells[i][j].object.player == player) {
          playerCells.push(this.cells[i][j]);
        }
      }
    }
    return playerCells;
  }

  getEaterCells(player) {
    let eaterCells = []
    let playerCells = this.getPlayerCells(player)
    for (let pcell of playerCells) {
      if (pcell.hasEatMove()) {
        eaterCells.push(pcell);
      }
    }
    return eaterCells;
  }

  highlightEat() {
    let eaterCells = this.getEaterCells(this.cPlayer)
    for (let cell of eaterCells) {
      cell.highlight = boardColorSet.eater;
    }
    return eaterCells;
  }


  getWinner() {
    let cannotMove = true;
    let playerCells = this.getPlayerCells(this.cPlayer);
    for (let pcell of playerCells) {
      if (pcell.hasAvailableMoves()) {
        cannotMove = false;
      }
    }
    if (cannotMove) {
      return this.oPlayer;
    } else {
      return null;
    }

  }


}

function n2x(n) {
  return n * cellSize + boardPad + cellSize / 2;
}

function x2n(x) {
  return floor((x - boardPad) / cellSize);
}