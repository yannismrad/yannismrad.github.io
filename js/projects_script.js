/**Global vars **/
var language, langFr = "fr", defaultLanguage = "en";
var projectId, projectName, projectImage, projectScreenshotsNode, projectGameDescription, projectWorkDescription, projectGitLink, projectYTLink;
var nbScreenshots = 3;
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
		//console.log("error invalid id");
		project = xml.find('project[id="error"]'); //choose the default project (error)
		error = true;
	}

	//Get the name
	projectName = project.find('name').text();
	
	//Get the appropriate description, for chosen language
	projectGameDescription = project.find('description[lang="'+language+'"]').text();
	projectWorkDescription = project.find('workDescription[lang="'+language+'"]').text();
	
	//if language does not exist chose english as the default one
	if(projectGameDescription.length == 0)
	{
		language = defaultLanguage;
		projectGameDescription = project.find('description[lang="'+defaultLanguage+'"]').text();
	}
	
	if(projectWorkDescription.length == 0)
	{
		language = defaultLanguage;
		projectWorkDescription = project.find('workDescription[lang="'+defaultLanguage+'"]').text();
	}
	
	//Get the project image
	projectImage = project.find('image').text();
	
	//Get the screenshots node
	projectScreenshotsNode = project.find('screenshots');
	
	//Links node
	var linksNode = project.find('links');
	
	//Get the github link
	projectGitLink= linksNode.find('link[name="github"]').text();

	//Get the youtube link ID
	projectYTLink= linksNode.find('link[name="youtube"]').text();
	
	//image tag (only if there is a link)
	if(projectImage.length > 0)
		var imgTag = '<img src="'+projectImage+'" id="gameImage" height="230px"></img>'
		
	var textGameDescriptionTag = '<p id="gameDescription">'+projectGameDescription+'</p>'
	var textWorkDescriptionTag = '<p id="workDescription">'+projectGameDescription+'</p>'
	
	var screenText = "";
	var screenshotsTab = null;
	
	//Screenshots (only if non empty)
	if(projectScreenshotsNode != null)
	{
		screenText ="<h1><b>Screenshots</b></h1>";
		screenshotsTab = new Array();

		projectScreenshotsNode.find('screenshotImg').each(function() {
			//console.log("node = "+ $(this).text());
			screenshotsTab.push($(this).text());
		});
		
		/*for(var i=0; i< nbScreenshots;i++)
		{
			screenshotsTab[i] = projectScreenshotsNode+""+i+".png";
			console.log("image = "+screenshotsTab[i])
		} */
	}
	
	
	
	//github icon
	if(projectGitLink.length > 0)
	{
		var gitLink ='<a href="'+projectGitLink+'" title="'+projectName+' page"><img src="'+githubIcon+'" id="githubIcon"/></a>';
		var gitText = '<h1><b>GitHub</b></h1>';
	}
	var divider = '';

	//youtube video
	var ytIframeTag="";
	
	if(projectYTLink.length > 0)
	{
		ytIframeTag = '<iframe id="videoFrame" width="600" height="400" src="https://www.youtube.com/embed/'+projectYTLink+'" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>';
			
		//divider = '<div class="bottom-divider"></div>';
	}
		
	//Append the content to the HTML tags
	$("#gameName").append(projectName); //project name
	//$("#gameDiv").append(imgTag); //project image
	$("#gameDescriptionDiv").append(textGameDescriptionTag); //project description
	$("#videoDiv").append(ytIframeTag); // video
	
	if(error == false)
	{
		if(screenshotsTab != null && screenshotsTab.length > 0)
		{
			$("#screenshotsDiv").append("<div class=\"top-divider\"></div>");
			$("#screenshotsDiv").append(screenText);
			
			for(var i=0; i< screenshotsTab.length;i++)
			{
				var imgTag = '<a class="imgScreenshot" target="_blank" href="images/screenshots/'+projectId+'/'+i+'.png"><img width="200" height = "150"  alt ="screenshot" src="'+screenshotsTab[i]+'"></a>'
				$("#screenshotsDiv").append(imgTag);
			}
		
		}
		
		$("#linksDiv").append(gitText);
		$("#linksDiv").append(gitLink); //project github link
	}
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