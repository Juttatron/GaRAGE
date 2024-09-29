window.addEventListener('load', function(){
    //Canvas setup
    const canvas = document.getElementById('canvas1');
    const ctx = canvas.getContext('2d');
    canvas.width = 1500;
    canvas.height = 500;

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
            this.speedy = 0;
            this.speedx = 1;
        }

        update() {
            this.y += this.speedy;
            this.x += this.speedx;
            if (this.x > (canvas.width - this.width)) {
                this.x = 20;
            }

            if (this.y > (canvas.height - this.height)) {
                this.speedy = -1;
            }
            else if (this.y < 0) {
                this.speedy = 1;
            }

            if (this.game.keys.includes('ArrowUp')) {
                this.speedy = -1;
            }
            else if (this.game.keys.includes('ArrowDown')) {
                this.speedy = 1;
            }
        }

        draw(context) {
            context.fillRect(this.x, this.y, this.width, this.height);
        }
    }

    class Enemy {

    }

    class Layer {

    }

    class Background {

    }

    class UI {

    }
    
    class Game {
        constructor(width, height) {
            this.width = width;
            this.height = height;
            this.player = new Player(this);
            this.input = new InputHandler(this);
            this.keys = [];
        }

        update() {
            this.player.update();
        }

        draw(context) {
            this.player.draw(context);
        }

    }

    const game = new Game(canvas.width, canvas.height);
    
    // animation loop
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        game.update();
        game.draw(ctx);
        requestAnimationFrame(animate);
    }

    animate();
});