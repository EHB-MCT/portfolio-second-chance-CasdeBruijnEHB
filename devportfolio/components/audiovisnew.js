import React from 'react';
import Sketch from 'react-p5';
import 'p5/lib/addons/p5.sound';

const AudioVisualization = () => {
  let audio, fft;

  const setup = (p, canvasParentRef) => {
    p.createCanvas(400, 200).parent(canvasParentRef);
    audio = new p5.AudioIn();
    audio.start();
    fft = new p5.FFT();
    fft.setInput(audio);
  };

  const draw = (p) => {
    p.background(0);

    const waveform = fft.waveform();

    p.noFill();
    p.beginShape();
    p.stroke(255);
    p.strokeWeight(2);
    for (let i = 0; i < waveform.length; i++) {
      const x = p.map(i, 0, waveform.length, 0, p.width);
      const y = p.map(waveform[i], -1, 1, p.height, 0);
      p.vertex(x, y);
    }
    p.endShape();
  };

  return <Sketch setup={setup} draw={draw} />;
};

export default AudioVisualization;