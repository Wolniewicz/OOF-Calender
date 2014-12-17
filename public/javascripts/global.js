
// Userlist data array for filling in info box
var oofListData = [];

// DOM Ready =============================================================
$(document).ready(function() {

    // Populate the user table on initial page load
    populateTable();


    // OOFName link click
    $('#userList table tbody').on('click', 'td a.linkshowuser', showUserInfo);

    // Add OOF button click
    $('#btnAddOOF').on('click', addUser);

    // Put OOF button click
    $('#btnPutOOF').on('click', putUser);

    // Delete OOF link click
    $('#userList table tbody').on('click', 'td a.linkdeleteuser', deleteOOF);

});

// Functions =============================================================

// Fill table with data
function populateTable() {

    // Empty content string
    var tableContent = '';

    // jQuery AJAX call for JSON
    $.getJSON( '/oof/ooflist', function( data ) {

    	// Stick our user data array into a userlist variable in the global object
    	oofListData = data;

        // For each item in our JSON, add a table row and cells to the content string
        $.each(data, function(){
        	tableContent += '<tr>';
        	tableContent += '<td><a href="#" class="linkshowuser" rel="' + this.name + '" title="Show Details">' + this.name + '</a></td>';
        	tableContent += '<td>' + this.photoUrl + '</td>';
        	tableContent += '<td>' + this.fromDate + '</td>';
        	tableContent += '<td>' + this.toDate + '</td>';
        	tableContent += '<td>' + this.note + '</td>';
        	tableContent += '<td><a href="#" class="linkdeleteuser" rel="' + this._id + '">delete</a></td>';
        	tableContent += '</tr>';
        });

        // Inject the whole content string into our existing HTML table
        $('#userList table tbody').html(tableContent);
    });
};



// Show User Info
function showUserInfo(event) {

    // Prevent Link from Firing
    event.preventDefault();

    // Retrieve username from link rel attribute
    var thisUserName = $(this).attr('rel');

    // Get Index of object based on id value
    var arrayPosition = oofListData.map(function(arrayItem) { return arrayItem.name; }).indexOf(thisUserName);
    // Get our User Object
    var thisUserObject = oofListData[arrayPosition];

    //Populate Info Box
    $('#oofInfoId').text(thisUserObject._id);
    $('#oofInfoPhotoUrl').text(thisUserObject.photoUrl);
    $('#oofInfoName').text(thisUserObject.name);
    $('#oofInfoFromDate').text(thisUserObject.fromDate);
    $('#oofInfoToDate').text(thisUserObject.toDate);
    $('#oofInfoReason').text(thisUserObject.reason);
    $('#oofInfoNote').text(thisUserObject.note);

};


// Add User
function addUser(event) {
	event.preventDefault();

    // Super basic validation - increase errorCount variable if any fields are blank
    var errorCount = 0;
    $('#addOOF input').each(function(index, val) {
    	if($(this).val() === '') { errorCount++; }
    });

    // Check and make sure errorCount's still at zero
    if(errorCount === 0) {

        // If it is, compile all user info into one object
        var newUser = {
        	'photoUrl': $('#addOOF fieldset input#inputOOFPhotoURL').val(),
        	'name': $('#addOOF fieldset input#inputOOFName').val(),
        	'fromDate': $('#addOOF fieldset input#inputOOFFromDate').val(),
        	'toDate': $('#addOOF fieldset input#inputOOFToDate').val(),
        	'reason': $('#addOOF fieldset input#inputOOFReason').val(),
        	'note': $('#addOOF fieldset input#inputOOFNote').val()
        }

        // Use AJAX to post the object to our adduser service
        $.ajax({
        	type: 'POST',
        	data: newUser,
        	url: '/oof/addoof',
        	dataType: 'JSON'
        }).done(function( response ) {

            // Check for successful (blank) response
            if (response.msg === '') {

                // Clear the form inputs
                $('#addOOF fieldset input').val('');

                // Update the table
                populateTable();

            }
            else {

                // If something goes wrong, alert the error message that our service returned
                alert('Error: ' + response.msg);

            }
        });
    }
    else {
        // If errorCount is more than 0, error out
        alert('Please fill in all fields');
        return false;
    }
};


// Add User
function putUser(event) {
	event.preventDefault();

	if($('#putOOF fieldset input#putOOFID').val() === ''){
		alert('You need to give us a OOF id!');
		return;
	}

	// Pop up a confirmation dialog
	var confirmation = confirm('Are you sure you want to update this OOF?');

    // Check and make sure the user confirmed
    if (confirmation === true) {

	    // Retrieve username from link rel attribute
	    var thisOOFId = $('#putOOF fieldset input#putOOFID').val();

    	// Get Index of object based on id value
    	var arrayPosition = oofListData.map(function(arrayItem) { return arrayItem._id; }).indexOf(thisOOFId);
    	// Get our User Object
    	var thisOOFIdObject = oofListData[arrayPosition];

    	//Populate Info Box
    	if($('#putOOF fieldset input#putOOFPhotoURL').val() === '')
    		$('#putOOF fieldset input#putOOFPhotoURL').val(thisOOFIdObject.photoUrl);

    	if($('#putOOF fieldset input#putOOFName').val() === '')
    		$('#putOOF fieldset input#putOOFName').val(thisOOFIdObject.name);

    	if($('#putOOF fieldset input#putOOFFromDate').val() === '')
    		$('#putOOF fieldset input#putOOFFromDate').val(thisOOFIdObject.fromDate);

    	if($('#putOOF fieldset input#putOOFToDate').val() === '')
    		$('#putOOF fieldset input#putOOFToDate').val(thisOOFIdObject.toDate);

    	if($('#putOOF fieldset input#putOOFReason').val() === '')
    		$('#putOOF fieldset input#putOOFReason').val(thisOOFIdObject.reason);

    	if($('#putOOF fieldset input#putOOFNote').val() === '')
    		$('#putOOF fieldset input#putOOFNote').val(thisOOFIdObject.note);




        	// If it is, compile all user info into one object
        	var putUser = {
        		'photoUrl': $('#putOOF fieldset input#putOOFPhotoURL').val(),
        		'name': $('#putOOF fieldset input#putOOFName').val(),
        		'fromDate': $('#putOOF fieldset input#putOOFFromDate').val(),
        		'toDate': $('#putOOF fieldset input#putOOFToDate').val(),
        		'reason': $('#putOOF fieldset input#putOOFReason').val(),
        		'note': $('#putOOF fieldset input#putOOFNote').val()
        	}

    	// Use AJAX to post the object to our adduser service
    	$.ajax({
    		type: 'PUT',
    		data: putUser,
    		url: '/oof/updateoof/' + $('#putOOF fieldset input#putOOFID').val(),
    		dataType: 'JSON'
    	}).done(function( response ) {

        	// Check for successful (blank) response
        	if (response.msg === '') {

        	    // Clear the form inputs
        	    $('#putOOF fieldset input').val('');

        	    // Update the table
        	    populateTable();

        	}
        	else {

           		// If something goes wrong, alert the error message that our service returned
           		alert('Error: ' + response.msg);

           	}
           });
    }
};



// Delete OOF
function deleteOOF(event) {

	event.preventDefault();

    // Pop up a confirmation dialog
    var confirmation = confirm('Are you sure you want to delete this OOF?');

    // Check and make sure the user confirmed
    if (confirmation === true) {

        // If they did, do our delete
        $.ajax({
        	type: 'DELETE',
        	url: '/oof/deleteoof/' + $(this).attr('rel')
        }).done(function( response ) {

            // Check for a successful (blank) response
            if (response.msg === '') {
            }
            else {
            	alert('Error: ' + response.msg);
            }

            // Update the table
            populateTable();

        });

    }
    else {

        // If they said no to the confirm, do nothing
        return false;

    }

};