(function($){
    String.prototype.replaceAll = function(stringToFind,stringToReplace){
        var temp = this;
        var index = temp.indexOf(stringToFind);
        while(index != -1){
            temp = temp.replace(stringToFind,stringToReplace);
            index = temp.indexOf(stringToFind);
        }
        return temp;
    }

    var editableDivTemplate = '<div class="tagtextbox" style="background: white" contenteditable data-trigger="focusin focusout"></div>';

    var isValidPhoneNumber = function(value){
        var phoneRe = /^((\+\d{1,3}(-| )?\(?\d\)?(-| )?\d{1,3})|(\(?\d{2,3}\)?))(-| )?(\d{3,4})(-| )?(\d{4})(( x| ext)\d{1,5}){0,1}$/;
        var digits = value.replace(/\D/g, "");
        return (value.match(phoneRe) !== null);
    }
    var isValidEMail = function(value){
        var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(value);
    }
    var KeyBoardHelper = {

        getKeyCode : function(e) {
            var keycode = null;
            if(window.event) {
                keycode = window.event.keyCode;
            }else if(e) {
                keycode = e.which;
            }
            return keycode;
        },

        getKeyCodeValue : function(keyCode, shiftKey) {
            shiftKey = shiftKey || false;
            var value = null;
            if(shiftKey === true) {
                value = this.modifiedByShift[keyCode];
            }else {
                value = this.keyCodeMap[keyCode];
            }
            return value;
        },

        getValueByEvent : function(e) {
            return this.getKeyCodeValue(this.getKeyCode(e), e.shiftKey);
        },

        keyCodeMap : {
            8:"backspace", 9:"tab", 13:"return", 16:"shift", 17:"ctrl", 18:"alt", 19:"pausebreak", 20:"capslock", 27:"escape", 32:" ", 33:"pageup",
            34:"pagedown", 35:"end", 36:"home", 37:"left", 38:"up", 39:"right", 40:"down", 43:"+", 44:"printscreen", 45:"insert", 46:"delete",
            48:"0", 49:"1", 50:"2", 51:"3", 52:"4", 53:"5", 54:"6", 55:"7", 56:"8", 57:"9", 59:";",
            61:"=", 65:"a", 66:"b", 67:"c", 68:"d", 69:"e", 70:"f", 71:"g", 72:"h", 73:"i", 74:"j", 75:"k", 76:"l",
            77:"m", 78:"n", 79:"o", 80:"p", 81:"q", 82:"r", 83:"s", 84:"t", 85:"u", 86:"v", 87:"w", 88:"x", 89:"y", 90:"z",
            96:"0", 97:"1", 98:"2", 99:"3", 100:"4", 101:"5", 102:"6", 103:"7", 104:"8", 105:"9",
            106: "*", 107:"+", 109:"-", 110:".", 111: "/",
            112:"f1", 113:"f2", 114:"f3", 115:"f4", 116:"f5", 117:"f6", 118:"f7", 119:"f8", 120:"f9", 121:"f10", 122:"f11", 123:"f12",
            144:"numlock", 145:"scrolllock", 186:";", 187:"=", 188:",", 189:"-", 190:".", 191:"/", 192:"`", 219:"[", 220:"\\", 221:"]", 222:"'"
        },

        modifiedByShift : {
            192:"~", 48:")", 49:"!", 50:"@", 51:"#", 52:"$", 53:"%", 54:"^", 55:"&", 56:"*", 57:"(", 109:"_", 61:"+",
            219:"{", 221:"}", 220:"|", 59:":", 222:"\"", 188:"<", 189:">", 191:"?",
            96:"insert", 97:"end", 98:"down", 99:"pagedown", 100:"left", 102:"right", 103:"home", 104:"up", 105:"pageup"
        }

    };
    var TagHelper = {
        init: function(options){
             this.options = options;
        },
        isValidTag: function(tag, value){
            var validator = this.options.validators[tag];
            return validator(value);
        },

        saveSelection: function(containerEl) {
            var charIndex = 0, start = 0, end = 0, foundStart = false, stop = {};
            var sel = rangy.getSelection(), range;

            function traverseTextNodes(node, range) {
                if (node.nodeType == 3) {
                    if (!foundStart && node == range.startContainer) {
                        start = charIndex + range.startOffset;
                        foundStart = true;
                    }
                    if (foundStart && node == range.endContainer) {
                        end = charIndex + range.endOffset;
                        throw stop;
                    }
                    charIndex += node.length;
                } else {
                    for (var i = 0, len = node.childNodes.length; i < len; ++i) {
                        traverseTextNodes(node.childNodes[i], range);
                    }
                }
            }

            if (sel.rangeCount) {
                try {
                    traverseTextNodes(containerEl, sel.getRangeAt(0));
                } catch (ex) {
                    if (ex != stop) {
                        throw ex;
                    }
                }
            }

            return {
                start: start,
                end: end+3
            };
         },

        restoreSelection: function(containerEl, savedSel) {

            var charIndex = 0, range = rangy.createRange(), foundStart = false, stop = {};
            range.collapseToPoint(containerEl, 0);

            function traverseTextNodes(node) {
                if (node.nodeType == 3) {
                    var nextCharIndex = charIndex + node.length;
                    if (!foundStart && savedSel.start >= charIndex && savedSel.start <= nextCharIndex) {
                        range.setStart(node, savedSel.start - charIndex);
                        foundStart = true;
                    }
                    if (foundStart && savedSel.end >= charIndex && savedSel.end <= nextCharIndex) {
                        range.setEnd(node, savedSel.end - charIndex);
                        throw stop;
                    }
                    charIndex = nextCharIndex;
                } else {
                    for (var i = 0, len = node.childNodes.length; i < len; ++i) {
                        traverseTextNodes(node.childNodes[i]);
                    }
                }
            }

            try {
                traverseTextNodes(containerEl);
            } catch (ex) {
                if (ex == stop) {
                    rangy.getSelection().setSingleRange(range);
                } else {
                    throw ex;
                }
            }
        }
    }



    $.fn.TagHelper = function(options){
        this._options = $.extend({}, $.fn.TagHelper.options, options);
        var tagConverter = options.tagConverter;

        var ele            = $(this);
        var tagHelper      = Object.create(TagHelper);
        var keyBoardHelper = Object.create(KeyBoardHelper);

        var makeTagOn      = this._options.separator;

        tagHelper.init(this._options);

        var editableTextArea = $(editableDivTemplate);
        ele.append(editableTextArea);

        editableTextArea.keyup(function(event){
            if(makeTagOn === keyBoardHelper.getValueByEvent(event)){
                var words = $(this).text().trim().split(makeTagOn),
                    processedWords = words.splice(0, words.length - 1),
                    lastWord = processedWords[processedWords.length - 1];

                var tagClass = tagHelper.isValidTag(tagConverter, lastWord) ? "successTag": "errorTag";
                var savedSel = tagHelper.saveSelection(this);

                var that = this;
                var tag = '<span class="myTag '+tagClass+'" id="te"><span>' + lastWord + '&nbsp;&nbsp;</span><a href="#" class="myTagRemover" title="Remove">X</a></span>';
                this.innerHTML = this.innerHTML.replace(lastWord, tag);
                tagHelper.restoreSelection(this, savedSel);
                $(this).find('a').each(function(i,o){
                    $(o).click(function(){
                        $(this).closest('span.myTag').remove();
                    })
                });
                ele.data('parsedData', $(this).text().replaceAll('X'+makeTagOn,","));
            }

        });

    }

    $.fn.TagHelper.options = {
        "validators"  : {
            "EMail": isValidEMail,
            "PhoneNumber":isValidPhoneNumber
        },
        "separator"   : ',',
        "tagConverter":"EMail"
    }
})(jQuery)