utils.setStage('stage');
  // this is how we want it to work.
  let rect1 = new utils.graphic({
    origin:{
      x:0,
      y:0
    },
    height:200,
    width:200,
    zIndex:0,
    fill:'lightpink',
    type:'rect',
    stageId:'stage',
    label:'background'
  });
  
  let rect2 = new utils.graphic({

    origin:{
      x:100,
      y:5
    },
    speed:{
      x:1,
      y:1
    },
    stop:{
      x:50,
      y:25
    },
    height:50,
    width:25,
    zIndex:5,
    fill:'#b8dada',
    type:'rect',
    stageId:'stage'
  });
   let txt = new utils.graphic({
    origin:{
      x:-50,
      y:190
    },
    speed:{
      x:2,
      y:0
    },
    stop:{
      x:80,
      y:190
    },
    font:'bold 24px Bradley Hand',
    color: '#000',
    align:'center',
    zIndex:3,
    text:'42 \rFlavors',
     
    type:'text',
    stageId:'stage'
  });
  
  let circle = new utils.graphic({
    origin:{
      x:100,
      y:100
    },
    speed:{
      x:-0.5,
      y:-1
    },
    stop:{
      x:50,
      y:5
    },
    radius:5,
    delay:1500,
    fill:'yellow',
    stroke:'green',
    lineWidth:4,
    
    // type: identifier,
    type:'circle',
    stageId:'stage'
  });
  let img = new utils.graphic({
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
    zIndex:10,
    src:'images/ice-cream.png',
    
    // identifier
    type:'image',
    stageId:'stage',
    label:'ice cream'
  });

 // rect1.rectRender();
  let arr = [rect2,circle,txt,img];

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