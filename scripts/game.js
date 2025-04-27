
// scripts/game.js

// --- Game Loop ---
let animationFrameId = null; // To potentially control the loop

function gameLoop() {
    // Check for game over state first
    if (gameOver) {
        // Draw one last frame with the game over state visually indicated
        ctx.fillStyle = "rgba(0, 0, 0, 0.5)"; // Example: Darken screen
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        // The popup already shows the game over message + restart instruction

        // Stop the loop
        if (animationFrameId) {
             cancelAnimationFrame(animationFrameId);
             animationFrameId = null;
        }
        console.log("Game loop stopped (Game Over).");
        return; // Exit the function to prevent further updates/drawing
    }

    // Only update game state if popup isn't showing
    if (!showingPopup) {
        updatePlayer();
        updateEnemies(); // Update enemy positions
        checkCollisions(); // Check for interactions
    }

    // --- Drawing ---
    // Clear canvas (or draw background which covers everything)
    // ctx.clearRect(0, 0, canvas.width, canvas.height); // Less needed if background covers all

    drawBackground();    // Draw the dynamic background first
    drawPlatforms();     // Draw level geometry
    drawInfoPackets();   // Draw collectibles
    drawEnemies();       // Draw hazards
    drawDoor();          // Draw the level exit
    drawPlayer();        // Draw the player last (on top)

    // Request the next frame
    animationFrameId = requestAnimationFrame(gameLoop);
}

// --- Collision Handling ---
function checkCollisions() {
    // Only perform collision checks if the game is not over
    if (gameOver) return;

    // 1. Player vs Info Packets
    infoPackets.forEach((packet) => {
        if (!packet.collected && collisionCheck(player, packet)) {
            packet.collected = true;
            score += 10; // Increment score
            scoreDisplay.textContent = `Score: ${score}`; // Update score display

            // Show the fact related to this packet
            const layerIndex = currentLevel - 1;
            if (osiLayers[layerIndex] && osiLayers[layerIndex].facts[packet.factIndex] !== undefined) {
                 showInfoPopup(osiLayers[layerIndex].facts[packet.factIndex]);
            } else {
                 console.warn(`Fact not found for level ${currentLevel}, factIndex ${packet.factIndex}`);
                 showInfoPopup("Collected an info packet!"); // Fallback
            }
        }
    });

    // 2. Player vs Enemies
    enemies.forEach(enemy => {
        // Check collision only if game isn't already over
        if (!gameOver && collisionCheck(player, enemy)) {
            console.log("Collision with enemy!");
            gameOver = true; // Set game over flag
             const layerName = osiLayers[currentLevel-1]?.name || "Unknown Layer";
            showInfoPopup(`Game Over! Hit by ${layerName} interference. Press R to Restart.`);
            // Game loop will stop on the next frame check
        }
    });

    // 3. Player vs Door
    if (!gameOver && collisionCheck(player, door)) { // Check only if not already game over
         const allPacketsCollected = infoPackets.every(packet => packet.collected);
         if (allPacketsCollected) {
            console.log(`Reached door on level ${currentLevel}. All packets collected.`);
            // Move to next level or end game
            currentLevel++;
            score += 50; // Bonus score for completing level

            if (currentLevel > osiLayers.length) {
                // --- WIN CONDITION ---
                gameOver = true; // Use gameOver to stop the loop
                showInfoPopup(`Congratulations! You've mastered the OSI Model! Final Score: ${score}`);
                 // Game loop will stop on the next frame check
            } else {
                // Load next level
                loadLevel(currentLevel);
                // Show welcome message for the new level
                 const layerData = osiLayers[currentLevel-1];
                 showInfoPopup(`Entering Level ${currentLevel}: The ${layerData.name}. ${layerData.description}`);
            }
        } else {
             // Optional feedback if door touched but packets remain
             if (!showingPopup || !infoPopup.textContent.includes("Collect all info packets")) {
                  showInfoPopup("Collect all info packets ('i') to activate the door!");
             }
        }
    }
}

// --- Enemy Update ---
function updateEnemies() {
     // Only update if game is not over and popup isn't showing
     if (gameOver || showingPopup) return;

     enemies.forEach(enemy => {
         enemy.x += enemy.speedX * enemy.directionX;

         // Basic boundary/platform collision for enemies (example)
         // Check against canvas edges
         if (enemy.x <= 0 || enemy.x + enemy.width >= canvas.width) {
             enemy.directionX *= -1; // Reverse direction
              enemy.x = Math.max(0, Math.min(enemy.x, canvas.width - enemy.width)); // Clamp position
         }

         // Optional: Check against platforms to make them turn around
         let reversedOnPlatform = false;
         platforms.forEach(platform => {
             // Check if enemy is roughly above a platform (for edge detection)
             const verticalCheckBuffer = 5; // Pixels below enemy bottom to check for platform
             const isAbovePlatform = enemy.y + enemy.height >= platform.y - verticalCheckBuffer &&
                                     enemy.y < platform.y + platform.height;

             if (isAbovePlatform) {
                  const enemyRightEdge = enemy.x + enemy.width;
                  const enemyLeftEdge = enemy.x;
                  const platformRightEdge = platform.x + platform.width;
                  const platformLeftEdge = platform.x;

                  // Check if moving right and right edge is at or past platform's right edge
                  if (enemy.directionX > 0 && enemyRightEdge >= platformRightEdge) {
                     // Basic check: turn around if at the edge
                     // More complex: check if there's ground ahead before turning
                     enemy.directionX = -1; // Turn left
                     enemy.x = platformRightEdge - enemy.width; // Align edge precisely
                     reversedOnPlatform = true;

                  }
                  // Check if moving left and left edge is at or past platform's left edge
                  else if (enemy.directionX < 0 && enemyLeftEdge <= platformLeftEdge) {
                     enemy.directionX = 1; // Turn right
                     enemy.x = platformLeftEdge; // Align edge precisely
                     reversedOnPlatform = true;
                  }
             }

             // Optional: Check collision with platform sides (if enemy hits a wall)
             if (!reversedOnPlatform && collisionCheck(enemy, platform)) {
                 // Check vertical alignment to ensure it's a side hit, not top/bottom
                  const verticalOverlap = Math.max(0, Math.min(enemy.y + enemy.height, platform.y + platform.height) - Math.max(enemy.y, platform.y));
                  // Check horizontal overlap too
                  const horizontalOverlap = Math.max(0, Math.min(enemy.x + enemy.width, platform.x + platform.width) - Math.max(enemy.x, platform.x));

                  // Ensure significant vertical overlap but minimal horizontal (just touching side)
                  if (verticalOverlap > enemy.height * 0.5 && horizontalOverlap < Math.abs(enemy.speedX * 2)) {
                      if (enemy.directionX > 0) { // Moving right into platform left side
                          enemy.x = platform.x - enemy.width;
                          enemy.directionX = -1;
                      } else if (enemy.directionX < 0) { // Moving left into platform right side
                          enemy.x = platform.x + platform.width;
                          enemy.directionX = 1;
                      }
                   }
             }
         });
     });
}


// --- Game Initialization and Restart ---

// MODIFIED: Restarts on the *current* level, doesn't reset total score.
function restartGame() {
    console.log(`Restarting game on level ${currentLevel}...`);
    gameOver = false; // Reset the game over state
    showingPopup = false; // Ensure no popups are active

    // DO NOT reset currentLevel here - keep the level where the player died
    // DO NOT reset score here - let the player keep their total score

    hideInfoPopup(); // Hide any existing popups like "Game Over"

    // Reload the *current* level. This function already handles
    // resetting player position, enemy positions, and info packet 'collected' status
    // specific to that level based on its init...Level function.
    loadLevel(currentLevel);

    // Ensure the loop starts again if it was stopped
    if (!animationFrameId) {
        animationFrameId = requestAnimationFrame(gameLoop);
        console.log("Game loop restarted.");
    }
}


// Initialize the game function
function initGame() {
    console.log("Initializing OSI Model Platformer...");

    // Ensure canvas and context are valid before proceeding
    if (!canvas || typeof canvas.getContext !== 'function') {
         console.error("Canvas element is not valid or not found!");
         document.getElementById('gameContainer').innerHTML = "<h2 style='color: red;'>Error: Could not initialize graphics. Canvas not supported or not found.</h2>";
         return; // Stop initialization
    }
    // It's good practice to check getContext result too
    if (!ctx) {
         console.error("Failed to get 2D rendering context!");
          document.getElementById('gameContainer').innerHTML = "<h2 style='color: red;'>Error: Could not get 2D context for graphics.</h2>";
         return; // Stop initialization
    }


    currentLevel = 1; // Start at level 1 initially
    score = 0;        // Reset score initially
    gameOver = false; // Reset game over state initially
    showingPopup = false; // Reset popup state initially

    loadLevel(currentLevel); // Load the first level's assets

    // Display initial welcome message via popup
    const firstLayer = osiLayers[0];
    if (firstLayer) {
        showInfoPopup(`Welcome! Use Arrow Keys. Collect packets ('i') to learn about the ${firstLayer.name}. Reach the door!`);
    } else {
         showInfoPopup("Welcome to the OSI Model Platformer!");
    }


    // Start the game loop if not already running
     if (!animationFrameId) {
          animationFrameId = requestAnimationFrame(gameLoop);
          console.log("Initial game loop started.");
     } else {
          // If restarting, animationFrameId might still exist but be cancelled.
          // Requesting a new frame ensures it runs.
          cancelAnimationFrame(animationFrameId); // Cancel any lingering frame just in case
          animationFrameId = requestAnimationFrame(gameLoop);
          console.log("Game loop potentially restarted after init.");
     }
}

// Start the game automatically when the window loads everything
window.onload = function() {
    initGame(); // Call the initialization function
};

