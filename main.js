/*
 * Copyright (c) 2014 Peter Flynn.
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a
 * copy of this software and associated documentation files (the "Software"),
 * to deal in the Software without restriction, including without limitation
 * the rights to use, copy, modify, merge, publish, distribute, sublicense,
 * and/or sell copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
 * DEALINGS IN THE SOFTWARE.
 */


/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4, maxerr: 50 */
/*global define, brackets, $ */

define(function (require, exports, module) {
    "use strict";
    
    // Brackets modules
    var ExtensionUtils      = brackets.getModule("utils/ExtensionUtils"),
        EditorManager       = brackets.getModule("editor/EditorManager");
    
    
    /** @type {?Editor} */
    var currentEditor;
    
    /** @type {!jQueryObject} */
    var $chars;
    
    
    /** Update label */
    function handleDocumentChange(event, document) {
        $chars.text("(" + document.getText().length + " chars)");
    }
    
    /** Listen for edits on active document */
    function handleActiveEditorChange(event, newEditor) {
        if (currentEditor) {
            $(currentEditor.document).off("change", handleDocumentChange);
            currentEditor = null;
        }
        
        currentEditor = newEditor;
        
        if (currentEditor) {
            $(currentEditor.document).on("change", handleDocumentChange);
            handleDocumentChange(null, currentEditor.document); // initially update label
        } else {
            $chars.text("");
        }
    }
    
    
    // Create label in statusbar
    $chars = $("<span class='charcount-label' />");
    $chars.appendTo("#status-info");
    $chars.attr("title", "Newlines count as 1 char. But on Windows, newlines may occupy 2 chars on disk once saved.");
    
    ExtensionUtils.addEmbeddedStyleSheet("#status-info .charcount-label { color: #aaa; }" +
                                         "body.dark #status-info .charcount-label { color: #9a9a9a; }");
    
    // Listen for editors to attach to
    $(EditorManager).on("activeEditorChange", handleActiveEditorChange);
    handleActiveEditorChange(EditorManager.getActiveEditor());
});
