/* ICE CREAM */

let demo = {};

(function(pen){


utils.setStage('stage');

// ATA
utils.setBackgroundColor('lightpink');

const colors = {
  orange:'#ffc44e',
  green: '#4795a7',
  darkgreen:'#356f7d',
};

  const small_cone_src = 'images/cone-small-vert.png';
  
  const large_cone_src = 'images/ice-cream.png';

  let logo_rect = new utils.graphic({
      start: {
         x: 10,
         y: 256
      },
      speed: {
         y: -2
      },
      stop: {
         y: 53
      },
      height: 30,
      width: 120,
      zIndex: 2,
      fill: colors.green,
      type: 'rect',
      label: "Logo Rectangle",
   });

   let flavors = new utils.graphic({
      start: {
         x: -70,
         y: 145
      },
      speed: {
         x: 4,
      },
      stop: {
         x: 70
      },
      font: 'bold 24px Bradley Hand',
      color: colors.darkgreen,
      align: 'center',
      text: "42 Flavors!",
      delay: 1500,
      label: "42 Flavors text",
      type: 'text',
   });

   let nevs = new utils.graphic({
      start: {
         x: -10,
         y: -10
      },
      speed: {
         x: 2,
         y: 2
      },
      stop: {
         x: 70,
         y: 45
      },
      font: "24px Bradley Hand",
      color: colors.darkgreen,
      align: 'center',
      zIndex: 2,
      text: "Nev's",
      delay: 500,
      label: "Nev's",
      type: "text",
   });
   let ic_text = new utils.graphic({
      start: {
         x: 70,
         y: 75,
         alpha: 0,
      },
      speed: {
         alpha: 0.02
      },
      stop: {
         alpha: 1
      },
      font: "Bold 22px Arial",
      color: '#fff',
      align: 'center',
      zIndex: 2,
      text: "Ice Cream",
      label: "Ice Cream Text",
      type: "text",
      delay: 1500,
   });

   let logo_circle = new utils.graphic({
      start: {
         x: 70,
         y: -50
      },
      speed: {
         y: 2
      },
      stop: {
         y: 65
      },
      radius: 50,
      fill: colors.orange,
      stroke: colors.green,
      lineWidth: 7,

      // type: identifier,
      label: "Nev's Ice Cream Logo Circle",
      type: "circle",
   });
   let large_cone = new utils.graphic({
      start: {
         x: 200,
         y: 6
      },
      speed: {
         x: -1
      },
      stop: {
         x: 150
      },
      scale:0.75,
      src: large_cone_src,
      type: 'image',
      label: "ice cream cone with three scoops"
   });
  

   let small_cone = new utils.graphic({
      start: {
         x: 60,
         y: 85,
         alpha: 0
      },
      speed: {
         alpha: 0.02
      },
      stop: {
         alpha: 1
      },
      src: small_cone_src,

      // identifier
      type: 'image',
      delay: 2000,
      label: "logo cone"
   });

   pen.init = function() {

      let arr = [logo_rect, 
                 logo_circle,
                 flavors, 
                 large_cone,
                 nevs, 
                 ic_text,
                 small_cone];

      for (o of arr) {
         o.animate();
      }

      let btns = document.querySelectorAll('#restart,#stage');

      for (btn of btns) {
         btn.addEventListener('click', function() {
           for (o of arr) {
            o.reset();
            o.animate();
           }
        });
      }
   }
})(demo)
demo.init();