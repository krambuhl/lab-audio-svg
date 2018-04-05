import $bus from './lib/bus'

export default class {
  constructor ({ el }) {
    this.el = el
    this.list = [{
      time: 0,
      res: window.innerHeight / 2
    }]

    this.groupEl = document.createElement('g')
    this.pathEl = document.createElement('path')

    this.el.append(this.groupEl)
    this.groupEl.append(this.pathEl)

    this.mounted()
  }

  mounted () {
    $bus.on('generator-bit', ({ time, res }) => {
      const last = this.list[this.list.length - 1]
      this.list.push({
        time: parseInt(time * 100, 10),
        res: parseInt(res * window.innerHeight / 1.5 + window.innerHeight / 2, 10)
      })
      this.path = this.createPath()

      this.update()
    })
  }

  createPath () {
    return this.list.reduce((path, { time, res }) => {
      return `${path} L ${time} ${res}`
    }, 'M 0 400')
  }

  update () {
    this.pathEl.setAttribute('d', this.path)
  }
}
