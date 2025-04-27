// Player object
const player = {
    x: 50,
    y: 500, // Initial position, will be set by level init
    width: 30,
    height: 50,
    speed: 4, // Max horizontal speed
    velX: 0,
    velY: 0,
    jumping: false, // Is player currently moving upwards from a jump?
    grounded: false, // Is player currently on a platform?
    color: '#4682b4' // Steel Blue
};

// Game physics constants
const gravity = 0.5;
const friction = 0.85; // Increased friction for less sliding
const jumpStrength = 11; // Slightly adjusted jump power

// Controls state
const keys = {
    right: false,
    left: false,
    up: false // We track 'up' key press for initiating jump
};

// Event listeners for controls - arrow keys only
// MODIFIED: Added restart logic and restructured processing order
document.addEventListener("keydown", function(e) {
    // 1. Check for Restart first (only if game is over)
    // Assumes restartGame() is defined in game.js (loaded before this script needs it at runtime)
    if (gameOver && e.key.toUpperCase() === 'R') {
        if (typeof restartGame === 'function') {
             restartGame();
        } else {
            console.error("restartGame function not found!");
        }
        return; // Stop further processing for 'R' key if restarting
    }

    // 2. Handle Popup dismissal (if popup is showing, dismiss with any key)
    // Assumes hideInfoPopup() is defined in levels.js
    if (showingPopup) {
        if (typeof hideInfoPopup === 'function') {
             hideInfoPopup();
        } else {
             console.error("hideInfoPopup function not found!");
        }
        return; // Stop further key processing when popup is shown
    }

    // 3. Handle Gameplay controls (only if NOT game over AND NOT showing popup)
    if (!gameOver && !showingPopup) {
        // Prevent default browser scroll on arrow keys
        if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)) {
            e.preventDefault();
        }

        if (e.key === "ArrowRight") keys.right = true;
        if (e.key === "ArrowLeft") keys.left = true;
        if (e.key === "ArrowUp") keys.up = true; // Track key press state
    }
});


document.addEventListener("keyup", function(e) {
    if (e.key === "ArrowRight") keys.right = false;
    if (e.key === "ArrowLeft") keys.left = false;
    if (e.key === "ArrowUp") keys.up = false; // Reset key press state
});


/**
 * Checks for AABB collision between two rectangular objects.
 * Objects must have x, y, width, height properties.
 * @param {object} objA The first object.
 * @param {object} objB The second object.
 * @returns {boolean} True if colliding, false otherwise.
 */
function collisionCheck(objA, objB) {
    // Check X axis overlap
    if (objA.x < objB.x + objB.width && objA.x + objA.width > objB.x) {
        // Check Y axis overlap
        if (objA.y < objB.y + objB.height && objA.y + objA.height > objB.y) {
            return true; // Collision detected
        }
    }
    return false; // No collision
}


// Update player position and handle physics/collisions
// MODIFIED: Added instruction to game over message on falling
function updatePlayer() {
    // --- Horizontal Movement ---
    if (keys.right) {
        if (player.velX < player.speed) {
             player.velX += 1; // Accelerate
        } else {
             player.velX = player.speed; // Cap speed
        }
    } else if (keys.left) {
         if (player.velX > -player.speed) {
            player.velX -= 1; // Accelerate
         } else {
            player.velX = -player.speed; // Cap speed
         }
    } else {
        // Apply friction only when no horizontal key is pressed
        player.velX *= friction;
    }
     // Stop completely if velocity is very small
     if (Math.abs(player.velX) < 0.1) {
          player.velX = 0;
     }

    // --- Horizontal Collision Check ---
    player.x += player.velX; // Apply horizontal velocity

    platforms.forEach(platform => {
        if (collisionCheck(player, platform)) {
            // Correct position based on movement direction
            if (player.velX > 0) { // Moving right into platform
                player.x = platform.x - player.width;
            } else if (player.velX < 0) { // Moving left into platform
                player.x = platform.x + platform.width;
            }
            player.velX = 0; // Stop horizontal movement on collision
        }
    });


    // --- Vertical Movement ---
    // Apply jump impulse (only if grounded and ArrowUp is pressed)
     if (keys.up && player.grounded && !player.jumping) {
         player.velY = -jumpStrength;
         player.jumping = true; // Mark as having initiated a jump
         player.grounded = false;
     }

    // Apply gravity
    player.velY += gravity;

    // Reset grounded state before checking vertical collisions
    player.grounded = false;

    // --- Vertical Collision Check ---
    player.y += player.velY; // Apply vertical velocity

    platforms.forEach(platform => {
        if (collisionCheck(player, platform)) {
             // Determine collision side more reliably
             const playerBottom = player.y + player.height;
             const playerTop = player.y;
             const playerLeft = player.x;
             const playerRight = player.x + player.width;

             const platformTop = platform.y;
             const platformBottom = platform.y + platform.height;
             const platformLeft = platform.x;
             const platformRight = platform.x + platform.width;

             // Check if landing on top
             // Player's bottom edge was near or above platform top in previous frame AND is now overlapping
             if (player.velY >= 0 && (playerBottom - player.velY) <= platformTop + 1) {
                 player.y = platformTop - player.height; // Place player precisely on top
                 player.velY = 0;
                 player.grounded = true;
                 player.jumping = false; // Can jump again
             }
             // Check if hitting head on bottom
             // Player's top edge was near or below platform bottom in previous frame AND is now overlapping
             else if (player.velY < 0 && (playerTop - player.velY) >= platformBottom - 1) {
                 player.y = platformBottom; // Place player precisely below
                 player.velY = 0; // Stop upward movement
             }
             // Note: Side collisions during vertical movement are handled by the horizontal check primarily
        }
    });

    // --- Boundary Checks ---
    // Prevent player from going off screen left/right
    if (player.x < 0) {
        player.x = 0;
        player.velX = 0;
    } else if (player.x + player.width > canvas.width) {
        player.x = canvas.width - player.width;
        player.velX = 0;
    }

    // Handle falling off the bottom
    if (player.y > canvas.height + 100) { // Give some buffer before reset
         console.log("Player fell off!");
         gameOver = true; // Set game over flag
         // MODIFIED: Added restart instructions
         showInfoPopup("Game Over! You fell into the network void. Press R to Restart.");
         // Game loop will stop in game.js due to gameOver flag
    }
}
