class Platform {
    constructor(game, x, y, width, height, speedY = 0, range = 0) {
        this.game = game;
        this.x = x; // X position
        this.y = y; // Y position
        this.width = width; // Platform width
        this.height = height; // Platform height
        this.speedY = speedY; // Vertical speed for floating
        this.range = range; // Range for floating
        this.initialY = y; // Store initial Y position
    }

    draw() {
        this.game.ctx.fillStyle = 'brown'; // Color of the platform
        this.game.ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}