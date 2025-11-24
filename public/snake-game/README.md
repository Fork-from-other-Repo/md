# Snake Game

A fully functional snake game built with HTML5 Canvas and vanilla JavaScript.

## Features

- **Classic gameplay mechanics**: Snake moves continuously, grows when eating food, and dies on collision
- **HTML5 Canvas rendering**: Smooth graphics with grid layout
- **Dual control schemes**: Use Arrow Keys or WASD to control the snake
- **Random food spawning**: Food appears randomly on the game board
- **Score tracking**: Score increases with each food pellet eaten
- **Collision detection**: Game ends when snake hits walls or itself
- **Game restart**: Press Space or click the Restart button to play again
- **Responsive design**: Works on different screen sizes
- **Visual polish**: Snake has animated eyes that face the direction of movement

## How to Play

1. Open `index.html` in a web browser
2. Use the **Arrow Keys** or **WASD** to control the snake's direction:
   - **Up Arrow** or **W**: Move up
   - **Down Arrow** or **S**: Move down
   - **Left Arrow** or **A**: Move left
   - **Right Arrow** or **D**: Move right
3. Eat the red food pellets to grow your snake and increase your score
4. Avoid hitting the walls or your own tail
5. Press **Space** or click the **Restart** button to restart the game at any time

## Game Configuration

The game uses the following constants (defined in `snake.js`):

- `GRID_SIZE`: 20 (20×20 grid)
- `CELL_SIZE`: 20 pixels per cell
- `MOVE_INTERVAL_MS`: 110 milliseconds between moves

You can adjust these values to change the game's difficulty or appearance.

## File Structure

```
snake-game/
├── index.html    # Main HTML file with canvas element
├── styles.css    # Styling and layout
├── snake.js      # Game logic and rendering
└── README.md     # This file
```

## Technical Details

- **No dependencies**: Pure vanilla JavaScript, no frameworks or libraries
- **requestAnimationFrame**: Smooth game loop using browser animation API
- **Modular design**: Clean separation of game logic, rendering, and input handling
- **Collision handling**: Proper collision detection for walls and self-collision
- **Food spawning**: Smart algorithm ensures food never spawns on the snake

## Browser Compatibility

Works in all modern browsers that support:

- HTML5 Canvas
- ES6 JavaScript (Classes, const/let, arrow functions, etc.)
- requestAnimationFrame API

## License

This snake game is part of the md WeChat Markdown editor project.
