let utils = {};

(function(pen) {

   let stage = null;

   pen.setStage = function(stageId) {
      stage = document.getElementById(stageId);
   };
   pen.setBackgroundColor = function(color) {
      if (stage) {
         stage.style.backgroundColor = color;
      }
   };

   // this is actually a constructor.
   // show what it traditionally looks like.
   // we are attaching it to the arg we pass in so we can use it 
   // outside the constructor.
   pen.graphic = function(o = {}) {

      // grab the stage based on the passed-in graphic's stage ID.

      // first, we create a canvas for each element.
      // each element gets its own layer so that
      // re-rendering won't affect the other element.
      this.reqIds = [];
      this.canvas = document.createElement('canvas');

      // then, we set the width and height 
      this.canvas.width = stage.clientWidth;
      this.canvas.height = stage.clientHeight;
      this.canvas.setAttribute('role', 'img');

      if (o.label) {
         this.canvas.setAttribute('aria-label', o.label);
      }
      if (o.zIndex) {
         this.canvas.style.zIndex = o.zIndex;
      }

      stage.appendChild(this.canvas);

      this.ctx = this.canvas.getContext('2d');

      // let's iterate through the keys of what we passed in.
      for (key of Object.keys(o)) {
         this[key] = o[key];
      }
      this.reset();

   };
   pen.graphic.prototype.cancelFrames = function() {

      while (this.reqIds.length > 0) {
         let reqId = this.reqIds.pop();
         window.cancelAnimationFrame(reqId);
      }

   }
   pen.graphic.prototype.reset = function() {
      this.started = false;

      this.cur = {...this.start};

      if (this.cur.alpha || this.cur.alpha == 0) {
         this.ctx.globalAlpha = this.cur.alpha;
      }
      if (this.reqIds.length > 0) {
         this.cancelFrames();
      }
   };
   // translate the coordinates to the actual canvas.
   // this function would have to vary with shape.
   // this is a specific function for a rectangle.
   pen.graphic.prototype.rectRender = function() {
      this.ctx.fillStyle = this.fill;
      this.ctx.fillRect(this.cur.x, this.cur.y, this.width, this.height);
   };

   // let's write a render function that uses the graphic properties to render the
   // text.
   pen.graphic.prototype.textRender = function() {
      this.ctx.fillStyle = this.color;
      this.ctx.textAlign = this.align;
      this.ctx.font = this.font;
      this.ctx.fillText(this.text, this.cur.x, this.cur.y)
   }
   pen.graphic.prototype.circleRender = function() {

      this.ctx.beginPath();

      this.ctx.arc(this.cur.x, this.cur.y, this.radius, 0, 2 * Math.PI);

      if (this.stroke) {
         this.ctx.lineWidth = this.lineWidth || 1;
         this.ctx.strokeStyle = this.stroke;
         this.ctx.stroke();
      }
      if (this.fill) {
         this.ctx.fillStyle = this.fill;
         this.ctx.fill();
      }
   }

   pen.graphic.prototype.imageRender = function() {
      const render = () => {
         let params = [this.img, this.cur.x, this.cur.y];
         if (this.scale) {
            let w = this.img.width*this.scale;
            let h = this.img.height*this.scale;
            params.push(w,h);
         }
         this.ctx.drawImage(...params);
      };
      if (!this.img || !this.img.src) {
         this.img = new Image();
         this.img.src = this.src;
         this.img.onload = function() {
            render();
         };
      } else {
         render();
      }
   }

   // method for drawing a star
   pen.graphic.prototype.starRender = function() {

      // set shape properties
      let numPoints = this.numPoints || 5;
      // set inner and outer radius
      let outerRadius = this.outerRadius || 100;
      let innerRadius = this.innerRadius || 50;

      // establish the current center point
      let cx = this.cur.x || 0;
      let cy = this.cur.y || 0;

      // set centerpoint
      this.ctx.lineWidth = this.lineWidth || 1;
      this.ctx.strokeStyle = this.stroke || '#000';

      // start the path
      this.ctx.beginPath();

      // write a function called drawLine.

      // move to moves the pen to the start curition.
      // lineTo keeps the penDown.
      const draw = (radius, angle, action) => {
         // use cosine to get horizontal coordinate
         let x = cx + radius * Math.cos(angle);
         // use sin to get vertical coordinate
         let y = cy + radius * Math.sin(angle);
         this.ctx[action](x, y);
      };

      let rotate = this.rotate || 0;

      let angle = 2 * Math.PI / numPoints;

      draw(outerRadius, rotate, 'moveTo');

      for (var i = 0; i <= numPoints; i++) {

         let outerAngle = i * angle + rotate;
         let innerAngle = outerAngle + angle / 2;

         draw(outerRadius, outerAngle, 'lineTo');
         draw(innerRadius, innerAngle, 'lineTo');
      }
      // add the outline
      this.ctx.stroke();

      // add the fill
      if (this.fill) {
         this.ctx.fillStyle = this.fill;
         this.ctx.fill();
      }
   };

   pen.graphic.prototype.updateProps = function() {

      for (prop in this.speed) {

            let diff = Math.abs(this.cur[prop] - this.stop[prop]);

            if (diff <= Math.abs(this.speed[prop])) {
               this.cur[prop] = this.stop[prop];
            } else {
               this.cur[prop] += this.speed[prop]
            }
      }
   }
   pen.graphic.prototype.checkCanvasAlpha = function() {
      if (this.speed.alpha && this.ctx.globalAlpha != this.cur.alpha) {
         this.ctx.globalAlpha = this.cur.alpha;
      }
   };
   pen.graphic.prototype.animate = async function(timeStamp) {

      const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

      const frameNeeded = () => {
         for (prop in this.speed) {
            if (this.stop[prop] != this.cur[prop]) {
               return true;
            }
         }
         return false;
      }
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

      // only updated props if the animation has already been started.
      if (this.started) {
         this.updateProps();
         this.checkCanvasAlpha();
      }
      let func = this.type + 'Render';
      
      this[func]();

      if (!this.started && this.delay) {
         await sleep(this.delay);
      }
      this.started = true;

      // start to check if we should repeat.
      // if we are not at the limit yet, call the animation logic.
      if (frameNeeded()) {
        
         // create an alias for "this"
         let obj = this;

         // create the callback
         let anim = function() {
            obj.animate();
         };
         // request the frame
         let reqId = window.requestAnimationFrame(anim);
        
         // store the request ID
         obj.reqIds.push(reqId);
      }
   }

})(utils);