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
