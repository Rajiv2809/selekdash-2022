class Meteor {
    constructor(game){
        this.x = Math.floor(Math.random() * (game.width - 240  ));
        this.y = 30;
        this.height = 30;
        this.width = 30;
        this.speed = 2;
        this.meteorInterVal = 0.5;
        this.game = game;
        
    }
    update(){
        this.y += this.speed;

    }
    draw(){
        this.game.ctx.fillStyle = 'red';
        this.game.ctx.fillRect(this.x, this.y, this.width, this.height)    
    }
    update(){
        this.y += this.speed;

    }
    
}