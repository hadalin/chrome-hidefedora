var fedoras = [],
	removalMethod = 'hide',
	showReportButton = true,
	banned = [],
	bannedWords = [];

chrome.storage.sync.get(["removalMethod", "showReportButton"], function(items) {
	if(_.has(items, "removalMethod")) {
		removalMethod = items.removalMethod;
	}
	if(_.has(items, "showReportButton")) {
		showReportButton = items.showReportButton;
	}
});

chrome.storage.local.get(["fedoras", "banned", "bannedWords"], function(items) {
	if(_.has(items, "fedoras")) {
		fedoras = items.fedoras;
	}
	if(_.has(items, "banned")) {
		banned = items.banned;
	}
	if(_.has(items, "bannedWords")) {
		bannedWords = items.bannedWords;
	}
});

var randomInt = function(min, max) {
    return Math.floor(Math.random()*(max-min+1)+min);
};

var localBan = function(profileId) {
	if(!_.contains(banned, profileId)) {
		chrome.storage.local.get("banned", function(items) {
			if(_.has(items, "banned")) {
				banned = items.banned;
			}
			banned.push(profileId);
		    chrome.storage.local.set({
		      banned: banned
		    });
		});
	}
};

var getParentUrl = function() {
	var isInIFrame = (parent !== window),
        parentUrl = null;

    if(isInIFrame) {
        parentUrl = _.escape(document.referrer);
    }

    return parentUrl;
};

var submitReport = function(profileId, comment) {
	$.ajax({
		url: 'https://jhvisser.com/hidefedora/html/submit/submit.php',
		type: 'POST',
		data: {
			submit: 1,
			profileUrl: profileId,
			comment: comment,
			youtubeUrl: getParentUrl()
		}
	});
};

var onReportClick = function(e) {
	if(confirm('Are you sure you want to report and ban fedora profile?')) {
		var profileId = $(this).data("profileId"),
			comment = $(this).data("comment");

		localBan(profileId);
		submitReport(profileId, comment);

		$(this).prop('disabled', true).html('Reported').addClass('hide-fedora-reported');

		setTimeout(function() {
			execute();
		}, 1000);
	}
};

var process = function(outerSelector, innerSelector) {
	$(outerSelector).each(function(index, element) {
		var el = $(element),
			profileId = el.find('[oid]').first().attr('oid'),
			comment = el.find('div.Ct').first().text(),
			thisEl = $(this);

		if(_.contains(fedoras, profileId) || 
			_.contains(banned, profileId) || 
			_.some(bannedWords, function(word) { 
				return comment.toLowerCase().indexOf(_.unescape(word.toLowerCase())) > -1; 
			})) {

			switch(removalMethod) {
				// Hide
				case "hide":
					thisEl.remove();
					break;
				// Replace
				case "replace-fedora-cat":
					if(!thisEl.hasClass("hide-fedora-found")) {

						thisEl.addClass("hide-fedora-found");

						var fileUrl = chrome.extension.getURL('resources/pics/fedora-cats/' + randomInt(1,22) + '.jpg');

						// Title
						el.find(".Ub.gna")
							.html("Replaced with a cat")
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
		else if(showReportButton && !thisEl.hasClass("hide-fedora-tagged")) {
			thisEl.addClass("hide-fedora-tagged");
			thisEl
				.find('.RN.f8b')
				.first()
				.after('<button type="button" class="hide-fedora-report-btn">HF</button>');

			thisEl.find('.hide-fedora-report-btn')
				.data('profileId', profileId)
				.data('comment', comment)
				.click(onReportClick);
		}
	});
};

var execute = function() {
	process(".Yp.yt.Xa", ".ve.oba.HPa > a");
	process(".Ik.Wv", ".fR > a");
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
	    	if(counter === 24) {
	        	clearInterval(interval);
	    	}
		}, 250);
	}

});
