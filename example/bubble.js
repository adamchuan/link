import BaseAct from './baseAct';
import { Glass } from './boom';

const bubbleSrc = require('../../../assets/img/noHash/mine/bubble.png');

const LEFT = -1 ;

const RIGHT = 1;

export class Bubble {
    moveTargetY = 250 + Math.floor(Math.random() * 100) // 
    
    moveOffsetX = Math.random() * 10 + 50 // 左右移动的极限值，到达极限值后，调整方向

    direction = [LEFT, RIGHT][Math.round(Math.random())];

    speedX = Math.random() * 0.1 + 0.04; // 单位px/ms

    speedY = Math.random() * 0.1 + 0.3; // 单位px/ms

    stop = false;

    end = false;

    constructor (opts = {}) {
        if(!opts.ctx) {
            throw new Error('need canvas ctx');
        }

        this.controller = opts.controller;
        this.ctx = opts.ctx;
        this.x = this.startX = opts.x;
        this.y = this.startY = opts.y;
        this.scale = opts.scale;
        this.image = opts.image;
        this.opacity = 0;
        
        this.duration = opts.duration;
        this.delay = opts.delay;

        this.runTime = 0;

        this.width = this.image.naturalWidth || this.image.width;
        this.height = this.image.naturalHeight || this.image.height;
        this.fadeTime = 100;

        this.speedFade = Math.ceil(1 / this.fadeTime);
    }

    draw = () => {
        const { ctx } = this;
        ctx.save();
        // ctx.translate(this.x + this.width / 2, this.y + this.height / 2);
        // ctx.rotate(this.rotation);
        // ctx.scale(this.scaleX, this.scaleY);
        console.log(this.opacity);
        ctx.globalAlpha = this.opacity;
        ctx.drawImage(this.image, this.x, this.y, this.width * this.scale, this.height * this.scale);
        // ctx.translate(-this.x - this.width / 2, -this.y - this.height / 2);
        ctx.restore();
    }

    play() {}

    update = (time) => {
       this.move(time);

       this.runTime += time;

       if(this.runTime - this.delay >= this.duration) { //超过运行时间中止
           this.onEnd(this);
       }

       if(this.runTime < this.delay) { // 未到执行时间
           return;
       }
       
       if(this.runTime <= this.fadeTime + this.delay) {
           this.fadeIn(time)
       }

       if(this.runTime >= this.duration - this.fadeTime + this.delay) {
           this.fadeOut(time);
       }

       this.draw();
   }

   move = (time) => {
       this.x += time * this.speedX * this.direction;
       this.y -= (time * this.speedY);

       if(this.x < this.startX - this.moveOffsetX) { // 超过界限后反弹
           this.x = this.startX * 2 - this.moveOffsetX * 2 - this.x; // 推到后的公式
           this.direction = -this.direction; // 方向取反
       }

       if(this.x > this.startX + this.moveOffsetX) {
           this.x = this.startX * 2  + this.moveOffsetX * 2- this.x ; // 推到后的公式
           this.direction = -this.direction; // 方向取反
       }
   }

   fadeIn = (time) => {
       this.opacity += time * this.speedFade;

       if(this.opacity >= 1) {
           this.opacity = 1;
       }
   }

   fadeOut = (time) => {
       this.opacity -= time * this.speedFade;

       if(this.opacity <= 0) {
           this.opacity = 0;
       }
   }


    reset = () => {
        this.stop = false;
        this.end = false;
    }
}