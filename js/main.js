$(document).ready(function(){

    var starNum = 60;
    var yCenter = parseInt($(window).height())/2;
    var xCenter = parseInt($(window).width())/2;
    var starCanvas = document.getElementById("stars");
    starCanvas.height = $(window).height();
    starCanvas.width = $(window).width();
    var starCtx = starCanvas.getContext("2d");
    starCtx.strokeStyle = "#FFFFFF";
    var starArray = [] ;
    var newXacc = 0.00010*Math.random()+ 0.00004;
    var newYacc = 0.00004*Math.random()+0.00003;
    var warpFactor = false;
    var starColors = ['rgb(255, 232, 193)',"rgb(251, 179, 72)", "rgb(99, 138, 255)"]
    var starCores = ["rgb(255, 205, 205)", "rgb(247, 255, 190)", "rgb(203, 239, 255)"]
    setInterval(drawStars, 20);



    function makeStars(){
      var moreStars = [];
      for(i=0; i<starNum - starArray.length; i++){
        var newDirection = Math.random()*(Math.PI*2);
        var newOffset = Math.floor(Math.random()*3000+100);
        var newSpeed = Math.floor(Math.random()*(newOffset/200)+1);
        var newStar = new star(newDirection, newOffset, newSpeed, newXacc, newYacc);

        moreStars.push(newStar);
        }
        starArray = starArray.concat(moreStars);
    }

    function drawStars(){
      starCtx.clearRect(0,0,$(window).width(), $(window).height());
      for (i=0; i < starArray.length; i++){
        starArray[i].draw();
        if (starArray[i].inCanvas()){

          starArray.splice(i, 1);
        }
      }
      if (starArray.length < starNum*0.9){
        makeStars();
      }
    }

    function starWarp(){
      newXacc = 0.0004;
      newYacc = 0.0004;
      for (i=0; i < starArray.length; i++){
        starArray[i].xAcc = 0.0004;
        starArray[i].yAcc = 0.0004;
        starArray[i].warpX = starArray[i].x;
        starArray[i].warpY = starArray[i].y;
      }
      warpFactor = true;
    }


    function star(direction, offset,speed, xAcc, yAcc){
      this.direction = direction;
      this.offset = offset;
      this.xSpeed = (Math.cos(direction)*speed*0.5)
      this.ySpeed = (Math.sin(direction)*speed*0.5)
      this.x = Math.floor(xCenter + Math.cos(direction)*offset);
      this.y = Math.floor(yCenter + Math.sin(direction)*offset);
      this.starWidth = 1;
      this.xAcc = xAcc;
      this.yAcc = yAcc;
      this.warpX = this.x;
      this.warpY = this.y;
      this.shadow = starColors[Math.floor(Math.random()*starColors.length)];
      this.core = starCores[Math.floor(Math.random()*starCores.length)];

        this.draw = function() {
            starCtx.beginPath();
            starCtx.lineCap = 'round';
            starCtx.moveTo(this.x,this.y);
            starCtx.shadowBlur=Math.floor(Math.random() * 70)+15;
            starCtx.shadowColor = this.shadow;
            starCtx.strokeStyle = this.core;
            if (warpFactor){
              starCtx.strokeStyle = "white";
              this.warpX +=  this.xSpeed/(0.85 * this.offset) * (Math.abs(xCenter - this.x)/100);
              this.warpY += this.ySpeed /(0.52 * this.offset) * (Math.abs(yCenter - this.y)/100);
              console.log();
              starCtx.moveTo(this.warpX, this.warpY);
              this.x -= this.xSpeed*((this.offset*0.001)*this.xAcc);
              this.y -= this.ySpeed *((this.offset*0.001)*this.yAcc);
            }

            this.x += this.xSpeed;
            this.y += this.ySpeed;
            starCtx.lineTo(this.x,this.y);
            this.starWidth = 1;
            starCtx.lineWidth = this.starWidth;
            starCtx.stroke();
            this.xSpeed += this.xSpeed*(Math.abs(xCenter - this.x)*this.xAcc);
            this.ySpeed += this.ySpeed*(Math.abs(yCenter - this.y)*this.yAcc);


        }
        this.inCanvas = function(){
          if (warpFactor && this.warpX > parseInt($(window).width()) || this.warpX<0 || this.warpY > parseInt($(window).height()) || this.warpY < 0 ){
            return true
          }
          else if ((this.x > parseInt($(window).width()) || this.x<0 || this.y > parseInt($(window).height()) || this.y < 0) && !warpFactor) {
            return true
          }
          else{
              return false;
            }
          }
        }

});
