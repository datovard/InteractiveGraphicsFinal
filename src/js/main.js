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
			{x: 30,		y: 40, 	s: 0.13, 	r: 1 },
			{x: 300, 	y: 50, 	s: 0.09, 	r: 1  },
			{x: 450, 	y: 50, 	s: 0.13, 	r: 1  },
			{x: 50, 	y: 250, s: 0.3, 	r: 1  },
			{x: 250, 	y: 250, s: 0.3, 	r: 1  },
			{x: 450, 	y: 250, s: 0.2, 	r: 1  },
			{x: 50, 	y: 450, s: 0.3, 	r: 1  },
			{x: 250, 	y: 450, s: 0.08, 	r: 1  }
		];

		for( var i = 0; i < this.positions.length; i++ )
		{
			this.paintings[i] = slideshow.add.image( this.positions[i].x, this.positions[i].y, "paint"+(i+1));
			this.paintings[i].scale.setTo( this.positions[i].s );
			this.paintings[i].inputEnabled = true;
		}
	},

	update: function()
	{
		for( var i = 0; i < this.paintings.length; i++ ){
			if(this.paintings[i].input.pointerOver()){
				slideshow.add.tween(this.paintings[i].scale).to( { x: this.positions[i].s + 0.02, y: this.positions[i].s + 0.02 }, 100, Phaser.Easing.Linear.None, true );
			}else{
				slideshow.add.tween(this.paintings[i].scale).to( { x: this.positions[i].s, y: this.positions[i].s }, 100, Phaser.Easing.Linear.None, true );
			}
		}
	}
}

slideshow.state.add("Presentation", First);
slideshow.state.add("Menu", Menu);
slideshow.state.start("Presentation");

function iniciarSlide(){
	slideshow.state.start("Menu", true);
}
