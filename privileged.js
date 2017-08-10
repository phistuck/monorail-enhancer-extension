// All rights reserved? (c) PhistucK
// This code is released to the public domain where available,
// or under the MIT license since it is pretty unrestrictive
// and it sounds swell.

// Watch out, this code is pretty stupid.
// I hold no responsibility for you getting fired for copying it.
// Or for brain damage.

chrome.runtime.onMessage.addListener(
 function (message)
 {
  if (message.action === "open-url")
  {
   chrome.tabs.create({url: message.url};
  }
 });
