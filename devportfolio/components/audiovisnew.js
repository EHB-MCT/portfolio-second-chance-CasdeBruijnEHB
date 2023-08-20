import React from 'react';
import Sketch from 'react-p5';
import 'p5/lib/addons/p5.sound';

const AudioVisualization = (props) => {
let audio, fft, canvasHeight, canvasWidth, dim;


//First we are getting the RGB color of the most dominant color in the album photo.
  let redColorCode=props.hslColor.color[0];
  let greenColorCode=props.hslColor.color[1]
  let blueColorCode=props.hslColor.color[2];
  //because we are using HSL we are converting it with a script found on https://www.30secondsofcode.org/js/s/rgb-to-hsl/
    const RGBToHSL = (r, g, b) => {
    r /= 255;
    g /= 255;
    b /= 255;
    const l = Math.max(r, g, b);
    const s = l - Math.min(r, g, b);
    const h = s
      ? l === r
        ? (g - b) / s
        : l === g
        ? 2 + (b - r) / s
        : 4 + (r - g) / s
      : 0;
    return [
      60 * h < 0 ? 60 * h + 360 : 60 * h,
      100 * (s ? (l <= 0.5 ? s / (2 * l - s) : s / (2 - (2 * l - s))) : 0),
      (100 * (2 * l - s)) / 2,
    ];
  };
  let hslCode=RGBToHSL(redColorCode,greenColorCode,blueColorCode);
  const setup = (p, canvasParentRef) => {
     canvasWidth = window.innerWidth;  
     canvasHeight = window.innerHeight; 
     dim = canvasWidth / 2
    p.colorMode(p.HSB, 360, 100, 100);
    p.noStroke();
    p.ellipseMode(p.RADIUS);
    p.frameRate(24);


    p.createCanvas(canvasWidth, canvasHeight).parent(canvasParentRef);
    audio = new p5.AudioIn();
    audio.start();
    fft = new p5.FFT(0.8,512);
    fft.setInput(audio); 
  };

  /*
  const draw = (p) => {
    p.background(0);

    const spectrum = fft.analyze();
    p.stroke(255);
    for (var i=0; i<spectrum.length;i++){
      
      var amp=spectrum[i];
      var y = p.map(amp, 0,256, p.height,0);
      console.log(y)
      p.line(i, p.height, i, y);
    }
    p.stroke(255);
    p.noFill();
  };
  */
 
 const draw = (p) => {
  p.background(230, 30, 23);

  const spectrum = fft.analyze();
  let ampSum = 0;

  for (let i = 0; i < spectrum.length; i++) {
    ampSum += spectrum[i];
  }

  const avgAmp = ampSum / spectrum.length;


  //let hueFirst = p.map(avgAmp, 0, 50, 0, 100);
  //let hueSecond = p.map(avgAmp, 0, 100, 0, 360);
  let imageHue=hslCode[0];
  let saturation = p.map(avgAmp, 0, 50, 20, 100); 
  let offset= p.map(avgAmp, 0, 100, 0, 1);
  let offsetP1=p.map(avgAmp, 0, 100, 0, 1);
  console.log("offset: ", offsetP1)
  if(offsetP1>=1){
    offsetP1=1;
  }else if(offsetP1<=0){
    offsetP1=0;
  }

  let gradient = p.drawingContext.createLinearGradient(
    canvasWidth / 2 - 200, canvasHeight / 2 - 200,
    canvasWidth / 2 + 200, canvasHeight / 2 + 200
  );
    /*
    console.log(avgAmp)
    console.log(p.map(avgAmp, 0, 100, 0, 1))
    console.log(offset)
    console.log(offset-0.1)
    console.log(offset+0.1)  
    */
    
  gradient.addColorStop(offsetP1, `hsl(${imageHue}, ${saturation}%, 50%)`);
   //gradient.addColorStop(p.map(avgAmp, 0, 250, 0, 1), `hsl(${hueFirst}, ${saturation}%, 50%)`);
  gradient.addColorStop(1, `hsl(${(imageHue )}, ${saturation}%, 20%)`);

  p.drawingContext.fillStyle = gradient;
  p.rect(0, 0, canvasWidth, canvasHeight);
};
  
  return <Sketch setup={setup} draw={draw} />;
};


export default AudioVisualization;