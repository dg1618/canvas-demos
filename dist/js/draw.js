let utils = {};

(function(pen) {

  let stage = null;
  
  pen.setStage = function(stageId) {
     stage = document.getElementById(stageId);
  };
  pen.setBackgroundColor = function(color) {
     stage.style.backgroundColor = color;
  }
 
  // this is actually a constructor.
  // show what it traditionally looks like.
  // we are attaching it to the arg we pass in so we can use it 
  // outside the constructor.
  pen.graphic = function(o={}) {
      
      // grab the stage based on the passed-in graphic's stage ID.
      
      
      // first, we create a canvas for each element.
      // each element gets its own layer so that
      // re-rendering won't affect the other element.
      this.canvas = document.createElement('canvas');
      // then, we set the width and height based on the 
      // width of the stage. 
    
      this.canvas.width = stage.clientWidth;
      this.canvas.height = stage.clientHeight;
    
      this.canvas.setAttribute('role','img');
      
      if (o.label) {
           this.canvas.setAttribute('aria-label',o.label);
      }

      // here we'll set the stacking of the canvas based on
      // zIndex.
      if (o.zIndex) {
           this.canvas.style.zIndex = o.zIndex;
      }
    
      stage.appendChild(this.canvas);

    
      //, now add it to the canvas.
      // if you wanted multiple canvases, 
      // make hte canvas part of the stage.
     
      
      this.ctx = this.canvas.getContext('2d');
      if (o.alpha && (o.alpha.start || o.alpha.start === 0)) {
        this.ctx.globalAlpha = 0; //o.alpha.start;
      }
    
      // syntactical - to let devs know we are tracking this.
      this.started = false;
      
      // let's iterate through the keys of what we passed in.
      for (key of Object.keys(o)) {
          this[key] = o[key];
      }
      this.reset();

  };
  // translate the coordinates to the actual canvas.
  // this function would have to vary with shape.
  // this is a specific function for a rectangle.
  pen.graphic.prototype.rectRender = function() {
    this.ctx.fillStyle = this.fill;
    this.ctx.fillRect(this.cur.x,this.cur.y,this.width,this.height);
  };
  pen.graphic.prototype.reset = function() {
    this.cur = {...this.origin};

    if (this.cur.alpha || this.cur.alpha == 0) {
      this.ctx.globalAlpha = this.cur.alpha;
    }
    this.started = false;
  };
  // let's write a render function that uses the graphic properties to render the
  // text.
  pen.graphic.prototype.textRender = function() {
    this.ctx.fillStyle = this.color;
    this.ctx.textAlign = this.align;
    this.ctx.font = this.font;
    this.ctx.fillText(this.text, this.cur.x,this.cur.y)
  }
  pen.graphic.prototype.circleRender = function() {
  
    this.ctx.beginPath();
    
    this.ctx.arc(this.cur.x, this.cur.y, this.radius, 0, 2*Math.PI);
    
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
      this.ctx.drawImage(this.img,this.cur.x,this.cur.y);
    };
    if (!this.img) {
      
      this.img = new Image();
      this.img.src = this.src;
      this.img.onload = function(){
        render();
      };
    }
    else {
      render();
    }
  }
  // TODO: add function for circle, image, and text.
  // image might be tricky if we need to call onload.
  
  // update the graphic's x and y coords.
  // only update them if we are not yet at hte limit.
  // this assumes that the limit will be hit eventually.
  
  pen.graphic.prototype.starRender = function() {
      
        // get context
        
     
        
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
        const draw = (radius,angle,action) => { 
           // use cosine to get horizontal coordinate
           let x = cx + radius*Math.cos(angle);
           // use sin to get vertical coordinate
           let y = cy + radius*Math.sin(angle);
           this.ctx[action](x,y);
        };
   
        let rotate = this.rotate || 0;
       
        let angle = 2*Math.PI / numPoints;
        
        draw(outerRadius,rotate,'moveTo');
        
 		    for (var i = 0; i <= numPoints; i++) {
          
           let outerAngle = i * angle + rotate;
           let innerAngle = outerAngle + angle/2;
          
           draw(outerRadius,outerAngle,'lineTo');
           draw(innerRadius,innerAngle,'lineTo'); 
		   }
       // add the outline
       this.ctx.stroke();
       
       // add the fill
       if (this.fill) {
          this.ctx.fillStyle = this.fill;
          this.ctx.fill();
       } 
  };
  
  // now there is a chance you may never reach the 
  pen.graphic.prototype.updateProps = function() {


    for (prop in this.speed) {
       if (this.cur[prop] != this.stop[prop]) { 

        let diff = Math.abs(this.cur[prop] - this.stop[prop]);

      if (diff < this.speed[prop]) {
         console.log('diff: ' + diff);
          this.cur[prop] = this.stop[prop];
          if (prop == 'alpha') {
              console.log('setting ' + prop  + 'to ' + this.stop[prop]);
              console.log('alpha is now ' + JSON.stringify(this.cur.alpha));
              this.ctx.globalAlpha = this.cur.alpha;
              console.log('this context alpha' + this.ctx.globalAlpha);
              this.imageRender();
          }
        }
       else {
          if (prop == 'alpha') { console.log('increasing ' + prop + ' by'+ this.speed[prop]); }
          this.cur[prop] += this.speed[prop]
       }

     }
    }
  }
  pen.graphic.prototype.checkCanvasAlpha = function() {
    console.log('check canvas alpha');
      if (this.speed.alpha && this.ctx.globalAlpha != this.cur.alpha) {
        this.ctx.globalAlpha = this.cur.alpha;
        console.log('alpha set to ' + this.ctx.globalAlpha);
      }
  };
  pen.graphic.prototype.animate = async function(timeStamp) {
    // clear the playing board.
    
    const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    const frameNeeded = () => {

      for (prop in this.speed) {
        if (this.stop[prop] != this.cur[prop]) {
          return true;
        }
      }
      return false;
    }


    this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height);

    let func = this.type + 'Render';
    
    // call this function using bracket syntax.
    this[func]();

    


     this.updateProps(); 

     this.checkCanvasAlpha();


    if (this.delay && !this.started) {
      await sleep(this.delay);
    }
    this.started = true;

    // start to check if we should repeat.
    // if we are not at the limit yet, call the animation logic.
    if (frameNeeded()) {
      // create a reference for this particular graphic.
      let obj = this;
      
      // enclose it a function so it will work in 
      // requestAnimationFrame.
      let anim = function() {
        obj.animate();
      };
      window.requestAnimationFrame(anim);
    }
  }

})(utils);