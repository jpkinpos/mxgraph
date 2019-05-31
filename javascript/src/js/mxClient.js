/**
 * Copyright (c) 2006-2017, JGraph Ltd
 * Copyright (c) 2006-2017, Gaudenz Alder
 */
var mxClient =
{
	/**
	 * Class: mxClient
	 *
	 * Bootstrapping mechanism for the mxGraph thin client. The production version
	 * of this file contains all code required to run the mxGraph thin client, as
	 * well as global constants to identify the browser and operating system in
	 * use. You may have to load chrome://global/content/contentAreaUtils.js in
	 * your page to disable certain security restrictions in Mozilla.
	 * 
	 * Variable: VERSION
	 *
	 * Contains the current version of the mxGraph library. The strings that
	 * communicate versions of mxGraph use the following format.
	 * 
	 * versionMajor.versionMinor.buildNumber.revisionNumber
	 * 
	 * Current version is 4.0.0.
	 */
	VERSION: '4.0.0',

	/**
	 * Variable: IS_IE
	 *
	 * True if the current browser is Internet Explorer 10 or below. Use <mxClient.IS_IE11>
	 * to detect IE 11.
	 */
	IS_IE: navigator.userAgent.indexOf('MSIE') >= 0,

	/**
	 * Variable: IS_IE6
	 *
	 * True if the current browser is Internet Explorer 6.x.
	 */
	IS_IE6: navigator.userAgent.indexOf('MSIE 6') >= 0,

	/**
	 * Variable: IS_IE11
	 *
	 * True if the current browser is Internet Explorer 11.x.
	 */
	IS_IE11: !!navigator.userAgent.match(/Trident\/7\./),

	/**
	 * Variable: IS_EDGE
	 *
	 * True if the current browser is Microsoft Edge.
	 */
	IS_EDGE: !!navigator.userAgent.match(/Edge\//),

	/**
	 * Variable: IS_QUIRKS
	 *
	 * True if the current browser is Internet Explorer and it is in quirks mode.
	 */
	IS_QUIRKS: navigator.userAgent.indexOf('MSIE') >= 0 && (document.documentMode == null || document.documentMode == 5),

	/**
	 * Variable: IS_EM
	 * 
	 * True if the browser is IE11 in enterprise mode (IE8 standards mode).
	 */
	IS_EM: 'spellcheck' in document.createElement('textarea') && document.documentMode == 8,

	/**
	 * Variable: VML_PREFIX
	 * 
	 * Prefix for VML namespace in node names. Default is 'v'.
	 */
	VML_PREFIX: 'v',

	/**
	 * Variable: OFFICE_PREFIX
	 * 
	 * Prefix for VML office namespace in node names. Default is 'o'.
	 */
	OFFICE_PREFIX: 'o',

	/**
	 * Variable: IS_NS
	 *
	 * True if the current browser is Netscape (including Firefox).
	 */
  	IS_NS: navigator.userAgent.indexOf('Mozilla/') >= 0 &&
  		navigator.userAgent.indexOf('MSIE') < 0 &&
  		navigator.userAgent.indexOf('Edge/') < 0,

	/**
	 * Variable: IS_OP
	 *
	 * True if the current browser is Opera.
	 */
  	IS_OP: navigator.userAgent.indexOf('Opera/') >= 0 ||
  		navigator.userAgent.indexOf('OPR/') >= 0,

	/**
	 * Variable: IS_OT
	 *
	 * True if -o-transform is available as a CSS style, ie for Opera browsers
	 * based on a Presto engine with version 2.5 or later.
	 */
  	IS_OT: navigator.userAgent.indexOf('Presto/') >= 0 &&
  		navigator.userAgent.indexOf('Presto/2.4.') < 0 &&
  		navigator.userAgent.indexOf('Presto/2.3.') < 0 &&
  		navigator.userAgent.indexOf('Presto/2.2.') < 0 &&
  		navigator.userAgent.indexOf('Presto/2.1.') < 0 &&
  		navigator.userAgent.indexOf('Presto/2.0.') < 0 &&
  		navigator.userAgent.indexOf('Presto/1.') < 0,
  	
	/**
	 * Variable: IS_SF
	 *
	 * True if the current browser is Safari.
	 */
  	IS_SF: navigator.userAgent.indexOf('AppleWebKit/') >= 0 &&
  		navigator.userAgent.indexOf('Chrome/') < 0 &&
  		navigator.userAgent.indexOf('Edge/') < 0,
  	
	/**
	 * Variable: IS_IOS
	 * 
	 * Returns true if the user agent is an iPad, iPhone or iPod.
	 */
  	IS_IOS: (navigator.userAgent.match(/(iPad|iPhone|iPod)/g) ? true : false),
  		
	/**
	 * Variable: IS_GC
	 *
	 * True if the current browser is Google Chrome.
	 */
  	IS_GC: navigator.userAgent.indexOf('Chrome/') >= 0 &&
		navigator.userAgent.indexOf('Edge/') < 0,
	
	/**
	 * Variable: IS_CHROMEAPP
	 *
	 * True if the this is running inside a Chrome App.
	 */
  	IS_CHROMEAPP: window.chrome != null && chrome.app != null && chrome.app.runtime != null,
		
	/**
	 * Variable: IS_FF
	 *
	 * True if the current browser is Firefox.
	 */
  	IS_FF: navigator.userAgent.indexOf('Firefox/') >= 0,
  	
	/**
	 * Variable: IS_MT
	 *
	 * True if -moz-transform is available as a CSS style. This is the case
	 * for all Firefox-based browsers newer than or equal 3, such as Camino,
	 * Iceweasel, Seamonkey and Iceape.
	 */
  	IS_MT: (navigator.userAgent.indexOf('Firefox/') >= 0 &&
		navigator.userAgent.indexOf('Firefox/1.') < 0 &&
  		navigator.userAgent.indexOf('Firefox/2.') < 0) ||
  		(navigator.userAgent.indexOf('Iceweasel/') >= 0 &&
  		navigator.userAgent.indexOf('Iceweasel/1.') < 0 &&
  		navigator.userAgent.indexOf('Iceweasel/2.') < 0) ||
  		(navigator.userAgent.indexOf('SeaMonkey/') >= 0 &&
  		navigator.userAgent.indexOf('SeaMonkey/1.') < 0) ||
  		(navigator.userAgent.indexOf('Iceape/') >= 0 &&
  		navigator.userAgent.indexOf('Iceape/1.') < 0),

	/**
	 * Variable: IS_VML
	 *
	 * True if the browser supports VML.
	 */
  	IS_VML: navigator.appName.toUpperCase() == 'MICROSOFT INTERNET EXPLORER',

	/**
	 * Variable: IS_SVG
	 *
	 * True if the browser supports SVG.
	 */
  	IS_SVG: navigator.appName.toUpperCase() != 'MICROSOFT INTERNET EXPLORER',

	/**
	 * Variable: NO_FO
	 *
	 * True if foreignObject support is not available. This is the case for
	 * Opera, older SVG-based browsers and all versions of IE.
	 */
  	NO_FO: !document.createElementNS || document.createElementNS('http://www.w3.org/2000/svg',
  		'foreignObject') != '[object SVGForeignObjectElement]' || navigator.userAgent.indexOf('Opera/') >= 0,

	/**
	 * Variable: IS_WIN
	 *
	 * True if the client is a Windows.
	 */
  	IS_WIN: navigator.appVersion.indexOf('Win') > 0,

	/**
	 * Variable: IS_MAC
	 *
	 * True if the client is a Mac.
	 */
  	IS_MAC: navigator.appVersion.indexOf('Mac') > 0,

	/**
	 * Variable: IS_TOUCH
	 * 
	 * True if this device supports touchstart/-move/-end events (Apple iOS,
	 * Android, Chromebook and Chrome Browser on touch-enabled devices).
	 */
  	IS_TOUCH: 'ontouchstart' in document.documentElement,

	/**
	 * Variable: IS_POINTER
	 * 
	 * True if this device supports Microsoft pointer events (always false on Macs).
	 */
  	IS_POINTER: window.PointerEvent != null && !(navigator.appVersion.indexOf('Mac') > 0),

	/**
	 * Variable: IS_LOCAL
	 *
	 * True if the documents location does not start with http:// or https://.
	 */
  	IS_LOCAL: document.location.href.indexOf('http://') < 0 &&
  			  document.location.href.indexOf('https://') < 0,

	/**
	 * Variable: defaultBundles
	 * 
	 * Contains the base names of the default bundles if mxLoadResources is false.
	 */
  	defaultBundles: [],

	/**
	 * Function: isBrowserSupported
	 *
	 * Returns true if the current browser is supported, that is, if
	 * <mxClient.IS_VML> or <mxClient.IS_SVG> is true.
	 * 
	 * Example:
	 * 
	 * (code)
	 * if (!mxClient.isBrowserSupported())
	 * {
	 *   mxUtils.error('Browser is not supported!', 200, false);
	 * }
	 * (end)
	 */
	isBrowserSupported: function()
	{
		return mxClient.IS_VML || mxClient.IS_SVG;
	},

	/**
	 * Function: link
	 *
	 * Adds a link node to the head of the document. Use this
	 * to add a stylesheet to the page as follows:
	 *
	 * (code)
	 * mxClient.link('stylesheet', filename);
	 * (end)
	 *
	 * where filename is the (relative) URL of the stylesheet. The charset
	 * is hardcoded to ISO-8859-1 and the type is text/css.
	 * 
	 * Parameters:
	 * 
	 * rel - String that represents the rel attribute of the link node.
	 * href - String that represents the href attribute of the link node.
	 * doc - Optional parent document of the link node.
	 */
	link: function(rel, href, doc)
	{
		doc = doc || document;

		// Workaround for Operation Aborted in IE6 if base tag is used in head
		if (mxClient.IS_IE6)
		{
			doc.write('<link rel="' + rel + '" href="' + href + '" charset="UTF-8" type="text/css"/>');
		}
		else
		{	
			var link = doc.createElement('link');
			
			link.setAttribute('rel', rel);
			link.setAttribute('href', href);
			link.setAttribute('charset', 'UTF-8');
			link.setAttribute('type', 'text/css');
			
			var head = doc.getElementsByTagName('head')[0];
	   		head.appendChild(link);
		}
	},
	
	/**
	 * Function: loadResources
	 * 
	 * Helper method to load the default bundles if mxLoadResources is false.
	 * 
	 * Parameters:
	 * 
	 * fn - Function to call after all resources have been loaded.
	 * lan - Optional string to pass to <mxResources.add>.
	 */
	loadResources: function(fn, lan)
	{
		var pending = mxClient.defaultBundles.length;
		
		function callback()
		{
			if (--pending == 0)
			{
				fn();
			}
		}
		
		for (var i = 0; i < mxClient.defaultBundles.length; i++)
		{
			mxResources.add(mxClient.defaultBundles[i], lan, callback);
		}
	},
	
	/**
	 * Function: include
	 *
	 * Dynamically adds a script node to the document header.
	 * 
	 * In production environments, the includes are resolved in the mxClient.js
	 * file to reduce the number of requests required for client startup. This
	 * function should only be used in development environments, but not in
	 * production systems.
	 */
	include: function(src)
	{
		document.write('<script src="'+src+'"></script>');
	}
};

/**
 * Variable: mxLoadResources
 * 
 * Optional global config variable to toggle loading of the two resource files
 * in <mxGraph> and <mxEditor>. Default is true. NOTE: This is a global variable,
 * not a variable of mxClient. If this is false, you can use <mxClient.loadResources>
 * with its callback to load the default bundles asynchronously.
 *
 * (code)
 * <script type="text/javascript">
 * 		var mxLoadResources = false;
 * </script>
 * <script type="text/javascript" src="/path/to/core/directory/js/mxClient.js"></script>
 * (end)
 */
if (typeof(mxLoadResources) == 'undefined')
{
	mxLoadResources = true;
}

/**
 * Variable: mxForceIncludes
 * 
 * Optional global config variable to force loading the JavaScript files in
 * development mode. Default is undefined. NOTE: This is a global variable,
 * not a variable of mxClient.
 *
 * (code)
 * <script type="text/javascript">
 * 		var mxLoadResources = true;
 * </script>
 * <script type="text/javascript" src="/path/to/core/directory/js/mxClient.js"></script>
 * (end)
 */
if (typeof(mxForceIncludes) == 'undefined')
{
	mxForceIncludes = false;
}

/**
 * Variable: mxResourceExtension
 * 
 * Optional global config variable to specify the extension of resource files.
 * Default is true. NOTE: This is a global variable, not a variable of mxClient.
 *
 * (code)
 * <script type="text/javascript">
 * 		var mxResourceExtension = '.txt';
 * </script>
 * <script type="text/javascript" src="/path/to/core/directory/js/mxClient.js"></script>
 * (end)
 */
if (typeof(mxResourceExtension) == 'undefined')
{
	mxResourceExtension = '.txt';
}

/**
 * Variable: mxLoadStylesheets
 * 
 * Optional global config variable to toggle loading of the CSS files when
 * the library is initialized. Default is true. NOTE: This is a global variable,
 * not a variable of mxClient.
 *
 * (code)
 * <script type="text/javascript">
 * 		var mxLoadStylesheets = false;
 * </script>
 * <script type="text/javascript" src="/path/to/core/directory/js/mxClient.js"></script>
 * (end)
 */
if (typeof(mxLoadStylesheets) == 'undefined')
{
	mxLoadStylesheets = true;
}

/**
 * Variable: basePath
 *
 * Basepath for all URLs in the core without trailing slash. Default is '.'.
 * Set mxBasePath prior to loading the mxClient library as follows to override
 * this setting:
 *
 * (code)
 * <script type="text/javascript">
 * 		mxBasePath = '/path/to/core/directory';
 * </script>
 * <script type="text/javascript" src="/path/to/core/directory/js/mxClient.js"></script>
 * (end)
 * 
 * When using a relative path, the path is relative to the URL of the page that
 * contains the assignment. Trailing slashes are automatically removed.
 */
if (typeof(mxBasePath) != 'undefined' && mxBasePath.length > 0)
{
	// Adds a trailing slash if required
	if (mxBasePath.substring(mxBasePath.length - 1) == '/')
	{
		mxBasePath = mxBasePath.substring(0, mxBasePath.length - 1);
	}

	mxClient.basePath = mxBasePath;
}
else
{
	mxClient.basePath = '.';
}

/**
 * Variable: imageBasePath
 *
 * Basepath for all images URLs in the core without trailing slash. Default is
 * <mxClient.basePath> + '/images'. Set mxImageBasePath prior to loading the
 * mxClient library as follows to override this setting:
 *
 * (code)
 * <script type="text/javascript">
 * 		mxImageBasePath = '/path/to/image/directory';
 * </script>
 * <script type="text/javascript" src="/path/to/core/directory/js/mxClient.js"></script>
 * (end)
 * 
 * When using a relative path, the path is relative to the URL of the page that
 * contains the assignment. Trailing slashes are automatically removed.
 */
if (typeof(mxImageBasePath) != 'undefined' && mxImageBasePath.length > 0)
{
	// Adds a trailing slash if required
	if (mxImageBasePath.substring(mxImageBasePath.length - 1) == '/')
	{
		mxImageBasePath = mxImageBasePath.substring(0, mxImageBasePath.length - 1);
	}

	mxClient.imageBasePath = mxImageBasePath;
}
else
{
	mxClient.imageBasePath = mxClient.basePath + '/images';	
}

/**
 * Variable: language
 *
 * Defines the language of the client, eg. en for english, de for german etc.
 * The special value 'none' will disable all built-in internationalization and
 * resource loading. See <mxResources.getSpecialBundle> for handling identifiers
 * with and without a dash.
 * 
 * Set mxLanguage prior to loading the mxClient library as follows to override
 * this setting:
 *
 * (code)
 * <script type="text/javascript">
 * 		mxLanguage = 'en';
 * </script>
 * <script type="text/javascript" src="js/mxClient.js"></script>
 * (end)
 * 
 * If internationalization is disabled, then the following variables should be
 * overridden to reflect the current language of the system. These variables are
 * cleared when i18n is disabled.
 * <mxEditor.askZoomResource>, <mxEditor.lastSavedResource>,
 * <mxEditor.currentFileResource>, <mxEditor.propertiesResource>,
 * <mxEditor.tasksResource>, <mxEditor.helpResource>, <mxEditor.outlineResource>,
 * <mxElbowEdgeHandler.doubleClickOrientationResource>, <mxUtils.errorResource>,
 * <mxUtils.closeResource>, <mxGraphSelectionModel.doneResource>,
 * <mxGraphSelectionModel.updatingSelectionResource>, <mxGraphView.doneResource>,
 * <mxGraphView.updatingDocumentResource>, <mxCellRenderer.collapseExpandResource>,
 * <mxGraph.containsValidationErrorsResource> and
 * <mxGraph.alreadyConnectedResource>.
 */
if (typeof(mxLanguage) != 'undefined' && mxLanguage != null)
{
	mxClient.language = mxLanguage;
}
else
{
	mxClient.language = (mxClient.IS_IE) ? navigator.userLanguage : navigator.language;
}

/**
 * Variable: defaultLanguage
 * 
 * Defines the default language which is used in the common resource files. Any
 * resources for this language will only load the common resource file, but not
 * the language-specific resource file. Default is 'en'.
 * 
 * Set mxDefaultLanguage prior to loading the mxClient library as follows to override
 * this setting:
 *
 * (code)
 * <script type="text/javascript">
 * 		mxDefaultLanguage = 'de';
 * </script>
 * <script type="text/javascript" src="js/mxClient.js"></script>
 * (end)
 */
if (typeof(mxDefaultLanguage) != 'undefined' && mxDefaultLanguage != null)
{
	mxClient.defaultLanguage = mxDefaultLanguage;
}
else
{
	mxClient.defaultLanguage = 'en';
}

// Adds all required stylesheets and namespaces
if (mxLoadStylesheets)
{
	mxClient.link('stylesheet', mxClient.basePath + '/css/common.css');
}

/**
 * Variable: languages
 *
 * Defines the optional array of all supported language extensions. The default
 * language does not have to be part of this list. See
 * <mxResources.isLanguageSupported>.
 *
 * (code)
 * <script type="text/javascript">
 * 		mxLanguages = ['de', 'it', 'fr'];
 * </script>
 * <script type="text/javascript" src="js/mxClient.js"></script>
 * (end)
 * 
 * This is used to avoid unnecessary requests to language files, ie. if a 404
 * will be returned.
 */
if (typeof(mxLanguages) != 'undefined' && mxLanguages != null)
{
	mxClient.languages = mxLanguages;
}

// Adds required namespaces, stylesheets and memory handling for older IE browsers
if (mxClient.IS_VML)
{
	if (mxClient.IS_SVG)
	{
		mxClient.IS_VML = false;
	}
	else
	{
		// Enables support for IE8 standards mode. Note that this requires all attributes for VML
		// elements to be set using direct notation, ie. node.attr = value. The use of setAttribute
		// is not possible.
		if (document.documentMode == 8)
		{
			document.namespaces.add(mxClient.VML_PREFIX, 'urn:schemas-microsoft-com:vml', '#default#VML');
			document.namespaces.add(mxClient.OFFICE_PREFIX, 'urn:schemas-microsoft-com:office:office', '#default#VML');
		}
		else
		{
			document.namespaces.add(mxClient.VML_PREFIX, 'urn:schemas-microsoft-com:vml');
			document.namespaces.add(mxClient.OFFICE_PREFIX, 'urn:schemas-microsoft-com:office:office');
		}

		// Workaround for limited number of stylesheets in IE (does not work in standards mode)
		if (mxClient.IS_QUIRKS && document.styleSheets.length >= 30)
		{
			(function()
			{
				var node = document.createElement('style');
				node.type = 'text/css';
				node.styleSheet.cssText = mxClient.VML_PREFIX + '\\:*{behavior:url(#default#VML)}' +
		        	mxClient.OFFICE_PREFIX + '\\:*{behavior:url(#default#VML)}';
		        document.getElementsByTagName('head')[0].appendChild(node);
			})();
		}
		else
		{
			document.createStyleSheet().cssText = mxClient.VML_PREFIX + '\\:*{behavior:url(#default#VML)}' +
		    	mxClient.OFFICE_PREFIX + '\\:*{behavior:url(#default#VML)}';
		}
	    
	    if (mxLoadStylesheets)
	    {
	    	mxClient.link('stylesheet', mxClient.basePath + '/css/explorer.css');
	    }
	}
}

// PREPROCESSOR-REMOVE-START
// If script is loaded via CommonJS, do not write <script> tags to the page
// for dependencies. These are already included in the build.
if (mxForceIncludes || !(typeof module === 'object' && module.exports != null))
{
// PREPROCESSOR-REMOVE-END
	mxClient.include(mxClient.basePath+'/js/util/mxLog.js');												// 디버깅용 콘솔을 띄운다.
	mxClient.include(mxClient.basePath+'/js/util/mxObjectIdentity.js'); 									// 오브젝트의 id를 통한 값 접근이 가능하게 만드는 클래스
	mxClient.include(mxClient.basePath+'/js/util/mxDictionary.js');											// 전체 오브젝트에 대한 정보를 보유 및 접근하는 클래스
	mxClient.include(mxClient.basePath+'/js/util/mxResources.js');											// 코드 외에 리소스를 가져오는 클래스
	mxClient.include(mxClient.basePath+'/js/util/mxPoint.js');												// 특정 셀의 x,y 좌표를 보유하는 클래스
	mxClient.include(mxClient.basePath+'/js/util/mxRectangle.js');											// mxPoint를 상속받는 Rectangle에 대한 클래스
	mxClient.include(mxClient.basePath+'/js/util/mxEffects.js');											// 투명도 조절로 깜박이는 효과를 사용할 수 있게하는 클래스
	mxClient.include(mxClient.basePath+'/js/util/mxUtils.js');												// 잡종 펑션이 모여있는 클래스 - ADD된 Action과 DOM과 링크를 걸어주는 등, 어플리케이션 내의 DOM 요소들에게 부여된 이벤트들에 대한 세부적인 액션을 부과할 수 있는 사용성을 가지는 도구들이 정의된 클래스
	mxClient.include(mxClient.basePath+'/js/util/mxConstants.js');											// 상수처럼 정의되어 있는 값들의 모음
	mxClient.include(mxClient.basePath+'/js/util/mxEventObject.js');										// 이벤트를 객체화하는 클래스. 컨슘 상태를 확인하여 부적합한 이벤트의 전달이 발생하는지를 알기위해 이벤트를 Wrapping하는 클래스
	mxClient.include(mxClient.basePath+'/js/util/mxMouseEvent.js');											// 마우스로 발생할 수 있는 이벤트들을 정의해 놓은 클래스. 실제 실행(consume)하려면 전달(디스패치)을 담당하는 fireMouseEvent를 필수로 사용해야한다.
	mxClient.include(mxClient.basePath+'/js/util/mxEventSource.js');										// 이벤트 전달자. 인자를 전달하며 Event를 호출한다. (일반 이벤트 호출)
	mxClient.include(mxClient.basePath+'/js/util/mxEvent.js');												// 'DOM'에 등록할 '이벤트', 그리고 이벤트에 바인딩할 '펑션'을 연결짓는 클래스 - ex) mxEventObj.addListener(mxEvent.CHANGE, mxUtils.bind(this, function(){}))
	mxClient.include(mxClient.basePath+'/js/util/mxXmlRequest.js');											// xmlRequest 클래스
	mxClient.include(mxClient.basePath+'/js/util/mxClipboard.js');											// copy&paste 클래스
	mxClient.include(mxClient.basePath+'/js/util/mxWindow.js');												// editor의 가운데 창
	mxClient.include(mxClient.basePath+'/js/util/mxForm.js');												// form 제공 클래스
	mxClient.include(mxClient.basePath+'/js/util/mxImage.js');												// image
	mxClient.include(mxClient.basePath+'/js/util/mxDivResizer.js');											// div resize
	mxClient.include(mxClient.basePath+'/js/util/mxDragSource.js');											// Drag 관련 펑션
	mxClient.include(mxClient.basePath+'/js/util/mxToolbar.js');											// 이전버전의 툴바
	mxClient.include(mxClient.basePath+'/js/util/mxUndoableEdit.js');										// Undo
	mxClient.include(mxClient.basePath+'/js/util/mxUndoManager.js');										// Undo
	mxClient.include(mxClient.basePath+'/js/util/mxUrlConverter.js');										// url에 따른 분기와 /만 붙어서 오는 경우를 담당하는 클래스
	mxClient.include(mxClient.basePath+'/js/util/mxPanningManager.js'); 									// 도형을 드래그하는 행위를 지원하는 클래스
	mxClient.include(mxClient.basePath+'/js/util/mxPopupMenu.js');											// 팝업 클래스
	mxClient.include(mxClient.basePath+'/js/util/mxAutoSaveManager.js');									// 자동저장 도우는 클래스
	mxClient.include(mxClient.basePath+'/js/util/mxAnimation.js');											// 애니메이션 동작을 제공하는 클래스.
	mxClient.include(mxClient.basePath+'/js/util/mxMorphing.js');											// 형태 변형을 책임짐, Animation의 서브 클래스이다.
	mxClient.include(mxClient.basePath+'/js/util/mxImageBundle.js');										// 이미지 가져오는 클래스
	mxClient.include(mxClient.basePath+'/js/util/mxImageExport.js');										// 이미지 내보내는 클래스
	mxClient.include(mxClient.basePath+'/js/util/mxAbstractCanvas2D.js');									// 모든 캔버스의 베이스가 되는 클래스이다.
	mxClient.include(mxClient.basePath+'/js/util/mxXmlCanvas2D.js');										// MXL로 저장
	mxClient.include(mxClient.basePath+'/js/util/mxSvgCanvas2D.js');										// SVG
	mxClient.include(mxClient.basePath+'/js/util/mxVmlCanvas2D.js');										// Vector Mark up Language Canvas
	mxClient.include(mxClient.basePath+'/js/util/mxGuide.js');												// 가이드 형체를 띄운다.
	mxClient.include(mxClient.basePath+'/js/shape/mxStencil.js');											// xml 형식으로 정의된 Stencil(도형틀?)을 불러오는 클래스 - ex) stencil.js의 118 Line 참고.
	mxClient.include(mxClient.basePath+'/js/shape/mxShape.js');												// 모든 형태 들에 대한 기본 클래스이다. Custom Shape 을 등록할 수 있다.  - mxCellRenderer.registerShape('customShape', CustomShape);
	mxClient.include(mxClient.basePath+'/js/shape/mxStencilRegistry.js');									// stencil을 get하고 add한다.
	mxClient.include(mxClient.basePath+'/js/shape/mxMarker.js');											// 요소 1
	mxClient.include(mxClient.basePath+'/js/shape/mxActor.js');												// 요소 2
	mxClient.include(mxClient.basePath+'/js/shape/mxCloud.js');												// 요소 3
	mxClient.include(mxClient.basePath+'/js/shape/mxRectangleShape.js');									// 요소 4
	mxClient.include(mxClient.basePath+'/js/shape/mxEllipse.js');											// 요소 5
	mxClient.include(mxClient.basePath+'/js/shape/mxDoubleEllipse.js');										// 요소 6
	mxClient.include(mxClient.basePath+'/js/shape/mxRhombus.js');											// 요소 7
	mxClient.include(mxClient.basePath+'/js/shape/mxPolyline.js');											// 요소 8
	mxClient.include(mxClient.basePath+'/js/shape/mxArrow.js');												// 요소 9
	mxClient.include(mxClient.basePath+'/js/shape/mxArrowConnector.js');									// 요소 10
	mxClient.include(mxClient.basePath+'/js/shape/mxText.js');												// 요소 11
	mxClient.include(mxClient.basePath+'/js/shape/mxTriangle.js');											// 요소 12
	mxClient.include(mxClient.basePath+'/js/shape/mxHexagon.js');											// 요소 13
	mxClient.include(mxClient.basePath+'/js/shape/mxLine.js');												// 요소 14
	mxClient.include(mxClient.basePath+'/js/shape/mxImageShape.js');										// 요소 15
	mxClient.include(mxClient.basePath+'/js/shape/mxLabel.js');												// 요소 16
	mxClient.include(mxClient.basePath+'/js/shape/mxCylinder.js');											// 요소 17 (원통)
	mxClient.include(mxClient.basePath+'/js/shape/mxConnector.js');											// 요소 18 (연결선)
	mxClient.include(mxClient.basePath+'/js/shape/mxSwimlane.js');											// 셀의 그룹의 상호작용을 표현하는 요소. schema Example 참고
	mxClient.include(mxClient.basePath+'/js/layout/mxGraphLayout.js');										// 셀 그룹의 레이아웃들을 관리하는 Base 클래스 : Base class for all layout algorithms in mxGraph
	mxClient.include(mxClient.basePath+'/js/layout/mxStackLayout.js');										// 레이아웃1
	mxClient.include(mxClient.basePath+'/js/layout/mxPartitionLayout.js');									// 레이아웃2
	mxClient.include(mxClient.basePath+'/js/layout/mxCompactTreeLayout.js');								// 레이아웃3
	mxClient.include(mxClient.basePath+'/js/layout/mxRadialTreeLayout.js');									// 레이아웃4
	mxClient.include(mxClient.basePath+'/js/layout/mxFastOrganicLayout.js');								// 레이아웃5
	mxClient.include(mxClient.basePath+'/js/layout/mxCircleLayout.js'); 									// 레이아웃6
	mxClient.include(mxClient.basePath+'/js/layout/mxParallelEdgeLayout.js');								// 레이아웃7
	mxClient.include(mxClient.basePath+'/js/layout/mxCompositeLayout.js');									// 레이아웃8
	mxClient.include(mxClient.basePath+'/js/layout/mxEdgeLabelLayout.js');  								// 레이아웃9
	mxClient.include(mxClient.basePath+'/js/layout/hierarchical/model/mxGraphAbstractHierarchyCell.js');	// swimLane Model에서 사용하는 클래스
	mxClient.include(mxClient.basePath+'/js/layout/hierarchical/model/mxGraphHierarchyNode.js');			// swimLane Model에서 사용하는 클래스
	mxClient.include(mxClient.basePath+'/js/layout/hierarchical/model/mxGraphHierarchyEdge.js');			// swimLane Model에서 사용하는 클래스
	mxClient.include(mxClient.basePath+'/js/layout/hierarchical/model/mxGraphHierarchyModel.js');			// Hierarchical Layout에서 사용하는 클래스
	mxClient.include(mxClient.basePath+'/js/layout/hierarchical/model/mxSwimlaneModel.js');					// mxSwimlane Layout에서 사용하는 클래스
	mxClient.include(mxClient.basePath+'/js/layout/hierarchical/stage/mxHierarchicalLayoutStage.js');		// 계층적 배치를 위해 현재 layout과 모델의 상태를 가져온다. for 부가적인 계산..등
	mxClient.include(mxClient.basePath+'/js/layout/hierarchical/stage/mxMedianHybridCrossingReduction.js'); // 각 계층에서 노드와 가장자리 더미 노드의 수평 위치를 설정한다. 가능한 한 가장자리를 곧게 하기 위해 중앙의 아래 및 위 중량을 사용한다.
	mxClient.include(mxClient.basePath+'/js/layout/hierarchical/stage/mxMinimumCycleRemover.js');			// 스기야마 배치의 제1단계 실시. 계층 할당에 대한 직선 경로 계산
	mxClient.include(mxClient.basePath+'/js/layout/hierarchical/stage/mxCoordinateAssignment.js');			// 각 계층에서 노드와 가장자리 더미 노드의 수평 위치를 설정한다. 가능한 한 가장자리를 곧게 하기 위해 무게중심은 물론 휴리스틱스를 사용한다.
	mxClient.include(mxClient.basePath+'/js/layout/hierarchical/stage/mxSwimlaneOrdering.js');				// 스기야마 배치의 제1단계 실시. 계층 할당에 대한 직선 경로 계산
	mxClient.include(mxClient.basePath+'/js/layout/hierarchical/mxHierarchicalLayout.js');					// 레이아웃 10
	mxClient.include(mxClient.basePath+'/js/layout/hierarchical/mxSwimlaneLayout.js');	    				// 레이아웃 11
	mxClient.include(mxClient.basePath+'/js/model/mxGraphModel.js'); 										// 그래프의 데이터 구조를 저장하는 기본 개체.
	mxClient.include(mxClient.basePath+'/js/model/mxCell.js');												// 모델의 구성요소들
	mxClient.include(mxClient.basePath+'/js/model/mxGeometry.js');											// mxRectangle을 상속받으며 수치 및 위치정보를 가진다.
	mxClient.include(mxClient.basePath+'/js/model/mxCellPath.js');											// 셀의 Path를 구하는 메커니즘을 지원하는 클래스
	mxClient.include(mxClient.basePath+'/js/view/mxPerimeter.js');											// 셀의 둘레 및 주위 선의 값을 적절히 산정하여 전달해주는 클래스
	mxClient.include(mxClient.basePath+'/js/view/mxPrintPreview.js');										// 인쇄 미리보기
	mxClient.include(mxClient.basePath+'/js/view/mxStylesheet.js');											// getDefaultVertexStyle 등, 셀의 스타일을 가져오거나 생성하거나 추가한다.
	mxClient.include(mxClient.basePath+'/js/view/mxCellState.js');											// cell의 스타일 상태 관련 클래스
	mxClient.include(mxClient.basePath+'/js/view/mxGraphSelectionModel.js');								// select되는 액션에 대한 정보를 저장한다.
	mxClient.include(mxClient.basePath+'/js/view/mxCellEditor.js');											// Cell을 Editing하는 기능을 가지는 클래스
	mxClient.include(mxClient.basePath+'/js/view/mxCellRenderer.js');										// cell을 화면에 표시한다.
	mxClient.include(mxClient.basePath+'/js/view/mxEdgeStyle.js');											// 선 스타일
	mxClient.include(mxClient.basePath+'/js/view/mxStyleRegistry.js');										// 스타일 등록을 지원
	mxClient.include(mxClient.basePath+'/js/view/mxGraphView.js');											// 앞/뒤로 셀을 보내기 등, 셀의 점과 모서리 값들을 계산하여 Cell States 로 캐싱하는 클래스
	mxClient.include(mxClient.basePath+'/js/view/mxGraph.js');   											// 모든 패키지들의 메인클래스. 실체. 용법 - ex) mxGraph.call(this, container, model, renderHint, stylesheet);
	mxClient.include(mxClient.basePath+'/js/view/mxCellOverlay.js');										// 셀의 겹침을 처리
	mxClient.include(mxClient.basePath+'/js/view/mxOutline.js');											// Graph의 Overview를 구현한다. (썸네일로 활용 가능할 듯)
	mxClient.include(mxClient.basePath+'/js/view/mxMultiplicity.js');										// 각 사각형을 둘 이상의 서클에 연결해야하며 다른 유형의 대상이 허용되지 않는 규칙을 정의합니다. validation 예제 참고
	mxClient.include(mxClient.basePath+'/js/view/mxLayoutManager.js');										// 그래프를 변경한 후 지정된 레이아웃을 실행하는 레이아웃 관리자 구현체 - ex) orgchart, Tree, folding 처럼, 커스터마이징할 수 있다
	mxClient.include(mxClient.basePath+'/js/view/mxSwimlaneManager.js');									// 스윔래인 관련 관리자 구현체.
	mxClient.include(mxClient.basePath+'/js/view/mxTemporaryCellStates.js');								// 셀 상태의 임시 세트를 생성하는 구현체.
	mxClient.include(mxClient.basePath+'/js/view/mxCellStatePreview.js');									// 셀의 자체 움직임을 지원하는 구현체
	mxClient.include(mxClient.basePath+'/js/view/mxConnectionConstraint.js');								// 연결선에 제약조건을 거는 객체를 정의할 수 있는 구현체.
	mxClient.include(mxClient.basePath+'/js/handler/mxGraphHandler.js');									// 선택을 처리하는 그래프 이벤트 핸들러.
	mxClient.include(mxClient.basePath+'/js/handler/mxPanningHandler.js');									// 패닝 핸들링을 위한 구현체
	mxClient.include(mxClient.basePath+'/js/handler/mxPopupMenuHandler.js');								// 팝업메뉴를 생성하기 위한 이벤트 핸들러
	mxClient.include(mxClient.basePath+'/js/handler/mxCellMarker.js');										// 마우스 위치에 따라 셀의 강조를 담당하는 구현체
	mxClient.include(mxClient.basePath+'/js/handler/mxSelectionCellsHandler.js');							// 셀 핸들러를 관리하고, 마우스 셀렉트 등의 이벤트를 호출하는 이벤트 핸들러
	mxClient.include(mxClient.basePath+'/js/handler/mxConnectionHandler.js');								// 새 연결(선)을 생성하는 그래프 이벤트 핸들러.  소스 및 대상 정점 및 factoryMethod를 찾아 강조 표시하기 위해 <mxTerminalMarker>를 사용한다
	mxClient.include(mxClient.basePath+'/js/handler/mxConstraintHandler.js');								// 새로운 연결을 시도할때 제약조건에 따른 분기가 가능하도록 지원하기 위한 구현체.
	mxClient.include(mxClient.basePath+'/js/handler/mxRubberband.js');										// 연결선 끌기에 대한 동작을 지원하기 위한 구현체
	mxClient.include(mxClient.basePath+'/js/handler/mxHandle.js');											// 꼭지점에 대한 단일 커스텀 핸들러를 구현하기 위한 클래스
	mxClient.include(mxClient.basePath+'/js/handler/mxVertexHandler.js');									// 셀크기 조정을 위한 핸들러
	mxClient.include(mxClient.basePath+'/js/handler/mxEdgeHandler.js');										// 가장자리와 제어지점 등의 위치를 수정하는 그래프 이벤트 핸들러. 강조도 사용한다.
	mxClient.include(mxClient.basePath+'/js/handler/mxElbowEdgeHandler.js');								// mxEdgeHandler를 확장함.
	mxClient.include(mxClient.basePath+'/js/handler/mxEdgeSegmentHandler.js');								// Edge에 대한 핸들러, 상속관계가 존재한다. mxEdgeSegmentHandler
	mxClient.include(mxClient.basePath+'/js/handler/mxKeyHandler.js');										// 키 스트로크에 대한 처리를 담당하는 핸들러 구현체 - ex) Stops editing on enter or escape keypress
	mxClient.include(mxClient.basePath+'/js/handler/mxTooltipHandler.js');									// 툴팁을 표시를 위한 핸들러.
	mxClient.include(mxClient.basePath+'/js/handler/mxCellTracker.js');										// 셀을 강조표시하는 핸들러, mxCellHandler를 상속받는다.
	mxClient.include(mxClient.basePath+'/js/handler/mxCellHighlight.js');									// 셀을 강조 표시하는 도우미 클래스. ( 강조표시를 이루고 있는 값(색,굵기 등)을 정하는 것을 도우는 클래스이다.)
	mxClient.include(mxClient.basePath+'/js/editor/mxDefaultKeyHandler.js');								// 키코드를 작업 이름에 바인딩한다. mxEditor.keyHandler에 저장된다.
	mxClient.include(mxClient.basePath+'/js/editor/mxDefaultPopupMenu.js');									// DOM 노드를 만들지 않고, 표시하기 위해 XML 형식으로 미리 저장된 메뉴를 분석해올 뿐이다.
	mxClient.include(mxClient.basePath+'/js/editor/mxDefaultToolbar.js');									// Editor를 위한 도구 모음이다. 그래프를 클릭하거나 셀을 선택할때마다 변경이 발생한다.
	mxClient.include(mxClient.basePath+'/js/editor/mxEditor.js');											// 백엔드 연결, 그래프, 레이아웃 셀, 실행 및 취소, 툴바 등에 대한 통합이 진행된다.
	mxClient.include(mxClient.basePath+'/js/io/mxCodecRegistry.js');										// 코덱 등록에 대한 싱글톤 클래스
	mxClient.include(mxClient.basePath+'/js/io/mxCodec.js');												// XML을 js객체로 가져오기위한 코덱. mxObjectCodec을 참고할 것. 인코딩/디코딩을 위해 mxCodecRegistry에 등록된 코덱을 사용한다.
	mxClient.include(mxClient.basePath+'/js/io/mxObjectCodec.js');											// Generic codec for JavaScript objects that implements a mapping between JavaScript objects and XML nodes. XML nodes maps each field or element to an attribute or child node, and vice versa.
	mxClient.include(mxClient.basePath+'/js/io/mxCellCodec.js');											// mxCell용 코덱. 로딩시점에 동적으로(암묵적으로) 생성되어서 사용된다.
	mxClient.include(mxClient.basePath+'/js/io/mxModelCodec.js');											// mxGraphModels용 코덱. 로딩시점에 동적으로(암묵적으로) 생성되어서 사용된다.
	mxClient.include(mxClient.basePath+'/js/io/mxRootChangeCodec.js');										// 뿌리에 대한 변화에 대응하기 위한 코덱.	in mxGraphModel
	mxClient.include(mxClient.basePath+'/js/io/mxChildChangeCodec.js');										// 하위에 대한 변화에 대응하기 위한 코덱.	in mxGraphModel
	mxClient.include(mxClient.basePath+'/js/io/mxTerminalChangeCodec.js');									// Codec for mxTerminalChanges. - (Terminal : Edge Source or mxCell) , 셀의 단자..?
	mxClient.include(mxClient.basePath+'/js/io/mxGenericChangeCodec.js');									// mxValueChanges, mxStyleChanges, mxGeometryChanges, mxCollapseChanges 및 mxVisibleChanges 용 코덱
	mxClient.include(mxClient.basePath+'/js/io/mxGraphCodec.js');											// Codec for mxGraphs.
	mxClient.include(mxClient.basePath+'/js/io/mxGraphViewCodec.js');										// Custom Encoder.  이 코덱은 그래프의 이미지를 만드는 데 사용할 수 있는 XML 형식에 보기만 쓰는데, 즉 계산된 경계, 가장자리 스타일 및 셀 스타일을 가진 절대 좌표를 포함하고 있다.
	mxClient.include(mxClient.basePath+'/js/io/mxStylesheetCodec.js');										// Codec for mxStylesheets.
	mxClient.include(mxClient.basePath+'/js/io/mxDefaultKeyHandlerCodec.js');								// Custom codec for configuring mxDefaultKeyHandlers.
	mxClient.include(mxClient.basePath+'/js/io/mxDefaultToolbarCodec.js');									// Custom codec for configuring mxDefaultToolbars.  이 코덱은 기존 툴바 핸들러에 대한 구성 데이터만 읽으며, 툴바를 인코딩하거나 생성하지 않는다.
	mxClient.include(mxClient.basePath+'/js/io/mxDefaultPopupMenuCodec.js');								// Custom codec for configuring mxDefaultPopupMenus.  기존 팝업 메뉴에 대한 구성 데이터만 읽으며, 인코딩하거나 메뉴를 생성하지 않는다. 이 코덱은 구성을 사용하여 메뉴를 동적으로 생성하는 팝업 메뉴에만 구성 노드를 전달한다.
	mxClient.include(mxClient.basePath+'/js/io/mxEditorCodec.js');											// mxEditors용 Codec.
// PREPROCESSOR-REMOVE-START
}
// PREPROCESSOR-REMOVE-END
