/**
 * Copyright (c) 2006-2013, JGraph Ltd
 */
/**
 * Class: mxCellEditor
 *
 * In-place editor for the graph. To control this editor, use
 * <mxGraph.invokesStopCellEditing>, <mxGraph.enterStopsCellEditing> and
 * <mxGraph.escapeEnabled>. If <mxGraph.enterStopsCellEditing> is true then
 * ctrl-enter or shift-enter can be used to create a linefeed. The F2 and
 * escape keys can always be used to stop editing. To customize the location
 * of the textbox in the graph, override <getEditorBounds> as follows:
 * 
 * (code)
 * graph.cellEditor.getEditorBounds = function(state)
 * {
 *   var result = mxCellEditor.prototype.getEditorBounds.apply(this, arguments);
 *   
 *   if (this.graph.getModel().isEdge(state.cell))
 *   {
 *     result.x = state.getCenterX() - result.width / 2;
 *     result.y = state.getCenterY() - result.height / 2;
 *   }
 *   
 *   return result;
 * };
 * (end)
 * 
 * The textarea uses the mxCellEditor CSS class. You can modify this class in
 * your custom CSS. Note: You should modify the CSS after loading the client
 * in the page.
 *
 * Example:
 * 
 * To only allow numeric input in the in-place editor, use the following code.
 *
 * (code)
 * var text = graph.cellEditor.textarea;
 * 
 * mxEvent.addListener(text, 'keydown', function (evt)
 * {
 *   if (!(evt.keyCode >= 48 && evt.keyCode <= 57) &&
 *       !(evt.keyCode >= 96 && evt.keyCode <= 105))
 *   {
 *     mxEvent.consume(evt);
 *   }
 * }); 
 * (end)
 * 
 * Placeholder:
 * 
 * To implement a placeholder for cells without a label, use the
 * <emptyLabelText> variable.
 * 
 * Resize in Chrome:
 * 
 * Resize of the textarea is disabled by default. If you want to enable
 * this feature extend <init> and set this.textarea.style.resize = ''.
 * 
 * To start editing on a key press event, the container of the graph
 * should have focus or a focusable parent should be used to add the
 * key press handler as follows.
 * 
 * (code)
 * mxEvent.addListener(graph.container, 'keypress', mxUtils.bind(this, function(evt)
 * {
 *   if (!graph.isEditing() && !graph.isSelectionEmpty() && evt.which !== 0 &&
 *       !mxEvent.isAltDown(evt) && !mxEvent.isControlDown(evt) && !mxEvent.isMetaDown(evt))
 *   {
 *     graph.startEditing();
 *     
 *     if (mxClient.IS_FF)
 *     {
 *       graph.cellEditor.textarea.value = String.fromCharCode(evt.which);
 *     }
 *   }
 * }));
 * (end)
 * 
 * To allow focus for a DIV, and hence to receive key press events, some browsers
 * require it to have a valid tabindex attribute. In this case the following
 * code may be used to keep the container focused.
 * 
 * (code)
 * var graphFireMouseEvent = graph.fireMouseEvent;
 * graph.fireMouseEvent = function(evtName, me, sender)
 * {
 *   if (evtName == mxEvent.MOUSE_DOWN)
 *   {
 *     this.container.focus();
 *   }
 *   
 *   graphFireMouseEvent.apply(this, arguments);
 * };
 * (end)
 *
 * Constructor: mxCellEditor
 *
 * Constructs a new in-place editor for the specified graph.
 * 
 * Parameters:
 * 
 * graph - Reference to the enclosing <mxGraph>.
 */
function mxCellEditor(graph)
{
	this.graph = graph;
};

/**
 * Variable: graph
 * 
 * Reference to the enclosing <mxGraph>.
 */
mxCellEditor.prototype.graph = null;

/**
 * Variable: textarea
 *
 * Holds the input textarea. Note that this may be null before the first
 * edit. Instantiated in <init>.
 */
mxCellEditor.prototype.textarea = null;

/**
 * Variable: editingCell
 * 
 * Reference to the <mxCell> that is currently being edited.
 */
mxCellEditor.prototype.editingCell = null;

/**
 * Variable: trigger
 * 
 * Reference to the event that was used to start editing.
 */
mxCellEditor.prototype.trigger = null;

/**
 * Variable: modified
 * 
 * Specifies if the label has been modified.
 */
mxCellEditor.prototype.modified = false;

/**
 * Variable: autoSize
 * 
 * Specifies if the textarea should be resized while the text is being edited.
 * Default is true.
 */
mxCellEditor.prototype.autoSize = true;

/**
 * Variable: selectText
 * 
 * Specifies if the text should be selected when editing starts. Default is
 * true.
 */
mxCellEditor.prototype.selectText = true;

/**
 * Variable: emptyLabelText
 * 
 * Text to be displayed for empty labels. Default is ''. This can be set
 * to eg. "[Type Here]" to easier visualize editing of empty labels. The
 * value is only displayed before the first keystroke and is never used
 * as the actual editing value.
 */
mxCellEditor.prototype.emptyLabelText = '';

/**
 * Variable: textNode
 * 
 * Reference to the label DOM node that has been hidden.
 */
mxCellEditor.prototype.textNode = '';

/**
 * Variable: zIndex
 * 
 * Specifies the zIndex for the textarea. Default is 5.
 */
mxCellEditor.prototype.zIndex = 5;

/**
 * Variable: minResize
 * 
 * Defines the minimum width and height to be used in <resize>. Default is 0x20px.
 */
mxCellEditor.prototype.minResize = new mxRectangle(0, 20);

/**
 * Function: init
 *
 * Creates the <textarea> and installs the event listeners. The key handler
 * updates the <modified> state.
 */
mxCellEditor.prototype.init = function ()
{
	this.textarea = document.createElement('textarea');

	this.textarea.className = 'mxCellEditor';
	this.textarea.style.position = 'absolute';
	this.textarea.style.overflow = 'visible';

	this.textarea.setAttribute('cols', '20');
	this.textarea.setAttribute('rows', '4');

	if (mxClient.IS_NS)
	{
		this.textarea.style.resize = 'none';
	}
	
	this.installListeners(this.textarea);
};

/**
 * Function: installListeners
 * 
 * Installs listeners for focus, change and standard key event handling.
 * NOTE: This code requires support for a value property in elt.
 */
mxCellEditor.prototype.installListeners = function(elt)
{
	mxEvent.addListener(elt, 'blur', mxUtils.bind(this, function(evt)
	{
		this.focusLost(evt);
	}));
	
	mxEvent.addListener(elt, 'change', mxUtils.bind(this, function(evt)
	{
		this.setModified(true);
	}));

	mxEvent.addListener(elt, 'keydown', mxUtils.bind(this, function(evt)
	{
		if (!mxEvent.isConsumed(evt))
		{
			if (this.isStopEditingEvent(evt))
			{
				this.graph.stopEditing(false);
				mxEvent.consume(evt);
			}
			else if (evt.keyCode == 27 /* Escape */)
			{
				this.graph.stopEditing(true);
				mxEvent.consume(evt);
			}
			else
			{
				// Clears the initial empty label on the first keystroke
				if (this.clearOnChange && elt.value == this.getEmptyLabelText())
				{
					this.clearOnChange = false;
					elt.value = '';
				}
				
				// Updates the modified flag for storing the value
				this.setModified(true);
			}
		}
	}));

	// Adds handling of deleted cells while editing
	this.changeHandler = mxUtils.bind(this, function(sender)
	{
		if (this.editingCell != null && this.graph.getView().getState(this.editingCell) == null)
		{
			this.stopEditing(true);
		}
	});
	
	this.graph.getModel().addListener(mxEvent.CHANGE, this.changeHandler);
	
	// Adds automatic resizing of the textbox while typing
	// Use input event in all browsers and IE >= 9 (but not IE11) for resize
	var evtName = (!mxClient.IS_IE11 && (!mxClient.IS_IE || document.documentMode >= 9)) ? 'input' : 'keypress';
	mxEvent.addListener(elt, evtName, mxUtils.bind(this, function(evt)
	{
		if (this.autoSize && !mxEvent.isConsumed(evt))
		{
			setTimeout(mxUtils.bind(this, function()
			{
				this.resize();
			}), 0);
		}
	}));
};

/**
 * Function: isStopEditingEvent
 * 
 * Returns true if the given keydown event should stop cell editing. This
 * returns true if F2 is pressed of if <mxGraph.enterStopsCellEditing> is true
 * and enter is pressed without control or shift.
 */
mxCellEditor.prototype.isStopEditingEvent = function(evt)
{
	return evt.keyCode == 113 /* F2 */ || (this.graph.isEnterStopsCellEditing() &&
		evt.keyCode == 13 /* Enter */ && !mxEvent.isControlDown(evt) &&
		!mxEvent.isShiftDown(evt));
};

/**
 * Function: isEventSource
 * 
 * Returns true if this editor is the source for the given native event.
 */
mxCellEditor.prototype.isEventSource = function(evt)
{
	return mxEvent.getSource(evt) == this.textarea;
};

/**
 * Function: resize
 * 
 * Returns <modified>.
 */
mxCellEditor.prototype.resize = function()
{
	if (this.textDiv != null)
	{
		var state = this.graph.getView().getState(this.editingCell);
		
		if (state == null)
		{
			this.stopEditing(true);
		}
		else
		{
			var isEdge = this.graph.getModel().isEdge(state.cell);

		 	if (isEdge || state.style[mxConstants.STYLE_OVERFLOW] != 'fill')
		 	{
		 		var scale = this.graph.getView().scale;
		 		var lw = mxUtils.getValue(state.style, mxConstants.STYLE_LABEL_WIDTH, null);
				var m = (state.text != null) ? state.text.margin : null;
				
				if (m == null)
				{
					m = mxUtils.getAlignmentAsPoint(mxUtils.getValue(state.style, mxConstants.STYLE_ALIGN, mxConstants.ALIGN_CENTER),
							mxUtils.getValue(state.style, mxConstants.STYLE_VERTICAL_ALIGN, mxConstants.ALIGN_MIDDLE));
				}
				
		 		if (isEdge)
				{
					this.bounds.x = state.absoluteOffset.x;
					this.bounds.y = state.absoluteOffset.y;
					this.bounds.width = 0;
					this.bounds.height = 0;
					
					if (lw != null)
				 	{
						var tmp = (parseFloat(lw) + 2) * scale;
						this.bounds.width = tmp;
						this.bounds.x += m.x * tmp;
				 	}
				}
				else if (this.bounds != null)
				{
					var bds = mxRectangle.fromRectangle(state);
				 	bds = (state.shape != null) ? state.shape.getLabelBounds(bds) : bds;
				 	
				 	if (lw != null)
				 	{
				 		bds.width = parseFloat(lw) * scale;
				 	}
				 	
				 	if (!state.view.graph.cellRenderer.legacySpacing || state.style[mxConstants.STYLE_OVERFLOW] != 'width')
				 	{
						var spacing = parseInt(state.style[mxConstants.STYLE_SPACING] || 2) * scale;
						var spacingTop = (parseInt(state.style[mxConstants.STYLE_SPACING_TOP] || 0) + mxText.prototype.baseSpacingTop) * scale + spacing;
						var spacingRight = (parseInt(state.style[mxConstants.STYLE_SPACING_RIGHT] || 0) + mxText.prototype.baseSpacingRight) * scale + spacing;
						var spacingBottom = (parseInt(state.style[mxConstants.STYLE_SPACING_BOTTOM] || 0) + mxText.prototype.baseSpacingBottom) * scale + spacing;
						var spacingLeft = (parseInt(state.style[mxConstants.STYLE_SPACING_LEFT] || 0) + mxText.prototype.baseSpacingLeft) * scale + spacing;
						
						var hpos = mxUtils.getValue(state.style, mxConstants.STYLE_LABEL_POSITION, mxConstants.ALIGN_CENTER);
						var vpos = mxUtils.getValue(state.style, mxConstants.STYLE_VERTICAL_LABEL_POSITION, mxConstants.ALIGN_MIDDLE);

						bds = new mxRectangle(bds.x + spacingLeft, bds.y + spacingTop,
							bds.width - ((hpos == mxConstants.ALIGN_CENTER && lw == null) ? (spacingLeft + spacingRight) : 0),
							bds.height - ((vpos == mxConstants.ALIGN_MIDDLE) ? (spacingTop + spacingBottom) : 0));
				 	}

					// +2/-1 is used to match the box model workarounds in the rendering code
					this.bounds.x = bds.x + state.absoluteOffset.x - 1;
					this.bounds.y = bds.y + state.absoluteOffset.y;
					this.bounds.width = bds.width + 2;
					this.bounds.height = bds.height;
				}
				
				// Measures string using a hidden div
				var wrap = this.graph.isWrapping(state.cell) && (this.bounds.width >= 2 || this.bounds.height >= 2);
				
				if (wrap)
				{
					this.textDiv.style.whiteSpace = 'normal';
					
					// Simulating maxWidth by checking the offsetWidth and setting the width if that is
					// larger doesn't solve the problem of HR taking up the width of the page instead
					// of the text around it, so there is no need to simulate maxWidth in quirks mode.
					if (mxClient.IS_QUIRKS)
					{
						this.textDiv.style.width = Math.ceil(this.bounds.width) + 'px';
					}
					else
					{
						this.textDiv.style.maxWidth = Math.ceil(this.bounds.width) + 'px';
					}
				}
				
				var value = this.getCurrentHtmlValue();
				this.textDiv.innerHTML = (value.length > 0) ? value : '&nbsp;';
				var size = mxUtils.getValue(state.style, mxConstants.STYLE_FONTSIZE, mxConstants.DEFAULT_FONTSIZE) * scale;
				var ow = this.textDiv.offsetWidth + size;
				var oh = this.textDiv.offsetHeight + 16;

				if (this.minResize != null)
				{
					ow = Math.max(ow, this.minResize.width);
					oh = Math.max(oh, this.minResize.height);
				}

				if (wrap)
				{
					ow = Math.min(this.bounds.width, ow);
				}
								
				// LATER: Keep in visible area
				this.textarea.style.left = Math.max(0, Math.ceil(this.bounds.x - m.x * (this.bounds.width - ow - 3))) + 'px';

				if (isEdge)
				{
					this.textarea.style.top = Math.max(0, Math.round(this.bounds.y - m.y * this.bounds.height + m.y * oh - m.y * 4) + 6) + 'px';
				}
				else
				{

					this.textarea.style.top = Math.max(0, Math.floor(this.bounds.y - m.y * (this.bounds.height - oh + size * 0.1 + 8))) + 'px';
				}

				this.textarea.style.width = Math.ceil(ow + this.textarea.offsetWidth - this.textarea.clientWidth) + 'px';
				this.textarea.style.height = Math.ceil(oh) + 'px';
		 	}
		}
	}
};

/**
 * Function: isModified
 * 
 * Returns <modified>.
 */
mxCellEditor.prototype.isModified = function()
{
	return this.modified;
};

/**
 * Function: setModified
 * 
 * Sets <modified> to the specified boolean value.
 */
mxCellEditor.prototype.setModified = function(value)
{
	this.modified = value;
};

/**
 * Function: focusLost
 *
 * Called if the textarea has lost focus.
 */
mxCellEditor.prototype.focusLost = function()
{
	this.stopEditing(!this.graph.isInvokesStopCellEditing());
};

/**
 * Function: startEditing
 *
 * Starts the editor for the given cell.
 * 
 * Parameters:
 * 
 * cell - <mxCell> to start editing.
 * trigger - Optional mouse event that triggered the editor.
 */
mxCellEditor.prototype.startEditing = function(cell, trigger)
{
	// Lazy instantiates textarea to save memory in IE
	if (this.textarea == null)
	{
		this.init();
	}
	
	this.stopEditing(true);
	var state = this.graph.getView().getState(cell);
	
	if (state != null)
	{
		this.editingCell = cell;
		this.trigger = trigger;
		this.textNode = null;

		if (state.text != null && this.isHideLabel(state))
		{
			this.textNode = state.text.node;
			this.textNode.style.visibility = 'hidden';
		}
		
		// Configures the style of the in-place editor
		var scale = this.graph.getView().scale;
		var size = mxUtils.getValue(state.style, mxConstants.STYLE_FONTSIZE, mxConstants.DEFAULT_FONTSIZE) * scale;
		var family = mxUtils.getValue(state.style, mxConstants.STYLE_FONTFAMILY, mxConstants.DEFAULT_FONTFAMILY);
		var color = mxUtils.getValue(state.style, mxConstants.STYLE_FONTCOLOR, 'black');
		var align = mxUtils.getValue(state.style, mxConstants.STYLE_ALIGN, mxConstants.ALIGN_LEFT);
		var bold = (mxUtils.getValue(state.style, mxConstants.STYLE_FONTSTYLE, 0) &
				mxConstants.FONT_BOLD) == mxConstants.FONT_BOLD;
		var italic = (mxUtils.getValue(state.style, mxConstants.STYLE_FONTSTYLE, 0) &
				mxConstants.FONT_ITALIC) == mxConstants.FONT_ITALIC;
		var uline = (mxUtils.getValue(state.style, mxConstants.STYLE_FONTSTYLE, 0) &
				mxConstants.FONT_UNDERLINE) == mxConstants.FONT_UNDERLINE;
		
		this.textarea.style.lineHeight = (mxConstants.ABSOLUTE_LINE_HEIGHT) ? Math.round(size * mxConstants.LINE_HEIGHT) + 'px' : mxConstants.LINE_HEIGHT;
		this.textarea.style.textDecoration = (uline) ? 'underline' : '';
		this.textarea.style.fontWeight = (bold) ? 'bold' : 'normal';
		this.textarea.style.fontStyle = (italic) ? 'italic' : '';
		this.textarea.style.fontSize = Math.round(size) + 'px';
		this.textarea.style.fontFamily = family;
		this.textarea.style.textAlign = align;
		this.textarea.style.overflow = 'auto';
		this.textarea.style.outline = 'none';
		this.textarea.style.color = color;
		
		// Specifies the bounds of the editor box
		var bounds = this.getEditorBounds(state);
		this.bounds = bounds;

		this.textarea.style.left = bounds.x + 'px';
		this.textarea.style.top = bounds.y + 'px';
		this.textarea.style.width = bounds.width + 'px';
		this.textarea.style.height = bounds.height + 'px';
		this.textarea.style.zIndex = this.zIndex;

		var value = this.getInitialValue(state, trigger);

		// Uses an optional text value for empty labels which is cleared
		// when the first keystroke appears. This makes it easier to see
		// that a label is being edited even if the label is empty.
		if (value == null || value.length == 0)
		{
			value = this.getEmptyLabelText();
			this.clearOnChange = value.length > 0;
		}
		else
		{
			this.clearOnChange = false;
		}
		
		this.setModified(false);		
		this.textarea.value = value;
		this.graph.container.appendChild(this.textarea);
		
		if (this.textarea.style.display != 'none')
		{
			if (this.autoSize)
			{
				this.textDiv = this.createTextDiv();
				document.body.appendChild(this.textDiv);
				this.resize();
			}
			
			this.textarea.focus();
			
			if (this.isSelectText() && this.textarea.value.length > 0)
			{
				if (mxClient.IS_IOS)
				{
					document.execCommand('selectAll');
				}
				else
				{
					this.textarea.select();
				}
			}
		}
	}
};

/**
 * Function: isSelectText
 * 
 * Returns <selectText>.
 */
mxCellEditor.prototype.isSelectText = function()
{
	return this.selectText;
};

/**
 * Function: createTextDiv
 *
 * Creates the textDiv used for measuring text.
 */
mxCellEditor.prototype.createTextDiv = function()
{
	var div = document.createElement('div');
	var style = div.style;
	style.position = 'absolute';
	style.whiteSpace = 'nowrap';
	style.visibility = 'hidden';
	style.padding = '0px';
	style.margin = '0px';
	style.display = (mxClient.IS_QUIRKS) ? 'inline' : 'inline-block';
	style.zoom = '1';
	style.verticalAlign = 'top';
	style.lineHeight = this.textarea.style.lineHeight;
	style.fontSize = this.textarea.style.fontSize;
	style.fontFamily = this.textarea.style.fontFamily;
	style.fontWeight = this.textarea.style.fontWeight;
	style.textAlign = this.textarea.style.textAlign;
	style.fontStyle = this.textarea.style.fontStyle;
	style.textDecoration = this.textarea.style.textDecoration;
	
	return div;
};

/**
 * Function: stopEditing
 *
 * Stops the editor and applies the value if cancel is false.
 */
mxCellEditor.prototype.stopEditing = function(cancel)
{
	cancel = cancel || false;
	
	if (this.editingCell != null)
	{
		if (this.textNode != null)
		{
			this.textNode.style.visibility = 'visible';
			this.textNode = null;
		}
		
		if (!cancel && this.isModified())
		{
			this.graph.labelChanged(this.editingCell, this.getCurrentValue(), this.trigger);
		}
		
		if (this.textDiv != null)
		{
			document.body.removeChild(this.textDiv);
			this.textDiv = null;
		}
		
		this.editingCell = null;
		this.trigger = null;
		this.bounds = null;
		this.textarea.blur();
		
		if (this.textarea.parentNode != null)
		{
			this.textarea.parentNode.removeChild(this.textarea);
		}
	}
};

/**
 * Function: getInitialValue
 * 
 * Gets the initial editing value for the given cell.
 */
mxCellEditor.prototype.getInitialValue = function(state, trigger)
{
	 return this.graph.getEditingValue(state.cell, trigger);
};

/**
 * Function: getCurrentValue
 * 
 * Returns the current editing value.
 */
mxCellEditor.prototype.getCurrentValue = function()
{
	 return this.textarea.value.replace(/\r/g, '');
};

/**
 * Function: getCurrentHtmlValue
 * 
 * Returns the current value as HTML to measure the text size.
 */
mxCellEditor.prototype.getCurrentHtmlValue = function()
{
	var value = this.getCurrentValue();
	
	if (value.charAt(value.length - 1) == '\n' || value == '')
	{
		value += '&nbsp;';
	}

	return mxUtils.htmlEntities(value, false).replace(/\n/g, '<br/>');
};

/**
 * Function: isHideLabel
 * 
 * Returns true if the label should be hidden while the cell is being
 * edited.
 */
mxCellEditor.prototype.isHideLabel = function(state)
{
	return true;
};

/**
 * Function: getMinimumSize
 * 
 * Returns the minimum width and height for editing the given state.
 */
mxCellEditor.prototype.getMinimumSize = function(state)
{
	var scale = this.graph.getView().scale;
	
	return new mxRectangle(0, 0, (state.text == null) ? 30 : state.text.size * scale + 20,
			(this.textarea.style.textAlign == 'left') ? 120 : 40);
};

/**
 * Function: getEditorBounds
 * 
 * Returns the <mxRectangle> that defines the bounds of the editor.
 */
mxCellEditor.prototype.getEditorBounds = function(state)
{
	var isEdge = this.graph.getModel().isEdge(state.cell);
	var scale = this.graph.getView().scale;
	var minSize = this.getMinimumSize(state);
	var minWidth = minSize.width;
 	var minHeight = minSize.height;
 	var result = null;
 	
 	if (!isEdge && state.view.graph.cellRenderer.legacySpacing && state.style[mxConstants.STYLE_OVERFLOW] == 'fill')
 	{
 		result = state.shape.getLabelBounds(mxRectangle.fromRectangle(state));
 	}
 	else
 	{
		var spacing = parseInt(state.style[mxConstants.STYLE_SPACING] || 0) * scale;
		var spacingTop = (parseInt(state.style[mxConstants.STYLE_SPACING_TOP] || 0) + mxText.prototype.baseSpacingTop) * scale + spacing;
		var spacingRight = (parseInt(state.style[mxConstants.STYLE_SPACING_RIGHT] || 0) + mxText.prototype.baseSpacingRight) * scale + spacing;
		var spacingBottom = (parseInt(state.style[mxConstants.STYLE_SPACING_BOTTOM] || 0) + mxText.prototype.baseSpacingBottom) * scale + spacing;
		var spacingLeft = (parseInt(state.style[mxConstants.STYLE_SPACING_LEFT] || 0) + mxText.prototype.baseSpacingLeft) * scale + spacing;
	
	 	result = new mxRectangle(state.x, state.y,
	 		 Math.max(minWidth, state.width - spacingLeft - spacingRight),
	 		 Math.max(minHeight, state.height - spacingTop - spacingBottom));
	 	
		result = (state.shape != null) ? state.shape.getLabelBounds(result) : result;
	
		if (isEdge)
		{
			result.x = state.absoluteOffset.x;
			result.y = state.absoluteOffset.y;
	
			if (state.text != null && state.text.boundingBox != null)
			{
				// Workaround for label containing just spaces in which case
				// the bounding box location contains negative numbers 
				if (state.text.boundingBox.x > 0)
				{
					result.x = state.text.boundingBox.x;
				}
				
				if (state.text.boundingBox.y > 0)
				{
					result.y = state.text.boundingBox.y;
				}
			}
		}
		else if (state.text != null && state.text.boundingBox != null)
		{
			result.x = Math.min(result.x, state.text.boundingBox.x);
			result.y = Math.min(result.y, state.text.boundingBox.y);
		}
	
		result.x += spacingLeft;
		result.y += spacingTop;
	
		if (state.text != null && state.text.boundingBox != null)
		{
			if (!isEdge)
			{
				result.width = Math.max(result.width, state.text.boundingBox.width);
				result.height = Math.max(result.height, state.text.boundingBox.height);
			}
			else
			{
				result.width = Math.max(minWidth, state.text.boundingBox.width);
				result.height = Math.max(minHeight, state.text.boundingBox.height);
			}
		}
		
		// Applies the horizontal and vertical label positions
		if (this.graph.getModel().isVertex(state.cell))
		{
			var horizontal = mxUtils.getValue(state.style, mxConstants.STYLE_LABEL_POSITION, mxConstants.ALIGN_CENTER);
	
			if (horizontal == mxConstants.ALIGN_LEFT)
			{
				result.x -= state.width;
			}
			else if (horizontal == mxConstants.ALIGN_RIGHT)
			{
				result.x += state.width;
			}
	
			var vertical = mxUtils.getValue(state.style, mxConstants.STYLE_VERTICAL_LABEL_POSITION, mxConstants.ALIGN_MIDDLE);
	
			if (vertical == mxConstants.ALIGN_TOP)
			{
				result.y -= state.height;
			}
			else if (vertical == mxConstants.ALIGN_BOTTOM)
			{
				result.y += state.height;
			}
		}
 	}
 	
 	return new mxRectangle(Math.round(result.x), Math.round(result.y), Math.round(result.width), Math.round(result.height));
};

/**
 * Function: getEmptyLabelText
 *
 * Returns the initial label value to be used of the label of the given
 * cell is empty. This label is displayed and cleared on the first keystroke.
 * This implementation returns <emptyLabelText>.
 * 
 * Parameters:
 * 
 * cell - <mxCell> for which a text for an empty editing box should be
 * returned.
 */
mxCellEditor.prototype.getEmptyLabelText = function (cell)
{
	return this.emptyLabelText;
};

/**
 * Function: getEditingCell
 *
 * Returns the cell that is currently being edited or null if no cell is
 * being edited.
 */
mxCellEditor.prototype.getEditingCell = function ()
{
	return this.editingCell;
};

/**
 * Function: destroy
 *
 * Destroys the editor and removes all associated resources.
 */
mxCellEditor.prototype.destroy = function ()
{
	if (this.textarea != null)
	{
		mxEvent.release(this.textarea);
		
		if (this.textarea.parentNode != null)
		{
			this.textarea.parentNode.removeChild(this.textarea);
		}
		
		this.textarea = null;
		
		if (this.changeHandler != null)
		{
			this.graph.getModel().removeListener(this.changeHandler);
			this.changeHandler = null;
		}
	}
};
