class Game {
    constructor(canvas,) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.width = canvas.width;
        this.height = canvas.height;
        this.player = new Player(this);
        this.stage = null;
        this.level = null;
        this.character = null;
        this.startGame = false;
        this.gravity = 0.15;
        this.difficulty = level;
        this.meteors = [];
        this.playerName = 'rajiv';
        this.score = 0;
        this.lifeTime = 20000;
        this.gameOver = false;
        this.health = 5;
        this.maxHealth = [
            new Health(this, 50),
            new Health(this, 110),
            new Health(this, 170),
            new Health(this, 230),
            new Health(this, 290),
        ];

        this.platforms = [
            new Platform(this, 60, 450, 200, 30, 1, 50),
            new Platform(this, 220, 380, 250, 30, 1.5, 75),
            new Platform(this, 430, 470, 240, 30, 2, 100),
            new Platform(this, 600, 350, 180, 30, 2, 40)
        ];
        this.boxes = [];

        if(this.startGame){

            this.startMeteorInterval();
            this.startBoxInterval();
        }  
        this.startBoxInterval();
        this.startMeteorInterval();


        window.addEventListener('keydown', e => {
            if (!this.gameOver) {

                if (e.key.toLowerCase() === 'd') this.player.startMoveRight();
                if (e.key.toLowerCase() === 'a') this.player.startMoveLeft();
                if (e.key.toLowerCase() === 'w') this.player.playerJump();
            }
        });

        window.addEventListener('keyup', e => {
            if (e.key.toLowerCase() === 'd') this.player.stopMoveRight();
            if (e.key.toLowerCase() === 'a') this.player.stopMoveLeft();
        });
        this.coins = [];
        this.initialCoinSpawn();

    }
   

    startMeteorInterval() {
            setInterval(() => {
                if (!this.gameOver) {
                    let initialMeteorCount;
                    if (this.level === 'easy') initialMeteorCount = 2;
                    else if (this.level === 'medium') initialMeteorCount = 3;
                    else if (this.level === 'hard') initialMeteorCount = 4;

                    for (let i = 0; i < initialMeteorCount; i++) {
                        this.meteors.push(new Meteor(this));
                    }
                }

            }, 2000); // 0.5 seconds
        
    }

    startBoxInterval() {


        setInterval(() => {
            if (!this.gameOver) {
                this.boxes.push(new Box(this))


            }
        }, 3000)

    }

    draw() {
        this.ctx.fillStyle = 'blue';
        this.ctx.fillRect(this.width - 200, 0, 200, this.height);
    }

    render() {
        this.checkHealth()
        this.player.draw();
        this.player.update();
        this.platforms.forEach(platform => {
            platform.draw();
        });

        this.player.checkCollisionWithMeteors();
        this.player.checkCollidingWithCoins();
        this.player.checkCollidingBox();
        this.player.checkIfPlayerFall();
        if (!this.gameOver & this.startGame) this.lifeTime -= 16
        this.draw();
        this.boxes.forEach(box => {
            box.draw()
        })
        this.meteors.forEach(meteor => {
            meteor.draw();
            if (!this.gameOver) meteor.update();
        });

        this.coins.forEach(coin => (
            coin.draw()
        ));
        this.maxHealth.forEach(health => {
            health.draw();
        });
        this.drawStatus();
        this.healthPlayer();


    }
    formatTimer() {
        return (this.lifeTime / 1000).toFixed(1); // Convert milliseconds to seconds
    }
    drawStatus() {
        this.ctx.save();
        this.ctx.font = '40px Arial';
        this.ctx.fillStyle = "black";
        this.ctx.fillText('Selekdash', 40, 65);
        this.ctx.font = '20px Arial';
        this.ctx.fillText('Player : ' + this.playerName, 40, 105)
        if (this.lifeTime > 0) {
            this.ctx.fillText('Llife Time : ' + this.formatTimer(), 40, 130);
        } else {
            this.lifeTime = 0;
            this.ctx.fillText('Life Time : ' + this.formatTimer(), 40, 130);
        }
        this.ctx.fillText('Score : ' + this.score, 40, 155)
        this.ctx.restore();
    }
    checkHealth() {
        if (this.health <= 0 || this.lifeTime <= 0) {
            this.gameOver = true;

        }
    }

    initialCoinSpawn() {
        for (let i = 0; i < 3; i++) {
            this.spawnCoin();
        }
    }
    spawnCoin() {
        if (this.platforms.length > 0) {
            const platform = this.platforms[Math.floor(Math.random() * this.platforms.length)];
            const x = platform.x + Math.random() * (platform.width - 20); // Ensure coin is within platform bounds
            const y = platform.y - 20; // Place coin on top of platform
            this.coins.push(new Coin(this, x, y));
        }

    }
    healthPlayer() {
        for (let i = 0; i < this.maxHealth.length; i++) {
            if (i < this.health) {
                this.maxHealth[i].update();

            } else {
                // Reset the color if the health object is not active
                this.maxHealth[i].color = 'gray';
            }
        }
    }

}


class Menu {
    constructor(game) {

        this.game = game;
        this.instructionDiv = document.querySelector('.instruction');
        this.characterSelectDiv = document.querySelector('.character-select');
        this.countdownDiv = document.querySelector('.countdown');
        this.countdownTimer = document.getElementById('countdown-timer');

        this.usernameInput = document.getElementById('username');
        this.agreeButton = document.getElementById('agree');
        this.playButton = document.getElementById('play');
        this.levelSelect = document.getElementById('level');

        this.setupEventListeners();
    }

    setupEventListeners() {
        this.usernameInput.addEventListener('input', () => {
            this.agreeButton.disabled = !this.usernameInput.value.trim();
        });

        this.agreeButton.addEventListener('click', () => {
            this.username = this.usernameInput.value.trim();
            this.showCharacterSelect();
        });

        document.querySelectorAll('.character').forEach(button => {
            button.addEventListener('click', (event) => {
                this.selectCharacter(event.target);
            });
        });

        document.getElementById('random-character').addEventListener('click', () => {
            this.randomSelectCharacter();
        });

        document.querySelectorAll('.stage').forEach(button => {
            button.addEventListener('click', (e) => {
                this.selectStage(e.target);
            });
        });

        document.getElementById('random-stage').addEventListener('click', () => {
            this.randomSelectStage();
        });

        this.levelSelect.addEventListener('change', () => {
            this.game.level = this.levelSelect.value;
            this.checkPlayButton();
        });

        this.playButton.addEventListener('click', () => {
            this.startCountdown();
        });
    }

    selectCharacter(element) {
        document.querySelectorAll('.character').forEach(button => {
            button.classList.remove('border');
        });
        element.classList.add('border');
        this.game.character = element.id;
        this.checkPlayButton();
    }

    randomSelectCharacter() {
        const randomIndex = Math.floor(Math.random() * 4) + 1;
        const randomCharacter = document.getElementById(`char${randomIndex}`);
        this.selectCharacter(randomCharacter);
        alert(`Randomly selected Character ${randomIndex}`);
    }

    selectStage(element) {
        document.querySelectorAll('.stage').forEach(button => {
            button.classList.remove('border');
        });
        element.classList.add('border');
        this.game.stage = element.id;
        this.checkPlayButton();
    }

    randomSelectStage() {
        const randomIndex = Math.floor(Math.random() * 4) + 1;
        const randomStage = document.getElementById(`stage${randomIndex}`);
        this.selectStage(randomStage);
        alert(`Randomly selected Stage ${randomIndex}`);
    }

    checkPlayButton() {
        this.playButton.disabled = !(this.game.character && this.game.stage && this.game.level);
    }

    showCharacterSelect() {
        this.instructionDiv.classList.add('hidden');
        this.characterSelectDiv.classList.remove('hidden');
    }

    startCountdown() {
        this.characterSelectDiv.classList.add('hidden');
        this.countdownDiv.classList.remove('hidden');
        let count = 3;
        this.countdownTimer.textContent = count;

        const interval = setInterval(() => {
            count--;
            if (count > 0) {
                this.countdownTimer.textContent = count;
            } else {
                clearInterval(interval);
                this.startGame();
            }
        }, 1000);
    }


    startGame() {
        this.countdownDiv.classList.add('hidden');
        // Initialize the game with the selected difficulty level
        const canvas = document.getElementById('canvas');
        canvas.classList.remove('hidden');
        this.game.startGame = true;
       

        // this.game.startMeteorInterval();
        // this.game.startBoxInterval();
        //     const game = new Game(canvas, this.level);
        //     const menu = new Menu(game);
        //     menu.setupEventListeners()
        //     function animate() {
        //         const ctx = canvas.getContext('2d');
        //         ctx.clearRect(0, 0, canvas.width, canvas.height);
        //         game.render();
        //         requestAnimationFrame(animate);
        //     }

        //     requestAnimationFrame(animate);
    }
}




window.addEventListener('load', function () {
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = 1000;
    canvas.height = 600;

    // Set the difficulty level here ('easy', 'medium', or 'hard')

    const game = new Game(canvas,);
    const menu = new Menu(game)
    menu.setupEventListeners()
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        if (game.character && game.stage && game.level) {
            game.render()
        }
        requestAnimationFrame(animate);
    }

    requestAnimationFrame(animate);
});
