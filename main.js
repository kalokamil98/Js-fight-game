const canvas = document.querySelector("canvas");

const c = canvas.getContext("2d");

canvas.width = 1074;
canvas.height = 576;

c.fillRect(0, 0, canvas.width, canvas.height);

const gravity = 0.5;

// ! Sprite class definiton

class Sprite {
  constructor({ position, velocity, color = "red", offset }) {
    this.position = position;
    this.velocity = velocity;
    this.width = 50;
    this.height = 150;
    this.lastKey;
    this.attackBox = {
      position: {
        x: this.position.x,
        y: this.position.y,
      },
      offset,
      height: 50,
      width: 100,
    };
    this.color = color;
    this.isAttacking;
  }
  draw() {
    c.fillStyle = this.color;
    c.fillRect(this.position.x, this.position.y, this.width, this.height);

    // attack box
    if (this.isAttacking) {
      c.fillStyle = "green";
      c.fillRect(
        this.attackBox.position.x,
        this.attackBox.position.y,
        this.attackBox.width,
        this.attackBox.height
      );
    }
  }
  update() {
    this.draw();
    this.attackBox.position.x = this.position.x + this.attackBox.offset.x;
    this.attackBox.position.y = this.position.y;

    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
    if (this.position.y + this.height + this.velocity.y >= canvas.height)
      this.velocity.y = 0;
    else {
      this.velocity.y += gravity;
    }
  }
  attack() {
    this.isAttacking = true;
    setTimeout(() => {
      this.isAttacking = false;
    }, 100);
  }
}

//  !Create Player object

const player = new Sprite({
  position: {
    x: 0,
    y: 0,
  },
  velocity: {
    x: 0,
    y: 0,
  },
  offset: {
    x: 0,
    y: 0,
  },
});

//  !Create enemy object

const enemy = new Sprite({
  position: {
    x: 400,
    y: 100,
  },
  velocity: {
    x: 0,
    y: 0,
  },
  color: "blue",
  offset: {
    x: -50,
    y: 0,
  },
});

const keys = {
  a: {
    pressed: false,
  },
  d: {
    pressed: false,
  },
  w: {
    pressed: false,
  },
  ArrowLeft: {
    pressed: false,
  },

  ArrowRight: {
    pressed: false,
  },
};

//  !Animation function fire every time

function animate() {
  window.requestAnimationFrame(animate);
  c.fillStyle = "black";
  c.fillRect(0, 0, canvas.width, canvas.height);
  player.update();
  enemy.update();

  player.velocity.x = 0;
  enemy.velocity.x = 0;

  //Player movement
  if (keys.a.pressed && player.lastKey === "a") {
    player.velocity.x = -4;
  } else if (keys.d.pressed && player.lastKey === "d") {
    player.velocity.x = 4;
  }

  //Enemy movement

  if (keys.ArrowLeft.pressed && enemy.lastKey === "ArrowLeft") {
    enemy.velocity.x = -4;
  } else if (keys.ArrowRight.pressed && enemy.lastKey === "ArrowRight") {
    enemy.velocity.x = 4;
  }

  // Detect colosion

  if (
    player.attackBox.position.x + player.attackBox.width >= enemy.position.x &&
    player.attackBox.position.x <= enemy.position.x + enemy.width &&
    player.attackBox.position.y + player.attackBox.height >= enemy.position.y &&
    player.attackBox.position.y <= enemy.position.y + enemy.height &&
    player.isAttacking
  ) {
    player.isAttacking = false;
    console.log("hit");
  }

  if (
    enemy.attackBox.position.x + enemy.attackBox.width >= player.position.x &&
    enemy.attackBox.position.x <= player.position.x + player.width &&
    enemy.attackBox.position.y + enemy.attackBox.height >= player.position.y &&
    enemy.attackBox.position.y <= player.position.y + player.height &&
    enemy.isAttacking
  ) {
    enemy.isAttacking = false;
    console.log("hit enemy");
  }
}
animate();

//!  Listen for key down

window.addEventListener("keydown", (event) => {
  switch (event.key) {
    // Plaeyer Keys
    case "d":
      keys.d.pressed = true;
      player.lastKey = "d";
      break;
    case "a":
      player.lastKey = "a";
      keys.a.pressed = true;
      break;
    case "w":
      player.lastKey = "w";
      keys.w.pressed = true;
      player.velocity.y += -15;
      break;
    case " ":
      player.attack();
      break;
    //Enemy Keys
    case "ArrowRight":
      keys.ArrowRight.pressed = true;
      enemy.lastKey = "ArrowRight";
      break;
    case "ArrowLeft":
      enemy.lastKey = "ArrowLeft";
      keys.ArrowLeft.pressed = true;
      break;
    case "ArrowUp":
      enemy.velocity.y += -15;
      break;
    case "Enter":
      enemy.attack();
      break;
  }
});

// ! Listen for key up

window.addEventListener("keyup", (event) => {
  // Player Keys
  switch (event.key) {
    case "d":
      keys.d.pressed = false;
      break;
    case "a":
      keys.a.pressed = false;
      break;

    // Enemy Keys
    case "ArrowRight":
      keys.ArrowRight.pressed = false;
      enemy.lastKey = "ArrowRight";
      break;
    case "ArrowLeft":
      enemy.lastKey = "ArrowLeft";
      keys.ArrowLeft.pressed = false;
      break;
  }
});
