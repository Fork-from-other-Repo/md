const GRID_SIZE = 20
const CELL_SIZE = 20
const BOARD_SIZE = GRID_SIZE * CELL_SIZE
const MOVE_INTERVAL_MS = 110

const DIRECTIONS = Object.freeze({
  UP: Object.freeze({ x: 0, y: -1 }),
  DOWN: Object.freeze({ x: 0, y: 1 }),
  LEFT: Object.freeze({ x: -1, y: 0 }),
  RIGHT: Object.freeze({ x: 1, y: 0 }),
})

const KEY_BINDINGS = {
  ArrowUp: DIRECTIONS.UP,
  ArrowDown: DIRECTIONS.DOWN,
  ArrowLeft: DIRECTIONS.LEFT,
  ArrowRight: DIRECTIONS.RIGHT,
  w: DIRECTIONS.UP,
  s: DIRECTIONS.DOWN,
  a: DIRECTIONS.LEFT,
  d: DIRECTIONS.RIGHT,
}

class SnakeGame {
  constructor() {
    this.canvas = document.getElementById(`game-board`)
    this.ctx = this.canvas.getContext(`2d`)
    this.scoreElement = document.getElementById(`score-value`)
    this.restartButton = document.getElementById(`restart-btn`)

    this.snake = []
    this.direction = DIRECTIONS.RIGHT
    this.pendingDirection = DIRECTIONS.RIGHT
    this.food = null
    this.score = 0
    this.lastFrameTime = 0
    this.isRunning = false
    this.isGameOver = false
    this.didWin = false
    this.animationFrameId = null

    this.handleKeydown = this.handleKeydown.bind(this)
    this.loop = this.loop.bind(this)

    document.addEventListener(`keydown`, this.handleKeydown)
    this.restartButton.addEventListener(`click`, () => this.restart())

    this.restart()
  }

  restart() {
    this.stop()
    this.snake = [
      { x: 8, y: 10 },
      { x: 7, y: 10 },
      { x: 6, y: 10 },
    ]
    this.direction = DIRECTIONS.RIGHT
    this.pendingDirection = DIRECTIONS.RIGHT
    this.score = 0
    this.isGameOver = false
    this.didWin = false
    this.lastFrameTime = 0
    this.food = this.spawnFood()
    this.updateScore()
    this.draw()
    this.isRunning = true
    this.animationFrameId = requestAnimationFrame(this.loop)
  }

  stop() {
    this.isRunning = false
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId)
      this.animationFrameId = null
    }
  }

  handleKeydown(event) {
    if (event.code === `Space`) {
      event.preventDefault()
      this.restart()
      return
    }

    if (this.isGameOver) {
      return
    }

    const rawKey = event.key
    const normalizedKey = rawKey.length === 1 ? rawKey.toLowerCase() : rawKey
    const nextDirection = KEY_BINDINGS[normalizedKey]

    if (!nextDirection) {
      return
    }

    const isOpposite
      = this.direction.x === -nextDirection.x
        && this.direction.y === -nextDirection.y

    if (isOpposite) {
      return
    }

    this.pendingDirection = nextDirection
    event.preventDefault()
  }

  loop(timestamp) {
    if (!this.isRunning) {
      return
    }

    if (!this.lastFrameTime) {
      this.lastFrameTime = timestamp
    }

    if (timestamp - this.lastFrameTime >= MOVE_INTERVAL_MS) {
      this.lastFrameTime = timestamp
      this.step()
    }

    if (this.isRunning) {
      this.animationFrameId = requestAnimationFrame(this.loop)
    }
  }

  step() {
    const head = { ...this.snake[0] }
    head.x += this.pendingDirection.x
    head.y += this.pendingDirection.y

    const isEating = this.food && head.x === this.food.x && head.y === this.food.y

    if (this.didCollide(head, Boolean(isEating))) {
      this.finish(false)
      return
    }

    this.direction = this.pendingDirection
    this.snake.unshift(head)

    if (isEating) {
      this.score += 1
      this.updateScore()
      this.food = this.spawnFood()
      if (!this.food && this.snake.length === GRID_SIZE * GRID_SIZE) {
        this.finish(true)
        return
      }
    }
    else {
      this.snake.pop()
    }

    this.draw()
  }

  didCollide(position, willGrow) {
    if (
      position.x < 0
      || position.x >= GRID_SIZE
      || position.y < 0
      || position.y >= GRID_SIZE
    ) {
      return true
    }

    // When the snake does not grow we can ignore the current tail, because it moves away.
    const body = willGrow ? this.snake : this.snake.slice(0, -1)
    return body.some(
      segment => segment.x === position.x && segment.y === position.y,
    )
  }

  spawnFood() {
    if (this.snake.length >= GRID_SIZE * GRID_SIZE) {
      return null
    }

    const occupied = new Set(
      this.snake.map(segment => `${segment.x},${segment.y}`),
    )

    let food
    do {
      food = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      }
    } while (occupied.has(`${food.x},${food.y}`))

    return food
  }

  updateScore() {
    this.scoreElement.textContent = this.score
  }

  draw() {
    this.ctx.fillStyle = `#020617`
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height)

    this.drawGrid()
    if (this.food) {
      this.drawFood()
    }
    this.drawSnake()

    if (this.isGameOver) {
      this.drawGameOver()
    }
  }

  drawGrid() {
    this.ctx.strokeStyle = `rgba(148, 163, 184, 0.08)`
    this.ctx.lineWidth = 1

    for (let i = 1; i < GRID_SIZE; i += 1) {
      const coord = i * CELL_SIZE
      this.ctx.beginPath()
      this.ctx.moveTo(coord, 0)
      this.ctx.lineTo(coord, BOARD_SIZE)
      this.ctx.stroke()

      this.ctx.beginPath()
      this.ctx.moveTo(0, coord)
      this.ctx.lineTo(BOARD_SIZE, coord)
      this.ctx.stroke()
    }
  }

  drawSnake() {
    this.snake.forEach((segment, index) => {
      const isHead = index === 0
      this.ctx.fillStyle = isHead ? `#facc15` : `#22c55e`

      this.ctx.fillRect(
        segment.x * CELL_SIZE + 2,
        segment.y * CELL_SIZE + 2,
        CELL_SIZE - 4,
        CELL_SIZE - 4,
      )

      if (isHead) {
        this.drawEyes(segment)
      }
    })
  }

  drawEyes(head) {
    this.ctx.fillStyle = `#0f172a`
    const eyeSize = 3
    const offset = 6

    if (this.direction === DIRECTIONS.RIGHT) {
      this.drawEye(head.x, head.y, CELL_SIZE - offset, offset, eyeSize)
      this.drawEye(head.x, head.y, CELL_SIZE - offset, CELL_SIZE - offset - eyeSize, eyeSize)
    }
    else if (this.direction === DIRECTIONS.LEFT) {
      this.drawEye(head.x, head.y, offset - eyeSize, offset, eyeSize)
      this.drawEye(head.x, head.y, offset - eyeSize, CELL_SIZE - offset - eyeSize, eyeSize)
    }
    else if (this.direction === DIRECTIONS.UP) {
      this.drawEye(head.x, head.y, offset, offset - eyeSize, eyeSize)
      this.drawEye(
        head.x,
        head.y,
        CELL_SIZE - offset - eyeSize,
        offset - eyeSize,
        eyeSize,
      )
    }
    else if (this.direction === DIRECTIONS.DOWN) {
      this.drawEye(head.x, head.y, offset, CELL_SIZE - offset, eyeSize)
      this.drawEye(
        head.x,
        head.y,
        CELL_SIZE - offset - eyeSize,
        CELL_SIZE - offset,
        eyeSize,
      )
    }
  }

  drawEye(cellX, cellY, offsetX, offsetY, size) {
    this.ctx.fillRect(
      cellX * CELL_SIZE + offsetX,
      cellY * CELL_SIZE + offsetY,
      size,
      size,
    )
  }

  drawFood() {
    this.ctx.fillStyle = `#ef4444`
    this.ctx.beginPath()
    this.ctx.arc(
      this.food.x * CELL_SIZE + CELL_SIZE / 2,
      this.food.y * CELL_SIZE + CELL_SIZE / 2,
      CELL_SIZE / 2 - 4,
      0,
      Math.PI * 2,
    )
    this.ctx.fill()
  }

  drawGameOver() {
    this.ctx.fillStyle = `rgba(2, 6, 23, 0.82)`
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height)

    this.ctx.fillStyle = this.didWin ? `#22c55e` : `#ef4444`
    this.ctx.font = `bold 32px 'Segoe UI', sans-serif`
    this.ctx.textAlign = `center`
    this.ctx.textBaseline = `middle`
    this.ctx.fillText(
      this.didWin ? `You Win!` : `Game Over`,
      this.canvas.width / 2,
      this.canvas.height / 2 - 16,
    )

    this.ctx.fillStyle = `#e2e8f0`
    this.ctx.font = `16px 'Segoe UI', sans-serif`
    this.ctx.fillText(
      `Press Restart or Space to play again`,
      this.canvas.width / 2,
      this.canvas.height / 2 + 20,
    )
  }

  finish(didWin) {
    this.didWin = didWin
    this.isGameOver = true
    this.isRunning = false
    this.draw()
  }
}

window.snakeGame = new SnakeGame()
