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



var banned = [],
    bannedWords = [];

var entityMap = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': '&quot;',
  "'": '&#39;',
  "/": '&#x2F;'
};

var escapeHtml = function(string) {
  return String(string).replace(/[&<>"'\/]/g, function(s) {
    return entityMap[s];
  });
};

var hideProfilesTable = function() {
  $('#banned .banned-table').hide();
  $('#banned .unban-all-container').hide();
  $('#banned .empty-notice').show('fast');
};

var showWordsTable = function() {
  $('#bannedWords .bannedWords-table').show('fast');
  $('#bannedWords .unban-all-container').show();
  $('#bannedWords .empty-notice').hide();
};

var hideWordsTable = function() {
  $('#bannedWords .bannedWords-table').hide();
  $('#bannedWords .unban-all-container').hide();
  $('#bannedWords .empty-notice').show('fast');
};

var addWordTableRow = function(word) {
  var tbody = $('#bannedWords .bannedWords-table > tbody:last').append('<tr><td> ' + word + ' </td><td><button type="button" class="btn btn-success btn-sm unban-word-btn">Unban</button></td></tr>'),
      lastBtn = tbody.find('tr:last .unban-word-btn');

  lastBtn.data('word', word);

  lastBtn.click(function() {
    var word = $(this).data('word');
    bannedWords = _.without(bannedWords, word);

    chrome.storage.local.set({
      bannedWords: bannedWords
    });

    $(this).closest('tr').remove();

    if(bannedWords.length < 1) {
      hideWordsTable();
    }
  });

};

$(function() {

  // Banned profiles
  chrome.storage.local.get("banned", function(items) {
    if(_.has(items, "banned")) {
      banned = items.banned;
    }

    if(banned.length > 0) {
      _.each(banned, function(value) {
        $('#banned .banned-table > tbody:last').append('<tr><td><a href="https://plus.google.com/' + value + '" target="_blank">plus.google.com/' + value + '</a></td><td><button data-profileid="' + value + '" type="button" class="btn btn-success btn-sm unban-btn">Unban</button></td></tr>');
      });


      $('#banned .unban-btn').click(function() {
        banned = _.without(banned, $(this).attr('data-profileid'));

        chrome.storage.local.set({
          banned: banned
        });

        if(banned.length > 0) {
          $(this).closest('tr').remove();
        }
        else {
          hideProfilesTable();
        }

      });


      $('#banned .unban-all-btn').click(function() {
        if(confirm('You sure?')) {
          banned = [];
          chrome.storage.local.set({
            banned: banned
          });

          $('#banned .banned-table tbody:last tr').remove();

          hideProfilesTable();
        }
      });

    }
    else {
      hideProfilesTable();
    }
  });

  // Banned words
  chrome.storage.local.get("bannedWords", function(items) {
    if(_.has(items, "bannedWords")) {
      bannedWords = items.bannedWords;
    }

    if(bannedWords.length > 0) {
      _.each(bannedWords, function(word) {
        addWordTableRow(word);
      });
    }
    else {
      hideWordsTable();
    }


    $('#bannedWords .add-word-btn').click(function() {
      var wordInputEl = $('#bannedWords .word-text'),
          word = escapeHtml(wordInputEl.val().trim());

      if(word !== "") {
        if(!_.contains(bannedWords, word)) {
          bannedWords.push(word);

          chrome.storage.local.set({
            bannedWords: bannedWords
          });

          addWordTableRow(word);

          if(bannedWords.length <= 1) {
            showWordsTable();
          }

        }
        else {
          alert('Word already exists.');
        }

        wordInputEl.val('');
      }
    });


    $('#bannedWords .unban-all-btn').click(function() {
      if(confirm('You sure?')) {
        bannedWords = [];
        chrome.storage.local.set({
          bannedWords: bannedWords
        });

        $('#bannedWords .bannedWords-table tbody:last tr').remove();

        hideWordsTable();
      }
    });

    $('#bannedWords .word-text').keyup(function(e) {
      if(event.keyCode == 13) {
        $('#bannedWords .add-word-btn').click();
      }
    });

  });

  $("form").on('submit',function(e) {
      e.preventDefault();
  });

  $('a[data-toggle="tab"]').on('click', function() {
    setTimeout(function() {
      $('#bannedWords .word-text').focus();
    }, 200);
  });

});