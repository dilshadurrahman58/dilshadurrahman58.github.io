/*
    This is a modified version of the following example:
    https://google-developers.appspot.com/gdata/samples/cal_sample_d96ec9fcb224708e5aea27f7b513973c.frame
    */

    /*
    This is a date class used by the functions below 
    */
	function objUsfDate() {
		this.Month = "";
		this.Day = "";
		this.Year = "";
		this.Time = "";
		this.fullMonthNames = Array("January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December");
		this.getFullMonthName = function () {
			return this.fullMonthNames[parseInt(this.Month) - 1];
		};
		this.getAbbrMonthName = function () {
			return this.fullMonthNames[parseInt(this.Month) - 1].substring(0, 3);
		};
		this.dayNumber = function () {
			var dayNumber = this.Year.toString() + pad(this.Month.toString(),2) + pad(this.Day.toString(),2);
			return dayNumber;
		};

	}


	/*
	usfEventIcon - Uses a date object (objUsfDate) and creates an event_icon div
	*/
	function usfEventIcon(objDate) {
		var eventIcon = document.createElement('div');
		eventIcon.className = 'widget_calIcon';
		
		var eventIconMonth = document.createElement('span');
		eventIconMonth.className = 'widget_calIconMonth';
		eventIconMonth.appendChild(document.createTextNode(objDate.getAbbrMonthName()));
		
		var eventIconDay = document.createElement('span');
		eventIconDay.className = 'widget_calIconDay';
		eventIconDay.appendChild(document.createTextNode(pad(objDate.Day,2)));
		
		eventIcon.appendChild(eventIconMonth);
		eventIcon.appendChild(eventIconDay);
		return eventIcon;
	}

	/*
    usfEventDateString takes in a begin and end date object (objUsfDate)
    it returns a html element to be inserted into the DOM.
    Using the begin and end date it decides if it needs to use a
	single date or a date range.
    */
	function usfEventDateString(objStartDate, objEndDate) {
		var eventDateString = "";
		
		var intEndDayNumber = objEndDate.dayNumber();
		var intStartDayNumber = objStartDate.dayNumber();
		
		if (intEndDayNumber > intStartDayNumber) {
			eventDateString += usfEventDateSingle(objStartDate);
			eventDateString += ' - ';
			eventDateString += usfEventDateSingle(objEndDate);
		} else {
			eventDateString = usfEventDateSingle(objStartDate);
		}
		return eventDateString;
	}

	/*
    usfEventDateSingle - Uses a date object (objUsfDate) to create an event date string
    */
	function usfEventDateSingle(objDate) {
		var eventDateSingle = objDate.getFullMonthName();
		eventDateSingle += ' ' + pad(objDate.Day,2);
		
		return eventDateSingle;
	}

    /*
    usfDateLi takes in a title (event name), entryLinkHref (linke to the event),
    the begining date (objUsfDate) and ending date (objUsfDate) objects and formats
    the li elements that make up the ol that is the calendar.
    */

	function usfDateLi(title, entryLinkHref, objStartDate, objEndDate) {
		var objStartDateNum = objStartDate.dayNumber();
		var objEndDateNum = objEndDate.dayNumber();

		var li = document.createElement('li');
		li.className = "widget_calItem";
		
		var eventContainer = li;
		
		// if we have a link to the event, create an 'a' element
		if (typeof entryLinkHref != 'undefined') {
			entryLinkHref = entryLinkHref + "&ctz=America/New_York";
			var eventLink = document.createElement('a');
			eventLink.className = 'widget_calLink';
			eventLink.setAttribute('href', entryLinkHref);
			li.appendChild(eventLink);
			eventContainer = eventLink;
		} 

		eventIcon = usfEventIcon(objStartDate);

		eventContainer.appendChild(eventIcon);
		
		var eventDetails = document.createElement('div');
		eventDetails.className = 'widget_calDetails';
		eventContainer.appendChild(eventDetails);
		
		var eventTitle = document.createElement('p');
		eventTitle.className = 'widget_calTitle';
		eventTitle.appendChild(document.createTextNode(title));
		eventDetails.appendChild(eventTitle);
		
		var eventDateString = usfEventDateString(objStartDate, objEndDate);
		
		var eventDate = document.createElement('p');
		eventDate.className = 'widget_calDate';
		eventDate.appendChild(document.createTextNode(eventDateString));
		eventDetails.appendChild(eventDate);
		
		var eventTimeString = "";

		if (objStartDate.Time > "") {
			eventTimeString += objStartDate.Time;
		} else {
			eventTimeString += ("12:00 AM");
		}
		if (objEndDate.Time > "") {
			eventTimeString += (" - " + objEndDate.Time);
		} else {
			eventTimeString += (" - " + "11:59 PM");
		}
		
		var eventTime = document.createElement('p');
		eventTime.className = 'widget_calTime';
		eventTime.appendChild(document.createTextNode(eventTimeString));
		eventDetails.appendChild(eventTime);

		return li;
	}



    /* Function from Google for formatting their time formats to something more readable
    Modified to return an objUSFDate
    */
    /**
     * Converts an xs:date or xs:dateTime formatted string into the local timezone
     * and outputs a human-readable form of this date or date/time.
     *
     * @param {string} gCalTime is the xs:date or xs:dateTime formatted string
     * @return {string} is the human-readable date or date/time string
     */

    function formatGCalTime(gCalTime) {
      // text for regex matches
      var remtxt = gCalTime;

      function consume(retxt) {
        var match = remtxt.match(new RegExp('^' + retxt));
        if (match) {
          remtxt = remtxt.substring(match[0].length);
          return match[0];
        }
        return '';
      }

      // minutes of correction between gCalTime and GMT
      var totalCorrMins = 0;

      var year = consume('\\d{4}');
      consume('-?');
      var month = consume('\\d{2}');
      consume('-?');
      var dateMonth = consume('\\d{2}');
      var timeOrNot = consume('T');
      var usfDate = new objUsfDate();

      // if a DATE-TIME was matched in the regex 
      if (timeOrNot == 'T') {
        var hours = consume('\\d{2}');
        consume(':?');
        var mins = consume('\\d{2}');
        consume('(:\\d{2})?(\\.\\d{3})?');
        var zuluOrNot = consume('Z');

        // if time from server is not already in GMT, calculate offset
        if (zuluOrNot != 'Z') {
          var corrPlusMinus = consume('[\\+\\-]');
          if (corrPlusMinus != '') {
            var corrHours = consume('\\d{2}');
            consume(':?');
            var corrMins = consume('\\d{2}');
            totalCorrMins = (corrPlusMinus == '-' ? 1 : -1) *
                (Number(corrHours) * 60 +
          (corrMins == '' ? 0 : Number(corrMins)));
          }
        }

        // get time since epoch and apply correction, if necessary
        // relies upon Date object to convert the GMT time to the local
        // timezone
        var originalDateEpoch = Date.UTC(year, month - 1, dateMonth, hours, mins);
        var gmtDateEpoch = originalDateEpoch + totalCorrMins * 1000 * 60;
        var ld = new Date(gmtDateEpoch);

        // date is originally in YYYY-MM-DD format
        // time is originally in a 24-hour format
        // this converts it to MM/DD hh:mm (AM|PM) 
        dateString = (ld.getMonth() + 1) + '/' + ld.getDate() + ' ' +
            ((ld.getHours() > 12) ? (ld.getHours() - 12) : (ld.getHours() === 0 ? 12 :
      ld.getHours())) + ':' + ((ld.getMinutes() < 10) ? ('0' +
      ld.getMinutes()) : (ld.getMinutes())) + ' ' +
      ((ld.getHours() >= 12) ? 'PM' : 'AM');
        usfDate.Day = ld.getDate();
        usfDate.Year = ld.getFullYear();
        usfDate.Month = ld.getMonth() + 1;
        usfDate.Time = ((ld.getHours() > 12) ? (ld.getHours() - 12) : (ld.getHours() === 0 ? 12 :
      ld.getHours())) + ':' + ((ld.getMinutes() < 10) ? ('0' +
      ld.getMinutes()) : (ld.getMinutes())) + ' ' +
      ((ld.getHours() >= 12) ? 'PM' : 'AM');
      } else {
        // if only a DATE was matched
        dateString = parseInt(month, 10) + '/' + parseInt(dateMonth, 10);
        usfDate.Day = parseInt(dateMonth, 10);
        usfDate.Month = parseInt(month, 10);
        usfDate.Year = parseInt(year, 10);
      }
      //return dateString;
      return usfDate;
    }

    /*
    Modified version of the Google listEvents from https://google-developers.appspot.com/gdata/samples/cal_sample_d96ec9fcb224708e5aea27f7b513973c.frame
    Takes in a feed and the div ID to build an unordered list as a child of the div
    */
    function listGcalEvents(root, divId,calName,calHref) {
      var feed = root.feed;
      var events = document.getElementById(divId);

      if (events.childNodes.length > 0) {
        events.removeChild(events.childNodes[0]);
      }
		
	  var eventContent = document.createElement('div');
	  eventContent.className = 'widget_content widget_cal';

      // create a new ordered list
      var ol = document.createElement('ol');
      ol.className = "widget_calItems";

      // loop through each event in the feed
      for (var i = 0; i < feed.entry.length; i++) {
        var entry = feed.entry[i];
        var title = entry.title.$t;
        var startDate = entry['gd$when'][0].startTime;
        var endDate = entry['gd$when'][0].endTime;

        // get the URL to link to the event
        for (var linki = 0; linki < entry['link'].length; linki++) {
          if (entry['link'][linki]['type'] == 'text/html' &&
              entry['link'][linki]['rel'] == 'alternate') {
            var entryLinkHref = entry['link'][linki]['href'];
          }
        }
        //Take link data and build li
        li = usfDateLi(title, entryLinkHref, formatGCalTime(startDate), formatGCalTime(endDate));
        // append the list item onto the unordered list
        ul.appendChild(li);
      }
      var calHeader = document.createElement('h2');
	  var calHeaderSpan = document.createElement('span');
      var calHeaderLink = document.createElement('a');
      var loadingElem = document.getElementById('calLoading');
      calHeader.className = "widget_name"; 
      var linkText = document.createTextNode(calName);
      calHeaderLink.href = calHref;
      calHeaderLink.appendChild(linkText);
	  calHeaderSpan.appendChild(calHeaderLink);	
      calHeader.appendChild(calHeaderSpan);
      //loadingElem.parentNode.removeChild(loadingElem);
      events.innerHTML = '';
      events.appendChild(calHeader);
      events.appendChild(eventContent);
	  eventContent.appendChild(ol);
    }

    function pad(n, width, z) {
      z = z || '0';
      n = n + '';
      return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
    }

        function googleCalendar(calAddress, gKey, divId, calTitle, qty) {
            var alternateContent = "/widget/usf-widgets/alternate-content.html";
            var currentDate = new Date();
            var numDays = 90;
            var futureDate = new Date();
            futureDate.setDate(futureDate.getDate() + numDays);
            var currentISODate = currentDate.toISOString();
            var maxISODate = futureDate.toISOString();
            var urlGoogle = "https://www.googleapis.com/calendar/v3/calendars/" + calAddress + "/events";
            $.support.cors = true;
            var request = $.ajax({
                url: "/utilities/google-cal.aspx",
                type: "GET",
                timeout: 3500,
                data: {
                    gURL: urlGoogle,
                    key: gKey,
                    singleEvents: 'True',
                    maxResults: qty,
                    orderBy: 'startTime',
                    timeMax: maxISODate,
                    timeMin: currentISODate
                },
                dataType: "json"
            });

            request.done(function (data) {
                var events = document.getElementById(divId);

                if (events.childNodes.length > 0) {
                    events.removeChild(events.childNodes[0]);
                }
				
				var eventContent = document.createElement('div');
				eventContent.className = 'widget_content widget_cal';

                // create a new ordered list
                var ol = document.createElement('ol');
                ol.className = "widget_calItems u-list";
                for (i in data['items']) {
                    var item = data['items'][i];
                    var startDateTime = new Date();
                    var endDateTime = new Date();
                    if (typeof item.start.dateTime != 'undefined') {
                        startDateTime = item.start.dateTime;
                    }
                    else {
                        //alert(new Date(item.start).toISOString());
                        startDateTime = new Date(item.start.date.toString());
                        startDateTime.setHours(0);
                        startDateTime.setMinutes(0);
                        startDateTime.setSeconds(0);
                        startDateTime = startDateTime.toISOString();
                    }
                    if (typeof item.end.dateTime != 'undefined') {
                        endDateTime = item.end.dateTime;
                    }
                    else {
                        endDateTime = new Date(item.end.date.toString());
                        endDateTime.setHours(0);
                        endDateTime.setMinutes(0);
                        endDateTime.setSeconds(0);
                        endDateTime = endDateTime.toISOString();
                    }
                    itemLi = usfDateLi(item.summary, item.htmlLink, formatGCalTime(startDateTime), formatGCalTime(endDateTime));
                    ol.appendChild(itemLi);
                }
                var calHeader = document.createElement('h2');
				var calHeaderSpan = document.createElement('span');
                var calHeaderLink = document.createElement('a');
                var loadingElem = document.getElementById('calLoading');
                calHeader.className = "widget_name";
                var linkText = document.createTextNode(calTitle);
                calHeaderLink.href = "https://www.google.com/calendar/embed?src=" + calAddress + "&ctz=America/New_York ";
                calHeaderLink.setAttribute('target', '_blank');
                calHeaderLink.appendChild(linkText);
				calHeaderSpan.appendChild(calHeaderLink);
                calHeader.appendChild(calHeaderSpan);
                //loadingElem.parentNode.removeChild(loadingElem);
                events.innerHTML = '';
                events.appendChild(calHeader);
                events.appendChild(eventContent);
				eventContent.appendChild(ol);
            });

            request.fail(function (jqXHR, textStatus, errorThrown) {
                galternateContent(divId, alternateContent);
            });

            function gremoveContent(widgetId) {
                $('#' + widgetId).html("");
            }

            function galternateContent(widgetId, alternateContent) {
                gremoveContent(widgetId);
                $.get(alternateContent, function (data) {
                    $('#' + widgetId).replaceWith(data);
                });
            }

        }
        if (!Date.prototype.toISOString) {
            (function () {
                function pad(number) {
                    var r = String(number);
                    if (r.length === 1) {
                        r = '0' + r;
                    }
                    return r;
                }
                Date.prototype.toISOString = function () {
                    return this.getUTCFullYear()
                    + '-' + pad(this.getUTCMonth() + 1)
                    + '-' + pad(this.getUTCDate())
                    + 'T' + pad(this.getUTCHours())
                    + ':' + pad(this.getUTCMinutes())
                    + ':' + pad(this.getUTCSeconds())
                    + '.' + String((this.getUTCMilliseconds() / 1000).toFixed(3)).slice(2, 5)
                    + 'Z';
                };
            }());
        }   

    function featureCode(featureNum)
    {
      $.ajax({
        dataType: 'jsonp',
        jsonp: 'jsonp_callback',
        url: 'http://usfweb.usf.edu/bullish/cms-feature/' + featureNum + '/show',
        success: function (j) {
          var state = "";
          $("#feature-vote-" + featureNum + " .bullish-title").html(j.Title);
          $("#feature-vote-" + featureNum + " .bullish-img").attr("src", j.ImageURL);
          $("#feature-vote-" + featureNum + " .bullish-description").html(j.Description);
          $("#feature-voted-" + featureNum + " .bullish-title").html(j.Title);
          $("#feature-voted-" + featureNum + " .bullish-description").html(j.Description);
          //alert(j.Description);
          if (j.Voted) {
            state = "voted";
            $("#feature-loading-" + featureNum + "").toggle();
            $("#feature-voted-" + featureNum + "").toggle();
          } else {
            state = "vote";
            $("#feature-loading-" + featureNum + "").toggle();
            $("#feature-vote-" + featureNum + "").toggle();
          }
        }
      });
      $("#feature-vote-" + featureNum).on('click', function (evt) {
        $("#feature-vote-" + featureNum).toggle();
        $("#feature-loading-" + featureNum).toggle();
        $.ajax({
          dataType: 'jsonp',
          jsonp: 'jsonp_callback',
          url: 'http://usfweb.usf.edu/bullish/cms-feature/' + featureNum + '/vote',
          success: function (j) {
            $("#feature-loading-" + featureNum).toggle();
            $("#feature-voted-" + featureNum).toggle();
          },
          failure: function () {
            $("#feature-loading-" + featureNum).toggle();
            $("#feature-vote-" + featureNum).toggle();
          }
        });
        return false;//Returning false prevents the event from continuing up the chain
      });
    }
