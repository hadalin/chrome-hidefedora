var resource = null;
var removalMethod = null;

chrome.storage.sync.get("removalMethod", function(items) {
	removalMethod = items.removalMethod;
});

var endsWith = function(str, suffix) {
	return str.indexOf(suffix, str.length - suffix.length) !== -1;
};

var removeFedora = function(outerSelector, innerSelector) {
	$(outerSelector).each(function(index, element) {
		var el = $(element);
		var href = el.find(innerSelector).attr("href");

		if(typeof _.find(resource.fedoras, function(fedora) { 
			return endsWith(href, fedora);
		}) !== "undefined") {

			var thisEl = $(this);

			if(!thisEl.hasClass("hide-fedora-tagged")) {

				thisEl.addClass("hide-fedora-tagged");

				switch(removalMethod) {
					// Hide
					case "hide":
						thisEl.remove();
						break;
					// Replace
					case "replace-fedora-cat":
						el.find(".Ub.gna")
							.html("Fedora replaced with Cat")
							.parent()
							.removeAttr('oid')
							.attr("href", "https://thecatapi.com/api/images/get");
						el.find(".Ct").html("Meow meow");
						el.find(".Uk.vKa")
							.removeAttr('oid')
							.attr("src", "https://thecatapi.com/api/images/get?format=src&type=jpg&size=small&rnd=" + Math.floor(Math.random() * (1000 - 0)) + 0)
							.parent()
							.attr("href", "https://thecatapi.com/api/images/get");
						el.find(".REa.Sea").remove();
						el.find(".Cx.fr").remove();
						break;
				}
			}
		}
	});
};

var execute = function() {
	if(resource !== null) {
		removeFedora(".Yp.yt.Xa", ".ve.oba.HPa > a");
		removeFedora(".Ik.Wv", ".fR > a");
	}
};

$.getJSON("https://raw.githubusercontent.com/hadalin/chrome-hidefedora/master/hidefedora/resources/fedoras.json", function(res) {
	resource = res;
});

// $.getJSON(chrome.extension.getURL("/resources/fedoras.json"), function(res) {
// 	resource = res;
// });

$(function() {

	var target = document.querySelector('.yJa');
	 
	if(target !== null) {

		// Set MutationObserver
		var MutationObserver = window.MutationObserver || window.WebKitMutationObserver;
		var observer = new MutationObserver(function() {
			execute();
		});
		 
		var config = { childList: true, subtree: true };
		 
		observer.observe(target, config);

		// Execute removal a couple of times before MutationObserver kicks in
		var counter = 0;
		var interval = setInterval(function() {
			execute();

	    	counter++;
	    	if(counter === 8) {
	        	clearInterval(interval);
	    	}
		}, 1000);
	}

});
