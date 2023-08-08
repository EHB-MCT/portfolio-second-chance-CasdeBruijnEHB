// AudioVisualization.js
import React, { useRef, useEffect } from 'react';
import p5 from 'p5';
import "p5/lib/addons/p5.sound";


const AudioVisualization = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const sketch = (p) => {
      let audio, fft;

      p.setup = () => {
        p.createCanvas(400, 200).parent(canvasRef.current);
        audio = new p5.AudioIn(); 
        audio.start();
        fft = new p5.FFT();
        fft.setInput(audio);
      };

      p.draw = () => {
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
    };

    new p5(sketch);

    return () => {
      p5.prototype.remove();
    };
  }, []);

  return <div ref={canvasRef}></div>;
};

export default AudioVisualization;
