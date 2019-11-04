const s2 = ( sketch ) => {
  var canvasDiv = document.getElementById('animation_purpose_unison');
  sketch.preload = () => {
  }
  img = sketch.loadImage('/home/sebastien/Documents/my_first_website/man.svg');
  sketch.setup = () => {
    
    var width = canvasDiv.offsetWidth;
    var height = canvasDiv.offsetHeight;
    let cnv = sketch.createCanvas(width, height);
    sketch.pixelDensity(1);
    
    sketch.draw1();

  }
  sketch.draw1 = () => {
    var width = canvasDiv.offsetWidth;
    var height = canvasDiv.offsetHeight;
    sketch.clear()
    sketch.background('rgba(0, 0, 0, 0)');
    sketch.image(img, 0, 0, 100, 100);
    sketch.stroke(255);
    sketch.line(15*width/100, 30*height/100, 400, 400);
    console.log(15*width/100);
  }


  sketch.resize = () => {
    wanted_width = document.body.clientWidth;
    sketch.draw1();

    // sketch.resizeCanvas(wanted_width, wanted_height, true)
  }


}
// create the canvas with the sketch
var myp52 = new p5(s2, document.getElementById("animation_purpose_unison"));
