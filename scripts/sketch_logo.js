const s1 = ( sketch ) => {
  let noiseScale=0.1;
  let xoff = 0;
  let count = 0;
  let w = 65;
  let h = 65;

  sketch.setup = () => {
    sketch.createCanvas(w, h);
    // img = sketch.loadImage('logo_transparent.png'); // Load the image
    sketch.pixelDensity(1);
  }

  sketch.draw = () => {
    sketch.background("rgba(255, 255, 255, 0)");
    let animate;
    if (sketch.mouseX <= 197.25 && sketch.mouseY <= 83){
      animate = true;
    }
    else {
      animate = false;
    }
    let img1 = sketch.createImage(w, h);
    img1.loadPixels();
    for (let i = 0; i < img1.width; i++) {
      for (let j = 0; j < img1.height; j++) {
        if (((i-(43))**2 + (j-(38))**2)**0.5 < w/3.5){
          if (animate){
            let noiseVal = sketch.noise((count+i)*noiseScale) * 255;
            img1.set(i, j, sketch.color((noiseVal)*0.9, (noiseVal)*0.9, (noiseVal)*0.9));
          }
          
        }
      }
    }
    count = count-1.2;
    img1.updatePixels();
    sketch.image(img1, 0, 0);
    // sketch.image(img, -23, -17, 130, 130);
    
  }
}

logo_p5 = new p5(s1, document.getElementById("div_sketch_logo"));