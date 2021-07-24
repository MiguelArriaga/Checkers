var dirs = {
  [REDPlayer]: {
    F: -1,
    B: 1,
    L: -1,
    R: 1,
  },
  [WHITEPlayer]: {
    F: 1,
    B: -1,
    L: -1,
    R: 1,
  }
};


function Move(cell, eat) {
  this.cell = cell;
  this.eat = eat;
}

class Cell {
  constructor(board,i, j) {
    this.i = i;
    this.j = j;
    this.x = n2x(i);
    this.y = n2x(j);
    this.color = color(255);
    this.highlight = null;
    this.object = new NoObject();
    this.board = board;
  }

  copy() {
    let newCell = new Cell(null,this.i, this.j)

    newCell.color = this.color;
    newCell.highlight = this.highlight;
    newCell.object = this.object.copy();
    newCell.object.cell = newCell;
    return newCell;
  }

  addPiece(color) {
    this.object = new Piece(color)
    this.object.cell = this
  }

  getPieceFrom(other) {
    this.object = other.object;
    this.object.cell = this;
    other.object = new NoObject();

  }

  movePieceTo(targetCell, anim = true) {
    // Move the piece (now it is in target)
    targetCell.getPieceFrom(this)

    // Set Animation properties is needed
    if (anim) {
      pieceMovingCount = pieceMovingTime;
      movingPiece = targetCell.object;
      movingPiece.setMovement(selectedCell.i, selectedCell.j, pieceMovingTime)
    }

    // Eat, if it is an eating move
    let atePiece = false;
    if (abs(targetCell.i - this.i) > 1) {
      //Eats
      let iother = round((targetCell.i + this.i) / 2);
      let jother = round((targetCell.j + this.j) / 2);
      this.board.cells[iother][jother].object = new NoObject();
      atePiece = true;
    }

    // Become Queen, if reached end of board
    if (targetCell.object.player == REDPlayer && targetCell.j == 0) {
      targetCell.object.queen = true;
    } else if (targetCell.object.player == WHITEPlayer && targetCell.j == N - 1) {
      targetCell.object.queen = true;
    }

    return atePiece

  }


  checkDirection(ud, lr) {
    let cplayer = this.object.player;
    // Closer corner
    let icc = this.i + dirs[cplayer][lr];
    let jcc = this.j + dirs[cplayer][ud];
    if (icc < 0 || icc >= N || jcc < 0 || jcc >= N) {
      return new Move(null, null)
    }

    let closeCorner = this.board.cells[icc][jcc];
    if (closeCorner.object instanceof NoObject) {
      return new Move(closeCorner, false)
    }

    // Farther Corner
    icc = this.i + 2 * dirs[cplayer][lr];
    jcc = this.j + 2 * dirs[cplayer][ud];
    if (icc < 0 || icc >= N || jcc < 0 || jcc >= N) {
      return new Move(null, null)
    }
    let farCorner = this.board.cells[icc][jcc];
    if ((closeCorner.object.player != cplayer) &&
      (farCorner.object instanceof NoObject)) {
      return new Move(farCorner, true)
    }

    return new Move(null, null)

  }

  getAvailableMoves() {
    let availableMoves = [];
    let existsEatMove = false;

    // Forward Eating
    let fl = this.checkDirection("F", "L");
    if (fl.cell != null) {
      availableMoves.push(fl);
      if (fl.eat) {
        existsEatMove = true;
      }
    }

    let fr = this.checkDirection("F", "R");
    if (fr.cell != null) {
      availableMoves.push(fr);
      if (fr.eat) {
        existsEatMove = true;
      }
    }

    // Add Queen return moves
    if (this.object.queen) {
      let bl = this.checkDirection("B", "L");
      if (bl.cell != null) {
        availableMoves.push(bl);
        if (bl.eat) {
          existsEatMove = true;
        }
      }

      let br = this.checkDirection("B", "R");
      if (br.cell != null) {
        availableMoves.push(br);
        if (br.eat) {
          existsEatMove = true;
        }
      }
    }


    // Eating is mandatory
    if (existsEatMove) {
      let onlyEatMoves = [];
      for (let move of availableMoves) {
        if (move.eat) {
          onlyEatMoves.push(move);
        }
      }
      availableMoves = onlyEatMoves;
    }

    return availableMoves;
  }


  hasEatMove() {
    let moves = this.getAvailableMoves();
    for (let move of moves) {
      if (move.eat) {
        return true;
      }
    }
    return false;
  }

  hasAvailableMoves() {
    let moves = this.getAvailableMoves();
    return moves.length > 0;
  }

  highlightMoves() {
    let moves = this.getAvailableMoves()
    for (let move of moves) {
      move.cell.highlight = boardColorSet.highlighted;
    }

  }

  draw_object() {
    this.object.draw();

  }

  draw_self() {
    let cellColor = this.color;
    if (this.highlight != null) {
      cellColor = this.highlight;
    }

    fill(cellColor);
    stroke(color(0));
    strokeWeight(1);
    rectMode(CENTER);
    rect(this.x, this.y, cellSize, cellSize);
  }

}

class NoObject {
  constructor() {
    this.player = -1
  }
  draw() {}

  copy(){
    return new NoObject();
  }

}