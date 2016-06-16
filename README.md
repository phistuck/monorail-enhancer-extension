# monorail-enhancer-extension
Enhancing Monorail, for a speedier bug driving. Err... tracking.

## Features
- Adds a \"Run\" button to the HTML attachment source code viewer.
- Removes inline videos.
- Adds audio and video playback without saving the file first.
- Fixes middle clicks on issue lists.
- Adds navigational previous and next arrows to long comments.

## Compatibility
Should work with any browser that supports the content script feature of Chrome extensions (so Edge, Firefox, Opera and Chrome?), ECMAScript 5 Array.prototype.filter, Array.prototype.map and Array.prototype.forEach.

## Known Issues
- Hiding and removing videos from the page does not cancel their download. Shame. It was a nice try.
However, the stupid code is left there in case it one day works. Note that I deliberately did not use any deprecated mutation events. I would want to get in the way of removing them from the platform one day.
- Tested in Chrome 51, created by a human - so the supported video and audio extensions are hard coded according to my memory of the supported formats in Chrome 51.

## Pull Requests
Sure, have fun. It will be my first pull-request-to-approve ever!

Or just fork it away and forget about me. Forget about everything, really. Go to sleep.

## Responsibility
None. You are on your own.
