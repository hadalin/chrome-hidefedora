Changes
=======

List of changes with the latest at the top:

  * v1.8.5
    * Fix permissions.
  * v1.8.4
    * Updated jquery.
  * v1.8.3
    * Fixed plugin execution when transitioning to another state.
  * v1.8.2.1
    * Forgot to uncomment some code after done debugging.
  * v1.8.2
    * Update due to YouTube HTML changes.
  * v1.8.1
    * Bugfix: Fixed button positioning.
  * v1.7.6
    * Bugfix: replies where not removed correctly.
  * v1.7.5
    * Bugfix: also remove replies when replacing comment.
  * v1.7.4
    * Bugfix: replies did not get removed.
  * v1.7.3
    * Update due to YouTube HTML changes.
  * v1.7.2
    * Changed server endpoints.
  * v1.7.1
    * Minor improvement.
  * v1.7.0
    * Fetching JSON every couple of hours to reduce server load.
  * v1.6.9
    * Bugfix: remove comment after reporting.
  * v1.6.8
    * Minor performance improvement.
  * v1.6.7
    * Bugfix: banned words didn't work if the phrase contained certain characters like ```/```.
    * Added confirmation when submitting a report.
    * Changed report button layout.
  * v1.6.6
    * Changed Report button text and escaping youtube URL.
  * v1.6.5
    * Starts removing comments a little bit earlier.
  * v1.6.4
    * Update options footer text.
  * v1.6.3
    * Bugfix: escape HTML in options.
  * v1.6.1
    * Sending Youtube URL as well when reporting a profile.
  * v1.6.0
    * Added option to ban words and phrases.
  * v1.5.2
    * Minor tweak on options page.
  * v1.5.1
    * Added an option to unban all profiles.
  * v1.5.0
    * Reporting a profile now also bans it. Use options page to unban profiles.
  * v1.4.3
    * Show report button on hover.
  * v1.4.2
    * Minor HTML tweak on options page.
  * v1.4.1
    * Included comment text when sending report.
  * v1.4
    * Styled report button.
  * v1.3
    * Added option to hide report button.
  * v1.2
    * Added 'Report Reddit Armie' button.
  * v1.1
    * Embedded 'Submit Reddit Armie profile' notice.
  * v1.0
    * Fetching list of fedora profiles from an outside source.
  * v0.9.5
    * Added footer to options page.
  * v0.9.4
    * Option to replace fedoras with cat pictures now shows cats waring hats. Also cat pictures are stored locally.
  * v0.9.3
    * Blacklist is now also stored locally in case remote list is not available.
  * v0.9.2
    * Tiny improvement.
  * v0.9.1
    * Bugfix.
  * v0.9
    * Added options page.
  * v0.8.2
    * Fixed minor bug.
  * v0.8
    * Bugfix: re-added githubusercontent.com and apis.google.com to manifest "matches" section. Access to githubusercontent is needed in order to load the blacklist. Chrome will ask to approve new permissions.
    * Why such version jump you ask. Simply because it looks more badass.
  * v0.2
    * Optimized inner workings. Extension now consumes less CPU. Actually no CPU when comments are removed and no new comments loaded.
