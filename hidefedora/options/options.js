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
