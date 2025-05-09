
// scripts/levels.js

// Game variables - accessible globally via script load order
let currentLevel = 1;
let score = 0;
let gameOver = false;
let showingPopup = false;

// Level elements - dynamically filled by loadLevel
let platforms = [];
let infoPackets = [];
let enemies = []; // This will always be set to [] in init functions now
let door = {}; // Represents the exit door object

// DOM Elements for UI updates
const levelInfoDisplay = document.getElementById('levelInfo');
const scoreDisplay = document.getElementById('scoreDisplay');
const infoPopup = document.getElementById('infoPopup');


// Load level based on current level number
function loadLevel(level) {
    // Reset player state potentially needed here if carrying over issues
    // Ensure player object exists before trying to modify it
     if (typeof player !== 'undefined') {
        player.x = 50; // Default starting X
        player.y = 500; // Default starting Y (adjust per level if needed)
        player.velX = 0;
        player.velY = 0;
        player.jumping = false;
        player.grounded = true; // Assume starting grounded unless level places them mid-air
    } else {
         console.error("Player object not defined when trying to load level!");
    }


    switch(level) {
        case 1: initPhysicalLevel(); break;
        case 2: initDataLinkLevel(); break;
        case 3: initNetworkLevel(); break;
        case 4: initTransportLevel(); break;
        case 5: initSessionLevel(); break;
        case 6: initPresentationLevel(); break;
        case 7: initApplicationLevel(); break;
        default:
            console.error("Invalid level number:", level);
            currentLevel = 1; // Reset to level 1 if invalid
            initPhysicalLevel();
    }

     // Ensure player start position is set correctly after level init overrides
     if (typeof player !== 'undefined') {
         // The init...Level functions should set the correct player.x, player.y
     }

    // Update level info display
    if (osiLayers[level-1]) {
        levelInfoDisplay.textContent = `Level ${level}: ${osiLayers[level-1].name}`;
    } else {
         levelInfoDisplay.textContent = "OSI Model Platformer"; // Fallback
    }
     scoreDisplay.textContent = `Score: ${score}`; // Update score display
}

// Show information popup
function showInfoPopup(text) {
    infoPopup.textContent = text;
    infoPopup.style.display = "block";
    showingPopup = true; // Pause game logic in gameLoop

    // Set a default timeout to hide popup, but key press will also hide it
    setTimeout(() => {
        // Only hide via timeout if it's still the *same* popup showing
        // And if the game isn't over (game over popup should persist until restart)
        if (showingPopup && !gameOver && infoPopup.textContent === text) {
            hideInfoPopup();
        }
    }, 6000); // 6 seconds timeout
}

// Hide information popup
function hideInfoPopup() {
    infoPopup.style.display = "none";
    showingPopup = false; // Resume game logic
}


// --- Level Initialization Functions ---
// MODIFIED: All enemies arrays are set to empty []

// Level 1: Physical Layer
function initPhysicalLevel() {
    platforms = [
        {x: 0, y: 550, width: 800, height: 50, color: "#a9a9a9"}, // Ground
        {x: 250, y: 450, width: 150, height: 20, color: "#a9a9a9"},
        {x: 450, y: 400, width: 150, height: 20, color: "#a9a9a9"},
        {x: 650, y: 350, width: 150, height: 20, color: "#a9a9a9"}
    ];
    infoPackets = [
        {x: 300, y: 410, width: 25, height: 25, color: osiLayers[0].color, collected: false, factIndex: 0},
        {x: 500, y: 360, width: 25, height: 25, color: osiLayers[0].color, collected: false, factIndex: 1},
        {x: 700, y: 310, width: 25, height: 25, color: osiLayers[0].color, collected: false, factIndex: 2}
    ];
    enemies = []; // MODIFIED: Removed enemies
    door = {x: 720, y: 300, width: 40, height: 50, color: "#66cc66"};
    player.x = 50;
    player.y = 500; // Start on ground
}

// Level 2: Data Link Layer
function initDataLinkLevel() {
    platforms = [
        {x: 0, y: 550, width: 150, height: 20, color: "#a9a9a9"}, // Start platform
        {x: 200, y: 500, width: 150, height: 20, color: "#a9a9a9"}, // Bridge parts
        {x: 400, y: 500, width: 150, height: 20, color: "#a9a9a9"},
        {x: 600, y: 550, width: 200, height: 20, color: "#a9a9a9"}, // End platform
        {x: 300, y: 400, width: 200, height: 20, color: "#a9a9a9"}, // Higher platforms
        {x: 100, y: 300, width: 200, height: 20, color: "#a9a9a9"},
        {x: 500, y: 300, width: 200, height: 20, color: "#a9a9a9"} // Platform for door
    ];
    infoPackets = [
        {x: 250, y: 460, width: 25, height: 25, color: osiLayers[1].color, collected: false, factIndex: 0},
        {x: 400, y: 360, width: 25, height: 25, color: osiLayers[1].color, collected: false, factIndex: 1},
        {x: 600, y: 260, width: 25, height: 25, color: osiLayers[1].color, collected: false, factIndex: 2}
    ];
    enemies = []; // MODIFIED: Removed enemies
    door = {x: 650, y: 250, width: 40, height: 50, color: "#66cc66"};
    player.x = 50;
    player.y = 500; // Start on ground
}

// Level 3: Network Layer
function initNetworkLevel() {
    platforms = [
        {x: 0, y: 550, width: 150, height: 20, color: "#a9a9a9"},
        {x: 200, y: 480, width: 150, height: 20, color: "#a9a9a9"}, // Stepping up
        {x: 400, y: 410, width: 150, height: 20, color: "#a9a9a9"},
        {x: 600, y: 340, width: 200, height: 20, color: "#a9a9a9"},
        {x: 300, y: 300, width: 100, height: 20, color: "#a9a9a9"}, // Small platforms
        {x: 150, y: 250, width: 100, height: 20, color: "#a9a9a9"},
        {x: 500, y: 200, width: 100, height: 20, color: "#a9a9a9"}
    ];
    infoPackets = [
        {x: 250, y: 440, width: 25, height: 25, color: osiLayers[2].color, collected: false, factIndex: 0},
        {x: 330, y: 260, width: 25, height: 25, color: osiLayers[2].color, collected: false, factIndex: 1},
        {x: 530, y: 160, width: 25, height: 25, color: osiLayers[2].color, collected: false, factIndex: 2}
    ];
    enemies = []; // MODIFIED: Removed enemies
    door = {x: 700, y: 290, width: 40, height: 50, color: "#66cc66"}; // Door on platform
    player.x = 50;
    player.y = 500;
}

// Level 4: Transport Layer
function initTransportLevel() {
    platforms = [
        {x: 0, y: 550, width: 800, height: 50, color: "#a9a9a9"}, // Base platform
        {x: 100, y: 450, width: 100, height: 20, color: "#a9a9a9"},
        {x: 300, y: 400, width: 100, height: 20, color: "#a9a9a9"},
        {x: 500, y: 350, width: 100, height: 20, color: "#a9a9a9"},
        {x: 300, y: 280, width: 100, height: 20, color: "#a9a9a9"}, // Mid air platforms
        {x: 100, y: 210, width: 100, height: 20, color: "#a9a9a9"},
        {x: 500, y: 150, width: 200, height: 20, color: "#a9a9a9"} // Top platform
    ];
    infoPackets = [
        {x: 130, y: 410, width: 25, height: 25, color: osiLayers[3].color, collected: false, factIndex: 0},
        {x: 330, y: 240, width: 25, height: 25, color: osiLayers[3].color, collected: false, factIndex: 1},
        {x: 580, y: 110, width: 25, height: 25, color: osiLayers[3].color, collected: false, factIndex: 2}
    ];
    enemies = []; // MODIFIED: Removed enemies
    door = {x: 650, y: 100, width: 40, height: 50, color: "#66cc66"}; // Door on top platform
    player.x = 50;
    player.y = 500;
}

// Level 5: Session Layer
function initSessionLevel() {
    platforms = [
        {x: 0, y: 550, width: 200, height: 20, color: "#a9a9a9"},
        {x: 250, y: 480, width: 300, height: 20, color: "#a9a9a9"}, // Long platform
        {x: 100, y: 400, width: 200, height: 20, color: "#a9a9a9"},
        {x: 400, y: 330, width: 200, height: 20, color: "#a9a9a9"},
        {x: 200, y: 260, width: 150, height: 20, color: "#a9a9a9"},
        {x: 450, y: 190, width: 300, height: 20, color: "#a9a9a9"} // Top long platform
    ];
    infoPackets = [
        {x: 180, y: 360, width: 25, height: 25, color: osiLayers[4].color, collected: false, factIndex: 0},
        {x: 250, y: 220, width: 25, height: 25, color: osiLayers[4].color, collected: false, factIndex: 1},
        {x: 650, y: 150, width: 25, height: 25, color: osiLayers[4].color, collected: false, factIndex: 2}
    ];
    enemies = []; // MODIFIED: Removed enemies
    door = {x: 700, y: 140, width: 40, height: 50, color: "#66cc66"};
    player.x = 50;
    player.y = 500;
}

// Level 6: Presentation Layer
function initPresentationLevel() {
     platforms = [
        {x: 0, y: 550, width: 150, height: 20, color: "#a9a9a9"},
        {x: 200, y: 490, width: 150, height: 20, color: "#a9a9a9"}, // Steps up
        {x: 0, y: 400, width: 250, height: 20, color: "#a9a9a9"},   // Platform on left
        {x: 300, y: 340, width: 150, height: 20, color: "#a9a9a9"},
        {x: 500, y: 280, width: 150, height: 20, color: "#a9a9a9"},
        {x: 300, y: 210, width: 150, height: 20, color: "#a9a9a9"}, // Mid air platforms
        {x: 550, y: 150, width: 250, height: 20, color: "#a9a9a9"} // Top platform
    ];
    infoPackets = [
        {x: 120, y: 360, width: 25, height: 25, color: osiLayers[5].color, collected: false, factIndex: 0},
        {x: 350, y: 170, width: 25, height: 25, color: osiLayers[5].color, collected: false, factIndex: 1},
        {x: 650, y: 110, width: 25, height: 25, color: osiLayers[5].color, collected: false, factIndex: 2}
    ];
     enemies = []; // MODIFIED: Removed enemies
    door = {x: 750, y: 100, width: 40, height: 50, color: "#66cc66"}; // Top right door
    player.x = 50;
    player.y = 500;
}

// Level 7: Application Layer
function initApplicationLevel() {
     platforms = [
        {x: 0, y: 550, width: 200, height: 20, color: "#a9a9a9"},
        {x: 250, y: 480, width: 200, height: 20, color: "#a9a9a9"},
        {x: 500, y: 410, width: 200, height: 20, color: "#a9a9a9"},
        {x: 350, y: 320, width: 150, height: 20, color: "#a9a9a9"}, // Floating platforms
        {x: 150, y: 250, width: 150, height: 20, color: "#a9a9a9"},
        {x: 400, y: 200, width: 200, height: 20, color: "#a9a9a9"},
        {x: 650, y: 150, width: 150, height: 20, color: "#a9a9a9"} // Final platform
    ];
    infoPackets = [
        {x: 300, y: 440, width: 25, height: 25, color: osiLayers[6].color, collected: false, factIndex: 0},
        {x: 200, y: 210, width: 25, height: 25, color: osiLayers[6].color, collected: false, factIndex: 1},
        {x: 700, y: 110, width: 25, height: 25, color: osiLayers[6].color, collected: false, factIndex: 2}
    ];
    enemies = []; // MODIFIED: Removed enemies
    // Final door leads to win condition in checkCollisions
    door = {x: 750, y: 100, width: 40, height: 50, color: "#FFD700"}; // Gold door for finish
    player.x = 50;
    player.y = 500;
}
