let mic, fft;
var validate = true;

function setup() {
  createCanvas(710, 400);
  noFill();

  mic = new p5.AudioIn();
  mic.start();
  fft = new p5.FFT();
  fft.setInput(mic);
  var a = [];
}

function draw() {
  background(0)
  
  let spectrum = fft.analyze();
  if (validate == true){
    validate = false;
    console.log(spectrum)
  } 
  beginShape();
  for (i = 0;i < spectrum.length; i += 10){
    let new_height = map(spectrum[i], 0, 255, height, 0);
    vertex(i, new_height);
    stroke(color(255, 0, 0));
    line(i, height, i, new_height);
  }
  endShape();
}
