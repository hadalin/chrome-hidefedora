function save_removal_method() {
  var removalMethod = document.getElementById('removal-method').value;
    chrome.storage.sync.set({
      removalMethod: removalMethod
    });
}

function save_show_report_button() {
  var showReportButton = document.getElementById('show-report-button').checked;
    chrome.storage.sync.set({
      showReportButton: showReportButton
    });
}

function restore_options() {
  chrome.storage.sync.get([
    'removalMethod',
    'showReportButton'
  ], function(items) {
  	if(typeof items.removalMethod !== 'undefined') {
    	document.getElementById('removal-method').value = items.removalMethod;
  	}

  	if(typeof items.showReportButton !== 'undefined') {
    	document.getElementById('show-report-button').checked = items.showReportButton;
  	}
  	else {
    	document.getElementById('show-report-button').checked = true;
  	}
  });
}

document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('removal-method').addEventListener('change', save_removal_method);
document.getElementById('show-report-button').addEventListener('change', save_show_report_button);


var hideTable = function() {
  $('.banned-table').hide();
  $('.ban-all-container').hide();
  $('#empty-notice').show('fast');
};

$(function() {

  var banned = [];
  chrome.storage.sync.get("banned", function(items) {
    if(_.has(items, "banned")) {
      banned = items.banned;
    }

    if(banned.length > 0) {
      _.each(banned, function(value) {
        $('.banned-table > tbody:last').append('<tr><td><a href="https://plus.google.com/' + value + '" target="_blank">plus.google.com/' + value + '</a></td><td><button data-profileid="' + value + '" type="button" class="btn btn-success btn-sm unban-btn">Unban</button></td></tr>');
      });

      $('.unban-btn').click(function() {
        banned = _.without(banned, $(this).attr('data-profileid'));

        chrome.storage.sync.set({
          banned: banned
        });

        if(banned.length > 0) {
          $(this).closest('tr').hide('slow');
        }
        else {
          hideTable();
        }

      });

      $('.unban-all-btn').click(function() {
        if(confirm('You sure?')) {
          chrome.storage.sync.set({
            banned: []
          });

          hideTable();
        }
      });

    }
    else {
      hideTable();
    }
  });

});