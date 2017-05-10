import EventEmitter from '@tencent/eventemitter';

export default class Act extends EventEmitter {
    constructor(opts = {}) {
        super();

        if(!opts.controller) {
            throw new Error('need controller');
        }

        this.controller = opts.controller;
        this.canvas = opts.controller.canvas;
        this.ctx = opts.controller.canvas.getContext('2d');
        this.imgs = opts.controller.imgs || {};
        this.elements = [];
        this.init();
    }

    init = () => {
        console.warn(`${this} 未实现 init 接口`);
    }

    start = () => {
        this.controller.addListener('render', this.update);

        this.startTime = this.runTime = Date.now();

        const elementsTask = [];

        this.elements.map((element) => {
            element.play();
            
            elementsTask.push(new Promise((resolve, reject) => {
                element.onEnd = (element, endTime) => {
                    this.elements.splice(this.elements.indexOf(element), 1);
                    resolve();
                }
            }));
        });

        Promise.all(elementsTask)
            .then(() => {
                this.end();
            });
    }

    update = () => {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        const now = Date.now();
        const runTime = now - this.startTime;
        const tickTime = now - this.runTime;

        if(this.elements.length === 0) {
            this.end();
            return ;
        }

        this.elements.map((element) => element.update(tickTime, runTime));

        this.runTime = now;
    }

    end = () => {
        this.controller.removeListener('render', this.update);
        this.emit('end', Date.now());
    }

    addElement = (element) => {
        element.ctx = this.ctx;
        element.canvas = this.canvas;

        this.elements.push(element);
    }
}