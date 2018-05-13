var wrapper = document.getElementById('DaliShow');
var CanvasWidth = wrapper.offsetWidth;
var CanvasHeight = wrapper.offsetHeight;

var slideshow = new Phaser.Game( CanvasWidth, CanvasHeight, Phaser.CANVAS, "DaliShow");

var First = {
	preload: function() {
		slideshow.load.image("DaliAtomicus", "assets/DaliAtomicus.jpg");
	},

	create: function() {
		Presentation = slideshow.add.group();
		DaliAtomicus = slideshow.add.image(0, 0, "DaliAtomicus");
		DaliAtomicus.scale.setTo( CanvasHeight/795 );
		Presentation.add(DaliAtomicus);
	}
}

slideshow.state.add("Presentation", First);
slideshow.state.start("Presentation");


function iniciarSlide(){
	console.log("llega")
}
