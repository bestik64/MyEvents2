const gapi = window.gapi;

export async function getEvents() {
    const maxDate = new Date()
    maxDate.setDate(maxDate.getDate() + 30)
    const formattedMaxDate = maxDate.toISOString()

    return await gapi.client.calendar.events.list({
        calendarId: "primary",
        timeMin: new Date().toISOString(),
        timeMax: formattedMaxDate,
        showDeleted: false,
        singleEvents: true,
        orderBy: "startTime",
    });
}

export async function addEvent(event) {
    return await  gapi.client.calendar.events.insert({
        'calendarId': 'primary',
        'resource': event
      });
}

export async function deleteEvent(eventId) {
    return await  gapi.client.calendar.events.delete({
        'calendarId': 'primary',
        'eventId': eventId
      });
}