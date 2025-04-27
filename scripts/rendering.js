// Canvas and context - ensure this runs after HTML is loaded
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// --- Drawing Functions ---

// Draw player character
function drawPlayer() {
    // Main body
    ctx.fillStyle = player.color;
    ctx.fillRect(player.x, player.y, player.width, player.height);

    // Simple "eyes"
    ctx.fillStyle = "white";
    const eyeY = player.y + 10;
    const eyeSize = 5;
    ctx.fillRect(player.x + player.width * 0.25 - eyeSize/2, eyeY, eyeSize, eyeSize);
    ctx.fillRect(player.x + player.width * 0.75 - eyeSize/2, eyeY, eyeSize, eyeSize);

    // Optional: Network signal aura (Subtle)
    // ctx.strokeStyle = "rgba(70, 130, 180, 0.3)"; // Lighter steel blue
    // ctx.lineWidth = 2;
    // ctx.beginPath();
    // ctx.arc(player.x + player.width/2, player.y + player.height/2, player.width * 0.7, 0, Math.PI * 2);
    // ctx.stroke();
}

// Draw platforms
function drawPlatforms() {
    platforms.forEach(platform => {
        // Platform base
        ctx.fillStyle = platform.color;
        ctx.fillRect(platform.x, platform.y, platform.width, platform.height);

        // Simple edge highlight for depth
        ctx.strokeStyle = "#888"; // Darker grey
        ctx.lineWidth = 1;
        ctx.strokeRect(platform.x, platform.y, platform.width, platform.height);

        // Optional: Circuit pattern (can be performance intensive)
        // ctx.strokeStyle = "#666";
        // ctx.lineWidth = 1;
        // for (let i = 10; i < platform.width; i += 20) {
        //     ctx.beginPath();
        //     ctx.moveTo(platform.x + i, platform.y);
        //     ctx.lineTo(platform.x + i, platform.y + platform.height);
        //     ctx.stroke();
        // }
    });
}

// Draw information packets
function drawInfoPackets() {
    infoPackets.forEach(packet => {
        if (!packet.collected) {
            // Info packet circle
            ctx.fillStyle = packet.color;
            ctx.beginPath();
            ctx.arc(packet.x + packet.width/2, packet.y + packet.height/2, packet.width/2, 0, Math.PI * 2);
            ctx.fill();

            // White border
            ctx.strokeStyle = "white";
            ctx.lineWidth = 2;
            ctx.stroke();

            // "i" symbol
            ctx.fillStyle = "#fff"; // White text
            ctx.font = "bold 16px Arial";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle"; // Vertically center
            ctx.fillText("i", packet.x + packet.width/2, packet.y + packet.height/2 + 1); // Adjust Y offset slightly
            ctx.textAlign = "left"; // Reset alignment
            ctx.textBaseline = "alphabetic"; // Reset baseline
        }
    });
}

// Draw enemies
function drawEnemies() {
    enemies.forEach(enemy => {
        // Enemy body
        ctx.fillStyle = enemy.color;
        ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);

        // Simple "angry eyes"
        ctx.fillStyle = "white";
        const eyeY = enemy.y + enemy.height * 0.3;
        const eyeSize = 4;
        ctx.fillRect(enemy.x + enemy.width * 0.25 - eyeSize/2, eyeY, eyeSize, eyeSize);
        ctx.fillRect(enemy.x + enemy.width * 0.75 - eyeSize/2, eyeY, eyeSize, eyeSize);

        // Optional: Signal interference visual (Subtle)
        // ctx.strokeStyle = "rgba(255, 0, 0, 0.2)";
        // ctx.lineWidth = 1;
        // ctx.beginPath();
        // ctx.arc(enemy.x + enemy.width/2, enemy.y + enemy.height/2, enemy.width * 0.8, 0, Math.PI * 2);
        // ctx.stroke();
    });
}

// Draw exit door
function drawDoor() {
    // Door frame
    ctx.fillStyle = door.color;
    ctx.fillRect(door.x, door.y, door.width, door.height);

    // Simple handle/detail
    ctx.fillStyle = door.color === "#FFD700" ? "#DAA520" : "#4CAF50"; // Darker shade for detail
    ctx.fillRect(door.x + door.width * 0.6, door.y + door.height * 0.4, 8, 8);

    // Outline
    ctx.strokeStyle = "#333"; // Dark grey outline
    ctx.lineWidth = 2;
    ctx.strokeRect(door.x, door.y, door.width, door.height);

    // Optional: Layer transition text above door
    // ctx.fillStyle = "#333";
    // ctx.font = "bold 10px Arial";
    // ctx.textAlign = "center";
    // ctx.fillText("EXIT", door.x + door.width/2, door.y - 5);
    // ctx.textAlign = "left"; // Reset
}

// --- Background Drawing ---

// Base drawBackground function calls level-specific ones
function drawBackground() {
    // Base background color (set via CSS now, but can override here)
    // ctx.fillStyle = "#e6f2ff";
    // ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Get color from osiLayers if available, otherwise default
    const bgColor = osiLayers[currentLevel-1]?.color || "#e6f2ff"; // Base light blue if layer undefined
    // Create a subtle gradient based on layer color
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, LightenDarkenColor(bgColor, 60)); // Lighter top
    gradient.addColorStop(1, LightenDarkenColor(bgColor, -20)); // Darker bottom
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);


    // Call level-specific background details
    // These are simplified examples - customize as desired
    switch(currentLevel) {
        case 1: drawPhysicalBackgroundDetails(); break;
        case 2: drawDataLinkBackgroundDetails(); break;
        case 3: drawNetworkBackgroundDetails(); break;
        case 4: drawTransportBackgroundDetails(); break;
        case 5: drawSessionBackgroundDetails(); break;
        case 6: drawPresentationBackgroundDetails(); break;
        case 7: drawApplicationBackgroundDetails(); break;
        default: break; // Default gradient is enough
    }
}

// Helper to lighten/darken hex colors (for gradients)
function LightenDarkenColor(col, amt) {
    let usePound = false;
    if (col[0] == "#") {
        col = col.slice(1);
        usePound = true;
    }
    const num = parseInt(col, 16);
    let r = (num >> 16) + amt;
    if (r > 255) r = 255;
    else if (r < 0) r = 0;
    let b = ((num >> 8) & 0x00FF) + amt;
    if (b > 255) b = 255;
    else if (b < 0) b = 0;
    let g = (num & 0x0000FF) + amt;
    if (g > 255) g = 255;
    else if (g < 0) g = 0;
    return (usePound ? "#" : "") + String("000000" + (g | (b << 8) | (r << 16)).toString(16)).slice(-6);
}


// --- Specific Background Detail Functions (Examples) ---
// (drawPhysicalBackgroundDetails, drawDataLinkBackgroundDetails, etc. remain the same)
function drawPhysicalBackgroundDetails() {
    // Draw subtle binary stream
    ctx.fillStyle = "rgba(255, 255, 255, 0.05)";
    ctx.font = "10px monospace";
    for (let i = 0; i < 100; i++) { // More density
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        ctx.fillText(Math.round(Math.random()), x, y);
    }
}

function drawDataLinkBackgroundDetails() {
    // Draw subtle frame outlines
    ctx.strokeStyle = "rgba(255, 255, 255, 0.1)";
    ctx.lineWidth = 1;
    for (let i = 0; i < 10; i++) {
        const x = Math.random() * (canvas.width - 100);
        const y = Math.random() * (canvas.height - 50);
        ctx.strokeRect(x, y, 80 + Math.random()*40, 30 + Math.random()*20);
    }
}

function drawNetworkBackgroundDetails() {
     // Draw subtle network lines/nodes
     ctx.strokeStyle = "rgba(255, 255, 255, 0.1)";
     ctx.fillStyle = "rgba(255, 255, 255, 0.1)";
     ctx.lineWidth = 1;
     for (let i = 0; i < 5; i++) {
         const x1 = Math.random() * canvas.width;
         const y1 = Math.random() * canvas.height;
         const x2 = Math.random() * canvas.width;
         const y2 = Math.random() * canvas.height;
         ctx.beginPath();
         ctx.moveTo(x1, y1);
         ctx.lineTo(x2, y2);
         ctx.stroke();
         ctx.fillRect(x1 - 3, y1 - 3, 6, 6); // Node point
         ctx.fillRect(x2 - 3, y2 - 3, 6, 6); // Node point
     }
}

function drawTransportBackgroundDetails() {
     // Draw subtle flowing lines (TCP streams)
     ctx.strokeStyle = "rgba(255, 255, 255, 0.08)";
     ctx.lineWidth = 2;
     for (let i = 0; i < 6; i++) {
         ctx.beginPath();
         ctx.moveTo(0, Math.random() * canvas.height);
         ctx.bezierCurveTo(
             canvas.width * 0.3, Math.random() * canvas.height,
             canvas.width * 0.7, Math.random() * canvas.height,
             canvas.width, Math.random() * canvas.height
         );
         ctx.stroke();
     }
}
function drawSessionBackgroundDetails() {
     // Draw subtle handshake/dialogue symbols
     ctx.fillStyle = "rgba(255, 255, 255, 0.1)";
     ctx.font = "18px sans-serif";
     for (let i = 0; i < 10; i++) {
         const x = Math.random() * canvas.width;
         const y = Math.random() * canvas.height;
         ctx.fillText("SYN", x, y);
         ctx.fillText("ACK", x + Math.random()*50 - 25, y + Math.random()*50 - 25);
     }
}

function drawPresentationBackgroundDetails() {
     // Draw subtle code/format symbols { } <> /
     ctx.fillStyle = "rgba(255, 255, 255, 0.07)";
     ctx.font = "16px monospace";
     const symbols = ["{ }", "< >", "/>", "[ ]", "()"];
     for (let i = 0; i < 15; i++) {
         const x = Math.random() * canvas.width;
         const y = Math.random() * canvas.height;
         ctx.fillText(symbols[Math.floor(Math.random() * symbols.length)], x, y);
     }
}

function drawApplicationBackgroundDetails() {
     // Draw subtle application icons (simplified)
     ctx.strokeStyle = "rgba(255, 255, 255, 0.1)";
     ctx.lineWidth = 2;
     const icons = ["✉️", "🌐", "📁", "⚙️"]; // Placeholder icons
     for (let i = 0; i < 8; i++) {
         const x = Math.random() * (canvas.width - 40);
         const y = Math.random() * (canvas.height - 40);
         // ctx.strokeRect(x, y, 30, 30); // Simple square icon
         ctx.font = "24px sans-serif"; // Use actual icons if font supports
         ctx.globalAlpha = 0.1;
         ctx.fillText(icons[Math.floor(Math.random() * icons.length)], x, y + 25);
         ctx.globalAlpha = 1.0; // Reset alpha
     }
}
