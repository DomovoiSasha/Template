window.onload = function () {
	var btnUp = document.getElementById('btn-up');

	
	btnUp.onclick = function() { 
		window.scrollTo(0,0);
	};
	
	window.onscroll = function () { 
		if ( window.pageYOffset > 0 ) {
			btnUp.style.display = 'block';
		} else {
			btnUp.style.display = 'none';
		};
		
	};
	
};

