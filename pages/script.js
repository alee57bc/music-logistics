const spotifyLogin = {
    init(){
        const loginSection = document.getElementById('spotify-login');
        const loggedInSection = document.getElementById('spotify-logged-in');
        const spotifyButton = document.getElementById('spotify-button');
        
        const userName = "User"; // Placeholder for user's name after login
        const welcomeText = document.getElementById('welcome-text');
        
        spotifyButton.addEventListener('click', () => {
            //add spotify api login logic here later
            loggedInSection.style.display = 'flex';
            welcomeText.textContent = `Welcome, ${userName}!`;
            loginSection.style.display = 'none';
        });
    }
}

spotifyLogin.init();