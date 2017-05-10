import BaseAct from './baseAct';
import BaseElement from './baseElement';
import { Bubble } from './bubble';

export class Piece extends BaseElement{
    constructor(opts = {}) {
        super(opts);
    }
}

export class Boom extends BaseElement{
    constructor(opts = {}) {
        super(opts);
    }
}

export class Glass extends BaseElement{
    constructor(opts = {}) {
        super(opts);
    }
}

export default class BoomAct extends BaseAct {
    constructor(opts = {}) {
        super(opts);

        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2;

        this.addElement(new Glass({
            frames: [{
                image: this.imgs.glass,
                x: centerX,
                y: centerY,
                delay: 150,
                size: 'fullscreen',
                duration: 2000
            }, {
                image: this.imgs.glass,
                x: centerX,
                y: centerY,
                duration: 200,
                size: 'fullscreen',
                opacity: [1, 0]
            }]
        }));

        this.addElement(new Glass({
            frames: [{
                image: this.imgs.glass,
                x: centerX,
                y: centerY,
                delay: 150,
                size: 'fullscreen',
                duration: 2000
            }, {
                image: this.imgs.glass,
                x: centerX,
                y: centerY,
                duration: 200,
                size: 'fullscreen',
                opacity: [1, 0]
            }]
        }));

        this.addElement(new Boom({
            frames: [{
                image: this.imgs.boom1,
                x: centerX,
                y: centerY,
                duration: 150,
                size: 'fullscreen',
                scale: [1, 1.5]
            }, {
                image: this.imgs.boom2,
                x: centerX,
                y: centerY,
                duration: 150,
                size: 'fullscreen',
                scale: [1, 1.5]
            }, {
                image: this.imgs.boom3,
                x: centerX,
                y: centerY,
                duration: 150,
                size: 'fullscreen',
                scale: [1, 1.5]
            }, {
                image: this.imgs.boom4,
                x: centerX,
                y: centerY,
                duration: 150,
                size: 'fullscreen',
                scale: [1, 1.5]
            }, {
                image: this.imgs.boom5,
                x: centerX,
                y: centerY,
                duration: 150,
                size: 'fullscreen',
                scale: [1, 1.3]
            }, {
                image: this.imgs.boom5,
                x: centerX,
                y: centerY,
                duration: 200,
                size: 'fullscreen',
                scale: [1, 1.5],
                opacity: [1, 0]
            }]
        }));

        this.addElement(new Piece({
            frames: [{
                image: this.imgs.piece,
                size: 'source',
                duration: 200,
                rotate: [0, -0.5 * Math.PI],
                scale: [1, 1.5],
                x: [centerX, centerX - 100],
                y: [centerY, centerY - 100]
            }, {
                image: this.imgs.piece,
                size: 'source',
                duration: 500,
                rotate: [-0.5 * Math.PI, -2 * Math.PI],
                scale: [1.5, 3],
                x: [centerX - 100, centerX - 300],
                y: [centerY - 100, centerY + 500]
            }]
        }));

        for(let i = 0; i < 40; i++) {
            let opts = {
                image: this.imgs.bubble,
                x: Math.random() * window.innerWidth * 2,
                y: Math.random() * window.innerHeight * 2 + 400,
                scale: Math.random() * 1 + 0.5,
                delay: 600 + Math.random() * 200,
                duration: 1400,
                ctx: this.ctx
            }
            let bubble = new Bubble(opts);

            this.addElement(bubble);
        }

    }
}