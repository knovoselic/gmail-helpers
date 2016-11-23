function insertScript(name) {
  var tag = document.createElement('script');
  tag.src = chrome.extension.getURL(name);
  (document.head || document.documentElement).appendChild(tag);
}

insertScript('jquery-1.10.2.min.js');
insertScript('randomColor.min.js');
insertScript('gmail.js');
insertScript('main.js');
