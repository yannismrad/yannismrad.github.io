/**Global vars **/
var language, langFr = "fr", defaultLanguage = "en", projectId, projectName, projectImage, projectDescription, projectGitLink, projectYTLink;
var xmlProjectFile = "project_desc.xml";
var githubIcon = "images/logos/github.png";
var returnToResumeText;
var error = false;
var useXDR = false;

$(document).ready(function(){
	checkBrowser();
	checkParameters();
});

/** Function to check the browser **/
function checkBrowser()
{
	//if IE is the browser (-> uses active x object)
	if("ActiveXObject" in window)
		useXDR = true;
}

/**Check the GET parameters and load appropriate content **/
function checkParameters()
{
	language = getURLParameter("lang");
	projectId = getURLParameter("proj");
	
	setReturnLink();	
	loadContent();

}

/** Load content from XML file**/
function loadContent()
{
	if(!useXDR)
	{
			$.ajax({ 
			type: "GET", 
			async:"false",
			url: "project_desc.xml", 
			dataType: "xml",
			xhrFields: {
				withCredentials: true
			},
			success: function(data){
				processData(data);
			},
			
			error: function(xhr, status, error){
				alert("XML failed with error: " + error);
			}
		});
	}
	
	else
	{
		loadIEVersion();
	}
	
}

/** Process the xml Data **/
function processData(data)
{
	//console.log("youpi");
	var xml = $(data);
	var project= xml.find('project[id="'+projectId+'"]');
	
	//invalid project
	if(project.length == 0)
	{
		console.log("error invalid id");
		project = xml.find('project[id="error"]'); //choose the default project (error)
		error = true;
	}

	//Get the name
	projectName = project.find('name').text();
	
	//Get the appropriate description, for chosen language
	projectDescription = project.find('description[lang="'+language+'"]').text();
	
	//if language does not exist chose english as the default one
	if(projectDescription.length == 0)
	{
		language = defaultLanguage;
		projectDescription = project.find('description[lang="'+defaultLanguage+'"]').text();
	}
	
	//Get the project image
	projectImage = project.find('image').text();
	
	var linksNode = project.find('links');
	
	//Get the github link
	projectGitLink= linksNode.find('link[name="github"]').text();

	//Get the youtube link ID
	projectYTLink= linksNode.find('link[name="youtube"]').text();
	
	//image tag (only if there is a link)
	if(projectImage.length > 0)
		var imgTag = '<img src="'+projectImage+'" id="gameImage" height="230px"></img>'
		
	var textTag = '<p id="gameDescription">'+projectDescription+'</p>'
	
	//github icon
	var gitLink ='<a href="'+projectGitLink+'" title="'+projectName+' page"><img src="'+githubIcon+'" id="githubIcon"/></a>';
	var gitText = '<h2><b>GitHub page</b></h2>';
	var ytImgTag="", ytText="<h1><b>Video</b></h1>";
	//youtube video
	if(projectYTLink.length > 0)
	{
		ytImgTag = '<a href="https://www.youtube.com/watch?v='+projectYTLink+'" target="_blank"><img height="230px" src="http://img.youtube.com/vi/'+projectYTLink+'/0.jpg" alt="Video"/> </a>';
	}
		
	//Append the content to the HTML tags
	$("#gameName").append(projectName); //project name
	$("#gameDiv").append(imgTag); //project image
	$("#gameDiv").append(textTag); //project description
	
	if(error == false)
	{
		$("#linksDiv").append(ytText);
		$("#linksDiv").append(ytImgTag);
		$("#linksDiv").append(gitText);
		$("#linksDiv").append(gitLink); //project github link
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

/**Load the IE version **/
function loadIEVersion()
{
	window.location.href="projects_ie.html?lang="+language+"&proj="+projectId;
}




/**Get URL parameters **/
function getURLParameter(name) {
  return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search)||[,""])[1].replace(/\+/g, '%20'))||null
}