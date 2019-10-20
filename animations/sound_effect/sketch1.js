let mic, fft;
var validate = true;

var inc = 0.01;
var time = 0;
var record = false;
var bar_width = 10;

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
  if (validate == true){
    validate = false;
    console.log(spectrum)
  } 
  for (i = 0;i < width; i += 1){
    let new_height = map(spectrum[i], 0, 255, height, 0);
    col = color(0, 255, 255)
    stroke(color(map(i, 0, width, 0, 235), 255, 255));

    line(i, height, i, new_height);
  }
  endShape();
  var yoff = 1;
  loadPixels();
  for (var x = 0; x < width; x++) {
    var xoff = 1;
    for (var y = 0; y < height; y++){
      var index = (x + y * width) * 4;
      var r = noise(xoff, yoff, time) * 255;
      pixels[index + 0] *= r/255;
      pixels[index + 1] *= r/255;
      pixels[index + 2] *= r/255;
      xoff += inc;
    }
    yoff += inc;
  }
  time += 0.1;
  if (record) {
    // console.log(pixels.length);
    // console.log("1 est : " + width*height)
    console.log("red : " + red(col) + "green : " + green(col) + "blue : " + blue(col));
  }
  updatePixels();
}

function stop() {
  record = ! record;
}