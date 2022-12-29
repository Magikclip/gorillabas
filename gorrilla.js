// Constantes para el tamaño del tablero y los rascacielos
const BOARD_WIDTH = 400;
const BUILDING_WIDTH = 50;
const BUILDING_HEIGHT = 100;

// Constantes para el tamaño y la posición inicial del cañón
const CANNON_WIDTH = 20;
const CANNON_HEIGHT = 30;
const CANNON_X = BUILDING_WIDTH / 2 - CANNON_WIDTH / 2;
const CANNON_Y = BUILDING_HEIGHT - CANNON_HEIGHT;

// Constantes para el tamaño y la posición inicial de los plátanos
const BANANA_WIDTH = 10;
const BANANA_HEIGHT = 10;
const BANANA_X = CANNON_X + CANNON_WIDTH / 2 - BANANA_WIDTH / 2;
const BANANA_Y = CANNON_Y - BANANA_HEIGHT;

// Constantes para la fuerza y el ángulo iniciales del tiro
const INITIAL_FORCE = 50;
const INITIAL_ANGLE = 45;

// Constantes para la gravedad y la resistencia del aire
const GRAVITY = 9.81;
const AIR_RESISTANCE = 0.9;

// Variables para llevar la cuenta de los puntos y las vidas de cada jugador
let player1Points = 0;
let player2Points = 0;
let player1Lives = 3;
let player2Lives = 3;

// Variables para llevar la cuenta del turno y el ángulo y la fuerza del tiro actual
let currentPlayer = 1;
let currentAngle = INITIAL_ANGLE;
let currentForce = INITIAL_FORCE;

// Variables para llevar la cuenta de la posición y la velocidad del plátano en vuelo
let bananaX;
let bananaY;
let bananaVelocityX;
let bananaVelocityY;

// Variable para llevar la cuenta del tiempo transcurrido desde el último tiro
let elapsedTime = 0;

// Función para calcular la trayectoria del tiro en función de la fuerza y el ángulo
function calculateTrajectory() {
  bananaX = BANANA_X;
  bananaY = BANANA_Y;
  bananaVelocityX = currentForce * Math.cos(currentAngle * Math.PI / 180);
  bananaVelocityY = currentForce * Math.sin(currentAngle * Math.PI / 180);
}

// Función para actualizar la posición del plátano en vuelo
function updateBananaPosition(dt) {
    elapsedTime += dt;
    bananaX += bananaVelocityX * dt;
    bananaY += bananaVelocityY * dt;
    bananaVelocityY -= GRAVITY * dt;
    bananaVelocityX *= AIR_RESISTANCE;
    bananaVelocityY *= AIR_RESISTANCE;
  }
  
  // Función para dibujar el tablero y los elementos gráficos del juego
  function draw() {
    // Dibuja los rascacielos
    ctx.fillRect(0, 0, BUILDING_WIDTH, BUILDING_HEIGHT);
    ctx.fillRect(BOARD_WIDTH - BUILDING_WIDTH, 0, BUILDING_WIDTH, BUILDING_HEIGHT);
  
    // Dibuja el cañón
    ctx.fillRect(CANNON_X, CANNON_Y, CANNON_WIDTH, CANNON_HEIGHT);
  
    // Dibuja el plátano en vuelo
    ctx.fillRect(bananaX, bananaY, BANANA_WIDTH, BANANA_HEIGHT);
  }
  
  // Función principal del juego, que se ejecuta en un bucle infinito
  function gameLoop() {
    // Calcula el tiempo transcurrido desde el último frame
    const currentTime = Date.now();
    const dt = (currentTime - lastTime) / 1000;
    lastTime = currentTime;
  
    // Actualiza la posición del plátano en vuelo
    updateBananaPosition(dt);
  
    // Dibuja el juego
    draw();
  
    // Vuelve a llamar a la función gameLoop en el próximo frame
    requestAnimationFrame(gameLoop);
  }
  
  // Inicializa el juego y comienza el bucle principal
  function startGame() {
    calculateTrajectory();
    lastTime = Date.now();
    gameLoop();
  }
  
  // Función para manejar clicks del ratón
function handleMouseClick(event) {
    // Dispara el plátano y cambia el turno al otro jugador
    shootBanana();
    currentPlayer = (currentPlayer % 2) + 1;
  }
  
  // Función para manejar teclas pulsadas
  function handleKeyDown(event) {
    // Cambia el ángulo o la fuerza del tiro según la tecla pulsada
    if (event.keyCode === 37) { // Tecla izquierda
      currentAngle = (currentAngle - 1 + 360) % 360;
    } else if (event.keyCode === 39) { // Tecla derecha
      currentAngle = (currentAngle + 1) % 360;
    } else if (event.keyCode === 38) { // Tecla arriba
      currentForce = Math.min(100, currentForce + 1);
    } else if (event.keyCode === 40) { // Tecla abajo
      currentForce = Math.max(0, currentForce - 1);
    }
  }
  
  // Función para disparar el plátano
  function shootBanana() {
    // Calcula la trayectoria del tiro y reinicia el tiempo transcurrido
    calculateTrajectory();
    elapsedTime = 0;
  }
  
  // Función para actualizar la interfaz de usuario
  function updateUI() {
    // Muestra la información de puntos y vidas de cada jugador
    document.getElementById("player1Points").innerHTML = player1Points;
    document.getElementById("player2Points").innerHTML = player2Points;
    document.getElementById("player1Lives").innerHTML = player1Lives;
    document.getElementById("player2Lives").innerHTML = player2Lives;
  }

  // Función para inicializar el juego
function init() {
    // Obtiene una referencia al elemento canvas y al contexto de dibujo
    canvas = document.getElementById("gameBoard");
    ctx = canvas.getContext("2d");
  
    // Establece la función handleMouseClick como manejador de evento para clicks del ratón
    canvas.addEventListener("click", handleMouseClick);
  
    // Establece la función handleKeyDown como manejador de evento para teclas pulsadas
    document.addEventListener("keydown", handleKeyDown);
  
    // Inicializa la interfaz de usuario
    updateUI();
  
    // Comienza el juego
    startGame();
  }
  
  // Función para detectar cuándo un tiro ha acertado a uno de los gorilas
function checkHit() {
    // Si el plátano ha salido del tablero, no se ha producido ningún impacto
    if (bananaX < 0 || bananaX > BOARD_WIDTH || bananaY < 0) {
      return;
    }
  
    // Calcula si el plátano ha acertado a uno de los gorilas
    let hitBuilding;
    if (bananaX < BUILDING_WIDTH) {
      hitBuilding = 1;
    } else if (bananaX > BOARD_WIDTH - BUILDING_WIDTH) {
      hitBuilding = 2;
    }
  
    // Si no se ha producido ningún impacto, no se hace nada más
    if (!hitBuilding) {
      return;
    }
  
    // Si el plátano ha acertado al edificio, se suma un punto al jugador correspondiente
    // y se resta una vida al gorila impactado
    if (hitBuilding === 1) {
      player1Points++;
      player2Lives--;
    } else {
      player2Points++;
      player1Lives--;
    }
  
    // Si alguno de los gorilas ha perdido todas las vidas, se termina el juego
    if (player1Lives === 0 || player2Lives === 0) {
      alert("¡El juego ha terminado!");
      return;
    }
  
    // Si no se ha terminado el juego, se actualiza la interfaz de usuario y se vuelve a empezar
    updateUI();
    currentPlayer = (currentPlayer % 2) + 1;
  }
  
// Función para detectar cuándo un tiro ha salido del tablero
function checkOutOfBounds() {
    // Si el plátano ha salido del tablero, se termina el turno del jugador actual
    if (bananaY > BUILDING_HEIGHT) {
      currentPlayer = (currentPlayer % 2) + 1;
    }
  }
  