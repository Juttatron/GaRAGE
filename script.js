window.addEventListener('load', function(){
    //Canvas setup
    const canvas = document.getElementById('canvas1');
    const ctx = canvas.getContext('2d');
    canvas.width = 1500;
    canvas.height = 500;
    const canvas2 = document.getElementById('canvas2');
    const ctx2 = canvas2.getContext('2d');
    canvas2.width = 1500;
    canvas2.height = 500;
    const closeStoryButton = document.getElementById("closeStoryButton");

    class InputHandler {
        constructor(game) {
            this.game = game;
            window.addEventListener('keydown', e => {
                if (((e.key === 'ArrowUp') || (e.key === 'ArrowDown'))
                    && this.game.keys.indexOf(e.key) === -1) {
                    this.game.keys.push(e.key);
                }
                console.log(this.game.keys);
            });
            window.addEventListener('keyup', e => {
                if (this.game.keys.indexOf(e.key) > -1) {
                    this.game.keys.splice(this.game.keys.indexOf(e.key), 1);
                }
                console.log(this.game.keys);
            });
        }
    }

    class Projectile {

    }

    class Particle {

    }
    
    class Player {
        constructor(game) {
            this.game = game;
            this.width = 190;
            this.height = 120;
            this.x = 20;
            this.y = 100;
            this.frameX = 0;
            this.frameY = 0;
            this.maxFrame = 2;
            this.fps = 0;
            this.speedy = 0;
            this.speedx = 1;
            this.image = document.getElementById('car');
            this.defaultFuel = 100;
            this.fuel = this.defaultFuel;
            this.armour = 0;
            this.seats = 0;
            this.tank = 0;
            this.engine = 0;
            this.tires = 0;
            this.scrap = 0; 
        }

        update() {
            this.y += this.speedy;
            this.x += this.speedx;
            if (this.fuel < 1) {
                this.x = 20;
                this.fuel = this.defaultFuel; // (re)move this later
            }

            if (this.game.keys.includes('ArrowUp') && (this.y > 0)) {
                this.speedy = -1;
            }
            else if (this.game.keys.includes('ArrowDown') && (this.y < (canvas.height - this.height))) {
                this.speedy = 1;
            }
            else {
                this.speedy = 0;
            }
            
            if (this.frameX < this.maxFrame){
                this.fps++;
                if (this.fps === 8) {
                    this.frameX++;
                    this.fps = 0; 
                } 
            }
            else {
                this.frameX = 0;
                this.fuel += -1;
            }
        }

        draw(context) {
            //context.fillRect(this.x, this.y, this.width, this.height);
            context.drawImage(this.image, this.frameX * this.width, this.frameY * this.height, this.width, this.height, this.x, this.y, this.width, this.height);
        }
    }

    class Mutant {
        constructor(game) {
            this.game = game;
            this.player = this.game.player;
            this.x = this.game.width;
            this.frameX = 0;
            this.frameY = 0;
            this.fps = 0;
            this.speedx = Math.random() * -1.5 - 0.5;
            this.markedForDeletion = false;
            this.smooshed = false;
            this.dead = false;
            //this.scrap = 2;
        }

        update() {
            this.x += this.speedx;
            if (this.x + this.width < 0) this.markedForDeletion = true;
            if (this.smooshed) {
                if (!this.dead) {
                    this.dead = true;
                    this.player.scrap += this.scrap;
                }
            }

            if (this.frameX < this.maxFrame){
                this.fps++;
                if (this.fps === 8) {
                    this.frameX++;
                    this.fps = 0; 
                } 
            }
            else {
                this.frameX = 0;
                this.fuel += -1;
            }
        }

        draw(context) {
            if (this.smooshed) {
                context.drawImage(this.imageSmooshed, this.frameX * this.width, this.frameY * this.height, this.width, this.height, this.x, this.y, this.width, this.height);
                //context.fillStyle = 'green';
                //context.fillRect(this.x, this.y+10, this.width, this.height/2);
            }
            else {
                context.drawImage(this.image, this.frameX * this.width, this.frameY * this.height, this.width, this.height, this.x, this.y, this.width, this.height);
                //context.fillStyle = 'red';
                //context.fillRect(this.x, this.y, this.width, this.height);
            }    
        }
    }

    class uglyMutant extends Mutant {
        constructor(game) {
            super(game);
            this.type = 'ugly';
            this.width = 100;
            this.height = 60;
            this.y = Math.random() * (this.game.height * 0.9 - this.height);
            this.maxFrame = 1;
            this.image = document.getElementById('uglyMutant');
            this.imageSmooshed = document.getElementById('uglyMutantSmooshed');
            this.scrap = Math.floor(Math.random() * 3) + 1;;
        }
    }

    class Layer {

    }

    class Background {

    }

    class UI {
        constructor (game){
            this.game = game;
            this.player = this.game.player;
            this.fontSize = 20;
            this.fontFamily = 'Enraged';
            this.x = 500;
            this.y = 400;
            this.scrapCount = document.getElementById('scrapCount');
        }
        
        draw() {

        }

        fuelGauge(context) {
                //context.fillRect(this.x, this.y, this.game.fuel, this.height);
                context.fillStyle = "rgba(0, " + (this.player.fuel+100) + ", 0, 1)";
                context.fillRect(this.x, this.y, this.player.fuel, 30);
        }

        scrapCounter(context) {
            context.font = this.fontSize*2 + "px " + this.fontFamily;
            context.fillStyle = "blue";
            context.fillText("Scrap:" + this.player.scrap, 20, 40);
        }

        storyScroll(context) {
            const x = canvas.width * 0.5;
            context.font = this.fontSize*2 + "px " + this.fontFamily;
            //context.style.textAlign = "center";
            context.fillStyle = "yellow";
            const line1 = context.fillText("10 years ago, an extinction level event called \“The Eruption\”", 10, 40);
            context.fillText("sent civilization spiralling into a post-apocalyptic nightmare.", 20, 100);
        }
    }
    
    class Intro {
        constructor (width, height) {
            this.width = width;
            this.height = height;
            this.UI = new UI(this);
            this.intro = true;
        }

        draw(context) {
            this.UI.storyScroll(context)
        }
    }

    class Game {
        constructor(width, height) {
            this.width = width;
            this.height = height;
            this.player = new Player(this);
            this.input = new InputHandler(this);
            this.UI = new UI(this);
            this.mutants = [];
            this.mutantTimer = 0;
            this.mutantInterval = 1000;
            this.keys = [];
            this.endRun = false;
            this.gameOver = false;
            //this.fuel = 100;
        }

        update(deltaTime) {
            this.player.update();
            //console.log(this.player.fuel);
            this.mutants.forEach(mutant => { 
               mutant.update();
               if (this.checkCollision(this.player, mutant)) {
                    mutant.smooshed = true;
                    //this.player.scrap += mutant.scrap;
               } 
            });
            this.mutants = this.mutants.filter(mutant => !mutant.markedForDeletion);
            if (this.mutantTimer > this.mutantInterval && !this.gameOver) {
                this.addMutant();
                this.mutantTimer = 0;
                //console.log(this.mutants);
            }
            else {
                this.mutantTimer += deltaTime;
            }
        }

        draw(context) {
            this.player.draw(context);
            this.UI.fuelGauge(context);
            this.UI.scrapCounter(context);
            this.mutants.forEach(mutant => { 
                mutant.draw(context); 
             });
        }

        addMutant() {
            this.mutants.push(new uglyMutant(this));
        }

        checkCollision(rect1, rect2) {
            return (
                rect1.x < rect2.x + rect2.width && 
                rect1.x + rect1.width > rect2.x &&
                rect1.y < rect2.y + rect2.height &&
                rect1.y + rect1.height > rect2.y
            )
        }
    }
    
    const intro = new Intro(canvas2.height, canvas2.width);
    const game = new Game(canvas.width, canvas.height);
    
    let lastTime = 0;
    //let intro = true;
    if (intro.intro) {
        intro.draw(ctx);
        closeStoryButton.onclick = function() {
            canvas2.style.display = "none";
            intro.intro = false;
        };
    }

    // animation loop
    function animate(timeStamp) {
        // delta time
        const deltaTime = timeStamp - lastTime;
        lastTime = timeStamp;
        //console.log(deltaTime);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        game.update(deltaTime);
        game.draw(ctx);
        requestAnimationFrame(animate);
    }

    //animate(0);
});
