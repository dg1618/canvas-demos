/* ICE CREAM */

utils.setStage('stage');

// ATA
utils.setBackgroundColor('lightpink');

const colors = {
  orange:'#ffc44e',
  green: '#4795a7',
  darkgreen:'#356f7d',
};

  let logo_rect = new utils.graphic({
    origin:{
      x:10,
      y:256
    },
    speed:{
      x:0,
      y:-2
    },
    stop:{
      x:this.origin.x,
      y:68
    },
    height:30,
    width:120,
    zIndex:2,
    fill:colors.green,
    type:'rect',
    label:"Logo Rectangle",
  });
  
  let flavors = new utils.graphic({
    origin:{
      x:-60,
      y:160
    },
    speed:{
      x:4,
      y:0
    },
    stop:{
      x:70,
      y:this.origin.y
    },
    font:'bold 24px Bradley Hand',
    color: colors.darkgreen,
    align:'center',
    zIndex:3,
    text:"42 Flavors!",
    delay:1500,
    label:"42 Flavors",
    type:'text',
    stageId:'stage'
  });

   let nevs = new utils.graphic({
    origin:{
      x:-10,
      y:-10
    },
    speed:{
      x:2,
      y:2
    },
    stop:{
      x:70,
      y:60
    },
    font:"30px Brush Script MT",
    color: colors.darkgreen,
    align:'center',
    zIndex:3,
    text:"Nev's",
    delay:500,
    label:"Nev's",
    type:"text",
  });
  let ic_text = new utils.graphic({
    origin:{
      x:70,
      y:90,
      alpha:0,
    },
    speed:{
      alpha:0.2
    },
    stop:{
      alpha:1
    },
    font:"Bold 22px Arial",
    color: '#fff',
    align:'center',
    zIndex:3,
    text:"Ice Cream",
   // delay:500,
    label:"Ice Cream Text",
    type:"text",
    delay:1500,
  });
  
  let logo_circle = new utils.graphic({
    origin:{
      x:70,
      y:-50
    },
    speed:{
      x:0,
      y:2
    },
    stop:{
      x:70,
      y:80
    },
    radius:50,
    fill: colors.orange,
    stroke: colors.green,
    lineWidth:7,
    
    // type: identifier,
    label:"Nev's Ice Cream Logo Circle",
    type:"circle",
  });
  let cone = new utils.graphic({
    origin:{
      x:200,
      y:5
    },
    speed:{
      x:-1,
      y:0
    },
    stop:{
      x:140,
      y:5
    },
    zIndex:5,
    src:'images/ice-cream.png',
    
    // identifier
    type:'image',
    label:"ice cream cone with three scoops: vanilla, chocolate, pistachio"
  });

 // rect1.rectRender();
  let arr = [logo_rect,logo_circle,flavors,cone,nevs,ic_text];

  for (o of arr) {
    o.animate();
  }

  let btn = document.getElementById('restart');
  
  btn.addEventListener('click',function() {
      for (o of arr) {
        o.reset();
        o.animate();
      }
  });