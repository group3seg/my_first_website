let mic, fft;
// noise.seed(Math.random());
const inc = 0.01;
let time = 0;
var record = false;

function setup() {
  createCanvas(710, 400);
  noFill();

  mic = new p5.AudioIn();
  mic.start();
  fft = new p5.FFT();
  fft.setInput(mic);
}
function draw() {
  background(0);
  colorMode(HSB, 255, 255, 255);
  
  let spectrum = fft.analyze();

  let yoff = 1;
  loadPixels();
  for (let x = 0; x < width; x++) {
    let xoff = 1;
    let bar_height = map(spectrum[x], 0, 255, height, 0);
    let col = color(map(x, 0, width, 0, 235), 255, 255);
    let r = red(col);
    let g = green(col);
    let b = blue(col)

    for (let y = width; y > bar_height; y--){
      let index = (x + y * width) * 4;
      // noiseDetail(8, 0.65)
      let n = noise(xoff, yoff, time);
      // n = 0.9;
      pixels[index + 0] = r * (n+0.1);
      pixels[index + 1] = g * (n+0.1);
      pixels[index + 2] = b * (n+0.1);
      xoff += inc;
    }
    yoff += inc;
  }	
  time += 0.1;
  if (record) {
    // console.log(pixels.length);
    // console.log("1 est : " + width*height)
    // console.log(spectrum)
    console.log("red : " + red(col) + "green : " + green(col) + "blue : " + blue(col));
  }
  updatePixels();
}

function stop() {
  record = ! record;
}