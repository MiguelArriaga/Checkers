class Piece {

  constructor(player, cell) {
    this.player = player;
    this.cell = cell;
    this.queen = false;
    this.isMoving = false;
    this.mx = null;
    this.my = null;
    this.spdx = null;
    this.spdy = null;
  }

  copy(){
    let newPiece = new Piece(null,null)
    newPiece.player = this.player;
    newPiece.queen = this.queen;
   return newPiece;
  }
  
  
  setMovement(oi, oj, TotStep) {
    this.mx = n2x(oi)
    this.my = n2x(oj)
    this.spdx = (this.cell.x - this.mx) / TotStep
    this.spdy = (this.cell.y - this.my) / TotStep
    this.isMoving = true;
  }
  move() {
    this.mx += this.spdx;
    this.my += this.spdy;
  }

  draw() {
    let cs = playersColorSet[this.player]
    ellipseMode(CENTER);

    let x = this.cell.x;
    let y = this.cell.y;

    if (this.isMoving) {
      x = this.mx;
      y = this.my;
    }



    strokeWeight(1);
    stroke(cs.pieceStroke1);
    fill(cs.pieceFill1);
    ellipse(x, y, 0.75 * cellSize);
    strokeWeight(3);
    stroke(cs.pieceStroke2);
    fill(cs.pieceFill2);
    ellipse(x, y, 0.55 * cellSize);
    
    if (this.queen) {
      let dd = cellSize / 8;
      stroke(0)
      strokeWeight(1);
      fill(0);
      beginShape();
      vertex(x-dd,y+dd*3/4);
      vertex(x-dd,y-dd*3/4);
      vertex(x,y);
      vertex(x+dd,y-dd*3/4);
      vertex(x+dd,y+dd*3/4);
      endShape(CLOSE);
    }


  }




}