function onAnchorClick(event) {
  chrome.tabs.create({
    selected: true,
    url: event.srcElement.href
  });
  return false;
}
function buildDom(ul, url, visitId, pvisitId){
	
	var a = document.createElement('a');
	a.href = url;
	a.appendChild(document.createTextNode("The visit ID: "+visitId+" and the parent's visit ID: "+pvisitId));
	//a.addEventListener('click', onAnchorClick);

	var li = document.createElement('li');
	li.appendChild(a);
	ul.appendChild(li);
}
function buildTypedUrlList(divName) {
	var urlTrack=[];
	var myDiv = document.getElementById(divName);
	var ul = document.createElement('ul');
	myDiv.appendChild(ul);
	chrome.history.onVisited.addListener(function (historyItem){
		numberOfVisits=0;
		console.log(historyItem.url+"--"+historyItem.id+"--"+historyItem.title+"--"+historyItem.visitCount+"\n");
		var url=historyItem.url;
		
		chrome.history.getVisits({url: url}, function(visitItems) {
				var lastVisitTime=historyItem.lastVisitTime;
				processVisits(url, visitItems);
          });

	});
	var processVisits = function(url, visitItems) {
		var ie = visitItems.length-1;
		urlTrack[visitItems[ie].visitId]={"url": url, "ParentID": visitItems[ie].referringVisitId};
		console.log(JSON.stringify(urlTrack[visitItems[ie].visitId])+"\n");
		buildDom(ul,url, visitItems[ie].visitId, visitItems[ie].referringVisitId);

	};

}

document.addEventListener('DOMContentLoaded', function () {
  buildTypedUrlList("typedUrl_div");
});