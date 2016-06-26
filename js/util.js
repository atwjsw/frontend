 var $ = function(selector) {
     // return [].slice.call(document.querySelectorAll(selector))
     // return document.querySelectorAll(selector)
     //       return Array.prototype.forEach.call(document.querySelectorAll(selector))

     return Array.prototype.concat.apply([], document.querySelectorAll(selector)).slice();
 }


 if (typeof Array.prototype.forEach != 'function') {
     Array.prototype.forEach = function(callback) {
         for (var i = 0; i < this.length; i++) {
             callback.apply(this, [this[i], i, this]);
         }
     };
 }

 //事件处理浏览器兼容
 function addEvent(node, event, handler) {
     if (!!node.addEventListener) {
         node.addEventListener(event, handler);
     } else {
         node.attachEvent('on' + event, handler);
     }
 }

 // Function.prototype.method = function(name, func) {

 //     this.prototype[name] = func;

 //     return this;

 // };

 if (!String.prototype.trim) {
     String.prototype.trim = function() {
         return this.replace(/(^\s*)|(\s*$)/g, "");
     }
 };


 var util = (function() {

     return {
         extend: function(o1, o2) {
             for (var i in o2)
                 if (o1[i] == undefined) {
                     o1[i] = o2[i]
                 }
         },
         addClass: function(node, className) {
             var current = node.className || "";
             if ((" " + current + " ").indexOf(" " + className + " ") === -1) {
                 node.className = current ? (current + " " + className) : className;
             }
         },
         delClass: function(node, className) {
             var current = node.className || "";
             node.className = (" " + current + " ").replace(" " + className + " ", " ").trim();
         },
         emitter: {
             // 注册事件
             on: function(event, fn) {
                 var handles = this._handles || (this._handles = {}),
                     calls = handles[event] || (handles[event] = []);

                 // 找到对应名字的栈
                 calls.push(fn);

                 return this;
             },
             // 解绑事件
             off: function(event, fn) {
                 if (!event || !this._handles) this._handles = {};
                 if (!this._handles) return;

                 var handles = this._handles,
                     calls;

                 if (calls = handles[event]) {
                     if (!fn) {
                         handles[event] = [];
                         return this;
                     }
                     // 找到栈内对应listener 并移除
                     for (var i = 0, len = calls.length; i < len; i++) {
                         if (fn === calls[i]) {
                             calls.splice(i, 1);
                             return this;
                         }
                     }
                 }
                 return this;
             },
             // 触发事件
             emit: function(event) {
                 var args = [].slice.call(arguments, 1),
                     handles = this._handles,
                     calls;

                 if (!handles || !(calls = handles[event])) return this;
                 // 触发所有对应名字的listeners
                 for (var i = 0, len = calls.length; i < len; i++) {
                     calls[i].apply(this, args)
                 }
                 return this;
             }
         }

     }
 })()
