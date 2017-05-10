import Act from './baseAct';
import BaseElement from './baseElement';
import { Bubble } from './bubble';

export class Mine {
    constructor (opts = {}) {
        this.imgs = opts.imgs;

        this.width = this.imgs.mine1.naturalWidth || this.imgs.mine1.width;
        this.height = this.imgs.mine1.naturalHeight || this.imgs.mine1.height;

        this.delay = opts.delay || 0;
        this.duration = opts.duration;
        this.boomdelay = opts.boomdelay; //爆炸延迟
        this.floatduration = opts.floatduration;
        this.joggleduration = this.duration - this.floatduration;
    }

    play() {
        this.offsetY = 20;
        this.targetY = window.innerHeight / 2 + this.imgs.mine1.height / 2;
        this.x = this.startX = this.canvas.width / 2 - this.imgs.mine1.width / 2;
        this.y = this.startY = this.canvas.height + this.imgs.mine1.height;

        this.speedY = (this.targetY - this.y) / this.floatduration; // 单位px/ms
        this.speedJoggle = 0.12;

        this.direction = 1;
        this.boomOpacitySpeed = 1 / (this.duration - this.boomdelay);
        this.boomOpacity = 0;

        this.startTime = Date.now();
        this.runTime = 0;

        this.draw();
    };

    update = (time) => {
        this.startTime += time;
        this.runTime += time;

        if(this.runTime < this.delay) {
            return;
        }

        if(this.runTime > this.duration + this.delay) {
            this.end();
            return ;
        }

        if(this.runTime <= this.floatduration + this.delay) {
            this.float(time);
        } else {
            this.joggle(time);
        }

        if(this.runTime >= this.boomdelay + this.delay) {
            this.boom(time);
        }

        this.draw();
    }

    float(time) {
        this.y += (time * this.speedY);
        if(this.y <= this.targetY) {
            this.y = this.targetY;
        }
    }

    joggle(time) {
        this.y -= (time * this.speedJoggle) * this.direction;

        if(this.y <= this.targetY - this.offsetY) { // 超过界限后反弹
            this.y = this.targetY - this.offsetY;
            this.direction = -this.direction; // 方向取反
        }

        if(this.y >= this.targetY) {
            this.y = this.targetY;
            this.direction = -this.direction; // 方向取反
        }

    }

    boom(time) {
        this.boomOpacity += time * this.boomOpacitySpeed;
        if(this.boomOpacity >= 1) {
            this.boomOpacity === 1;
        }
    }

    draw = () => {
        const { ctx } = this;
        ctx.save();

        // ctx.globalAlpha = this.opacity;
        ctx.drawImage(this.imgs.mine1, this.x, this.y, this.width, this.height);

        if(this.boomOpacity !== 0) {
            ctx.globalAlpha = this.boomOpacity;
            ctx.drawImage(this.imgs.mine2, this.x, this.y, this.width, this.height);
        }
        // ctx.translate(-this.x - this.width / 2, -this.y - this.height / 2);
        ctx.restore();
    }

    end() {
        this.onEnd && this.onEnd(this, Date.now());
    }
}

export class Water {
    constructor(opts = {}) {
        this.image = opts.image;
        this.duration = opts.duration;
        this.floatduration = opts.floatduration;
        this.delay = opts.delay || 0;
        this.offsetY = opts.offsetY || 0;
        this.x = opts.x;
        this.y = opts.y + this.offsetY;
        this.opacity = 0;
    }

    play() {
        this.height = this.canvas.width / this.image.width * this.image.height;
        this.width = this.canvas.width;

        // 防止屏幕过矮的情况
        this.targetY = Math.min(0, this.canvas.height - this.height) + this.offsetY;

        this.speedX = -0.02;
        this.speedY = (this.targetY - this.y) / this.floatduration;
        this.speedOpacity = 0.01;

        this.startTime = Date.now();
        this.runTime = 0;
        this.draw();
    }

    update(time) {
        this.startTime += time;
        this.runTime += time;

        if(this.runTime < this.floatduration) {
            this.moveY(time);
        }

        if(this.runTime < 200 + this.delay) {
            this.fadeIn(time);
        }

        if(this.runTime - 200 >= this.duration + this.delay) {
            this.fadeOut(time);
        }

        if(this.runTime > this.duration + this.delay) {
            this.end();
            return ;
        }

        this.translate(time);
        this.draw();
    }

    translate(time) {
        this.x += time * this.speedX;
        

        if(this.x >= this.canvas.width) {
            this.x = 0;
        }
    }

    fadeIn(time) {
        this.opacity += time * this.speedOpacity;
        if(this.opacity >= 1) {
            this.opacity = 1;
        }
    }

    fadeOut(time) {
        this.opacity -= time * this.speedOpacity;
        if(this.opacity <= 0) {
            this.opacity = 0;
        }
    }

    moveY(time) {
        this.y += time * this.speedY;
    }

    draw() {
        const { ctx, canvas } = this;
        const { image, width, height, x, y, opacity} = this;
        ctx.save();
        ctx.translate(-this.width - x, y);
        ctx.globalAlpha = opacity;
        ctx.drawImage(image, 0, 0, this.width, this.height);
        ctx.drawImage(image, this.width, 0, this.width, this.height);
        ctx.restore();
    }

    end() {
        this.onEnd && this.onEnd(this, Date.now());
    }
}

export default class MineAct extends Act {
    constructor(opts = {}) {
        super(opts);

        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2;

        /* start 水雷浮上来的气泡设置 */

        this.addElement(new Bubble({
            image: this.imgs.bubble,
            x: centerX + 10,
            y: this.canvas.height * 1.5,
            scale: 0.2,
            delay: 1000 + Math.random() * 100,
            duration: 2000,
            ctx: this.ctx
        }));

        this.addElement(new Bubble({
            image: this.imgs.bubble,
            x: centerX + 100,
            y: this.canvas.height * 1.5 - 200,
            scale: 0.3,
            delay: 1000 + Math.random() * 100,
            duration: 2000,
            ctx: this.ctx
        }));


        this.addElement(new Bubble({
            image: this.imgs.bubble,
            x: centerX - 10,
            y: this.canvas.height * 1.5 - 320,
            scale: 0.4,
            delay: 1000 + Math.random() * 100,
            duration: 2000,
            ctx: this.ctx
        }));

        this.addElement(new Bubble({
            image: this.imgs.bubble,
            x: centerX - 150,
            y: this.canvas.height * 1.5 - 300,
            scale: 0.4,
            delay: 1000 + Math.random() * 100,
            duration: 1600,
            ctx: this.ctx
        }));
        
        /* end 水雷浮上来的气泡设置 */

        for(let i = 0; i < 40; i++) {
            let opts = {
                image: this.imgs.bubble,
                x: Math.random() * window.innerWidth * 2,
                y: Math.random() * window.innerHeight * 3 + 800,
                scale: Math.random() * 1 + 0.5,
                delay: 3200 + Math.random() * 200,
                duration: 2000,
                ctx: this.ctx
            }
            let bubble = new Bubble(opts);

            this.addElement(bubble);
        }

    }


}