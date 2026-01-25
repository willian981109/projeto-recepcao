const canvas = document.getElementById("stars");
const ctx = canvas.getContext("2d");

let width, height;
let stars = [];

function resize() {
  width = canvas.width = window.innerWidth;
  height = canvas.height = window.innerHeight;
}

window.addEventListener("resize", resize);
resize();

function createStars() {
  stars = [];
  const total = Math.floor((width * height) / 8000);

  for (let i = 0; i < total; i++) {
    stars.push({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 1.5 + 0.3,
      speed: Math.random() * 0.3 + 0.05
    });
  }
}

function drawStars() {
  ctx.clearRect(0, 0, width, height);

  ctx.fillStyle = "rgba(255, 215, 150, 0.5)";

  stars.forEach(star => {
    ctx.beginPath();
    ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
    ctx.fill();

    star.y += star.speed;
    if (star.y > height) {
      star.y = 0;
      star.x = Math.random() * width;
    }
  });

  requestAnimationFrame(drawStars);
}

createStars();
drawStars();
