var wrapper = document.getElementById('DaliShow');
var CanvasWidth = wrapper.offsetWidth;
var CanvasHeight = wrapper.offsetHeight;

var slideshow = new Phaser.Game( CanvasWidth, CanvasHeight, Phaser.CANVAS, "DaliShow");

var First =
{
	daliAtomicus: "",
	presentation: "",
	fadeout: "",

	preload: function()
	{
		slideshow.load.image("DaliAtomicus", "assets/DaliAtomicus.jpg");
	},

	create: function()
	{
		this.presentation = slideshow.add.group();
		this.daliAtomicus = slideshow.add.image(0, 0, "DaliAtomicus");
		this.daliAtomicus.scale.setTo( CanvasHeight/795 );
		this.presentation.add(this.daliAtomicus);
		this.presentation.alpha = 0;

		slideshow.add.tween(this.presentation).to( { alpha: 1 }, 3000, Phaser.Easing.Linear.None, true );
		this.fadeout = slideshow.add.tween(this.presentation).to( { alpha: 0 }, 3000, Phaser.Easing.Linear.None );
		$("#intro").fadeTo(1000, 1, function() {});
	},

	shutdown: function() {
		this.fadeout.start();
	}
}

var Menu =
{
	background: "",
	presentation: "",
	paintings: [],
	positions: [],
	active: -1,
	lastX: -1,
	lastY: -1,

	preload: function()
	{
		slideshow.load.image("paint1", "assets/PersistenciaDeLaMemoria.jpg");
		slideshow.load.image("paint2", "assets/CisnesReflejandoElefantes.jpg");
		slideshow.load.image("paint3", "assets/ElGranMasturbador.jpg");
		slideshow.load.image("paint4", "assets/CristoDeSanJuanDeLaCruz.jpg");
		slideshow.load.image("paint5", "assets/ConstruccionBlandaConJudiasHervidas.jpg");
		slideshow.load.image("paint6", "assets/LaMetamorfosisDeNarciso.jpg");
		slideshow.load.image("paint7", "assets/GalateaDeLasEsferas.jpg");
		slideshow.load.image("paint8", "assets/SuenoCausadoVueloAbejaAlrededorGranadaSegundoAntesDespertar.jpg");
	},

	create: function()
	{
		this.presentation = slideshow.add.group();
		this.background = slideshow.add.image(0, 0, "paint1");
		this.background.scale.setTo( CanvasHeight/795 );
		this.background.alpha = 0.4;
		this.presentation.add(this.background);

		this.positions = [
			{x: 30,		y: 40, 	s: 0.13, 	c: 0.35, sx: 25, sy: 10 },
			{x: 300, 	y: 50, 	s: 0.09, 	c: 0.26, sx: 20, sy: 20 },
			{x: 450, 	y: 50, 	s: 0.13, 	c: 0.34, sx: 20, sy: 20 },
			{x: 50, 	y: 250, s: 0.3, 	c: 0.6, sx: 250, sy: 10 },
			{x: 250, 	y: 250, s: 0.3, 	c: 1, sx: 130, sy: 20 },
			{x: 450, 	y: 250, s: 0.2, 	c: 0.67, sx: 15, sy: 40 },
			{x: 50, 	y: 450, s: 0.3, 	c: 0.76, sx: 200, sy: 10 },
			{x: 250, 	y: 450, s: 0.08, 	c: 0.2, sx: 180, sy: 10 }
		];

		for( var i = 0; i < this.positions.length; i++ )
		{
			this.paintings[i] = slideshow.add.image( this.positions[i].x, this.positions[i].y, "paint"+(i+1));
			this.paintings[i].scale.setTo( this.positions[i].s );
			this.paintings[i].inputEnabled = true;
			this.paintings[i].input.enableDrag(false, true);
			this.paintings[i].input.dragDistanceThreshold = 20;
			this.paintings[i].events.onInputUp.add(this.listener, this);
			this.paintings[i].id = i;
		}
	},

	update: function()
	{
		if( this.active == -1 ){
			for( var i = 0; i < this.paintings.length; i++ ){
				if(this.paintings[i].input.pointerOver()){
					slideshow.add.tween(this.paintings[i].scale).to( { x: this.positions[i].s + 0.02, y: this.positions[i].s + 0.02 }, 100, Phaser.Easing.Linear.None, true );
				}else{
					slideshow.add.tween(this.paintings[i].scale).to( { x: this.positions[i].s, y: this.positions[i].s }, 100, Phaser.Easing.Linear.None, true );
				}
			}
		}
	},

	isDrag: function()
	{
		var distanceFromLastUp = Phaser.Math.distance(slideshow.input.activePointer.positionDown.x, slideshow.input.activePointer.positionDown.y, slideshow.input.activePointer.x, slideshow.input.activePointer.y);
		if (distanceFromLastUp != 0) return true;
		return false;
	},

	listener: function(image, pointer){
		if( pointer.button == 0 && !this.isDrag() ){
			if( this.active == -1 ){
				this.active = image.id;
				this.lastX = image.x;
				this.lastY = image.y;

				move = slideshow.add.tween(image).to(
					{ x:  this.positions[this.active].sx, y:  this.positions[this.active].sy },
					100, Phaser.Easing.Linear.None );

				scale = slideshow.add.tween(image.scale).to(
					{ x: this.positions[this.active].c, y: this.positions[this.active].c },
					1000, Phaser.Easing.Linear.None );

				move.chain(scale);
				move.start();
				this.showInfo(this.active);
			} else {
				scale = slideshow.add.tween(image.scale).to(
					{ x: this.positions[this.active].s, y: this.positions[this.active].s },
					1000, Phaser.Easing.Linear.None );
				move = slideshow.add.tween(image).to( { x: this.lastX, y: this.lastY }, 100, Phaser.Easing.Linear.None );
				move.chain(scale);
				move.start();
				this.showInstruct( this.active );

				this.active = -1;
				this.lastX = -1;
				this.lastY = -1;
			}
		}
	},

	showInfo: function( id )
	{
		$("#instruct").fadeTo(1000, 0, function(){
			$("#instruct").hide();
			$("#paint"+(id+1)).fadeTo(1000, 1, function() {});
		});
	},

	showInstruct: function( id )
	{
		$("#paint"+(id+1)).fadeTo(1000, 0, function(){
			$("#paint"+(id+1)).hide();
			$("#instruct").fadeTo(1000, 1, function() {});
		});
	}
}

slideshow.state.add("Presentation", First);
slideshow.state.add("Menu", Menu);
slideshow.state.start("Presentation");

function startSlide()
{
	slideshow.state.start("Menu", true);
	$("#intro").fadeTo(1000, 0, function() {
		$("#intro").hide();
		$("#instruct").fadeTo(1000, 1, function(){});
	});
}
