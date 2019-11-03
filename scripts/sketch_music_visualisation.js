// https://p5js.org/reference/#/p5.sound/userStartAudio

const s = ( sketch ) => {
  var index = 0;
  var time = 0;
  var inc = 0.01;


  var wanted_height = 150;
  var wanted_width = document.body.clientWidth;

  var data_resolution = 19;

  var bar_idx = 0;
  var bars = [];

  var micro = undefined;


  let slider;

  var minimum = -50;
  var maximum = 50;
  var avg = 0;

  sketch.setup = () => {
    let cnv = sketch.createCanvas(wanted_width, wanted_height);
    // cnv.parent("myContainer");
    sketch.pixelDensity(1);
    
    sketch.myLoop();

  }


  sketch.myLoop = () => {
    setTimeout(function () {
      // Code is here
      // get the spectrum
      if (typeof micro === 'undefined'){
        if (index >= data.length){index = 0;} //reset the animation at the end
        var spectrum = data[index];
        index++;
      }
      else {
        var spectrum = micro.analyze().map(function(x) { return x * 100; });
      }
      
      
      // initialize things
      sketch.background("rgba(58, 58, 58, 0.01)");
      sketch.colorMode(sketch.HSB, 255, 255, 255);
    
      bar_idx = 0;

      let yoff = 1;
      sketch.loadPixels();

      var temp_min = Math.min.apply(Math, spectrum);
      var temp_max = Math.max.apply(Math, spectrum);
      
      maximum = maximum - ((maximum - temp_max)/5);
      minimum = minimum - ((minimum - temp_min)/5);


      for (let new_x = 0; new_x < sketch.width; new_x += 1) {
        var is_bar = false;
        if (new_x % data_resolution == 0){
          is_bar = true;
          var min_bef = 0;
          var max_bef = wanted_width;
          var min_aft = 0;
          var max_aft = data.length - 40;
          var x_data = Math.round(sketch.map(new_x, min_bef, max_bef, min_aft, max_aft));


          var xoff = 1;

          
          
          

          var bar_height = sketch.map(Math.round(spectrum[x_data]), minimum, maximum, wanted_height, 0);
          if (typeof bars[bar_idx] === 'undefined'){
            bars[bar_idx] = new Bar(sketch.height);
          }
          else{
            bars[bar_idx].update_pixels(bar_height);
          }
          var col = sketch.color(sketch.map(new_x, 0, wanted_width, 0, 235), 255, 255);
          var r = sketch.red(col);
          var g = sketch.green(col);
          var b = sketch.blue(col);
        }
        


        for (let y = sketch.height; y >= 0; y--){
          let index = (new_x + 7 + y * wanted_width) * 4;
          // we their is color only if y > bar_height
          // otherwise it is supposed to be alpha
          if (is_bar == true){
            // noiseDetail(8, 0.65)
            let n = sketch.noise(xoff, yoff, time);

            // n = 0.9;
            let alpha = bars[bar_idx].get_pixel(y);
            sketch.pixels[index + 0] = r;
            sketch.pixels[index + 1] = g;
            sketch.pixels[index + 2] = b;
            sketch.pixels[index + 3] = alpha * (n+0.1);

            xoff += inc;
          }
          else{
            sketch.pixels[index + 3] = 0;
          }
          
          
        }
        yoff += inc;
        bar_idx += 1;
      } 
      time += 0.1;
      sketch.updatePixels();

      // call the function again
      sketch.myLoop();

     }, 10) // delay before executing the function
  }

  sketch.resize = () => {
    wanted_width = document.body.clientWidth;
    wanted_height = 150;
    sketch.resizeCanvas(wanted_width, wanted_height, true)
  }

  function Bar(max_h){
    this.max_h = max_h;
    this.arr = Array(max_h).fill(0);
    this.update_pixels = function(h){
      for (let e = 0; e < this.max_h ; e++){
        if (e > h){
          this.arr[e] += 50;
          if (this.arr[e] >255){this.arr[e] = 255}

        }
        else{
          this.arr[e] -= 50;
          if (this.arr[e] < 0 ){this.arr[e] = 0}
        }
      }
    }
    this.get_pixel = function(y){
      return this.arr[y];
    }
  }


  sketch.try_it = () => {
    if (typeof micro === 'undefined'){
      sketch.userStartAudio().then(function() {
          console.log("audio started");
        });
      mic = new p5.AudioIn();
      mic.start();
        micro = new p5.FFT();
        micro.setInput(mic);
        
    }
    else {
        console.log("audio stopped");
      mic.stop();
      delete mic
      delete micro;
      micro = undefined;
    }
  }

}
// create the canvas with the sketch
var myp5 = new p5(s, document.getElementById("myContainer"));

// handle the resize event from the body
function resize(){
  myp5.resize();
}
