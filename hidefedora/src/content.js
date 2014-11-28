var fedoras = [],
	removalMethod = 'hide';

chrome.storage.sync.get("removalMethod", function(items) {
	if(_.has(items, "removalMethod")) {
		removalMethod = items.removalMethod;
	}
});

chrome.storage.local.get("fedoras", function(items) {
	if(_.has(items, "fedoras")) {
		fedoras = items.fedoras;
	}
});

var endsWith = function(str, suffix) {
	return str.indexOf(suffix, str.length - suffix.length) !== -1;
};

var randomInt = function(min, max) {
    return Math.floor(Math.random()*(max-min+1)+min);
};

var removeFedora = function(outerSelector, innerSelector) {
	$(outerSelector).each(function(index, element) {
		var el = $(element),
			href = el.find(innerSelector).attr("href"),
			thisEl = $(this);

		if(typeof _.find(fedoras, function(fedora) { return endsWith(href, fedora); }) !== "undefined") {

			switch(removalMethod) {
				// Hide
				case "hide":
					thisEl.remove();
					break;
				// Replace
				case "replace-fedora-cat":
					if(!thisEl.hasClass("hide-fedora-tagged")) {

						$(this).addClass("hide-fedora-tagged");

						var fileUrl = chrome.extension.getURL('resources/pics/fedora-cats/' + randomInt(1,22) + '.jpg');

						// Title
						el.find(".Ub.gna")
							.html("Fedora replaced with a cat")
							.parent()
							.removeAttr('oid')
							.attr("href", fileUrl);
						// Text
						el.find(".Ct").html("Meow meow");
						// Img
						el.find(".Uk.vKa")
							.removeAttr('oid')
							.attr("src", "")
							.attr("src", fileUrl)
							.parent()
							.attr("href", fileUrl);
						// Controls
						el.find(".REa.Sea").remove();
						// Replies
						el.find(".Cx.fr").remove();
					}
					break;
			}

		}
	});
};

var execute = function() {
	removeFedora(".Yp.yt.Xa", ".ve.oba.HPa > a");
	removeFedora(".Ik.Wv", ".fR > a");
};

$.getJSON("https://jhvisser.com/hidefedora/getJSON.php", function(res) {
	fedoras = res.fedoras;
    chrome.storage.local.set({
      fedoras: res.fedoras
    });
});


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
