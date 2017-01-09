/*
    checkboxes.js
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

// Get all list items
var listItems = document.querySelectorAll("div#main > article.page > div.page__inner-wrap > section.page__content li");

// Loop through the list items
listItems.forEach(function(val, index, arr) {
    // Create a checkbox that will be added
    var newCheckbox = document.createElement("input");
    newCheckbox.setAttribute("type", "checkbox");
    newCheckbox.setAttribute("style", "margin-right: 10px;");
    // User clicked on checkbox
    newCheckbox.onchange = function() {
        // Check if the box is checked or not
        if(newCheckbox.checked) {
            // Style the text
            newCheckbox.parentNode.setAttribute("style", "color: gray; text-decoration: line-through;");
            // Get any child list items
            var childItems = newCheckbox.parentNode.getElementsByTagName("LI");
            // Loop through and check them
            for(var i = 0; i < childItems.length; i++) {
                childItems[i].childNodes[0].checked = true;
                childItems[i].childNodes[0].disabled = true;
                childItems[i].setAttribute("style", "color: gray; text-decoration: line-through;");
            }
        } else {
            // Style the text
            newCheckbox.parentNode.removeAttribute("style");
            // Get any child list items
            var childItems = newCheckbox.parentNode.getElementsByTagName("LI");
            /// Loop through and uncheck them
            for(var i = 0; i < childItems.length; i++) {
                childItems[i].childNodes[0].checked = false;
                childItems[i].childNodes[0].disabled = false;
                childItems[i].removeAttribute("style");
            }
        }
    };

    // Insert it
    val.insertBefore(newCheckbox, val.childNodes[0]);
});