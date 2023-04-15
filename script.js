const canvas = document.createElement('canvas')
const ctx = canvas.getContext('2d')
const genDelay = 25
const cellSize = 12
const bgColor1 = '#22a9'
const bgColor2 = '#33b9'
const cellColor = 'yellow'
const shifts = [[0, -1], [1, -1], [1, 0], [1, 1], [0, 1], [-1, 1], [-1, 0], [-1, -1]]

let timerId, running, rowCount, rowLength, boardWidth, boardHeight
let state = ['3,3', '2,3', '3,2', '3,1', '1,2', '38,37', '39,35', '38,36', '40,36', '40,37', '39,38']
let generation = 1

document.body.append(canvas)
adapt()
playPause()

canvas.onclick = handleClick
window.onresize = adapt

window.onkeydown = e => {
  if (e.code == 'Space') playPause()
}

function adapt() {
  rowCount = innerHeight / cellSize | 0
  rowLength = innerWidth / cellSize | 0
  canvas.width = boardWidth = rowLength * cellSize
  canvas.height = boardHeight = rowCount * cellSize
  render()
}

function render() {
  ctx.fillStyle = bgColor1
  ctx.fillRect(0, 0, boardWidth, boardHeight)

  for (let y = 0; y < rowCount; y++) {
    for (let x = 0; x < rowLength; x++) {
      if (state.includes(`${x},${y}`)) {
        ctx.fillStyle = cellColor
        ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize)
      } else if ((x + y) % 2) {
        ctx.fillStyle = bgColor2
        ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize)
      }
    }
  }
}

function handleClick(e) {
  const x = e.offsetX / cellSize | 0
  const y = e.offsetY / cellSize | 0
  const cell = `${x},${y}`
  const i = state.indexOf(cell)

  if (i == -1) state.push(cell)
  else state.splice(i, 1)

  render()
}

function playPause() {
  if (running) clearInterval(timerId)
  else timerId = setInterval(update, genDelay)

  running = !running
}

function update() {
  state = findPotentCells().filter(cell => {
    const neighbors = getNeighbors(cell)
    const { length } = neighbors.filter(neighbor => state.includes(neighbor))

    return length == 3 || length + state.includes(cell) == 3
  })
  render()
}

function findPotentCells() {
  return state.reduce((cells, cell) => {
    const neighbors = getNeighbors(cell)

    for (const neighbor of neighbors) {
       if (!cells.includes(neighbor)) cells.push(neighbor)
    }
    return cells
  }, [...state])
}

function getNeighbors(cell) {
  const [x, y] = cell.split(',').map(Number)
  
  return shifts.map(
    ([sx, sy]) => `${wrap(x + sx, rowLength)},${wrap(y + sy, rowCount)}`
  )
}

function wrap(pos, limit) {
  return pos < 0 ? limit - 1 : pos > limit - 1 ? 0 : pos
}
