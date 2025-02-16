# Sync 3D Multi-Tabs

This project is a real-time 3D physics simulation that synchronizes spheres (representing objects in a multi-tab environment) across different browser tabs using Socket.IO and Three.js.

## Overview

- **Purpose:**  
  The application simulates a collection of spheres moving with realistic physics. Each browser tab represents a client that shows the simulation, and the server synchronizes the state so that when a tab is closed, its corresponding sphere is removed from all clients.

- **Technology Stack:**  
  - **Server:** Node.js with [Express](https://expressjs.com/) and [Socket.IO](https://socket.io/).  
  - **Client:** HTML with [Three.js](https://threejs.org/) for 3D rendering.

## How It Works

1. **Sphere Initialization:**  
   When a client connects, the server creates a sphere with a random position, velocity, and color.
   
2. **Physics Simulation:**  
   The server continuously updates the spheres’ positions using a basic physics engine. The simulation includes:
   - **Movement:**  
     Spheres move based on their individual velocities.
   - **Boundary Reflection:**  
     When a sphere reaches the defined boundaries, its velocity reverses to simulate a bounce.
   - **Collision Handling:**  
     When two spheres collide (i.e., the distance between their centers is less than twice the radius), the simulation applies Newtonian physics principles to:
     - Calculate the normalized vector between the centers.
     - Compute the relative velocity and project it along the collision normal.
     - Adjust the velocities based on an impulse response for perfectly elastic collisions (assuming equal masses).
     - Correct positions to resolve overlaps.

3. **Real-Time Updates:**  
   The updated state of all spheres is emitted to all connected clients at roughly 60 FPS. When a client disconnects, its sphere is removed from the simulation.

4. **Rendering:**  
   - The client uses a Three.js scene to render the spheres.
   - An ambient light uniformly illuminates the scene.
   - Spheres are rendered using `MeshStandardMaterial` to provide a solid, realistic appearance with proper shadow casting and receiving.

## Physics Details

- **Movement:**  
  Sphere positions are updated by simply adding their velocity values.

- **Collision Detection:**  
  Collisions are detected when the distance between two sphere centers is less than two times the radius.

- **Collision Response:**  
  Using principles of Newtonian physics for elastic collisions:
  - The collision normal is computed from the centers’ positions.
  - The relative velocity is projected onto this normal.
  - If the spheres are approaching each other, their velocities are adjusted to reflect an exchange of momentum.
  - Post-collision, a small positional adjustment resolves any overlaps.

## Dependencies

- [Express](https://expressjs.com/)
- [Socket.IO](https://socket.io/)
- [Three.js](https://threejs.org/)

## License

This project is licensed under the ISC License.