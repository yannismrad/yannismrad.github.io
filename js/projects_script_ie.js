var language, projectId;
var langFr="fr", defaultLang="en";

/**Get URL parameters **/
function getURLParameter(name) {
  return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search)||[,""])[1].replace(/\+/g, '%20'))||null
}

$(document).ready(function(){
	checkParameters();
	setReturnLink();
	hideDiv();
	
	$(document).scrollTop( $("#"+projectId+"_"+language).offset().top-110 );  
});

/**Check the GET parameters and load appropriate content **/
function checkParameters()
{
	language = getURLParameter("lang");
	projectId = getURLParameter("proj");
	
	if(language != "fr" && language !="en")
		language = defaultLang;
}

/**Function to hide content depending on the language **/
function hideDiv()
{
	if(language =="fr")
	{
		$("#contentEN").hide();
	}
	
	else
	{
		$("#contentFR").hide();
	}
}

/** Set the right return page (fr or en) depending on the language **/
function setReturnLink()
{
	//Return to resume link in header
	if(language==langFr)
		returnToResumeText= "Retour au CV";	
	else
		returnToResumeText = "Return to Resume"
		
	$("#returnToResumeLink").append("<b>"+returnToResumeText+"</b>");
	if(language=="fr")
		$("#returnToResumeLink").attr("href","index.htm");
		
	else
		$("#returnToResumeLink").attr("href","index_eng.htm");
	
}