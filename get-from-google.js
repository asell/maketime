/**
 * 
 */
//creates a moment from a date string
var createMoment = function(dateString){
	return moment(dateString, 'YYYY-MM-DD HH:mm');
}

//returns -1 if x is before y in minutes, 0 if same, 1 if after
var sortOnStartDate = function(firstEvent, secondEvent){
	var firstDateTime = firstEvent.start.dateTime;
	var secondDateTime = secondEvent.start.dateTime;
	if(!firstDateTime){
		firstDateTime = firstEvent.start.date;
	}
	if(!secondDateTime){
		secondDateTime = secondEvent.start.date;
	}
	var x = createMoment(firstDateTime);
    var y = createMoment(secondDateTime);
    return (x.isBefore(y, 'minute') ? -1 : x.isSame(y, 'minute') ? 0 : 1)
}

//returns a list of all calendar events from google overlapping at all with startBy-endBy range
var filterGoogleEvents = function(startByDateTime, endByDateTime, eList){
	var filteredEventList = [];
	var startBy = createMoment(startByDateTime);
	var endBy = createMoment(endByDateTime)
	for (event in eList){
		var curEventStart = createMoment(eList[event].start.dateTime);
		var curEventEnd = createMoment(eList[event].end.dateTime);
		
		//does currentEvent overlap with the range at all
		//if so, add it to the list of events in the range
		if (((curEventStart.isAfter(startBy, 'minute') || curEventStart.isSame(startBy, 'minute')) && (curEventStart.isBefore(endBy, 'minute'))) 
			  || ((curEventEnd.isAfter(startBy, 'minute') || curEventEnd.isSame(startBy, 'minute')) && (curEventEnd.isBefore(endBy, 'minute'))))
		{
			filteredEventList.push(eList[event]);
		}
	}
	return filteredEventList;
};

/*************************************** code above here tested and works **********************/

//TODO: finish implementing, this is not necessary, more important to finish scheduleEventFirstAvailable
//to finish, all we need to do is insert moment compares
//calculates all available slots to schedule the task
//filteredGoogleCalEventList must be sorted by startTime ascending, e.g. earliest events first
/*
 * ourTask will be JSON object for 
 */
var calculateAvailableSlots = function(ourTask, filteredGoogleCalEventList){
	var prevEvent = filteredGoogleCalEventList[0];
	if (!filteredGoogleCalEventList || !filteredGoogleCalEventList.length){
		ourEvent.start
	}
	//if we can fit between furthest in future of (now, ourEvent.startBy) and the first event in our eligible range
	if ((!filteredGoogleCalEventList.length) || ((prevEvent.start.dateTime >= ourEvent.startBy) && ((prevEvent.start.dateTime - ourEvent.startBy) >= ourEvent.duration))){
		event = {"kind": "calendar#event", "id": ourEvent.id, "start": ourEvent.startBy, "end": ourEvent.startBy + ourEvent.duration};
		return event;
	}
};

//returns the event with all fields properly filled out, throws error if can't create
//schedules in earliest available slot after the startBy dateTime
//filtered and sorted list
var scheduleEventFirstAvailable = function(ourEvent, filteredSortedGoogleCalEventList){
	var prevEvent = filteredGoogleCalEventList[0];
	var event;
	//if we can fit before first item in range, or if the list is empty
	//then set the time fields and return the event
	//TODO: add check to take max of (ourEvent.startBy, actual time.now (moment.js now() maybe?))
	if (((prevEvent.start.dateTime >= ourEvent.startBy) && ((prevEvent.start.dateTime - ourEvent.startBy) >= ourEvent.duration)) || filteredGoogleCalEventList.length <= 0){
		event = {"kind": "calendar#event", "id": ourEvent.id, "start": ourEvent.startBy, "end": ourEvent.startBy + ourEvent.duration};
		return event;
	}
	//if length 1
	if (filteredGoogleCalEventList.length === 1){
		//if we can fit after first item
		if ((ourEvent.endBy.dateTime - prevEvent.end.dateTime) >= ourEvent.duration){
			event = {"kind": "calendar#event", "id": ourEvent.id, "start": prevEvent.end, "end": prevEvent.end + ourEvent.duration};
			return event;
		}//can't fit, so return null
		else return null;
	}
	for (var i = 1; i < googleCalEventList.length; i++){
		var currEvent = googleCalEventList[i];
		if (ourEvent.duration <= (currEvent.start.dateTime - prevEvent.end.dateTime)){
			var start;
			var end;
			//TODO: add check to take max of (ourEvent.startBy, actual time.now (moment.js now() maybe?)) needs work for re-schedule
			if (ourEvent.startBy < prevEvent.end.dateTime){
				start = prevEvent.end;
				end = start + duration;
			}
			else {
				start = ourEvent.startBy;
				end = start;
			}
			event = {"kind": "calendar#event", "id": ourEvent.id, "start": start, "end": end};
			return event;
		}
		prevEvent = currEvent;
	}
	//check to see if can add after the last event
	//TODO: add check to take max of (ourEvent.startBy, actual time.now (moment.js now() maybe?))
	if ((ourEvent.endBy.dateTime - lastEndTime) >= ourEvent.duration){
		event = {"kind": "calendar#event", "id": ourEvent.id, "start": prevEvent.end, "end": prevEvent.end + ourEvent.duration};
		return event;
	}
	//can't add it
	return null;
};
