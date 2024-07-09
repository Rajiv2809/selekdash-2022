class Health{
    constructor(game, x){
        this.game = game
        this.x = game.width - 250 - x
        this.y = 40;
        this.color ;
    }
    draw(){
        this.game.ctx.fillStyle = this.color;
        this.game.ctx.fillRect(this.x ,this.y , 50, 50)
    }
    update(){
        this.color = 'pink'
    }
}