window.addEventListener('load', function(){
    //Canvas setup
    const canvas = document.getElementById('canvas1');
    const ctx = canvas.getContext('2d');
    canvas.width = 1500;
    canvas.height = 500;

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
                    game.player.moving = false; // Stop movement on key release
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
            this.x = 50;
            //this.y = 100;
            this.frameX = 0;
            this.frameY = 0;
            this.maxFrame = 2;
            this.fps = 0;
            this.currentLane = 2; // Start in the middle lane (lane index 2)
            this.targetLane = this.currentLane;
            this.y = this.calculateLaneCenterY(this.currentLane); // Calculate initial y position
            this.laneSpeed = 2;
            this.changingLane = false;
            this.speedy = 0;
            this.speedx = 0;
            this.image = document.getElementById('car');
            this.defaultFuel = 250;
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
                //this.x = 20;
                this.fuel = this.defaultFuel; // (re)move this later
                //this.speedx = 0;
            }

            const targetY = this.calculateLaneCenterY(this.targetLane);
        if (Math.abs(this.y - targetY) > this.laneSpeed) {
            this.y += this.y < targetY ? this.laneSpeed : -this.laneSpeed;
        } else {
            this.y = targetY; // Snap to the target lane if close enough
            this.currentLane = this.targetLane; // Update current lane only after reaching target
            this.moving = false; // Stop movement when the target is reached
        }

            if (this.game.keys.includes('ArrowUp') && (this.y > 0)) {
                this.moveUp();
                //this.speedy = -1;
            }
            else if (this.game.keys.includes('ArrowDown') && (this.y < (canvas.height - this.height))) {
                this.moveDown();
                //this.speedy = 1;
            }
            else {
                //this.speedy = 0;
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

        calculateLaneCenterY(laneIndex) {
            //const canvas = this.game.canvas;
            const laneStartY = canvas.height * 0.4;
            const laneHeight = canvas.height * 0.6 / 5;
            return laneStartY + (laneHeight * laneIndex) + (laneHeight / 2) - (this.height / 2);
        }
    
        moveUp() {
            if (!this.moving && this.targetLane > 0) {
                this.targetLane--; // Update target lane
                this.moving = true; // Start movement
            }
        }
    
        moveDown() {
            if (!this.moving && this.targetLane < 4) {
                this.targetLane++; // Update target lane
                this.moving = true; // Start movement
            }
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
            this.speedx = 1 * -1.5 - 0.5;
            this.markedForDeletion = false;
            this.smooshed = false;
            this.dead = false;
            //this.scrap = 2;
            this.lane = Math.floor(Math.random() * 5); // Random lane index (0-4)
            this.y = this.calculateLaneCenterY(this.lane);
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
            }
            else {
                context.drawImage(this.image, this.frameX * this.width, this.frameY * this.height, this.width, this.height, this.x, this.y, this.width, this.height);
            }    
        }

        calculateLaneCenterY(laneIndex) {
            //const canvas = this.game.canvas;
            const laneStartY = canvas.height * 0.4;
            const laneHeight = canvas.height * 0.6 / 5;
            return laneStartY + (laneHeight * laneIndex) + (laneHeight / 2) - (this.height / 2);
        }
    }

    class uglyMutant extends Mutant {
        constructor(game) {
            super(game);
            this.type = 'ugly';
            this.width = 100;
            this.height = 60;
            //this.y = Math.random() * (this.game.height * 0.9 - this.height);
            this.lane = Math.floor(Math.random() * 5); // Random lane index (0-4)
            this.y = this.calculateLaneCenterY(this.lane);
            this.maxFrame = 1;
            this.image = document.getElementById('uglyMutant');
            this.imageSmooshed = document.getElementById('uglyMutantSmooshed');
            this.scrap = Math.floor(Math.random() * 3) + 1;;
        }
    }

    class Layer {
        constructor(game, image, speedModifier) {
            this.game = game;
            this.image = image;
            this.speedModifier = speedModifier;
            this.width = 1768;
            this.height = 500;
            this.x = 0;
            this.y = 0;
        }

        update() {
            if (this.x <= -this.width) this.x = 0;
            this.x -= this.game.speed * this.speedModifier;
        }

        draw(context) {
            context.drawImage(this.image, this.x, this.y);
            context.drawImage(this.image, this.x + this.width, this.y);
        }
    }


    class Background {
        constructor(game) {
            this.game = game;
            this.image1 = document.getElementById("layer1");
            this.farGround = new Layer(this.game, this.image1, 6);
            this.image2 = document.getElementById("layer2");
            this.backGround = new Layer(this.game, this.image2, 4);
            this.image3 = document.getElementById("layer3");
            this.midGround = new Layer(this.game, this.image3, 2);
            this.image4 = document.getElementById("layer4");
            this.foreGround = new Layer(this.game, this.image4, 1);
            this.layers = [this.farGround, this.backGround, this.midGround];
        }

        update() {
            this.layers.forEach(layer => layer.update());
        }

        draw(context) {
            this.layers.forEach(layer => layer.draw(context));
        }
    }

    class RoadUI {
        constructor (game){
            this.game = game;
            this.player = this.game.player;
            this.fontSize = 20;
            this.fontFamily = 'Enraged';
            this.x = 500;
            this.y = 400;
            this.scrapCount = document.getElementById('scrapCount');
            this.cHeight = canvas.height; // Start from bottom of the canvas
            this.lines = []; // Array to store wrapped lines
        }
        
        draw(context) {
            //fuelGuage
            context.fillStyle = "rgba(0, " + (this.player.fuel+100) + ", 0, 1)";
            context.fillRect(this.x, this.y, this.player.fuel, 30);

            //scrapCounter
            context.font = this.fontSize*2 + "px " + this.fontFamily;
            context.fillStyle = "blue";
            context.fillText("Scrap:" + this.player.scrap, 20, 40);

            if (this.game.runEnded) {
                context.textAlign = "center";
                let message1 = "Out of Fuel";
                let message2 = "Scrap:" + this.player.scrap;
                context.fillText(message1, this.game.width * 0.5, this.game.height * 0.5 - 40);
                context.fillText(message2, this.game.width * 0.5, this.game.height * 0.5 + 40);
            }
        }

        /*fuelGauge(context) {
                //context.fillRect(this.x, this.y, this.game.fuel, this.height);
                context.fillStyle = "rgba(0, " + (this.player.fuel+100) + ", 0, 1)";
                context.fillRect(this.x, this.y, this.player.fuel, 30);
        }

        scrapCounter(context) {
            context.font = this.fontSize*2 + "px " + this.fontFamily;
            context.fillStyle = "blue";
            context.fillText("Scrap:" + this.player.scrap, 20, 40);
        }*/

        storyScroll(context) {
            const x = canvas.width * 0.5;
            const y = 50;
            const paraWidth = canvas.width - 400;
            const lineHeight = 40;
            context.fillRect(0, 0, canvas.width, canvas.height);
            context.font = this.fontSize*2 + "px " + this.fontFamily;
            context.fillStyle = "yellow";
            context.textAlign = "center";
            const storyP1 = "10 years ago, an extinction level event called \“The Eruption\” sent civilization spiralling into a post-apocalyptic nightmare.";
            this.wrapText(ctx, storyP1, x, y, paraWidth, lineHeight);
            const storyP2 = "Geysers of an ancient undiscovered ooze exploded from the ground with volcanic force, throwing thick avalanches of toxic lava and full plumes of mutagenic poison almost everywhere.";
            this.wrapText(ctx, storyP2, x, y*4, paraWidth, lineHeight);
            const storyP3 = "The survivors must fight for scrap and keep moving in a world overrun by mutant monsters using every ounce of metal and mettle to reach the end of the road…";
            this.wrapText(ctx, storyP3, x, y*8, paraWidth, lineHeight);
        }

        wrapText(ctx, text, x, y, maxWidth, lineHeight) {
            const words = text.split(' ');
            let line = '';
            
            words.forEach(word => {
                const testLine = line + word + ' ';
                if (ctx.measureText(testLine).width > maxWidth) {
                    ctx.fillText(line, x, y); // Draw the line
                    line = word + ' '; // Start a new line
                    y += lineHeight; // Move down to the next line
                } else {
                    line = testLine; // Add word to the current line
                }
            });
        
        ctx.fillText(line, x, y); // Draw the last line
        }
    }

    class GarageUI {
        constructor (game){
            this.game = game;
            this.player = this.game.player;
            this.fontSize = 20;
            this.fontFamily = 'Enraged';
            this.x = 500;
            this.y = 400;
            this.scrapCount = document.getElementById('scrapCount');
            this.cHeight = canvas.height; // Start from bottom of the canvas
            this.lines = []; // Array to store wrapped lines
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
            const y = 50;
            const paraWidth = canvas.width - 400;
            const lineHeight = 40;
            context.fillRect(0, 0, canvas.width, canvas.height);
            context.font = this.fontSize*2 + "px " + this.fontFamily;
            context.fillStyle = "yellow";
            context.textAlign = "center";
            const storyP1 = "10 years ago, an extinction level event called \“The Eruption\” sent civilization spiralling into a post-apocalyptic nightmare.";
            this.wrapText(ctx, storyP1, x, y, paraWidth, lineHeight);
            const storyP2 = "Geysers of an ancient undiscovered ooze exploded from the ground with volcanic force, throwing thick avalanches of toxic lava and full plumes of mutagenic poison almost everywhere.";
            this.wrapText(ctx, storyP2, x, y*4, paraWidth, lineHeight);
            const storyP3 = "The survivors must fight for scrap and keep moving in a world overrun by mutant monsters using every ounce of metal and mettle to reach the end of the road…";
            this.wrapText(ctx, storyP3, x, y*8, paraWidth, lineHeight);
        }

        wrapText(ctx, text, x, y, maxWidth, lineHeight) {
            const words = text.split(' ');
            let line = '';
            
            words.forEach(word => {
                const testLine = line + word + ' ';
                if (ctx.measureText(testLine).width > maxWidth) {
                    ctx.fillText(line, x, y); // Draw the line
                    line = word + ' '; // Start a new line
                    y += lineHeight; // Move down to the next line
                } else {
                    line = testLine; // Add word to the current line
                }
            });
        
        ctx.fillText(line, x, y); // Draw the last line
        }
    }
    
    class Intro {
        constructor (width, height) {
            this.width = width;
            this.height = height;
            this.UI = new RoadUI(this);
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
            this.BG = new Background(this);
            this.RoadUI = new RoadUI(this);
            this.mutants = [];
            this.mutantTimer = 0;
            this.mutantInterval = 1000;
            this.keys = [];
            this.runEnded = false;
            this.gameOver = false;
            this.speed = 1;
            //this.fuel = 100;
        }

        update(deltaTime) {
            this.BG.update();
            this.player.update();
            //console.log(this.player.fuel);
            this.BG.foreGround.update();
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
            this.checkFuel() 
        }

        draw(context) {
            this.BG.draw(context);
            
            //this.RoadUI.fuelGauge(context);
            //this.RoadUI.scrapCounter(context);
            this.RoadUI.draw(context);
            this.mutants.forEach(mutant => { 
                mutant.draw(context); 
             });
             this.player.draw(context);
             this.BG.foreGround.draw(context);
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

        checkFuel() {
            if (this.player.fuel == 0) {
                this.runEnded = true;
                intro.intro = true;
                cancelAnimationFrame(theRoad);
            }
        }

        
    }
    
    const intro= new Intro(canvas.width, canvas.height);
    const game = new Game(canvas.width, canvas.height);
    
    let lastTime = 0;
    //let intro = true;
    if (intro.intro) {
        intro.draw(ctx);
        closeStoryButton.onclick = function() {
            intro.intro = false;
            animate(0);
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
