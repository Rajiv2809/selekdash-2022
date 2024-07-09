class Player {
    constructor(game) {
        this.game = game;
        this.x = game.width - (game.width/2) - 40; // Initializing x position
        this.y = game.height - 40 - (game.height/2); // Initializing y position to be on the ground
        this.spriteHeight = 40;
        this.spriteWidth = 40;
        this.height = 40;
        this.width = 40;
        this.speedX = 0; // Initial horizontal speed is 0
        this.maxSpeedX = 4; // Maximum horizontal speed
        this.speedY = 0; // Initial vertical speed is 0
        this.jumpSpeed = -10; // Negative value to move upwards
        this.gravity = 0.35; // Gravity to pull the player down
        this.grounded = false; // To check if the player is on the ground or platform
        this.boostedSpeedX = 6;
    }

    draw() {
        this.game.ctx.fillStyle = 'red';
        this.game.ctx.fillRect(this.x, this.y, this.spriteWidth, this.spriteHeight);
    }

    update() {
        // Apply gravity
        this.speedY += this.gravity;

        // Update the player's position
        this.y += this.speedY;
        this.x += this.speedX;

        // Check if the player is touching the bottom
        if (this.isTouchingBottom()) {
            this.y = this.game.height - this.height;
            this.speedY = 0;
            this.grounded = true;
        } else {
            this.grounded = false;
        }

        // Prevent the player from going through the top
        if (this.isTouchingTop()) {
            this.y = 0;
            this.speedY = 0;
        }
        if (this.touchingLeft()) {
            this.x = 0;
        }
        let onPlatform = false;
        this.game.platforms.forEach(platform => {
            if (this.isTouchingPlatform(platform)) {
                this.y = platform.y - this.height;
                this.speedY = 0;
                onPlatform = true;
            }
        });
        
        if (onPlatform) {
            this.grounded = true;
        }

        if (this.touchingRight()) {
            this.x  = this.game.width - this.spriteWidth - 200;
        }
      
    }

    isTouchingBottom() {
        return this.y >= this.game.height - this.height;
    }

    isTouchingTop() {
        return this.y <= 0;
    }

    startMoveRight() {
        this.speedX = this.maxSpeedX;
    }

    startMoveLeft() {
        this.speedX = -this.maxSpeedX;
    }

    stopMoveRight() {
        if (this.speedX > 0) this.speedX = 0;
    }

    stopMoveLeft() {
        if (this.speedX < 0) this.speedX = 0;
    }

    playerJump() {
        if (this.grounded) {
            this.speedY = this.jumpSpeed;
            this.grounded = false;
        }
    }


    touchingLeft() {
        return this.x <= 0;
    }

    touchingRight() {
        return this.x >= this.game.width - this.spriteWidth - 200;
    }

    checkCollisionWithMeteors(){
        this.game.meteors.forEach(meteor => {
            if(this.isCollidingMeteors(meteor)){
                this.game.health = this.game.health - 1;
                console.log(this.game.health);
                this.game.meteors.splice(this.game.meteors.indexOf(meteor), 1);
            }
        })
    }

    isCollidingMeteors(meteor){
            const playerRight = this.x + this.width;
            const playerBottom = this.y + this.height;
            const meteorRight = meteor.x + meteor.width;
            const meteorBottom = meteor.y + meteor.height;
    
            return this.x < meteorRight &&
                playerRight > meteor.x &&
                this.y < meteorBottom &&
                playerBottom > meteor.y;
    }
    checkCollidingWithCoins(){
        this.game.coins.forEach(coin => {
            if(this.isCollidingCoins(coin)){
                this.game.score = this.game.score + 1;
                this.game.coins.splice(this.game.coins.indexOf(coin), 1);
                this.game.spawnCoin();
            }
        })
    }
    isCollidingCoins(coin){
        const playerRight = this.x + this.width;
        const playerBottom = this.y + this.height;
        const coinRight = coin.x + coin.width;
        const coinBottom = coin.y + coin.height;

        return this.x < coinRight &&
            playerRight > coin.x &&
            this.y < coinBottom &&
            playerBottom > coin.y;
    }
    checkIfPlayerFall(){
        if(this.y >= this.game.height-this.height){
            this.x = this.game.width - (this.game.width/2) - 40;
            this.y = this.game.height - 40 - (this.game.height/2);
            this.game.health = this.game.health - 1;
        }
    }
    isCollidindBox(box){
        const playerRight = this.x + this.width;
        const playerBottom = this.y + this.height;
        const boxRight = box.x + box.width;
        const boxBottom = box.y + box.height;
        return this.x < boxRight &&
            playerRight > box.x &&
            this.y < boxBottom &&
            playerBottom > box.y;
    }
    checkCollidingBox(){
        this.game.boxes.forEach(box => {
            if(this.isCollidindBox(box)){
                if(box.color === 0){
                    this.game.health = this.game.health - 1;
                    this.game.boxes.splice(this.game.boxes.indexOf(box), 1)
                } else if(box.color === 1){
                    this.maxSpeedX = this.boostedSpeedX;
                    setTimeout(() => {
                        this.maxSpeedX = 4; // Revert to normal speed after 3 seconds
                    }, 3000);
                    this.game.boxes.splice(this.game.boxes.indexOf(box), 1);
                }else if(box.color === 2){
                    if(this.game.health < 5){
                        this.game.health = this.game.health + 1;
                    }

                    this.game.boxes.splice(this.game.boxes.indexOf(box), 1)
                }else if(box.color === 3){
                    this.game.lifeTime = this.game.lifeTime + 10000
                    this.game.boxes.splice(this.game.boxes.indexOf(box), 1)
                }
                

            }
        })
        
        
    }

    isTouchingPlatform(platform) {
        const playerBottom = this.y + this.height;
        const playerRight = this.x + this.width;
        const playerLeft = this.x;

        const platformTop = platform.y;
        const platformRight = platform.x + platform.width;
        const platformLeft = platform.x;

        // Check if the player is falling onto the platform
        if (playerBottom >= platformTop && playerBottom <= platformTop + this.speedY &&
            playerRight > platformLeft && playerLeft < platformRight) {
            return true;
        }
        return false;
    }

    
}
