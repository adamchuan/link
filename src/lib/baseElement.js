const animationAttrs = ['scale', 'rotate', 'translate', 'opacity', 'x', 'y'];

// 抽象的通用类
export default class BaseElement {
    constructor(opts = {}) {
        const { 
            canvas,
            image,
            ctx
        } = opts;

        this.image = opts.image;
        this.ctx = opts.ctx;
        this.canvas = opts.canvas;

        this.activeFrameIndex = 0;

        if(opts.frames) {
            this.frames = opts.frames;
        } else {
            this.frames = [
                Object.assign({}, opts)
            ];
        }
    }

    play() {
        const { image } = this.frames[this.activeFrameIndex];

        const activeFrame = this.activeFrame = Object.assign({
            delay: 0,
            duration: 0,
            runTime: 0,
            startTime: Date.now(),
            width: image.naturalWidth || image.width,
            height: image.naturalHeight || image.height,
            x: 0,
            y: 0,
            animationAttrs: [],
            size: 'auto',
            scale: 1,
            rotate: 0,
            opacity: 1,
        }, this.frames[this.activeFrameIndex]);

        if(activeFrame.size === 'fullscreen') {
            if(activeFrame.width / activeFrame.height >= this.canvas.width / this.canvas.height) {
                activeFrame.width = this.canvas.height / this.canvas.height * activeFrame.width;
                activeFrame.height = this.canvas.height;
            }

            if(activeFrame.width / activeFrame.height  < this.canvas.width / this.canvas.height) {
                activeFrame.height = this.canvas.width / activeFrame.width * activeFrame.height;
                activeFrame.width = this.canvas.width;
            }
        }

        if(typeof activeFrame.originX === 'undefined') { // 以图片中心作为 transform-origin 默认设置到图片中心
            activeFrame.originX = activeFrame.width / 2;
        }

        if(typeof activeFrame.originY === 'undefined') {
            activeFrame.originY = activeFrame.height / 2;
        }

        animationAttrs.map((attr) => {
            if(activeFrame[attr] && activeFrame[attr].length == 2) {
                if(activeFrame.duration <= 0) {
                    return;
                }

                const config = activeFrame[attr];
                const startName = `${attr}Start`;
                const endName= `${attr}End`;
                const speedName= `${attr}Speed`;

                activeFrame[attr] = activeFrame[startName] = config[0];
                activeFrame[endName] = config[1];
                activeFrame[speedName] = (activeFrame[endName] - activeFrame[startName]) / activeFrame.duration;

                activeFrame.animationAttrs.push(attr);
            }
        });
    }

    nextFrame() { // 切换到下一帧
        this.activeFrameIndex ++;
        
        if(this.activeFrameIndex >= this.frames.length) {
            this.end();
        } else {
            this.play();
        }
    }

    update(time) {
        const { activeFrame } = this;

        activeFrame.startTime += time;
        activeFrame.runTime += time;

        if(activeFrame.runTime < activeFrame.delay) {
            return;
        }

        this.translate(time);

        this.draw();

        if(activeFrame.runTime > activeFrame.duration + activeFrame.delay) {
            this.nextFrame();
        }
    }

    translate(time) {
        const { activeFrame } = this;

        activeFrame.animationAttrs.map((attr) => {
            const startName = `${attr}Start`;
            const endName= `${attr}End`;
            const speedName= `${attr}Speed`;

            activeFrame[attr] += activeFrame[speedName] * time;

            if((activeFrame[speedName] > 0 && activeFrame[attr] >= activeFrame[endName])
                || (activeFrame[speedName] < 0 && activeFrame[attr] <= activeFrame[endName])) {
                activeFrame[attr] = activeFrame[endName];
            }
        });
    }

    draw() {
        const { ctx } = this;
        const { canvas, activeFrame } = this;
        const { image, width, height, scale, x, y, rotate, opacity, originX, originY} = this.activeFrame;

        ctx.save();
        ctx.translate(x, y); // 将坐标系原点移动到图片的中心
        ctx.scale(scale, scale);
        ctx.globalAlpha = opacity;
        ctx.rotate(rotate);
        ctx.drawImage(image, -originX, -originY, width, height); // 矩阵变化
        ctx.restore();
    }

    end() {
        this.onEnd && this.onEnd(this, Date.now());
    }
}