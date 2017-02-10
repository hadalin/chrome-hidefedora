var TIME_PERIOD_CHECK_HOURS = 1,
	JSON_URL = 'https://jhvisser.com/hidefedora/reports/profiles.json',
	fedoras = [],
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
		url: 'https://jhvisser.com/hidefedora/reports',
		type: 'POST',
		data: {
			submit: 1,
			profileUrl: profileId,
			comment: comment,
			youtubeUrl: window.location.href
		}
	});
};

var onReportClick = function(e) {
	if(confirm('Are you sure you want to report and ban this fedora profile?')) {
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

var process = function(outerSelector) {
	$(outerSelector).each(function(index, element) {
		var el = $(element),
			profileId = el.find('a').attr('href');
			comment = el.find('.comment-renderer-text-content:first').text();
			thisEl = $(this);

		if(_.contains(fedoras, profileId) ||
			_.contains(banned, profileId) ||
			_.some(bannedWords, function(word) {
				return comment.toLowerCase().indexOf(_.unescape(word.toLowerCase())) > -1;
			})) {

			switch(removalMethod) {
				// Hide
				case "hide":
					var commentThreadRenderer = thisEl.parent('.comment-thread-renderer');
					if (commentThreadRenderer.length === 0) {
						thisEl.remove();
					} else {
						thisEl.parent('.comment-thread-renderer').remove();
					}
					break;
				// Replace
				case "replace-fedora-cat":
					if(!thisEl.hasClass("hide-fedora-found")) {

						thisEl.addClass("hide-fedora-found");

						thisEl.parent().find('.comment-replies-renderer').remove();

						var fileUrl = chrome.extension.getURL('resources/pics/fedora-cats/' + randomInt(1,22) + '.jpg');

						// Title
						el.find(".comment-author-text")
							.html("Replaced with a cat")
							.removeAttr('data-ytid')
							.attr("href", fileUrl);
						// Text
						el.find(".comment-renderer-text-content").html("Meow meow");
						// Img
						el.find(".comment-author-thumbnail")
							.find("img")
							.attr("src", "")
							.attr("src", fileUrl)
							.closest(".yt-uix-sessionlink")
							.attr("href", fileUrl)
							.removeAttr('data-ytid');
						// Controls
						el.find(".comment-renderer-footer").remove();
						// Replies
						el.find('.comment-replies-renderer:first').remove();
					}
					break;
			}

		}
		else if(showReportButton && !thisEl.hasClass("hide-fedora-tagged")) {
			thisEl.addClass("hide-fedora-tagged");
			thisEl
				.find('.comment-renderer-footer .comment-action-buttons-toolbar')
				.append('<button type="button" class="hide-fedora-report-btn">HF</button>');

			thisEl.find('.hide-fedora-report-btn')
				.data('profileId', profileId)
				.data('comment', comment)
				.click(onReportClick);
		}
	});
};

var execute = function() {
	process(".comment-renderer");
};

var fetchJSON = function(dateString) {
	$.getJSON(JSON_URL, function(res) {
		fedoras = res.fedoras;
	    chrome.storage.local.set({
	      fedoras: res.fedoras,
	      lastJSONUpdate: dateString
	    });
	});
};

chrome.storage.local.get("lastJSONUpdate", function(items) {
	if(_.has(items, "lastJSONUpdate")) {
		var lastJSONUpdate = items.lastJSONUpdate,
			now = moment();

		if(moment(lastJSONUpdate).add(TIME_PERIOD_CHECK_HOURS, 'hours').isBefore(now)) {
			fetchJSON(now.toISOString());
		}
	}
	else {
		fetchJSON(new Date().toISOString());
	}
});

var trigger = function() {
	var target = document.querySelector('#watch-discussion');

	if (target === null) return;

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
		if (counter === 24) {
			clearInterval(interval);
		}
	}, 250);
};

window.addEventListener('pageshow', function() {
	trigger();
});

document.addEventListener('transitionend', function(e) {
	if (e.target.id === 'progress') {
		trigger();
	}
});
