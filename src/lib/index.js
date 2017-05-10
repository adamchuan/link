import BubbleAct from './bubble';
import MineAct from './mine';
import EventEmitter from '@tencent/eventemitter';
import { loadImage, loadImages } from '../../lib/SourceLoader';

const raf = window.requestAnimationFrame 
    || window.webkitRequestAnimationFrame 
    || function(fn) {setTimeout(fn, 60)};

export default class Mine extends EventEmitter{
    bubbles = [];

    stop = false;

    resourceMap = [{
        name: 'bubble',
        src: require('../../../assets/img/noHash/mine/bubble.png')
    }, {
        name: 'mine1',
        src: require('../../../assets/img/noHash/mine/mine1.png')
    }, {
        name: 'mine2',
        src: require('../../../assets/img/noHash/mine/mine2.png')
    }, {
        name: 'piece',
        src: require('../../../assets/img/noHash/mine/piece.png')
    }, {
        name: 'boom1',
        src: require('../../../assets/img/noHash/mine/boom2/1.png')
    }, 
    {
        name: 'boom2',
        src: require('../../../assets/img/noHash/mine/boom2/2.png')
    }, 
    {
        name: 'boom3',
        src: require('../../../assets/img/noHash/mine/boom2/3.png')
    },
    {
        name: 'boom4',
        src: require('../../../assets/img/noHash/mine/boom2/4.png')
    }, 
    {
        name: 'boom5',
        src: require('../../../assets/img/noHash/mine/boom2/5.png')
    }, {
        name: 'water',
        src: require('../../../assets/img/noHash/mine/water.png')
    }, {
        name: 'glass',
        src: require('../../../assets/img/noHash/mine/glass.png')
    }]

    imgs = {}

    bgHandler = {}

    act = [];

    activeAct = null;

    constructor(opts = {}) {
        super();
        this.oldController = opts.oldController;
    }

    init = () => {
        //生成气泡

        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        document.querySelector('.animation-container').appendChild(canvas);

        canvas.width = window.innerWidth * 2;
        canvas.height = window.innerHeight * 2;
        canvas.style.position = 'absolute';
        canvas.style.top = 0;
        canvas.style.left = 0;
        canvas.style.width = window.innerWidth + 'px';
        canvas.style.height = window.innerHeight + 'px';

        this.canvas = canvas;
        this.context = ctx;

        loadImages(this.resourceMap.map((res) => res.src))
            .then((imgs) => {
                this.resourceMap.forEach((res, i) => {
                    this.imgs[res.name] = imgs[i];
                });

                this.act = [
                    new MineAct({
                        controller: this
                    })
                ]
                
                this.activeAct = 0;

                this.act.map((act) => {
                    act.addListener('end', this._onActEnd);
                });
            }, (error) => {
                console.log(error);
            })
            .then(() => {
                this.oldController.init();

                this.oldController.on('create', () => {
                    this.emit('create');
                });
            });

        this.emit('init');
    }

    _onActEnd = () => { // 每一幕结束时候的事件
        this.nextAct();
    }

    _tick = () => {
        const now = Date.now();
        const speedTime = now - this.runTime;

        this.emit('render', speedTime, now);

        if(!this.stop) {
            raf(this._tick);
        }
    }

    start = (opts) => { //开始接口
        this.play();
        this.oldController.start();
        raf(this._tick);
    }   

    nextAct = () => {
        this.activeAct ++;

        if(this.activeAct >= this.act.length) {
            this.emit('finish');
        } else {
            this.emit('nextact', this.activeAct);
            this.play();
        }
    }

    play = () => {
        this.act[this.activeAct].start();
    }

    destroy = () => {
        if(document.querySelector('.animation-container')) {
            document.querySelector('.animation-container').removeChild(this.canvas);
        }
        this.oldController.destroy();
        this.emit('destroy');
    }
}