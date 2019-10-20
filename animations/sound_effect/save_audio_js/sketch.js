let mic, fft;
var record = false;
arr = []
function setup() {
  createCanvas(710, 400);
  noFill();

  mic = new p5.AudioIn();
  mic.start();
  fft = new p5.FFT();
  fft.setInput(mic);
}

function draw() {
	let spectrum = fft.analyze();
	if (record){arr.push(spectrum);}


}
function start(){
	record = true;
}

function stop(){
	record = false;
}

function show(){
	for (e of arr){
		document.getElementById("txt").innerHTML += ("[" + arr + "],"); 
	}
	

}