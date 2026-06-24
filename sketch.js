let w;
let h;
let size;
let canvassize = 1000;
let video;
const density = "Ñ@#W9876543210?!abc;:+=-,._ "
const modes = ["ascii","dvd","pixel","rainbow","infrared","video","flip","filters"]
let mode = localStorage.getItem("mode") || modes[2]
let x = 0
let y = 0
let z = 0;
let speed = 100
let vx = 1.5 
let vy = 2  
let p = 0;
let horizonal = true;
let golden = false;
let timerStart;
let videos = [];

let colors_list2;
let color_list;
let color_index = 0
let currentVideo = 0;
let filter_index =0 ;
const colors = [[p,0,0],[0,p,0],[0,0,p]]

function createModeButtons() {
  let xOffset = 10;

  for (let i = 0; i < modes.length; i++) {
    let btn = createButton(modes[i].toUpperCase());
    btn.class("mode-btn");

    btn.position(xOffset, canvassize + 6);

    xOffset += btn.size().width + 6; // tight spacing
    btn.mousePressed(() => {
      localStorage.setItem("mode", modes[i]);
      location.reload();
    });
  }
}

if (mode == "ascii"){
  function setup() {
    size = 100
    canvas = createCanvas(canvassize, canvassize);
    canvas.parent('canvas-holder');
    createModeButtons();
    video = createCapture(VIDEO)
    video.size(size,size)
    video.hide()
    w = width/video.width;
    h = height/video.height;
  }

  function draw() {
    background(0);
    video.loadPixels();
    for (let i=0;i<video.width;i++){
      for (let j=0; j< video.height; j++){
        const pixel_index = (i + j*video.width)*4
        const r = video.pixels[pixel_index +0]
        const g = video.pixels[pixel_index +1]
        const b = video.pixels[pixel_index +2]
        avg = (r + g + b)/3
        noStroke()
        fill(30,avg,30)
        text(density[floor(map(avg,0,255,density.length,0))],i*w+w*0.5,j*h+h*0.5)
      }
    }
  }
}
else if (mode == "dvd"){
  function setup() {
    canvas = createCanvas(canvassize, canvassize);
    canvas.parent('canvas-holder');
    createModeButtons();
    video = createCapture(VIDEO)
    size = 100
    video.size(size,size)
    video.hide()
    w = width/video.width ;
    h = height/video.height ;
  }

  function draw() {
    x += vx
    y += vy
    background(0);
    video.loadPixels();
    if (!golden){
      for (let i=0;i<video.width;i++){
        for (let j=0; j< video.height; j++){
          const pixel_index = (i + j*video.width)*4
          const r = video.pixels[pixel_index +0]
          const g = video.pixels[pixel_index +1]
          const b = video.pixels[pixel_index +2]
          avg = (r + g + b)/3

          const colors = [[avg,50,50],[30,30,(avg+30)%255],[60,avg,60],[avg],[avg,90,50],[avg,75,0],[100,35,avg],[205,avg,10]]
          noStroke()

          fill(...colors[floor(z)%colors.length])
          ellipse((i*2 + x),(j*2 + y),10)
        }
      }
    }
    else{
      if (millis()- timerStart >=10000){
        golden = false
      }
      for (let i=0;i<video.width;i++){
        for (let j=0; j< video.height; j++){
          const pixel_index = (i + j*video.width)*4
          const r = video.pixels[pixel_index +0]
          const g = video.pixels[pixel_index +1]
          const b = video.pixels[pixel_index +2]
          avg = (r + g + b)/3
          noStroke()
          fill(avg,avg,0)
          ellipse((i+x),(j+y),5)
        }
      }
    }
    if (y+size*2 >= height){
      vy *= -1 
      z += 1
    }
    if (x+size*2 >= width){
      vx *= -1 
      z += 1
    }
    if (x <= 0){
      vx *= -1 
      z += 1 * speed
    }
    if (y <= 0){
      vy *= -1 
      z += 1 * speed 
    }
    if (x+size >= width && y+size >= height){
      golden = true
      timerStart = millis()
    }
  }
}
else if (mode == "pixel"){
  function setup() {
    canvas = createCanvas(canvassize, canvassize);
    canvas.parent('canvas-holder');
    createModeButtons();
    size = 80
    video = createCapture(VIDEO)
    video.size(size,size)
    video.hide()
    w = width/video.width;
    h = height/video.height;
    slider = createSlider(1,8);
 
    slider.position(10,height+46);
    slider.size(200);

  }

  function draw() {
    let slider_value = pow(2,slider.value())
    video.size(slider_value,slider_value)
    video.hide()
    background(0);
    video.loadPixels();
    for (let i=0;i<video.width;i++){
      for (let j=0; j< video.height; j++){
        const pixel_index = (i + j*video.width)*4
        const r = video.pixels[pixel_index +0]
        const g = video.pixels[pixel_index +1]
        const b = video.pixels[pixel_index +2]
        avg = (r + g + b)/3
        noStroke()
        fill(r,g,b)
        rect(i*width/slider_value,j*height/slider_value,width/slider_value,height/slider_value)
      }
    }
    fill(255);
    stroke(0);
    strokeWeight(4);
    textSize(24)
    textAlign(RIGHT, BOTTOM)
    text(`${slider_value}x${slider_value}`,1000-1,1000-1)
  }
}
else if (mode == "rainbow") {
  
  function truetofalse() {
    horizonal = (!horizonal);
  }
  function setup() {
    canvas = createCanvas(canvassize, canvassize);
    canvas.parent('canvas-holder');
    createModeButtons();
    video = createCapture(VIDEO)
    size = 1000
    video.size(size,size)
    video.hide()
    w = width/video.width;
    h = height / video.height;
    slider = createSlider(0, 7);
    
    let btn = createButton(`Direction`).mousePressed(() => truetofalse());
    btn.position(220, canvassize + 46);
    btn.class("mode-btn2");
  
 
    slider.position(10,height+46);
    slider.size(200);
    
  }

  function draw() {
    background(0);
    video.loadPixels();
    h6 = height/7
    for (let i=0;i<video.width;i++){
      for (let j=0; j< video.height; j++){
        const pixel_index = (i + j*video.width)*4
        const r = video.pixels[pixel_index +0]
        const g = video.pixels[pixel_index +1]
        const b = video.pixels[pixel_index +2]
        avg = (r + g + b)/3
        colors_list2= [[avg, 10, 10],[avg, avg * 0.647, 10],[avg, avg, 10],[10, avg, 10],[10, 10, avg],[avg * 0.5, avg * 0.2, avg * 1.3],[avg, 10, avg]]
        noStroke()
        if (horizonal) {
          height_j = i * w + 0.5 * w
        }
        else { 
          height_j = j * h + 0.5 * h
        }

        for (let k = 0; k < 7; k++) {
          if (k*h6 <= height_j && height_j <= h6*(k+1)) {
            video.pixels[pixel_index] = colors_list2[(k + slider.value())%7][0]
            video.pixels[pixel_index + 1] = colors_list2[(k + slider.value())%7][1]
            video.pixels[pixel_index + 2] = colors_list2[(k + slider.value())%7][2]
          }
        }
      }
    }
    video.updatePixels()

 
    image(video,0,0)
  }
}
else if (mode == "infrared"){
  function setup() {
    canvas = createCanvas(canvassize, canvassize);
    canvas.parent('canvas-holder');
    createModeButtons();
    video = createCapture(VIDEO)
    size = 1000
    video.size(size,size)
    video.hide()
    
   
   

    for (let i =0;i<9;i++) {
      let btn = createButton(`Color ${i+1}`).mousePressed(() => switchColor(i));
      btn.position(10 + i * 80, canvassize + 46);
      btn.class("mode-btn2");
    }
    w = width/video.width;
    h = height/video.height;
  }
  function switchColor(index){
    color_index = index;
  }
  function draw() {
    background(0);
    video.loadPixels();
    let avg ;
    
    for (let i=0;i<video.width;i++){
      for (let j=0; j< video.height; j++){
        const pixel_index = (i + j*video.width)*4
        const r = video.pixels[pixel_index +0]
        const g = video.pixels[pixel_index +1]
        const b = video.pixels[pixel_index +2]
        avg = (r+g+b)/3
       
        color_list= [[r,g,b],[avg,50,70],[45,avg,40],[45,45,avg],[avg,avg,30],[0,avg,avg*1.3],[avg,avg,avg],[255-r,255-g,255-b],
        [min(r-avg+30,255),min(g-avg+30,255),min(30+b-avg,255)]]
       
       
       
        video.pixels[pixel_index] = color_list[color_index][0]
        video.pixels[pixel_index+1] = color_list[color_index][1]
        video.pixels[pixel_index+2] = color_list[color_index][2]
        
      }
    }
   
    video.updatePixels()

 
    image(video,0,0)
  }
}
else if (mode == "video"){
  function preload() {
    //credits https://www.youtube.com/watch?v=xCWt22dv5RY
    let names = ["OmeTV-Loading.mp4","Cat_Bongo.mp4","Freddy.mp4"]
    for (let i=0;i<names.length;i++) {
      videos[i] = createVideo("videos/"+names[i]);
      videos[i].hide()
      
    }
  }
  function setup() {
    canvas = createCanvas(canvassize, canvassize);
    canvas.parent('canvas-holder');
    createModeButtons();

    videos.unshift(createCapture(VIDEO))
    
    videos[0].hide()
    for (let i =0;i<videos.length;i++) {
      let btn;
      if (i==0) {
        btn =createButton(`Camera`).mousePressed(() => switchVideo(i));
      }
      else{
        btn = createButton(`Video ${i}`).mousePressed(() => switchVideo(i));
      }
      btn.class("mode-btn2");
      btn.position(10 + i * 80, canvassize + 46);
    }
    
  }

  function draw() {
    background(0);
    if (videos[currentVideo] == videos[3]) {
      videos[currentVideo].volume(0);
    }
    else {
      videos[currentVideo].volume(1);
    }
    image(videos[currentVideo],0,0,width,height)
    
  }
  function switchVideo(index) {
    videos[currentVideo].time(0)
    videos[currentVideo].pause();

    currentVideo = index;

    videos[currentVideo].loop();
}
}
else if (mode == "flip"){
  function setup() {
    canvas = createCanvas(canvassize, canvassize);
    canvas.parent('canvas-holder');
    createModeButtons();
    size = 1000
    video = createCapture(VIDEO)
    video.size(size,size)
    video.hide()
    
    slider = createSlider(0,4,0);
    angles = [0,Math.PI/2,Math.PI,Math.PI*3/2,0]
    slider.position(10,height+46);
    slider.size(200);
  }

  function draw() {
   
   
    
    background(0,100,100);
    translate(width/2, height/2)
    rotate(angles[slider.value()])
 
    fill(255);
   
    image(video,-width/2,-height/2,width,height)
  }
}else if (mode == "filters"){
  function setup() {
    canvas = createCanvas(canvassize, canvassize);
    canvas.parent('canvas-holder');
    createModeButtons();
    size = 1000
    video = createCapture(VIDEO)
    video.size(size,size)
    video.hide()
    for (let i =0;i<5;i++) {
      let btn;
      if (i==0){
        btn = createButton(`Camera`).mousePressed(() => switchVideo(i));
      }
      else {
        btn = createButton(`Filters ${i}`).mousePressed(() => switchVideo(i));
      }
      btn.class("mode-btn2");
      btn.position(10 + i * 80, canvassize + 46);
    }
    
  }

  function draw() {
    background(0);
    video.loadPixels();
    if (filter_index == 1){
      for (let i=0;i<video.width;i++){
        for (let j=0; j< video.height; j++){
          let pixel_index 
          let original_pixel=(((i) + j*video.width)*4) 
          if (i < video.width/2){
            pixel_index= ((i) + j*video.width)*4
            
          }else{
            pixel_index = ((width-(i)) + j*video.width)*4
          }
          const r = video.pixels[pixel_index +0]
          const g = video.pixels[pixel_index +1]
          const b = video.pixels[pixel_index +2]
          avg = (r+g+b)/3
          video.pixels[original_pixel] = r
          video.pixels[original_pixel+1] = g
          video.pixels[original_pixel+2] = b
          
        }
      } 
    }
    else if (filter_index == 2){
      for (let i=0;i<video.width;i++){
        for (let j=0; j< video.height; j++){
          let pixel_index 
          let original_pixel=(((i) + j*video.width)*4) 
          if (j < video.height/2){
            pixel_index= ((i) + j*video.width)*4
            
          }else{
            pixel_index = ((i) + ((height-j))*video.width)*4
          }
          const r = video.pixels[pixel_index +0]
          const g = video.pixels[pixel_index +1]
          const b = video.pixels[pixel_index +2]
          avg = (r+g+b)/3
          video.pixels[original_pixel] = r
          video.pixels[original_pixel+1] = g
          video.pixels[original_pixel+2] = b
          
        }
      }
    }
  else if (filter_index == 3) {
        for (let i=0;i<video.width;i++){
          for (let j=0; j< video.height; j++){
            let pixel_index 
            let original_pixel=(((i) + j*video.width)*4) 
            if (i > video.width/2){
              pixel_index= ((i-video.width/2) + j*video.width)*4
              
            }else{
              pixel_index =  (video.width/2-(i) + j*video.width)*4
            }
            const r = video.pixels[pixel_index +0]
            const g = video.pixels[pixel_index +1]
            const b = video.pixels[pixel_index +2]
            avg = (r+g+b)/3
            video.pixels[original_pixel] = r
            video.pixels[original_pixel+1] = g
            video.pixels[original_pixel+2] = b
            
          }
        }
      }
    else if (filter_index ==4){
      for (let i=0;i<video.width;i++){
        for (let j=0; j< video.height; j++){
          let pixel_index 
          let original_pixel=(((i) + j*video.width)*4) 
          if (j < video.height/2){
            if (i < video.width/2){
              pixel_index= ((i) + j*video.width)*4
            }
            else{
              pixel_index= ((i-width/2) + j*video.width)*4
            }
            
          }else{
            if (i < video.width/2){
              pixel_index = ((i) + ((j-height/2))*video.width)*4
            }
            else{
              pixel_index= ((i-width/2) + ((j-height/2))*video.width)*4
            }
            
          }
          const r = video.pixels[pixel_index +0]
          const g = video.pixels[pixel_index +1]
          const b = video.pixels[pixel_index +2]
          avg = (r+g+b)/3
          video.pixels[original_pixel] = r
          video.pixels[original_pixel+1] = g
          video.pixels[original_pixel+2] = b
          
        }
      }
    }
    
    
    video.updatePixels()
    image(video,0,0)
  }
  function switchVideo(index) {
    filter_index = index;
}
}
