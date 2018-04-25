
class Editor {
    constructor(el) {
        this.el = el;
        this.focus = false;
        this.browser = {
            name: 'unknown',
        };
    }
    init() {
        // console.log('editor init');
        this.checkBrowser();
        document.getElementById(this.el).onfocus = (e)=>{
            this.focus = true;
        }
        document.getElementById(this.el).onblur = (e)=>{
            this.focus = false;
        }		
        document.getElementById(this.el).onkeydown = (e)=>{
            this.handleNewline(e);
        }
    }
    handleEmoji(str) {
        // console.log('editor handle emoji');
        let selection, range;
        document.getElementById(this.el).focus();
        if (!window.getSelection){
            selection = document.selection;
            range = selection.createRange();

            document.getElementById(this.el).focus();
    
            range.pasteHTML(str);
            range.collapse(false);
            range.select();
        }
        else{
            selection = window.getSelection();
            range = selection.rangeCount > 0 ? selection.getRangeAt(0) : null;
            if(range === null) { return false;}

            document.getElementById(this.el).focus();
            range.collapse(false);
            let hasR = range.createContextualFragment(str);
            let hasR_lastChild = hasR.lastChild;
            while (hasR_lastChild && hasR_lastChild.nodeName.toLowerCase() === "br" && hasR_lastChild.previousSibling && hasR_lastChild.previousSibling.nodeName.toLowerCase() === "br") {
                let e = hasR_lastChild;
                hasR_lastChild = hasR_lastChild.previousSibling;
                hasR.removeChild(e)
            }
            range.insertNode(hasR);
            if (hasR_lastChild) {
                range.setEndAfter(hasR_lastChild);
                range.setStartAfter(hasR_lastChild)
            }
            selection.removeAllRanges();
            selection.addRange(range)
        }
    
    }
    handleNewline(ev) {
        let key = ev.keyCode || ev.charCode;
        if(this.focus === false) { return false;}
        if(key === 13) {
            let sel, rang, br, fixbr, node, inner, tempRange, offset;
            if(ev.preventDefault) {
                ev.preventDefault();
            } else {
                ev.returnValue = false;
            }
            if(window.getSelection) {
                br = document.createElement('br');
                sel = window.getSelection();
                rang = sel.rangeCount > 0 ? sel.getRangeAt(0) : null;
                if(rang === null) { return false;}
                rang.deleteContents();
                node = sel.focusNode;
                inner = false;

                while(node.parentNode != document.documentElement) {
                    if(node === document.getElementById(this.el)) {
                        inner = true;
                        break;
                    } else {
                        node = node.parentNode;
                    }
                }

                if(inner) {
                    if(this.browser.chrome || this.browser.safari || this.browser.firefox) {
                        tempRange = rang.cloneRange();
						tempRange.selectNodeContents(document.getElementById(this.el));
						tempRange.setEnd(rang.endContainer, rang.endOffset);
						offset = tempRange.toString().length;						
						if(offset == document.getElementById(this.el).textContent.length && document.getElementById(this.el).querySelectorAll("#edit-div br[type='_moz']").length == 0) {//在行尾且不存在<br type='_moz'>時
							fixbr = br.cloneNode();
							fixbr.setAttribute('type', '_moz');
							rang.insertNode(fixbr);
						}
                    }
                    rang.insertNode(br);
                }

                if(document.implementation && document.implementation.hasFeature && document.implementation.hasFeature("Range", "2.0")) {
					tempRange = document.createRange();
					tempRange.selectNodeContents(document.getElementById(this.el));
					tempRange.setStart(rang.endContainer, rang.endOffset);
					tempRange.setEnd(rang.endContainer, rang.endOffset);
					sel.removeAllRanges();
					sel.addRange(tempRange);
				}		
            
            } else {
                rang = document.selection.createRange();
				if (rang === null) {
					return false;
				}
				rang.collapse(false)
				rang.pasteHTML('<br>'); 
				rang.select();				
            }

        }
    }
    clear() {
        document.getElementById(this.el).innerHTML = '';
    }
    getHtml() {
        let html = document.getElementById(this.el).innerHTML;
        return html;
    }
    getText() {
        let html = document.getElementById(this.el).innerHTML;
        let text;
        text = html.replace(/&nbsp;/g,' ');
        text = text.replace(/<br[^>]*>/g,'\n');
        text = text.replace(/<img src="\/static\/img\/emoj\/([0-9]{3}).png">/g, '</$1/>');
        return text;
    }
    checkBrowser() {
        let info = window.navigator.userAgent;
        if(info.indexOf("MSIE") > 0) {  
            this.browser.name = 'MSIE';
            this.browser.ie = true;  
        } else if(info.indexOf("Firefox") > 0){ 
            this.browser.name = 'Firefox'; 
            this.browser.firefox = true;  
        } else if(info.indexOf("Chrome") > 0) {
            this.browser.name = 'Chrome'; 
            this.browser.chrome = true;  
        } else if(info.indexOf("Safari") > 0) {
            this.browser.name = 'Safari';
            this.browser.safari = true;
        } else if(info.indexOf("Opera") >= 0) {
            this.browser.name = 'Opera';
            this.browser.opera = true;
        } else {
            this.browser.name = 'unknow';
        }  
    }
    setFocus(event) {  
        // TO DO: set focus after all nodes
    }  
}

