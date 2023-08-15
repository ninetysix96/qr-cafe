document.getElementById('login-form').addEventListener('submit', function(event) {
	event.preventDefault(); // Prevent form submission to server.

	var username = document.getElementById('username').value;
	var password = document.getElementById('password').value;

	// Simple validation.
	if(username === '' || password === '') {
			alert('Please fill in all fields.');
	} else {
			// Here you would typically send the form data to the server for authentication.
			// We're just printing it to the console for the purpose of this example.
			console.log('Username:', username, 'Password:', password);
	}
});
