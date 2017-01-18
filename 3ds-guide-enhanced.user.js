// ==UserScript==
// @name         3DS Guide Enhanced
// @namespace    https://ivanfon.github.io/
// @version      0.4
// @description  A browser extension with enhancements for the 3DS hacking guide found at https://3ds.guide/
// @author       Ivan Fonseca
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_listValues
// @match        *://3ds.guide/*
// @exclude      *://3ds.guide/
// @exclude      *://3ds.guide/credits
// ==/UserScript==

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

(function() {
    // Variables
    // How many boxes are checked
    var checks = 0;
    // List of all checkboxes
    var listItems;
    // Progress bar container
    var barContainer;
    // Settings popup
    var settingsPopup;

    // Add CSS
    addCSS();
    // Add checkboxes
    addCheckboxes();
    // Add the info box
    addInfoBox();
    // Add the progress bar
    addProgress();
    // Add the settings popup
    addSettings();
    // Load settings from local storage
    loadSettings();

    // Adds all the CSS rules
    function addCSS() {
        // Add the CSS
        GM_addStyle("\
        \
        #tdsge-info-box { \
            position: fixed; \
            bottom: 0; \
            right: 0; \
            margin-right: 30px; \
            margin-left: 30px; \
            margin-bottom: 20px; \
            background-color: rgba(82,173,200,0.3); \
            opacity: 0.5; \
            border-radius: 5px; \
            width: 15%; \
            text-align: center; \
            padding: 0px 5px 5px 15px; \
            animation: fade-out 1s; \
        } \
        \
        #tdsge-info-box:hover { \
            animation: fade-in 1s; \
        } \
        \
        @keyframes fade-in { \
            0% { \
                opacity: 0.5; \
            } \
            100% { \
                opacity: 1; \
            } \
        } \
        \
        @keyframes fade-out { \
            0% { \
                opacity: 1; \
            } \
            100% { \
                opacity: 0.5; \
            } \
        } \
        \
        .tdsge-checkbox { \
            margin-right: 50px; \
        } \
        \
        #tdsge-info-title { \
            margin-top: 15px; \
        } \
        \
        #tdsge-info-box:hover { \
            opacity: 1; \
        } \
        \
        #tdsge-clear-button, #tdsge-settings-close-button { \
            background-color: rgba(238,95,91,0.75); \
        } \
        \
        #tdsge-settings-button { \
            background-color: #23dd8d; \
            margin-top: 10px; \
        } \
        \
        #tdsge-check-counter { \
            font-size: 15px; \
        } \
        \
        #tdsge-author-link { \
            margin-top: 15px; \
        } \
        \
        #tdsge-progress-container { \
            margin-top: 0%; \
            margin-bottom: 0%; \
            padding-top: 0%; \
            padding-bottom: 0% \
            font-size: 0.2rem; \
            position: fixed; \
            height: 7px; \
            top: 0; \
            left: 0; \
            right: 0; \
            z-index: 9001; \
            width: 0%; \
        } \
        \
        #tdsge-progress-bar { \
            display: block; \
            position: fixed; \
            overflow: hidden; \
        } \
        \
        .tdsge-progress-bar-green { \
            background: #26d6a1; \
        } \
        \
        .tdsge-progress-bar-blue { \
            background: #7d9fe8; \
        } \
        \
        .tdsge-button { \
            margin: 0 0 0 0; \
        } \
        \
        #tdsge-settings-popup-container { \
            display: none; \
            position: fixed; \
            z-index: 9002; \
            left: 0; \
            top: 0; \
            width: 100%; \
            height: 100%; \
            overflow: auto; \
            background: rgb(0, 0, 0); \
            background: rgba(0, 0, 0, 0.4); \
        } \
        \
        #tdsge-settings-popup-content { \
            margin: 15% auto; \
            padding: 20px; \
            border: 1px solid #888; \
            width: 40%; \
            background: #e8e8e8; \
        } \
        \
        #tdsge-settings-popup-content h3 { \
            margin-top: 20px; \
            font-size: 25px; \
        } \
        \
        #tdsge-settings-popup-content h5 { \
            margin-top: 20px; \
        } \
        \
        #tdsge-settings-popup-content label { \
            font-size: 15px; \
        } \
        \
        #tdsge-settings-popup-content input { \
            float: left; \
            margin-right: 10px; \
        } \
        \
        #tdsge-settings-version { \
            font-size: 14px; \
            padding-left: 10px; \
        } \
        ");
    }

    // Adds checkboxes to all list items
    function addCheckboxes() {
        // Get all items to add checkboxes to
        listItems = document.querySelectorAll("div#main > article.page > div.page__inner-wrap > section.page__content li, .notice, .notice--info, .notice--danger, .notice--success, .notice--warning, .notice--primary");
        // Convert it to an array
        listItems = [].slice.call(listItems);
        // Remove the last three items
        listItems.splice(listItems.length - 3, listItems.length);
        
        // Loop through the list items
        listItems.forEach(function(val, index, arr) {
            // Create a checkbox that will be added
            var newCheckbox = document.createElement("input");
            newCheckbox.setAttribute("type", "checkbox");
            newCheckbox.setAttribute("class", "tdsge-checkbox");
            newCheckbox.setAttribute("style", "margin-right: 10px;");
            // User clicked on checkbox
            newCheckbox.onchange = function() {
                // Check if the box is checked or not
                if(newCheckbox.checked) {
                    // Add a checked box
                    updateChecks(true);
                    // Style the text
                    newCheckbox.parentNode.setAttribute("style", "color: gray; text-decoration: line-through;");
                    // #main > article > div > section > center > div:nth-child(1)
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
        infoDiv.setAttribute("id", "tdsge-info-box");

        // Create the title
        var infoTitle = document.createElement("h5");
        infoTitle.setAttribute("id", "tdsge-info-title");
        infoTitle.innerHTML = "3DS Guide Enhanced";
        // Add it to the div
        infoDiv.appendChild(infoTitle);

        // Create the checkbox counter
        var checkCounter = document.createElement("p");
        checkCounter.setAttribute("id", "tdsge-check-counter");
        checkCounter.innerHTML = '<span id="checkCounter">0</span> / ' + listItems.length + " steps completed";
        // Add it to the div
        infoDiv.appendChild(checkCounter);

        // Create the clear button
        var clearButton = document.createElement("button");
        clearButton.setAttribute("id", "tdsge-clear-button");
        clearButton.setAttribute("class", "btn btn--light-outline btn-large tdsge-button");
        clearButton.innerHTML = "Clear Steps";
        clearButton.onclick = clearSteps;
        // Add it to the div
        infoDiv.appendChild(clearButton);

        // Create the settings button
        var settingsButton = document.createElement("button");
        settingsButton.setAttribute("id", "tdsge-settings-button");
        settingsButton.setAttribute("class", "btn btn--light-outline btn-large tdsge-button");
        settingsButton.innerHTML = "Settings";
        settingsButton.onclick = openSettings;
        // Add it to the div
        infoDiv.appendChild(settingsButton);

        // Create the author link
        var authorLink = document.createElement("h6");
        authorLink.setAttribute("id", "tdsge-author-link");
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

        // Calculate percentage completed
        var percentDone = 100 * (checks / listItems.length);

        // Update progress bar
        barContainer.setAttribute("style", "width: " + percentDone + "%;");

        // Colour the progress bar
        if(percentDone == 100) {
            // Make it green
            barContainer.setAttribute("class", "tdsge-progress-bar-green");
        } else {
            // Make it blue
            barContainer.setAttribute("class", "tdsge-progress-bar-blue");
        }
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

    // Add the progress bar
    function addProgress() {
        // Create the progress bar container
        barContainer = document.createElement("div");
        barContainer.setAttribute("id", "tdsge-progress-container");

        // Create the progress bar
        var bar = document.createElement("span");
        bar.setAttribute("id", "tdsge-progress-bar");
        bar.setAttribute("class", "tdsge-progress-bar-blue");

        // Add the progress bar as a child of the container
        barContainer.appendChild(bar);

        // Add it to the top
        document.body.insertBefore(barContainer, document.querySelector("#main"));
    }

    // Add the settings popup to the page
    function addSettings() {
        // Create the settings popup container
        settingsPopup = document.createElement("div");
        settingsPopup.setAttribute("id", "tdsge-settings-popup-container");

        // Create the settings popup content
        var settingsContent = document.createElement("div");
        settingsContent.setAttribute("id", "tdsge-settings-popup-content");
        settingsContent.innerHTML = '\
        <h3>3DS Guide Enhanced Settings<span id="tdsge-settings-version">v0.3.1</span></h3>\
        <h5>Info box position:</h5>\
        <input type="radio" name="info-box-pos" id="tdsge-settings-info-box-pos-left" value="left">\
        <label for="left">Left</label>\
        <input type="radio" name="info-box-pos" id="tdsge-settings-info-box-pos-right" value="right">\
        <label for="right">Right</label>\
        <br>\
        <button class="btn btn--light-outline btn-large" id="tdsge-settings-close-button">Close</button>\
        ';

        // Add it to the container
        settingsPopup.appendChild(settingsContent);

        // Add the popup to the body
        document.body.appendChild(settingsPopup);

        // Add the close event to the close button
        document.querySelector("#tdsge-settings-close-button").onclick = closeSettings;

        // Select position radio buttons
        if(GM_listValues().indexOf("tdsge-info-box-left") > -1) {
            if(GM_getValue("tdsge-info-box-left")) {
                document.querySelector("#tdsge-settings-info-box-pos-left").checked = true;
            } else {
                document.querySelector("#tdsge-settings-info-box-pos-right").checked = true;
            }
        }
        
        // Add settings events to controls
        document.querySelector("#tdsge-settings-info-box-pos-left").onclick = changePosition;
        document.querySelector("#tdsge-settings-info-box-pos-right").onclick = changePosition;
    }

    // Opens the settings popup
    function openSettings() {
        settingsPopup.style.display = "block";
    }

    // Closes the settings popup
    function closeSettings() {
        settingsPopup.style.display = "none";
    }

    // Change the info box position
    function changePosition() {
        // Get the direction
        var left = document.querySelector("#tdsge-settings-info-box-pos-left").checked;
        // Get the info box
        var infoBox = document.querySelector("#tdsge-info-box");

        if(left) {
            infoBox.style.left = 0;
            infoBox.style.right = "";
        } else {
            infoBox.style.left = "";
            infoBox.style.right = 0;
        }

        // Store the new value
        GM_setValue("tdsge-info-box-left", left);
    }

    // Loads settings from local storage
    function loadSettings() {
        // Get list of stored settings for 3dsge
        var tdsgeSettings = [];

        // Loop through stored settings
        GM_listValues().forEach(function(val) {
            // Check if it starts with tdsge
            if(val.substring(0, 5) == "tdsge") {
                tdsgeSettings.push(val);
            }
        });

        // Loop through tdsge settings
        tdsgeSettings.forEach(function(val) {
            switch(val) {
                case "tdsge-info-box-left":
                    // Get the infobox
                    // Get the info box
                    var infoBox = document.querySelector("#tdsge-info-box");
                    // Get the position
                    var left = GM_getValue(val);
                    // Move the infobox
                    if(left) {
                        infoBox.style.left = 0;
                        infoBox.style.right = "";
                    } else {
                        infoBox.style.left = "";
                        infoBox.style.right = 0;
                    }
                default:
                    // words
            }
        });
    }
})();
