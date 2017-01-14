/*
    3ds-guide-enhanced.user.js
    Part of the 3DS Guide Enhanced extension.

    Copyright (c) 2017 Ivan Fonseca

    Permission is hereby granted, free of charge, to any person obtaining a copy
    of this software and associated documentation files (the "Software"), to deal
    in the Software without restriction, including without limitation the rights
    to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
    copies of the Software, and to permit persons to whom the Software is
    furnished to do so, subject to the following conditions:

    The above copyright notice and this permission notice shall be included in all
    copies or substantial portions of the Software.

    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
    IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
    FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
    AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
    LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
    OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
    SOFTWARE.
*/

// ==UserScript==
// @name         3DS Guide Enhanced
// @namespace    https://ivanfon.github.io/
// @version      0.2.2
// @description  A browser extension with enhancements for the 3DS hacking guide found at https://3ds.guide/
// @author       Ivan Fonseca
// @match        *://3ds.guide/*
// @grant        none
// ==/UserScript==


(function() {
    // Variables
    // How many boxes are checked
    var checks = 0;
    // List of all checkboxes
    var listItems;

    // Add CSS
    addCSS();
    // Add checkboxes
    addCheckboxes();
    // Add the info box
    addInfoBox();

    // Adds all the CSS rules
    function addCSS() {
        // Create the style tag
        var styleTag = document.createElement("style");
        styleTag.type = "text/css";
        // Add the CSS
        styleTag.innerHTML = "\
        \
        #tdsgeInfoBox { \
            position: fixed; \
            bottom: 0; \
            right: 0; \
            margin-right: 30px; \
            margin-bottom: 20px; \
            background-color: rgba(82,173,200,0.3); \
            opacity: 0.5; \
            border-radius: 5px; \
            width: 15%; \
            text-align: center; \
            padding: 0px 5px 5px 15px; \
            animation: fadeOut 1s; \
        } \
        \
        #tdsgeInfoBox:hover { \
            animation: fadeIn 1s; \
        } \
        \
        @keyframes fadeIn { \
            0% { \
                opacity: 0.5; \
            } \
            100% { \
                opacity: 1; \
            } \
        } \
        \
        @keyframes fadeOut { \
            0% { \
                opacity: 1; \
            } \
            100% { \
                opacity: 0.5; \
            } \
        } \
        \
        .tdsgeCheckbox { \
            margin-right: 50px; \
        } \
        \
        #tdsgeInfoTitle { \
            margin-top: 15px; \
        } \
        \
        #tdsgeInfoBox:hover { \
            opacity: 1; \
        } \
        \
        #tdsgeButton { \
            background-color: rgba(238,95,91,0.75); \
            margin: 0 0 0 0; \
        } \
        \
        #tdsgeCheckCounter { \
            font-size: 15px; \
        } \
        \
        #tdsgeAuthorLink { \
            margin-top: 15px; \
        } \
        ";
        
        // Add it to the head tag
        document.head.appendChild(styleTag);
    }

    // Adds checkboxes to all list items
    function addCheckboxes() {
        // Get all list items
        listItems = document.querySelectorAll("div#main > article.page > div.page__inner-wrap > section.page__content li");

        // Loop through the list items
        listItems.forEach(function(val, index, arr) {
            // Create a checkbox that will be added
            var newCheckbox = document.createElement("input");
            newCheckbox.setAttribute("type", "checkbox");
            newCheckbox.setAttribute("class", "tdsgeCheckbox");
            newCheckbox.setAttribute("style", "margin-right: 10px;");
            // User clicked on checkbox
            newCheckbox.onchange = function() {
                // Check if the box is checked or not
                if(newCheckbox.checked) {
                    // Add a checked box
                    updateChecks(true);
                    // Style the text
                    newCheckbox.parentNode.setAttribute("style", "color: gray; text-decoration: line-through;");
                    // Get any child list items
                    var childItems = newCheckbox.parentNode.getElementsByTagName("LI");
                    // Loop through and check them
                    for(var i = 0; i < childItems.length; i++) {
                        // Check if the child isn't checked yet
                        if(!childItems[i].childNodes[0].checked) {
                            // Make it checked
                            childItems[i].childNodes[0].checked = true;
                            // Add a check
                            updateChecks(true);
                        }
                        childItems[i].childNodes[0].disabled = true;
                        childItems[i].setAttribute("style", "color: gray; text-decoration: line-through;");
                    }
                } else {
                    // Remove a checked box
                    updateChecks(false);
                    // Style the text
                    newCheckbox.parentNode.removeAttribute("style");
                    // Get any child list items
                    var childItems = newCheckbox.parentNode.getElementsByTagName("LI");
                    /// Loop through and uncheck them
                    for(var i = 0; i < childItems.length; i++) {
                        // Check if the child is already checked
                        if(childItems[i].childNodes[0].checked) {
                            // Make it unchecked
                            childItems[i].childNodes[0].checked = false;
                            // Remove a check
                            updateChecks(false);
                        }
                        childItems[i].childNodes[0].disabled = false;
                        childItems[i].removeAttribute("style");
                    }
                }
            };

            // Insert it
            val.insertBefore(newCheckbox, val.childNodes[0]);
        });
    }

    // Adds the info box
    function addInfoBox() {
        // Create the div
        var infoDiv = document.createElement("div");
        // Set it's style
        infoDiv.setAttribute("id", "tdsgeInfoBox");

        // Create the title
        var infoTitle = document.createElement("h5");
        infoTitle.setAttribute("id", "tdsgeInfoTitle");
        infoTitle.innerHTML = "3DS Guide Enhanced";
        // Add it to the div
        infoDiv.appendChild(infoTitle);

        // Create the checkbox counter
        var checkCounter = document.createElement("p");
        checkCounter.setAttribute("id", "tdsgeCheckCounter");
        checkCounter.innerHTML = '<span id="checkCounter">0</span> / ' + listItems.length + " steps completed";
        // Add it to the div
        infoDiv.appendChild(checkCounter);

        // Create the clear button
        var clearButton = document.createElement("button");
        clearButton.setAttribute("id", "tdsgeButton");
        clearButton.setAttribute("class", "btn btn--light-outline btn-large");
        clearButton.innerHTML = "Clear Steps";
        clearButton.onclick = clearSteps;
        // Add it to the div
        infoDiv.appendChild(clearButton);

        // Create the author link
        var authorLink = document.createElement("h6");
        authorLink.setAttribute("id", "tdsgeAuthorLink");
        authorLink.innerHTML = '<a href="https://github.com/ivanfon">Ivan Fonseca</a> <3';
        // Add it to the div
        infoDiv.appendChild(authorLink);

        // Add the info box to the body
        document.body.appendChild(infoDiv);
    }

    // Updates number of checked boxes
    function updateChecks(checked) {
        // Check if the box was checked
        if(checked) {
            // Add a checked box
            checks++;
        // Box was unchecked
        } else {
            // Remove a checked box
            checks--;
        }

        // Update the check counter
        document.getElementById("checkCounter").innerHTML = String(checks);
    }

    // Unchecks all steps and resets counter
    function clearSteps() {
        // Loop through checkboxes
        listItems.forEach(function(val, index, arr) {
            // Uncheck current item
            val.childNodes[0].checked = false;
            // Enable current item
            val.childNodes[0].disabled = false;
            // Remove styles
            val.removeAttribute("style");
        });
        // Reset amount checked
        checked = 0;
        if(document.getElementById("checkCounter")) {
            document.getElementById("checkCounter").innerHTML = 0;
        }
    }
})();