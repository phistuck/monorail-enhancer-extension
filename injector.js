// All rights reserved? (c) PhistucK
// This code is released to the public domain where available,
// or under the MIT license since it is pretty unrestrictive
// and it sounds swell.

// Watch out, this code is pretty stupid.
// I hold no responsibility for you getting fired for copying it.
// Or for brain damage.

var url = document.location.href;

function runAttachmentView()
{
 var eContent = document.querySelector("pre.prettyprint"),
     content,
     eContainer,
     eLink,
     eLinkContainer;

 function processContent()
 {
  var content =
       Array.prototype.map.call(
        eContent.querySelectorAll("tr"),
        function (e)
        {
         return e.textContent;
        })
        .join("\n");
  this.href =
   "data:text/html" +
   (content.match(/charset['"\s]*=['"\s]*/i)? "": ";charset=utf-8") +
   "," +
   encodeURIComponent(content);
 }

 if (!eContent)
 {
  return;
 }
 eContainer = document.querySelector(".fc");
 eLinkContainer =
  eContainer.insertBefore(
   document.createElement("div"), eContainer.firstChild);
 eLinkContainer.style.textAlign = "center";
 eLink = eLinkContainer.appendChild(document.createElement("a"));
 eLink.innerHTML = "Run";
 eLink.href = "#";
 eLink.addEventListener("click", processContent);
}

function runListView()
{
 var eResults = document.querySelector("#resultstable"),
     lastClientX = 0, lastClientY = 0,
     shouldCheckForClicks = true, shouldInitiateOpen = true;
 eResults.addEventListener(
  "mousedown",
  function (e)
  {
   if (e.button !== 1)
   {
    return;
   }
   lastClientX = e.clientX;
   lastClientY = e.clientY;
   e.preventDefault();
  });
 eResults.addEventListener(
  "mouseup",
  function (e)
  {
   function open()
   {
    var element = e.target,
        eLink,
        hRef;

    while (element && element.tagName !== "TR")
    {
     element = element.parentNode;
    }
    
    if (!element)
    {
     return;
    }
    
    eLink = element.querySelector("a[href]");
    hRef = eLink.getAttribute("href");
    if (!eLink || !hRef || hRef === "#")
    {
     return;
    }

    window.open(eLink.href);
   }

   if (e.clientX !== lastClientX || e.clientY !== lastClientY)
   {
    return;
   }
   
   lastClientX = 0;
   lastClientY = 0;
   if (shouldCheckForClicks)
   {
    timer = 
     setTimeout(
      function ()
      {
       shouldCheckForClicks = false;
       shouldInitiateOpen = true;
       open();
      },
      200);
   }
   else if (shouldInitiateOpen) {
    open();
   }
  });
 eResults.addEventListener(
  "click",
  function (e)
  {
   if (e.button !== 1)
   {
    return;
   }
   
   clearTimeout(timer);
   shouldCheckForClicks = false;
   shouldInitiateOpen = false;
  });
}

function runIssueView()
{
 function enhanceOldVideos()
 {
  Array.prototype.forEach.call(
   document.querySelectorAll(
   '*:not([href*="&inline=1"]):not([href*="attachmentText?aid"])' +
   ' + a[href^="attachment?"][download]'),
   function (e)
   {
    var eFileName = e.parentNode.querySelector("b"),
        fileName = (eFileName && eFileName.textContent) || "",
        eLink,
        acceptableExtensions =
         [
          "mp4",
          "webm",
          "mkv",
          "ogv",
          "wav",
          "mp3",
          "aac",
          "ogg",
          "opus",
          // Surprisingly, it works.
          // For example -
          // crbug.com/619999#c6
          "mov"
          // TODO(phistuck) - add others?
         ];

    function contains(extension)
    {
     return fileName.indexOf("." + extension) !== -1? "1": "";
    }
    
    if (!acceptableExtensions.map(contains).join(""))
    {
     return;
    }
    
    eLink = e.parentNode.insertBefore(document.createElement("a"), e);
    eLink.textContent = "Attempt viewing";
    eLink.target = "_blank";
    eLink.href =
     "data:text/html," +
     "<!doctype html><body style=\"margin: 0\">" +
     "<video autoplay=\"autoplay\" " +
     "onplay=\"this.width = window.innerWidth - 10; " +
              "this.height = window.innerHeight - 10\"" +
     "controls=\"controls\" src=\"" + e.href + "\"" +
     "style=\"max-width: 100%; max-height: 100%;\"/>";
   });
 }
 document.documentElement.appendChild(document.createElement("style"))
  .textContent = "video {display: none;}";
 // A poor attempt to make videos not download, or to make the browser
 // cancel the video download. It does not really work. :(
 new MutationObserver(function() {
  Array.prototype.forEach.call(
   document.querySelectorAll("video"),
   function (e)
   {
    e.parentNode.removeChild(e);
   });
 })
 .observe(
  document.documentElement,
  {
   childList: true,
   subtree: true
  });
 document.addEventListener("DOMContentLoaded", enhanceOldVideos);
}

if (url.indexOf("issues/attachmentText?") !== -1)
{
 document.addEventListener("DOMContentLoaded", runAttachmentView);
}
else if (url.indexOf("issues/list") !== -1)
{
 document.addEventListener("DOMContentLoaded", runListView);
}
else if (url.indexOf("issues/detail") !== -1)
{
 runIssueView();
}
