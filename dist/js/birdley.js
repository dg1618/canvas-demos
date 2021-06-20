/* BIRDLEY */

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
      x:90,
      y:10
    },
    speed:{
      x:0.5,
      y:1
    },
    stop:{
      x:100,
      y:20
    },
    font:'bold 24px Bradley Hand',
    color: '#000',
    align:'center',
    zIndex:3,
    text:'42 \rFlavors',
     
    type:'text',
    stageId:'stage'
  });
  let star = new utils.graphic({
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
    delay:10,
    fill:'#f06d06',
    stroke:'green',
    lineWidth:4,
    
    // type: identifier,
    type:'star',
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
      x:0,
      y:0
    },
    speed:{
      x:1,
      y:1
    },
    stop:{
      x:100,
      y:50
    },
    zIndex:10,
    src:'https://birdleymedia.com/images/character_icons/birdley.png',
    
    // identifier
    type:'image',
    delay:1000,
    stageId:'stage',
    label:'birdley'
  });

  rect1.rectRender();
  let arr = [star,rect2,circle,txt,img];

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