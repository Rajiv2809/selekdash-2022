class Coin {
    constructor(game, x, y) {
        this.x = x;
        this.y = y;
        this.width = 20;
        this.height = 20;
        this.game = game;
    }

    draw() {
        this.game.ctx.fillStyle = 'yellow';
        this.game.ctx.beginPath();
        this.game.ctx.arc(this.x + this.width / 2, this.y + this.height / 2, this.width / 2, 0, Math.PI * 2);
        this.game.ctx.fill();
    }

    update() {
        // For now, coins are static so no need to update position
    }
}