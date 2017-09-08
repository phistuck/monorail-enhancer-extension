# monorail-enhancer-extension
Enhancing Monorail, for a speedier bug driving. Err... tracking.

## Features
- Adds a "Run" button to the HTML attachment source code viewer.
- Removes inline videos.
- Adds audio and video playback without saving the file first.
- Adds navigational previous and next arrows to long comments.
- Adds a shortcut for ticking platforms that use Blink.

## Compatibility
Should work with any browser that supports the content script and event page features and the `chrome.runtime.sendMessage`, `chrome.runtime.onMessage` and `chrome.tabs.create` APIs of Chrome extensions (so Edge, Firefox, Opera and Chrome?), ECMAScript 5 `Array.prototype.filter`, `Array.prototype.map` and `Array.prototype.forEach` and ECMAScript 6 `let`, `const`, `for-of` and `=>` functions.

## Known Issues
- Hiding and removing videos from the page does not cancel their download. Shame. It was a nice try.
However, the stupid code is left there in case it one day works. Note that I deliberately did not use any deprecated mutation events. I would not want to get in the way of removing them from the platform one day.
- Tested in Chrome 60, created by a human - so the supported video and audio extensions are hard coded according to my memory of the supported formats in Chrome 51.

## Pull Requests
Sure, have fun. It will be my first pull-request-to-approve ever!

Or just fork it away and forget about me. Forget about everything, really. Go to sleep.

## Responsibility
None. You are on your own.

## License
MIT, or public domain. Whichever works for you.
