let utils = {};
/* local ice cream, coffee shop
get a nice color palette of pinks,
greens, etc.
*/
(function(pen) {

  
  // this is actually a constructor.
  // show what it traditionally looks like.
  // we are attaching it to the arg we pass in so we can use it 
  // outside the constructor.
  
  let stage = null;
  
  pen.setStage = function(stageId) {
     stage = document.getElementById(stageId);
  };
 
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
    this.ctx.fillRect(this.pos.x,this.pos.y,this.width,this.height);
  };
  pen.graphic.prototype.reset = function() {
    this.pos = {...this.origin};
    this.started = false;
  };
  // let's write a render function that uses the graphic properties to render the
  // text.
  pen.graphic.prototype.textRender = function() {
    this.ctx.fillStyle = this.color;
    this.ctx.textAlign = this.align;
    this.ctx.font = this.font;
    this.ctx.fillText(this.text, this.pos.x,this.pos.y)
  }
  pen.graphic.prototype.circleRender = function() {
  
    this.ctx.beginPath();
    
    this.ctx.arc(this.pos.x, this.pos.y, this.radius, 0, 2*Math.PI);
    
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
      this.ctx.drawImage(this.img,this.pos.x,this.pos.y);
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
		    let cx = this.pos.x || 0;
        let cy = this.pos.y || 0;
       
        // set centerpoint
        this.ctx.lineWidth = this.lineWidth || 1;
        this.ctx.strokeStyle = this.stroke || '#000';
		    
        // start the path
 		    this.ctx.beginPath();
       
        // write a function called drawLine.
       
        // move to moves the pen to the start position.
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
  pen.graphic.prototype.updateCoords = function() {
    if (this.pos.x != this.stop.x) { this.pos.x +=this.speed.x }
    if (this.pos.y != this.stop.y) { this.pos.y +=this.speed.y }
  };

  pen.graphic.prototype.animate = async function(timeStamp) {
    // clear the playing board.
    

    this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height);
    this.updateCoords();  
    let func = this.type + 'Render';
    
    // call this function using bracket syntax.
    this[func]();
    const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));
    
    if (this.delay && !this.started) {
      await sleep(this.delay);
    }
    this.started = true;
    // if we are not at the limit yet, call the animation logic.
    if (this.pos.y != this.stop.y || this.pos.x != this.stop.x) {
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