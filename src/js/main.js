// Elemento en el que irá la presentación
var wrapper = document.getElementById('DaliShow');

// Dimensiones de la presentación
var CanvasWidth = wrapper.offsetWidth;
var CanvasHeight = wrapper.offsetHeight;

// Se crea la presentación en Phaser
var slideshow = new Phaser.Game( CanvasWidth, CanvasHeight, Phaser.CANVAS, "DaliShow");

// Representa el menú lateral actualmente activo
var lateralActual = "intro";

// Función que cambia el estado del menú lateral.
// utiliza la función fadeTo de JQuery para el
// efecto de aparición lenta
function changeLateralMenu( section )
{
	$("#"+lateralActual).fadeTo(500, 0, function(){
		$("#"+lateralActual).hide(0, function(){
			$("#"+section).fadeTo(500, 1, function() {
				lateralActual = section;
			});
		});
	});
}

// Creando el estado de introducción
var First =
{
	daliAtomicus: "",
	presentation: "",
	fadeout: "",

	// Función de precarga, carga las imagenes necesarias al estado
	preload: function()
	{
		slideshow.load.image("DaliAtomicus", "assets/DaliAtomicus.jpg");
	},

	// Crea la escena del estado cargando la imagen de fondo junto
	// con las animaciones Fade-in de la presentación y el menú
	// lateral
	create: function()
	{
		this.presentation = slideshow.add.group();
		this.daliAtomicus = slideshow.add.image(0, 0, "DaliAtomicus");
		this.daliAtomicus.scale.setTo( CanvasHeight/795 );
		this.presentation.add(this.daliAtomicus);
		this.presentation.alpha = 0;

		// Animaciones son creadas con tween dentro de Phaser
		slideshow.add.tween(this.presentation).to( { alpha: 1 }, 3000, Phaser.Easing.Linear.None, true );
		this.fadeout = slideshow.add.tween(this.presentation).to( { alpha: 0 }, 3000, Phaser.Easing.Linear.None );
		$("#intro").fadeTo(1000, 1, function() {});
	},

	// Retira la foto de presentación para dar paso
	// al siguente estado entrante
	shutdown: function() {
		this.fadeout.start();
	}
}

// Creando el estado que controla la presentación e interacción
// de las 8 pinturas
var Menu =
{
	background: "",
	presentation: "",
	paintings: [],
	positions: [],
	active: -1,
	lastX: -1,
	lastY: -1,

	// Función de precarga, carga las imagenes de las 8 pinturas necesarias al estado
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

	// Crea la escena completa
	create: function()
	{
		// Crea un grupo Phaser y añade la imagen de fondo
		// colocando una transparencia
		this.presentation = slideshow.add.group();
		this.background = slideshow.add.image(0, 0, "paint1");
		this.background.scale.setTo( CanvasHeight/795 );
		this.background.alpha = 0.4;
		this.presentation.add(this.background);

		// Arreglo que contiene las posiciones iniciales x y,
		// la escala s de la imagen, la escala de presentación c
		// usada al clickear la imagen y las posiciones sx sy
		// a las que se desplaza la imagen al clickearla
		this.positions = [
			{x: 20,		y: 30, 	s: 0.13, 	c: 0.33, sx: 25, sy: 10 },
			{x: 250, 	y: 30, 	s: 0.09, 	c: 0.25, sx: 20, sy: 20 },
			{x: 450, 	y: 30, 	s: 0.13, 	c: 0.33, sx: 20, sy: 20 },
			{x: 50, 	y: 220, s: 0.3, 	c: 0.52, sx: 250, sy: 10 },
			{x: 250, 	y: 200, s: 0.3, 	c: 0.90, sx: 130, sy: 20 },
			{x: 450, 	y: 200, s: 0.25, 	c: 0.63, sx: 15, sy: 40 },
			{x: 250, 	y: 350, s: 0.3, 	c: 0.66, sx: 200, sy: 10 },
			{x: 470, 	y: 330, s: 0.08, 	c: 0.18, sx: 180, sy: 10 }
		];

		// Se crean las imagenes y se añaden a un arreglo,
		// Se escalan y se les permite la opción Drag and drop
		// y se les coloca un evento para recibir el click
		// sobre la imagen
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

	// Función que controla el evento cuando el mouse pasa sobre una
	// imagen y esta se expande un poco para aumentar la visibilidad
	update: function()
	{
		// Si no hay ninguna imagen clickeada, se busca sobre
		// cual está el mouse y se realiza el efecto de
		// expandirla
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

	// Función que ayuda a determinar si el evento de ratón es un click o drag and drop
	isDrag: function()
	{
		var distanceFromLastUp = Phaser.Math.distance(slideshow.input.activePointer.positionDown.x, slideshow.input.activePointer.positionDown.y, slideshow.input.activePointer.x, slideshow.input.activePointer.y);
		if (distanceFromLastUp != 0) return true;
		return false;
	},

	// Función que escucha el click de mouse del usuario
	listener: function(image, pointer){
		// Si se determina que es el click izquierdo y
		// no es un drag and drop
		if( pointer.button == 0 && !this.isDrag() ){
			// si no hay foto activa
			if( this.active == -1 ){
				// Se guarda la foto activa y su ultima posicion
				this.active = image.id;
				this.lastX = image.x;
				this.lastY = image.y;

				// Se crean las animaciones de las fotos, una para moverla
				// y la segunda para expandirla a una escala determinada
				move = slideshow.add.tween(image).to(
					{ x:  this.positions[this.active].sx, y:  this.positions[this.active].sy },
					100, Phaser.Easing.Linear.None );

				scale = slideshow.add.tween(image.scale).to(
					{ x: this.positions[this.active].c, y: this.positions[this.active].c },
					1000, Phaser.Easing.Linear.None );

				// Se unen las animaciones
				move.chain(scale);
				move.start();
				changeLateralMenu( "paint" + (this.active + 1) );
			}
			// Si hay una foto activa
			else {
				// Se crean las animaciones, la primera para escalar la foto a pequena
				// y la segunda para moverla a la posicion previa
				scale = slideshow.add.tween(image.scale).to(
					{ x: this.positions[this.active].s, y: this.positions[this.active].s },
					1000, Phaser.Easing.Linear.None );
				move = slideshow.add.tween(image).to( { x: this.lastX, y: this.lastY }, 100, Phaser.Easing.Linear.None );

				// Se unen las animaciones
				move.chain(scale);
				move.start();
				changeLateralMenu( 'instruct' );

				// Se saca la imagen de activa
				this.active = -1;
				this.lastX = -1;
				this.lastY = -1;
			}
		}
	}
}

// Se crean los dos estados en Phaser
slideshow.state.add("Presentation", First);
slideshow.state.add("Menu", Menu);

// Se inicia con el estado de presentación
slideshow.state.start("Presentation");

// función que inicia la presentación luego de pulsar
// el botón "Iniciar", cambia el estado en Phaser y
// cambia el menú lateral por las instrucciones
// de uso
function startSlide()
{
	slideshow.state.start("Menu", true);
	changeLateralMenu( "instruct" );
}
