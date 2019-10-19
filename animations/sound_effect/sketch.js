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
    stroke(color(map(i, 0, width, 0, 255), 255, 255));
    line(i, height, i, new_height);
  }
  endShape();
  var yoff = 1;
  loadPixels();
  for (var y = 0; y < height; y++) {
    var xoff = 1;
    for (var x = 0; x < width; x++) {
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
    console.log(pixels.length);
    console.log("1 est : " + width*height)
  }
  updatePixels();
}

function stop() {
  record = ! record;
}