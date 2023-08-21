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

 
 const draw = (p) => {
  p.background(230, 30, 23);
  //Analyze the audio data that comes in.
  const fftData = fft.analyze();
  let ampSum = 0;
  for (let i = 0; i < fftData.length; i++) {
    ampSum += fftData[i];
  }
  //Calculate the average amplitude of the music
  const avgAmp = ampSum / fftData.length;
 
  //Get the HSL values from the album cover
  let imageHue=hslCode[0];
  let imageSat=hslCode[1]
  let imageLight=hslCode[2]

  let gradient = p.drawingContext.createLinearGradient(
    canvasWidth / 2 - 200, canvasHeight / 2 - 200,
    canvasWidth / 2 + 200, canvasHeight / 2 + 200
  );

  
  //Add the gradient lines to the canvas.  Add modulo 360 cause it's the max value
    let hueStep = imageHue / 3;
    let gradientstop1 = (imageHue - hueStep) % 360;
    let gradientstop2 = (imageHue - 2 * hueStep) % 360;
   
    //Calculate where the stop will be off the gradient. It will use the averageampl to give a value
    let offsetP2=manageOffsets(p.map(avgAmp, 10, 40, 0, 0.2)*2);
    let offsetP3=manageOffsets(p.map(avgAmp, 10, 40, 0.2, 0.4)*2);
    let offsetP4=manageOffsets(p.map(avgAmp, 10, 40, 0.4, 0.6)*2);
    //Check if the offset value stays between 0-1
    function manageOffsets(offset){
    if(offset>=1){
          offset=1;
        }else if(offset<=0){
          offset=0;
        }
        return offset;
    }
    
    //Add the gradients
  gradient.addColorStop(0, `hsl(${(imageHue)}, ${imageSat}%, ${imageLight}%)`);
  gradient.addColorStop(offsetP2, `hsl(${(gradientstop1 )}, ${imageSat}%, ${imageLight}%)`);
  gradient.addColorStop(offsetP3, `hsl(${(gradientstop2)}, ${imageSat}%, ${imageLight}%)`);
  gradient.addColorStop(offsetP4, `hsl(${(imageHue)}, ${imageSat}%, ${imageLight}%)`);
  


  p.drawingContext.fillStyle = gradient;
  p.rect(0, 0, canvasWidth, canvasHeight);
};


  
  return <Sketch className={"z-20"} setup={setup} draw={draw} />;
};

 


export default AudioVisualization;