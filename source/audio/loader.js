import MidiPlayer from 'midi-player-js'
import $bus from '../lib/bus'

// const fileUrl = '/assets/9-4-KARS.midi'
const fileUrl = '/assets/EDGE1.midi'
const Player = new MidiPlayer.Player((event) => {
  $bus.emit('player-event', event)
})

fetch(fileUrl)
  .then(res => res.arrayBuffer())
  .then((buffer) => {
    Player
      .loadArrayBuffer(buffer)
      .play()
  })
  .catch(console.log)
