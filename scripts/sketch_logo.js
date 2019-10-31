let noiseScale=0.02;
var xoff = 0;
var count = 0;
function setup() {
  let cnv = createCanvas(90, 90);
  cnv.parent("logo-animation");
  img = loadImage('logo_transparent.png'); // Load the image
  pixelDensity(1);
}

function draw() {
  background("rgba(255, 255, 255, 0)");

  let img1 = createImage(90, 90);
  img1.loadPixels();
  for (let i = 0; i < img1.width; i++) {
    for (let j = 0; j < img1.height; j++) {
      if (((i-45)**2 + (j-45)**2)**0.5 < 30){
        let noiseVal = noise((count+i)*noiseScale) * 255;
        stroke(noiseVal*255);
        img1.set(i, j, color((noiseVal)*0.3, (noiseVal)*0.6, (noiseVal)*0.2));
      }
    }
  }
  count--;
  img1.updatePixels();
  image(img1, 0, 0);
  image(img, -23, -17, 130, 130);
  
}