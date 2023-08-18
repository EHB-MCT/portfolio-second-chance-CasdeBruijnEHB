import React from 'react';
import Sketch from 'react-p5';
import 'p5/lib/addons/p5.sound';

const AudioVisualization = () => {
  let audio, fft;

  const setup = (p, canvasParentRef) => {
    const canvasWidth = window.innerWidth;  
    const canvasHeight = window.innerHeight; 
    p.createCanvas(canvasWidth, canvasHeight).parent(canvasParentRef);
    audio = new p5.AudioIn();
    audio.start();
    fft = new p5.FFT(0.8,512);
    fft.setInput(audio); 
  };

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

  return <Sketch setup={setup} draw={draw} />;
};

export default AudioVisualization;