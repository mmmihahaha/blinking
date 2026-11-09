let backgroundColor;
let paperRatio = 1.414; // A4 ratio = 1.414
let cw = 500; //width
let ch = cw*paperRatio; //height
let squareS = 15;

//New
let seed = Math.random() * 100000;
let filterOn = false;

function setup() {
  let cnv = createCanvas(cw, ch);
  cnv.parent('canvas-holder'); // places the canvas inside <main>, so CSS can centre it
  rectMode(CENTER);
  angleMode(DEGREES);
  noLoop();

  // Buttons live in index.html (placeholders for your hand-drawn PNGs)
  select('#save-btn').mousePressed(saveImage);
  select('#refresh-btn').mousePressed(drawAgain);
  select('#filter-btn').mousePressed(() => { filterOn = !filterOn; draw(); });
}

function drawAgain(){
  seed = Math.random() * 100000;
  clear();
  draw();
}

function draw() {
  randomSeed(seed);
  blendMode(BLEND); // reset, so the grain's OVERLAY mode from the last draw doesn't tint the next one

  backgroundColor = color(random(255), random(255), random(255)); 
  background(backgroundColor); 
  
  //Call function to draw background shapes
  push();
  strokeWeight(2);
  stroke('white');
  drawAbstract(0, 0, cw, ch);
  pop();
  
  //Call function for Hilma squares variations
  drawHilma();
  
  //Lines
  stroke(0);
  strokeWeight(1);
  line(random(width), 
       random(height), 
       cw/2 * random(1), ch/3 * random(1));
  
  //Dash Lines
  push();
  strokeWeight(1);
  drawingContext.setLineDash([20, 5, 5, 5, 5, 5, 5, 5]);
  line(random(width), 
       random(height), 
       cw/2 * random(1), ch/3 * random(1));
  line(random(width/2), 
       random(height/2), 
       cw/2 * random(5), ch/3 * random(5));
  pop();
  
  //Circles
  fill(random(255), random(255), random(255));
  circle(random(0, width), random(0, height), 100);
  
  push();
  drawingContext.setLineDash([20, 5, 5, 5, 5, 5, 5, 5]);
  circle(random(0, width), random(0, height), 100);
  pop();

  push();
  stroke(2);
  noFill();
  circle(random(0, width), random(0, height),
         random(100,200));
  pop();
  
  
   // Grainy Texture (see reference)
  if (filterOn){
   let grainImg = createGrainImage(70)
    blendMode(OVERLAY);
  // blendMode(SOFT_LIGHT);
    image(grainImg, 0, 0, width, height);
}
}

  //Background Shapes Function
function drawAbstract(shapeX, shapeY, shapeWidth, shapeHeight) {
  for (let i = 0; i < 3; i++) {
        //loop to draw 3 times
    let x = random(shapeX, shapeX + shapeWidth);
    let y = random(shapeY, shapeY + shapeHeight);
    let w = random(10, 100);
    let h = random(10, 100);
    
    drawAbstractStructure(x, y, w, h); // where's i???
  }
}

function drawAbstractStructure(x, y, w, h) {
  push();
  
  translate(x, y);
  // scale(random(2)); // Scale up for tighter composition
  
  let shapeType = int(random(5)); 
  
  strokeWeight(2);
  stroke(random(255),random(255),random(255));
  fill(random(255),random(255),random(255), random(100, 255));
  
  if (shapeType === 0) {
    circle(0, 0, cw/2);
    circle(0, 0, ch/2);

  } else if (shapeType === 1) {
    ellipse(0, 0, cw, ch);
    ellipse(0, 0, cw, ch);

  } else {
  triangle(0, ch/2+ch/2, cw/6, 0+ch/2, cw/3, ch/2+ch/2);
  triangle(cw*2/3, ch/2+ch/2, cw*5/6, 0+ch/2, cw, ch/2+ch/2);
  }
  
  pop();
}

  // 3 types Hilma Squares Function
function drawHilma() {
  
  for (let x = 30; x < width; x += 50){
    for (let y = 30; y < height; y += 50){
      
    let r = random(1); 

 if (r < 0.33) {
        noStroke();
        sqHilma1(x, y, squareS);
  } else if (r > 0.5) {
        sqHilma2(x, y, squareS);
  } else {
        noStroke();
        sqHilma3(x, y, squareS);
      }
    }
  }  
}

  //Square with inner circle
function sqHilma1(squareX, squareY, squareS){
  fill(210);
  square(squareX, squareY, squareS);
  fill(random(50,255), random(50,255), 
       random(50,255),random(0,255)); // pastel
  circle(squareX, squareY, squareS/2);
}

  //Square with stroke
function sqHilma2 (squareX, squareY, squareS){
  stroke(random(255));
  strokeWeight(squareS/6);
  fill(random(200,255), random(200,255), random(200,255));
  square(squareX, squareY, squareS*3/4);
}

  //Square with 4 inner squares
function sqHilma3 (squareX, squareY, squareS){
  fill(backgroundColor);
  stroke('white');
  strokeWeight(squareS/15);
  square(squareX, squareY, squareS / 2);
  square(squareX + squareS / 2, squareY, squareS / 2);
  square(squareX, squareY + squareS / 2, squareS / 2);
  square(squareX + squareS / 2, 
         squareY + squareS / 2, 
         squareS / 2);
}

  // Grainy texture function
function createGrainImage(n=50) {
  let pd = pixelDensity()
  let img = createImage(width * pd, height * pd)
  img.loadPixels()
  let p = img.pixels
  
  for (let i = 0; i < p.length; i += 4) {
    let v = 127 + round(random(-n / 2, n / 2))
    p[i] = v
    p[i + 1] = v
    p[i + 2] = v
    p[i + 3] = 255
  }
  img.updatePixels()
  return img
}

  //If texture function is on, press to stop the overlay mode
function mousePressed(){
   noLoop();
}

function saveImage() {
  saveCanvas('blinking_art', 'png');
}

/*References
Grainy texture: https://editor.p5js.org/byemiek/sketches/nC4Q7u7mO
We re-used the code for the grainy texture inside this project.
*/

