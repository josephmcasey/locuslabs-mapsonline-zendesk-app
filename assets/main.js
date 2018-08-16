$(function() {
    var client = ZAFClient.init();
    client.invoke('resize', { width: '100%', height: '450px' });

    client.get('ticketFields').then(
        function(data) {
            ticketFields(client, data.ticketFields);
        }
    )

});

function ticketFields(client, ticketFields) {

    const promises = []

    for(const ticketField of ticketFields) {

        switch(ticketField.label) {
            case 'LocusLabs Account':
            case 'Venue Identifier':
            case 'Floor Identifier':
            case 'Latitude':
            case 'Longitude':
                const promise = client.get(`ticket.customField:${ticketField.name}`)
                promises.push(promise)
                break;
            default:
                break;
        }
    }

    // console.log('ticketField: ', ticketField.name)

    Promise.all(promises).then(
        function( [ accounts, venue, floor, latitude, longitude ] ) {
            const v = o => Object.values(o)[1]
            showInfo( [ v(accounts), v(venue), v(floor), v(latitude), v(longitude) ] );
        },
        function(response) {
            console.log('error: ', response)
            showError(response);
        }
    )

}

function showInfo( [ accounts, venue, floor, latitude, longitude ] ) {

    console.log('data: ', accounts, venue, floor, latitude, longitude)

    const firstAccount = JSON.parse(accounts)[0];

    console.log('firstAccount: ', firstAccount)

    const requester_data = {
        'account': firstAccount,
        'venue': venue,
        'floor': floor,
        'coord': `${latitude},${longitude}`,
    };
    var source = $("#requester-template").html();
    var template = Handlebars.compile(source);
    var html = template(requester_data);
    $("#content").html(html);



    setTimeout(
        () => {
            window.LocusMaps({command: 'version'}).then(console.log)
            window.LocusMaps({command: "drawMarker", name: "Map Note Placement", lat: latitude, lng: longitude, imageURL: `https://img.locuslabs.com/js/misc/map-note-pin.svg`})
        },
        5000
    )
}

function showError(response) {
    var error_data = {
        'status': response.status,
        'statusText': response.statusText
    };
    var source = $("#error-template").html();
    var template = Handlebars.compile(source);
    var html = template(error_data);
    $("#content").html(html);
}

function formatDate(date) {
    var cdate = new Date(date);
    var options = {
        year: "numeric",
        month: "short",
        day: "numeric"
    };
    date = cdate.toLocaleDateString("en-us", options);
    return date;
}