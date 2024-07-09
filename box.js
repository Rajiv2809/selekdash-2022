class Box{
    constructor(game){
        this.game = game;

        this.color = Math.floor(Math.random() * 4) ;
        this.width = 50;
        this.height = 50;
        this.x =  Math.floor(Math.random() * this.game.width - 200 - this.height) ;
        this.y = 120 + Math.floor(Math.random() * (this.game.height - 400));
        
    }
    draw(){
        if(this.color === 0 ){
            this.game.ctx.fillStyle = "red";
        } else if(this.color === 1){
            this.game.ctx.fillStyle = "blue";
        } else if(this.color === 2) {
            this.game.ctx.fillStyle = "orange";
        } else if(this.color === 3){
            this.game.ctx.fillStyle = 'green'
        }
        
        this.game.ctx.fillRect(this.x, this.y , this.width, this.height);
    }
}