/**
 * 
 */

var sortFunc = function(firstEvent, secondEvent){
	var x = moment(firstEvent.start.dateTime);
    var y = moment(secondEvent.start.dateTime);
    return (x.diff(y, 'minutes') < 0 ? -1 : x.diff(y, 'minutes') == 0 ? 0 : 1)
}

var f = function(eList){
	var ret = [];
	for (e in eList){
		if (eList[e].start.dateTime){
			ret.push(eList[e]);
		}
	}
	return ret;
}

//TODO: compare dates using moment compares inline
var filterGoogleEvents = function(startByDateTime, endByDateTime, eList){
	var filteredEventList = [];
	for (event in eList){
		if (((moment(eList[event].start.dateTime).diff(moment(startByDateTime), 'minutes') >= 0) && (moment(eList[event].start.dateTime).diff(moment(endByDateTime), 'minutes') <= 0)) || ((moment(eList[event].end.dateTime).diff(moment(startByDateTime), 'minutes') >= 0) && (moment(eList[event].end.dateTime).diff(moment(endByTime), 'minutes') <= 0))){
			filteredEventList.push(eList[event]);
		}
	}
	return filteredEventList;
};

/*************************************** code above here tested and works **********************/

//TODO: finish implementing, this is not necessary, more important to finish scheduleEventFirstAvailable
//to finish, all we need to do is insert moment compares
//calculates all available slots to schedule the task
var calculateAvailableSlots = function(ourEvent, filteredGoogleCalEventList){
	var prevEvent = filteredGoogleCalEventList[0];
	if ((filteredGoogleCalEventList.length <= 0) || ((prevEvent.start.dateTime >= ourEvent.startBy) && ((prevEvent.start.dateTime - ourEvent.startBy) >= ourEvent.duration))){
		event = {"kind": "calendar#event", "id": ourEvent.id, "start": ourEvent.startBy, "end": ourEvent.startBy + ourEvent.duration};
		return event;
	}
};

//returns the event with all fields properly filled out, throws error if can't create
//schedules in earliest available slot after the startBy dateTime
var scheduleEventFirstAvailable = function(ourEvent, filteredGoogleCalEventList){
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
