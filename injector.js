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

function addNavigationalButtons()
{
 var commentHeights,
     commentList,
     overflowingCommentList,
     windowHeight = 0,
     windowWidth = 0,
     shouldShowOverlays,
     currentlyVisibleComment,
     eOverlay;

 function getComments(renew)
 {
  if (renew || !commentList)
  {
   commentList = document.querySelectorAll(".issuecomment");
  }
  return commentList;
 }

 function calculateElementHeightsAndTops(elements)
 {
   var scrollTop = window.scrollY;
   return Array.prototype.map.call(
           elements,
           function (e)
           {
            var rect = e.getClientRects()[0];

            return {
                    element: e,
                    top: rect.top + scrollTop,
                    height: rect.height || (rect.bottom - rect.top)
                   };
           });
 }

 function getOverflowingElements(elements, maximalHeight)
 {
   return elements.filter(
           function (element)
           {
             return element.height > maximalHeight;
           });
 }

 function intializeOverflowingCommentsList(
            viewportHeight, shouldOnlyUpdateFilter)
 {
   // window.removeEventListener("resize", handleResize);
   window.addEventListener("resize", handleResize);
   // window.removeEventListener("scroll", handleScroll);
   window.addEventListener("scroll", handleScroll);

   if (!shouldOnlyUpdateFilter)
   {
     commentList = calculateElementHeightsAndTops(getComments());
   }

   overflowingCommentList =
    getOverflowingElements(commentList, viewportHeight);
   shouldShowOverlays = !!overflowingCommentList.length;
 }

 function handleResize()
 {
  var previousWindowWidth = windowWidth,
      previousWindowHeight = windowHeight,
      currentWindowWidth = window.innerWidth,
      currentWindowHeight = window.innerHeight,
      shouldOnlyUpdateFilter = currentWindowWidth === previousWindowWidth,
      heightDelta = previousWindowHeight - currentWindowHeight;
  
  // The window was only resized a bit, bail.
  if (previousWindowWidth !== 0 && (heightDelta < 10 || heightDelta > -10))
  {
   return;
  }

  windowHeight = currentWindowHeight;
  windowWidth = currentWindowWidth;

  // TODO - implement some delay instead of recalculating on resize?
  // Some users resize slowly.

  intializeOverflowingCommentsList(windowHeight, shouldOnlyUpdateFilter);
 }

 function handleScroll()
 {
  if (!shouldShowOverlays)
  {
   return;
  }

  var scrollTop = window.scrollY;

  var currentlyVisibleComments =
   overflowingCommentList.filter(
    function (e)
    {
     return (e.top < scrollTop) &&
            ((e.top + e.height) > scrollTop + windowHeight);
    });

  if (currentlyVisibleComments.length !== 1)
  {
    currentlyVisibleComment = 0;
    eOverlay.classList.add("hidden");
    return;
  }
  currentlyVisibleComment = currentlyVisibleComments[0];
  eOverlay.classList.remove("hidden");
 }

 function handlePreviousCommentClick(e)
 {
  e.preventDefault();
  var previousCommentIndex = commentList.indexOf(currentlyVisibleComment);
  if (previousCommentIndex === 0)
  {
   scrollTo(scrollX, 0);
  }
  else
  {
   scrollTo(
    scrollX,
    commentList[commentList.indexOf(currentlyVisibleComment) - 1].top);
  }
 }

 function handleNextCommentClick(e) {
  e.preventDefault();
  var nextCommentIndex = commentList.indexOf(currentlyVisibleComment);
  if (nextCommentIndex === (commentList.length - 1))
  {
   scrollTo(scrollX, 9e9);
  }
  else
  {
   scrollTo(
    scrollX,
    commentList[commentList.indexOf(currentlyVisibleComment) + 1].top);
  }
 }

 // Use MutationObserver in order to adjust to dynamically added comments,
 // in case that is ever implemented.
 // function handleDynamicallyAddedElements()
 // {
 //  getComments(true);
 //  handleResize();
 // }

 function initializeOverlay()
 {
  eOverlay = document.body.appendChild(document.createElement("div"));
  eOverlay.classList.add("comment-navigator-overlay", "hidden");
  eOverlay.innerHTML =
   "<style>.comment-navigator-overlay a" +
   "{text-decoration: none; display: block;}" +
   ".comment-navigator-overlay.hidden{visibility: hidden;}" +
   ".comment-navigator-overlay:hover{opacity:1;}" +
   ".comment-navigator-overlay{opacity: 0.5; border-radius: 5px; " +
   "background: lightblue; color: black; top: 20px; position: fixed; " +
   "right: 20px;}</style>" +
   "<a href=\"#\" title=\"Previous comment\">▲</a>" +
   "<a href=\"#\" title=\"Next comment\">▼</a>";
  eOverlay.children[1].addEventListener("click", handlePreviousCommentClick);
  eOverlay.children[2].addEventListener("click", handleNextCommentClick);
  handleResize();
 }

 initializeOverlay();
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
   else if (shouldInitiateOpen)
   {
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
 document.addEventListener("DOMContentLoaded", enhanceOldVideos);
 window.addEventListener("load", addNavigationalButtons);

 if (!window.MutationObserver)
 {
  return;
 }

 // A poor attempt to make videos not download, or to make the browser
 // cancel the video download. It does not really work. :(
 new MutationObserver(
  function ()
  {
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
