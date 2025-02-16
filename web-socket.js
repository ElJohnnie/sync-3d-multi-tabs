const express = require("express");
const http = require("http");
const path = require("path");
const socketIo = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.static(path.join(__dirname, "websocket")));

const spheres = {};

io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);

  spheres[socket.id] = {
    x: Math.random() * 8 - 4,
    y: Math.random() * 8 - 4,
    vx: (Math.random() - 0.05) * 0.2,
    vy: (Math.random() - 0.05) * 0.2,
    color: Math.floor(Math.random() * 0xffffff)
  };

  socket.on("disconnect", () => {
    delete spheres[socket.id];
  });
});

function updatePhysics() {
  const radius = 1;

  for (const id in spheres) {
    const sphere = spheres[id];
    sphere.x += sphere.vx;
    sphere.y += sphere.vy;

    if (Math.abs(sphere.x) > 5) sphere.vx *= -1;
    if (Math.abs(sphere.y) > 5) sphere.vy *= -1;
  }


  const ids = Object.keys(spheres);
  for (let i = 0; i < ids.length; i++) {
    for (let j = i + 1; j < ids.length; j++) {
      const s1 = spheres[ids[i]];
      const s2 = spheres[ids[j]];
      const dx = s1.x - s2.x;
      const dy = s1.y - s2.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < 2 * radius && dist > 0) {

        const nx = dx / dist;
        const ny = dy / dist;


        const relVx = s1.vx - s2.vx;
        const relVy = s1.vy - s2.vy;

        const dot = relVx * nx + relVy * ny;

        if (dot < 0) {
          s1.vx = s1.vx - dot * nx;
          s1.vy = s1.vy - dot * ny;
          s2.vx = s2.vx + dot * nx;
          s2.vy = s2.vy + dot * ny;
        }


        const overlap = 2 * radius - dist;
        s1.x += (overlap / 2) * nx;
        s1.y += (overlap / 2) * ny;
        s2.x -= (overlap / 2) * nx;
        s2.y -= (overlap / 2) * ny;
      }
    }
  }

  io.emit("update", spheres);
  setTimeout(updatePhysics, 16); 
}

updatePhysics();

const PORT = 8080;
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});