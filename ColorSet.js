let REDPlayer = 1;
let WHITEPlayer = 2;
let playersColorSet = null;
let boardColorSet = null;

function loadColors() {
  playersColorSet = {
    [REDPlayer]: {
      pieceFill1: color(125, 0, 0),
      pieceFill2: color(220, 0, 0),
      pieceStroke1: color(10),
      pieceStroke2: color(170, 0, 0),
    },
    [WHITEPlayer]: {
      pieceFill1: color(100),
      pieceFill2: color(220),
      pieceStroke1: color(10),
      pieceStroke2: color(160),
    },
    
  }

  boardColorSet = {
    darkSquare: color(40),
    lightSquare: color(210),
    selectedGood: color(0, 160, 0),
    selectedBad: color(160, 0, 0),
    highlighted: color(190, 190, 80),
    eater: color(80, 190, 190),
    suggestion: color(190,20,190),
  }
}