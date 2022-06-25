jQuery(document).ready(function () {
    let urlstr = "https://www.usf.edu/alertfeed/get/alert/tampa"; // TAMPA PROD
    let urlemer = "http://www.usf.edu/usfalerts/tampa";
    let cdn = "//cdn.usf.edu/Web/Campus/Tampa/Master/css/emergency.css";
    let campus = "Tampa";

    if ((location.href.match(/devsite.usf.edu/)) || (location.href.match(/local/))) { // TAMPA DEV
        urlstr = "http://devsite.usf.edu/alertfeed/get/alert/tampa";
        urlemer = "http://devsite.usf.edu/usfalerts/tampa";
        cdn = "//cdn.usf.edu/Web/Campus/Tampa/Master/css/emergency.css";
    } else if (location.href.match(/testsite.usf.edu/)) { // TAMPA TEST
        urlstr = "http://testsite.usf.edu/alertfeed/get/alert/tampa";
        urlemer = "http://testsite.usf.edu/usfalerts/tampa";
        cdn = "//cdn.usf.edu/Web/Campus/Tampa/Master/css/emergency.css";
    } else if (location.href.match(/health.usf.edu/)) { // HEALTH PROD
        urlstr = "https://www.usf.edu/alertfeed/get/alert/health";
        urlemer = "http://www.usf.edu/usfalerts/tampa";
        cdn = "//cdn.usf.edu/Web/Campus/Health/Master/css/emergency.css";
    } else if (location.href.match(/dev.usfsm.edu/)) { // USFSM DEV
        urlstr = "http://devsite.usf.edu/alertfeed/get/alert/usfsm";
        urlemer = "http://devsite.usf.edu/usfalerts/usfsm";
        cdn = "//cdn.usf.edu/Web/Campus/Sarasota-Manatee/Master/css/emergency.css";
        campus = "USFSM";
    } else if (location.href.match(/test.usfsm.edu/)) { // USFSM TEST
        urlstr = "http://testsite.usf.edu/alertfeed/get/alert/usfsm";
        urlemer = "http://testsite.usf.edu/usfalerts/usfsm";
        cdn = "//cdn.usf.edu/Web/Campus/Sarasota-Manatee/Master/css/emergency.css";
        campus = "USFSM";
    } else if (location.href.match(/usfsm.edu/)) { // USFSM PROD
        urlstr = "https://www.usf.edu/alertfeed/get/alert/usfsm";
        urlemer = "http://www.usf.edu/usfalerts/usfsm";
        cdn = "//cdn.usf.edu/Web/Campus/Sarasota-Manatee/Master/css/emergency.css";
        campus = "USFSM";
    }

    //console.log("Using URL: " + urlstr);

    function check_for_alert() {
        $.ajax({
            type: 'GET',
            url: urlstr,
            async: false,
            jsonpCallback: 'emergencyCallback',
            contentType: "application/json",
            dataType: 'jsonp',
            success: function (json) {

                //console.log(json);

                if (json["emergency-message"].message != "") {
                    $("#emergency-homepage").addClass("emergency");

                    $("#emergency-homepage").html('<link type="text/css" rel="stylesheet" href="' + cdn + '" /><div class="u-wrapper emergency-wrapper"><div class="emergency-alert"><h2 class="emergency-heading"><span>Emergency</span> - <span class="emergency-type"></span></h2></div><div class="emergency-details"><p class="emergency-meta"><span class="emergency-date"></span></p><p class="emergency-text"></p></div><a class="emergency-link" href="#" target="_blank">usf.edu/usfalerts</a></div>');

                    $(".emergency-type").html("Emergency Notification");
                    $(".emergency-text").html(json["emergency-message"].message);
                    $(".emergency-date").html(json["emergency-message"].pubDate);
                    $(".emergency-link").attr("href", urlemer);
                    $(".emergency-link").text("www.usf.edu/alertusf/" + campus);

                    $("#emergency-homepage").show();
                } else {
                    $("#emergency-homepage").removeClass("emergency").hide();
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                // $("#emergency-homepage").html("").removeClass("emergency").css("display", "block").css("margin", "0");
                $("#emergency-homepage").removeClass("emergency").hide();
                console.log("Failed");
                console.log(jqXHR);
                console.log(textStatus);
                console.log(errorThrown);
            }
        });
    }

    // if( (! location.href.match(/dev.usfsm.edu/)) && (! location.href.match(/devsite.usf.edu/)) )
    // {
    // console.log("Set Interval");
    window.setInterval(check_for_alert, 15000);
    // }
    check_for_alert();
});