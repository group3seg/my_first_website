// https://p5js.org/reference/#/p5.sound/userStartAudio

const s = ( sketch ) => {
  var index = 0;
  var time = 50;
  var inc = 0.01;

  let unison_trigger_animation = false;
  let unison_finish_animation = false;
  let unison_animation = false;

  var wanted_height = 150;
  var wanted_width = document.body.clientWidth;

  var data_resolution = 9;

  var bar_idx = 0;
  var bars = [];

  var micro = undefined;




  var minimum = -50;
  var maximum = 50;


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
        /* if the micro is undefined then get the data from the data variable */
        if (index >= data.length){index = 0;} //reset the animation at the end
        var spectrum = data[index];
        index++; // increase the time
      }
      else {
        var spectrum = micro.analyze().map(function(x) { return x * 100; }); // take the spectrum form the mic if we can
      }
      
      
      // initialize things
      //sketch.background("rgba(58, 58, 58, 0)"); // do noting because we edit the pixels after
      sketch.colorMode(sketch.HSB, 255, 255, 255);
    
      bar_idx = 0;

      let yoff = 1;
      sketch.loadPixels(); //loads all the pixels and store them in the sketch.pixels variable

      // minimum and maximum values of the spectrum
      var temp_min = Math.min.apply(Math, spectrum);
      var temp_max = Math.max.apply(Math, spectrum);
      
      // change progressively the maximum and minimum variables
      maximum = maximum - ((maximum - temp_max)/5);
      minimum = minimum - ((minimum - temp_min)/5);

      // if need to show the text
      if (Math.round((time+5)*100)/100 == 60){
        unison_trigger_animation = true;
        unison_animation = true;
        unison_finish_animation = false;
      }
      // if we want to end the text and show the music spectrum
      else if (time >= 65){
        time = 0;
        // for memory
        xoff = 0;
        yoff = 0;

        unison_animation = false;
        unison_trigger_animation = false;
        unison_finish_animation = true;
      }
      // we want to show the spectrum
      else {
        unison_trigger_animation = false;
        unison_finish_animation = false;
        unison_animation = false;
      }
      
      // loop over each pexels on the x axis
      for (let new_x = 0; new_x < sketch.width; new_x += 1) {
        var is_bar = false;

        // if the pixel is part of vertical line
        if (new_x % data_resolution == 0){
          is_bar = true;

          // get the index of the value we want in the data array
          var min_bef = 0;
          var max_bef = wanted_width;
          var min_aft = 0;
          var max_aft = data.length - 40;
          var x_data = Math.round(sketch.map(new_x, min_bef, max_bef, min_aft, max_aft));


          var xoff = 1;

          // get the height of the bar
          var bar_height = sketch.map(Math.round(spectrum[x_data]), minimum, maximum, wanted_height, 0);
          
          // if it is the first time we run the code and the list of bars is not made yet
          if (typeof bars[bar_idx] === 'undefined'){
            let vertical_arr_unison = Array();

            // fill the binary array that will contain all the necessary values for each Bar object to show the unison text on the screen
            let y = Math.round(sketch.map(new_x, 0, sketch.width, 0, data1[0].length-1));
            for (let height_unison = 0; height_unison < sketch.height; height_unison++){
              let x = Math.round(sketch.map(height_unison, 0, sketch.height, 0, data1.length-1));
              vertical_arr_unison[height_unison] = data1[x][y]; // for the unison animation
            }
            
            // create Bar object and put it into the bars array
            bars[bar_idx] = new Bar(sketch.height, vertical_arr_unison, bar_idx);
          }
          // if the bar is already defined
          // we want to update the status of the bar
          else{
            // check if the trigger_animation event is triggered
            if (unison_trigger_animation){
              // change the state
              bars[bar_idx].state = 1
            }
            else {
              // check if the finish_animation event is triggered
              if(unison_finish_animation == true){
                // change the state
                bars[bar_idx].state = 4;
              }
            }
            // update the bar
            bars[bar_idx].update_pixels_with_state(bar_height);
            
          }

          // get the HSB color of the bar according to his location in the canvas
          var col = sketch.color(sketch.map(new_x, 0, wanted_width, 0, 235), 255, 255);
          // convert this color into the rgb colorspace
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

  function Bar(max_h, animation_array, wait_time){
    this.max_h = max_h;
    this.animation_array = animation_array;
    this.arr = Array(max_h).fill(0);
    this.h = 0;
    this.state = 0;
    this.wait_time = wait_time
    this.count_wait_time = 0
    this.speed = 10;

    /*
    State 0 ; Update everything without the unison text
    State 1 : Lower the bar. When done, go to state 2
    State 2 : Rase the bar to max with the unsion text
    State 4 : Stay up and wait for a while. When ready, lower the bar. After, go to state 3
    State 3 : Lower the bar to the value of the spectrum and go to state 0
    */

    // function that handle the update of the bar
    this.update_pixels_with_state = function(h){
      // default state
      if (this.state == 0){
        this.h = h;
        this.update_pixels();
      }
      else if (this.state == 1){
        this.h = this.h + this.speed;
        this.update_pixels();
        if (this.h >= this.max_h) {
          this.state = 2;
        }
      }
      else if (this.state == 2) {
        this.h = this.h - this.speed;
        this.update_pixels_with_unison();
        if (this.h < 0) {this.h = 0}
      }
      else if (this.state == 3) {
        this.h = this.h + this.speed;
        this.update_pixels_with_unison();
        if (this.h >= this.max_h) {
          this.state = 0;
        }
      }
      else if (this.state == 4) {
        this.h = this.h - this.speed;
        this.update_pixels_with_unison();
        if (this.h < 0) {this.h = 0}
        this.count_wait_time += 60;
        if (this.count_wait_time >= this.wait_time){
          this.count_wait_time = 0;
          this.state = 3;
        }
      }
    }
    // default function to update each pixels without the unison text
    this.update_pixels = function() {
      for (let e = 0; e < this.max_h ; e++){
        if (e > this.h) {
          this.arr[e] += 50;
          if (this.arr[e] >255){this.arr[e] = 255}
        }
        else {
          this.arr[e] -= 50;
          if (this.arr[e] < 0 ){this.arr[e] = 0}
        }
      }
    }
    // default funcion to update each pixels with the unison text
    this.update_pixels_with_unison = function() {
      for (let e = 0; e < this.max_h ; e++){
        if (e > this.h) {
          this.arr[e] = 255 - (255 * this.animation_array[e]);
          if (this.arr[e] >255){this.arr[e] = 255}
        }
        else {
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
      document.getElementById("btn-try-animation").innerHTML = "STOP";
        
    }
    else {
      console.log("audio stopped");
      mic.stop();
      delete mic
      delete micro;
      micro = undefined;
      document.getElementById("btn-try-animation").innerHTML = "TRY THE ANIMATION YOURSELF";
    }
  }

}
// create the canvas with the sketch
var myp5 = new p5(s, document.getElementById("myContainer"));

// handle the resize event from the body
function resize(){
  myp5.resize();
}

function try_it(){
  myp5.try_it();
}
