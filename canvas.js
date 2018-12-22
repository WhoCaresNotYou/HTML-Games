

  var controller, display, game;
  
  var over = false, fin = false, dum = false;

  controller = {

    left:false,
    right:false,
    up:false,

    keyUpDown:function(event) 
	{
      var key_state = (event.type == "keydown")?true:false;
      switch(event.keyCode) 
	  {
        case 37: controller.left = key_state; break;
        case 38: controller.up = key_state; break; 
        case 39: controller.right = key_state; break; 
      }
    }
  };

  display = {

    buffer:document.createElement("canvas").getContext("2d"),
    context:document.querySelector("canvas").getContext("2d"),
    output:document.querySelector("p"),

    render:function() 
	{
      for (let index = game.world.map.length - 1; index > -1; -- index) 
	  {
        this.buffer.fillStyle = (game.world.map[index] > 0)?("#0013" + game.world.map[index] + "f"):"#303840";
        this.buffer.fillRect((index % game.world.columns) * game.world.tile_size, Math.floor(index / game.world.columns) * game.world.tile_size, game.world.tile_size, game.world.tile_size);
      }

	  this.buffer.fillStyle = game.coin.colour;
      this.buffer.beginPath();
      this.buffer.arc(game.coin.x, game.coin.y, game.coin.radius, 0, Math.PI * 2, false);
	  this.buffer.fill();
	  this.buffer.fillStyle = game.door.colour;
      this.buffer.fillRect(game.door.x, game.door.y, game.door.width, game.door.height);
      this.buffer.fillStyle = game.player.colour;
      this.buffer.fillRect(game.player.x, game.player.y, game.player.width, game.player.height);
	  this.buffer.fillStyle = game.enemy.colour;
      this.buffer.fillRect(game.enemy.x, game.enemy.y, game.enemy.width, game.enemy.height);
      this.context.drawImage(this.buffer.canvas, 0, 0, this.buffer.canvas.width, this.buffer.canvas.height, 0, 0, this.context.canvas.width, this.context.canvas.height);
    },

    resize:function(event) 
	{
	  display.context.canvas.width = window.innerWidth;
	  display.context.canvas.height = window.innerHeight;
	  
      display.render();
    },
	
	end:function()
	{
		if(game.collision.elementCollision(game.player.x,game.player.y,
		                                   game.enemy.x,game.enemy.y,
					         			   game.player.width,game.enemy.width,
		           						   game.player.height,game.enemy.height))
		{
			over = true;
	    }
		if(game.collision.elementCollision(game.player.x,game.player.y,
		                                   game.door.x,game.door.y,
								           game.player.width,game.door.width,
								           game.player.height,game.door.height))
		{
			over = true;
			fin = true;
	    }
		if(game.collision.recCirColl(game.player.x, game.player.y, 
		                             game.player.width, game.player.height, 
									 game.coin.x, game.coin.y, game.coin.radius))
		{
			dum = true;
			
		}
	}
  };
  
  game = {
	  
    player: 
	{
	  colour:"#5e6ac4",
	  
      jumping:false,

      old_x:20,
      old_y:20,

      velocity_x:0,
      velocity_y:0,

	  height:5,
      width:5,
      x:20,
      y:20

    },

	enemy : 
	{
      colour:"#ff073d",

      velocity_x:0,
      velocity_y:0,

	  height:2,
      width:5,
      x:138,
      y:120

    },
	
	door :
	{
	  colour:"#5b544a",
      height:10,
      width:5,
      x:298,
      y:20
	},
	
	coin:
	{
	  colour:"#fff600",
      radius:5,
      x:190,
      y:22.5
	},
	
    world: 
	{
      columns: 21,
      rows:11,
      tile_size:15.2,

      map:     [2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,
	            5,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,4,
	            5,0,0,0,0,0,0,0,0,0,0,0,2,0,0,0,1,1,1,1,4,
	            5,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,4,
	            5,0,0,0,0,0,0,0,0,0,0,0,0,3,3,3,0,0,0,0,4,
	            5,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,4,
	            5,0,0,0,0,0,0,0,0,0,0,0,3,2,3,3,0,0,0,0,4,
	            5,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,4,
				5,0,0,0,0,0,0,0,0,3,3,3,3,3,0,0,0,0,0,0,4,
				5,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,4,
				5,0,0,0,0,0,3,3,3,0,0,0,0,0,0,0,0,0,0,0,4,
				5,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,4,
				1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]  
    },

    collision: 
	{
	  1:function(object, row, column) //left_right_up 
	  {
		if (this.topCollision(object, row)) 
		{ 
	      return; 
		}  
        if (this.leftCollision(object, column)) 
		{ 
	      return; 
		}
        this.rightCollision(object, column);  
      },

      2:function(object, row, column) //left_right_down
	  {
		this.downCollision(object, row);	
      },
	  
      3:function(object, row, column) //all_sides 
	  {
		if (this.topCollision(object, row)) 
		{ 
	      return; 
		}  
		if (this.downCollision(object, row)) 
		{ 
	      return; 
		}  
        if (this.leftCollision(object, column)) 
		{ 
	      return; 
		}
        this.rightCollision(object, column);  
      },

      4:function(object, row, column) //left 
	  {
		this.leftCollision(object, column);
      },
	  
      5:function(object, row, column) //right
	  {
		this.rightCollision(object, column);	
      },

      leftCollision(object, column) 
	  {
        if (object.velocity_x > 0) 
		{
          var left = column * game.world.tile_size;
          if (object.x + object.width * 0.5 > left && object.old_x <= left) 
		  {
            object.velocity_x = 0;
            object.x = object.old_x = left - object.width * 0.5 - 0.001;
            return true;
          }
        }
        return false;
      },

      rightCollision(object, column) 
	  {
        if (object.velocity_x < 0) 
		{
          var right = (column + 1) * game.world.tile_size;
          if (object.x + object.width * 0.5 < right && object.old_x + object.width * 0.5 >= right) 
		  {
            object.velocity_x = 0;
            object.old_x = object.x = right - object.width * 0.5;
            return true;
          }
        }
        return false;
      },

	  downCollision(object, row) 
	  {
        if (object.velocity_y < 0) 
		{
          var down = (row + 1) * game.world.tile_size;
          if (object.y < down && object.old_y >= down) 
		  {
            object.jumping = true;
            object.velocity_y = 0;
            object.old_y = object.y = down + object.height ;//+ 0.5;
            return true;
          }
        }
        return false;
      },
	  
      topCollision(object, row) 
	  {
        if (object.velocity_y > 0) 
		{
          var top = row * game.world.tile_size;
          if (object.y + object.height > top && object.old_y + object.height <= top) 
		  {
            object.jumping = false;
            object.velocity_y = 0;
            object.old_y = object.y = top - object.height - 0.01;
            return true;
          }
        }
        return false;
      },
	  
	  elementCollision:function(x1,y1,x2,y2,w1,w2,h1,h2)
	  {
		return !(x2 > (x1 + w1) || 
                (x2+w1) < x1 || 
                 y2 > (y1 + h1) ||
                (y2 + h2) < y1);
	  },
	  
	  recCirColl:function(x1, y1, width, height, x2, y2, radius)
      {
	    var distX = Math.abs(x2 - x1 - width/2);
        var distY = Math.abs(y2 - y1 - height/2);

        if (distX > (width/2 + radius)) 
	      return false;
        if (distY > (height/2 + radius)) 
		  return false; 

        if (distX <= (width/2)) 
	   	  return true;  
        if (distY <= (height/2)) 
		  return true; 

        var dx = distX - width/2;
        var dy = distY - height/2;
        return ((dx * dx) + (dy * dy) <= (radius * radius));
      }
    },

  loop:function() 
  {
	if(over == false)
	{
      if (controller.left) 
	  {
        game.player.velocity_x -= 0.15;
      }

      if (controller.right) 
	  {
        game.player.velocity_x += 0.15;
      }
     
      if (controller.up && !game.player.jumping) 
	  {
        game.player.velocity_y = -11;
        game.player.jumping = true;
      }
	  if(game.enemy.x < 170	)
	  {
	    game.enemy.velocity_x += 0.09;
	  }
	  else
	  {
		game.enemy.velocity_x -= 0.09;
	  }
	  
      game.player.velocity_y += 1; 
	  
      game.player.old_x = game.player.x;
      game.player.old_y = game.player.y;
      
	  game.player.x += game.player.velocity_x;
      game.player.y += game.player.velocity_y;
	  game.enemy.x += game.enemy.velocity_x;
	  
      if (game.player.x < 0) 
	  {
        game.player.velocity_x = 0;
        game.player.old_x = game.player.x = 0;
      }
	  
	  else if (game.player.x + game.player.width > display.buffer.canvas.width) 
	  {
        game.player.velocity_x = 0;
        game.player.old_x = game.player.x = display.buffer.canvas.width - game.player.width;
      }
	  
      if (game.player.y < 0) 
	  {
        game.player.velocity_y = 0;
        game.player.old_y = game.player.y = 0;
      }
	  
	  else if (game.player.y + game.player.height > display.buffer.canvas.height) 
	  {
        game.player.velocity_y = 0;
        game.player.old_y = game.player.y = display.buffer.canvas.height - game.player.height;
      }

      var tile_x = Math.floor((game.player.x + game.player.width * 0.5) / game.world.tile_size);
      var tile_y = Math.floor((game.player.y + game.player.height) / game.world.tile_size);
      var value_at_index = game.world.map[tile_y * game.world.columns + tile_x];

      if (value_at_index != 0) 
	  {
        game.collision[value_at_index](game.player, tile_y, tile_x);
      }
	  
      tile_x = Math.floor((game.player.x + game.player.width * 0.5) / game.world.tile_size);
      tile_y = Math.floor((game.player.y + game.player.height) / game.world.tile_size);
	  
      value_at_index = game.world.map[tile_y * game.world.columns + tile_x];
      
	  if (value_at_index != 0) 
	  {
        game.collision[value_at_index](game.player, tile_y, tile_x);
      }
	  
      game.player.velocity_x *= 0.9;
      game.player.velocity_y *= 0.9;
	  display.render();
	  display.end();
	}
	else if(over == true && fin == false)
    {
	  var canvas = document.querySelector('canvas');
	  var ctx = canvas.getContext('2d');
      
      ctx.clearRect(0, 0, 1325, 625);
	  ctx.font = "60px Blasphemy";   
	  ctx.fillStyle = '#7874b2';
	  ctx.fillText("Death", 220, 225);
    } 		
	else
	{
      var canvas = document.querySelector('canvas');
	  var ctx = canvas.getContext('2d');
         
      ctx.clearRect(0, 0, 1325, 625);
	  ctx.font = "60px Blasphemy";
	  ctx.fillStyle = '#7874b2';
	  ctx.fillText("Congratulations", 220, 225);
	}
	if(dum == true)
	{
		var canvas = document.querySelector('canvas');
	  var ctx = canvas.getContext('2d');
      
      ctx.clearRect(0, 0, 1440, 900);
	  ctx.font = "25px Blasphemy";
	  ctx.fillStyle = '#7874b2';
	  ctx.fillText("He who is not contented with what he has,", 330, 225);
	  ctx.fillText("would not be contented with what he would like to have",220,280);
	  setTimeout(function()
	  {
	    dum = false; 
	  }, 3000);
	}
    window.requestAnimationFrame(game.loop);
    }
  };
  
  display.buffer.canvas.height = 200;
  display.buffer.canvas.width = 320;
  
  window.addEventListener("resize", display.resize);
  window.addEventListener("keydown", controller.keyUpDown);
  window.addEventListener("keyup", controller.keyUpDown);
  
  game.loop();