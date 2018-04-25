
let preHandler = function(e){e.preventDefault();}
let getMousePos = function (event) {
    let e = event || window.event;
    let scrollX = document.documentElement.scrollLeft || document.body.scrollLeft;
    let scrollY = document.documentElement.scrollTop || document.body.scrollTop;
    let x = e.pageX || e.clientX + scrollX;
    let y = e.pageY || e.clientY + scrollY;
    return { 'x': x, 'y': y };
}

class Draw {
    constructor(el, elBox) {
        this.el = el
        this.canvas = document.getElementById(this.el)
        this.cxt = this.canvas.getContext('2d')
        this.stage_info = {}
        this.path = {
            beginX: 0,
            beginY: 0,
            endX: 0,
            endY: 0
        }
        this.config = {
            shape: '',
            color: '',
            lineWidth: 0,
        }
        this.flag = false
    }
    init(btn, willClear=true, shape='pencil', color='gold', lineWidth=5) {
        let that = this;

        this.stage_info = this.canvas.getBoundingClientRect()
        this.config = {
            shape: shape,
            color: color,
            lineWidth: lineWidth,
        }
        this.flag = false
        
        this.canvas.addEventListener('mousedown', function(event) {
            document.addEventListener('mousedown', preHandler, false); 
            that.drawBegin(event)
        })
        this.canvas.addEventListener('mouseup', function(event) { 
            document.addEventListener('mouseup', preHandler, false); 
            that.drawEnd(event)
        })
        this.canvas.addEventListener("mouseleave", function(event){
            document.addEventListener('mouseleave', preHandler, false); 
            that.drawEnd(event)
        })
        this.canvas.addEventListener("mousemove", function(event){
            document.addEventListener('mousemove', preHandler, false); 
            that.drawing(event)
        })

        if(willClear) this.clear(btn)
    }
    drawBegin(e) {
        console.log('begin');
        let that = this;
        let mousePos = getMousePos(e);
        window.getSelection() ? window.getSelection().removeAllRanges() : document.selection.empty()
        this.cxt.strokeStyle = this.config.color
        this.cxt.lineWidth = this.config.lineWidth
        this.cxt.beginPath()
        this.cxt.moveTo(
            mousePos.x - this.stage_info.left,
            mousePos.y - this.stage_info.top
        )
        this.path.beginX = mousePos.x - this.stage_info.left
        this.path.beginY = mousePos.y - this.stage_info.top
        this.flag = true
    }
    drawing(e) {
        if(this.flag) {
            let mousePos = getMousePos(e),
                endX = mousePos.x - this.stage_info.left,
                endY = mousePos.y - this.stage_info.top;

            this.path.endX = endX;
            this.path.endY = endY;

            switch(this.config.shape) {
                case 'pencil':
                {
                    this.drawFree(false, endX, endY)
                    break;
                }
                case 'line':
                {
                    // this.drawLine(this.path.beginX, this.path.beginY, endX, endY)
                    break;
                }
                case 'rectangle':
                {
                    // this.drawRect(this.path.beginX, this.path.beginY, endX, endY)
                    break;
                }
                case 'ellipse': 
                {
                    // this.drawEllipse(this.path.beginX, this.path.beginY, this.path.endX, this.path.endY)
                    break;
                }
                case 'text': 
                {
                    break;
                }
                default: break;
            }
        }
    }
    drawEnd(e) {
        switch(this.config.shape) {
            case 'pencil':
            {
                // this.drawFree(false, endX, endY)
                break;
            }
            case 'line':
            {
                this.drawLine(this.path.beginX, this.path.beginY, this.path.endX, this.path.endY)
                break;
            }
            case 'rectangle':
            {
                this.drawRect(this.path.beginX, this.path.beginY, this.path.endX, this.path.endY)
                break;
            }
            case 'ellipse': 
            {
                this.drawEllipse(this.path.beginX, this.path.beginY, this.path.this.path.endX, this.path.this.path.endY)
                break;
            }
            case 'text': 
            {
                break;
            }
            default: break;
        }

        console.log('end');
        document.removeEventListener('mousedown', preHandler, false); 
        document.removeEventListener('mousemove', preHandler, false);
        document.removeEventListener('mouseup', preHandler, false);
        document.removeEventListener('mouseleave', preHandler, false);

        this.flag = false
    }
    clear(btn) {
        this.cxt.clearRect(0, 0, this.stage_info.width, this.stage_info.height)
    }
    save(){
        return this.canvas.toDataURL("image/png")
    }
    drawFree(isEraser, x, y, size=50) {
        // console.log('drawFree');
        if(isEraser) {
            this.cxt.save()
            this.cxt.beginPath()
            this.cxt.arc(x, y, size, 0, Math.PI * 2, false);
            this.cxt.clip()
            this.cxt.clearRect(0,0,400,400)
            this.cxt.restore()
        }else{
            this.cxt.save()
            this.cxt.lineTo(x, y)
            this.cxt.stroke()
            this.cxt.restore()
        }
    }
    drawLine(beginX, beginY, endX, endY) {
        this.cxt.save()
        this.cxt.moveTo(beginX, beginY)
        this.cxt.lineTo(endX, endY)
        this.cxt.stroke()
        this.cxt.restore()
    }
    drawRect(beginX, beginY, endX, endY) {
        let width = Math.abs(endX - beginX),
            height = Math.abs(endY - beginY),
            left = endX > beginX ? beginX : endX,
            top = endY > beginY ? beginY : endY;

        this.cxt.save()
        this.cxt.strokeRect(left, top, width, height)
        // this.cxt.fillRect(left, top, width, height)
        this.cxt.restore()
    }
    drawEllipse(beginX, beginY, endX, endY) {
        let width = Math.abs(endX - beginX),
            height = Math.abs(endY - beginY),
            left = endX > beginX ? beginX : endX,
            top = endY > beginY ? beginY : endY,
            x = left + width / 2,
            y = top + height / 2,
            //选择a、b中的较大者作为arc方法的半径参数
            r = (width > height) ? width/2 : height/2,
            //横轴缩放比率
            ratioX = width / 2 / r, 
            //纵轴缩放比率
            ratioY = height / 2 / r; 

        this.cxt.save();
        this.cxt.scale(ratioX, ratioY); //进行缩放（均匀压缩）
        this.cxt.beginPath();
        this.cxt.arc(x / ratioX, y / ratioY, r, 0, 2 * Math.PI, false);
        this.cxt.closePath();
        this.cxt.stroke();
        this.cxt.restore();
    }
}
