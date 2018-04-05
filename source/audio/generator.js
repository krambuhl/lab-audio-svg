import generator from 'audio-generator/direct'
import speaker from 'audio-speaker/direct'
import mtof from 'mtof'
import { throttle } from 'lodash'

import $bus from '../lib/bus'

const τ = Math.PI * 2;

let noteNumber = 440

const throttleLog = throttle((...msg) => console.log(...msg), 250)
const throttleEmit = throttle((...msg) => $bus.emit(...msg), 1000 / 240)

const throttleRandom = throttle(() => Math.random(), 1000 / 4)

const generatorFn = time => {
  let tune = {
    r: mtof(60),
    t: mtof(64),
    f: mtof(69)
  }

  switch (Math.floor(time % 4)) {
    case 0: tune = {
      r: mtof(60),
      t: mtof(63),
      f: mtof(67)
    }; break
    case 1: tune = {
      r: mtof(58),
      t: mtof(62),
      f: mtof(65)
    }; break
    case 2: tune = {
      r: mtof(55),
      t: mtof(59),
      f: mtof(62)
    }; break
    case 3: tune = {
      r: mtof(58),
      t: mtof(63),
      f: mtof(67)
    }; break
  }

  if (
    // true ||
    (time % 1 > 0 && time % 1 < 0.67)
  ) {
    return (
      0
      + Math.sin(τ * time * tune.r)
      + Math.sin(τ * time * tune.r)
      + Math.sin(τ * time * (tune.r * 2))
      + Math.sin(τ * time * (tune.r / 2))
      + Math.cos(τ * time * (tune.r / 4))
      + Math.cos(τ * time * tune.t)
      + Math.cos(τ * time * tune.f)
      + Math.cos(τ * time * tune.f * (1 / 2))
    ) * 0.1
  }

  return 0
}


// panned sine generator
let generate = generator(time => {
  const res = generatorFn(time)
  throttleEmit('generator-bit', { time, res })
  return res
}, { duration: 16 });

let write = speaker();

// hook up generator → speaker loop
(function loop() {
  write(generate(), loop);
})();
