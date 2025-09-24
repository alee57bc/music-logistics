/*
//spotify login button logic
const loginSection = document.getElementById('spotify-login');
const loggedInSection = document.getElementById('spotify-logged-in');
const spotifyButton = document.getElementById('spotify-button');
        
const userName = "User"; // Placeholder for user's name after login
const welcomeText = document.getElementById('welcome-text');
        
//spotify api login calling
const clientId = "spotify-client-id"; // Replace with your Spotify client ID
const code = undefined;

if (!code) {
    redirectToAuthCodeFLow(clientId);
} else {
    const accessToken = await fetchAccessToken(clientId, code);
    const profile = await fetchUserProfile(accessToken);
    populateUI(profile);
}

//redirect to spotify auth page
async function redirectToAuthCodeFLow(clientId) {
    const verifier = generateCodeVerifier(128);
    const challenge = await generateCodeChallenge(verifier);
    
    localStorage.setItem('verifier', verifier);

    const params = new URLSearchParams();
    params.append("client_id", clientId);
    params.append("response_type", "code");
    params.append("redirect_uri", "http://127.0.0.1:5173/callback");
    params.append("scope", "user-read-private user-read-email");
    params.append("code_challenge_method", "S256");
    params.append("code_challenge", challenge);

    document.location = `https://accounts.spotify.com/authorize?${params.toString()}`;
}

//generate code verifier
function generateCodeVerifier(length) {
    let text = '';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (let i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}

//generate code challenge
async function generateCodeChallenge(verifier) {
    const data = new TextEncoder().encode(verifier);
    const digest = await window.crypto.subtle.digest('SHA-256', data);
    return btoa(String.fromCharCode(...new Uint8Array(digest)))
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');
} 

//get access token for code
async function getAccessToken(clientId, code) {
    const verifier = localStorage.getItem("verifier");

    const params = new URLSearchParams();
    params.append("client_id", clientId);
    params.append("grant_type", "authorization_code");
    params.append("code", code);
    params.append("redirect_uri", "http://127.0.0.1:5173/callback"); //change redirect_uri
    params.append("code_verifier", verifier);

    const result = await fetch("https://accounts.spotify.com/api/token", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: params
    });

    const { access_token } = await result.json();
    return access_token;
} 

//call web API
async function fetchUserProfile(accessToken) {
    const result = await fetch("https://api.spotify.com/v1/me", {
        method: "GET", headers: { Authorization: `Bearer ${token}` }
    });

    return await result.json();
} 

//update UI with profile data
function populateUI(profile) {
    document.getElementById("displayName").innerText = profile.display_name;
    if (profile.images[0]) {
        const profileImage = new Image(200, 200);
        profileImage.src = profile.images[0].url;
        document.getElementById("avatar").appendChild(profileImage);
        document.getElementById("imgUrl").innerText = profile.images[0].url;
    }
    document.getElementById("id").innerText = profile.id;
    document.getElementById("email").innerText = profile.email;
    document.getElementById("uri").innerText = profile.uri;
    document.getElementById("uri").setAttribute("href", profile.external_urls.spotify);
    document.getElementById("url").innerText = profile.href;
    document.getElementById("url").setAttribute("href", profile.href);
}
*/

//logic for spotify login button
const loginSection = document.getElementById('spotify-login');
const loggedInSection = document.getElementById('spotify-logged-in');
const spotifyButton = document.getElementById('spotify-button');
const userName = 'User'; // placeholder until real auth is wired
const welcomeText = document.getElementById('welcome-text');

if (spotifyButton) {
    spotifyButton.addEventListener('click', () => {
        //add spotify api login logic here later
        if (loggedInSection) loggedInSection.style.display = 'flex';
        if (welcomeText) welcomeText.textContent = `Welcome, ${userName}!`;
        if (loginSection) loginSection.style.display = 'none';
    });
}

// Feature card click behavior: show the matching recommendation panel and hide the others
(function() {
    const cards = document.querySelectorAll('.feature-card, .feature-card-2');
    const recommendationSection = document.querySelector('.recommendation-section');
    // Map card id -> panel id
    const panelMap = {
        'personal-card': 'personal-recommendations',
        'vibe-card': 'vibe-recommendations',
        'genre-card': 'genre-recommendations',
        'similarity-card': 'similarity-recommendations',
        'random-card': 'random-recommendations'
    };

    function hideAllPanels() {
        document.querySelectorAll('.recommend-pannels').forEach(p => {
            p.style.display = 'none';
            p.classList.remove('is-active');
        });
    }

    function anyCardActive() {
        return Array.from(cards).some(c => c.classList.contains('is-active'));
    }

    const checkboxSpacer = document.getElementById('checkbox-spacer');
    // initialize: hide recommendation section if no card active
    if (recommendationSection && !anyCardActive()) {
        recommendationSection.style.display = 'none';
    }
    // initialize checkbox spacer visibility based on any active card
    const activeCard = document.querySelector('.feature-card.is-active');
    if (checkboxSpacer) {
        if (activeCard && activeCard.id === 'random-card') {
            checkboxSpacer.style.display = 'none';
        } else {
            checkboxSpacer.style.display = '';
        }
    }

    cards.forEach(card => {
        card.addEventListener('click', () => {
            const wasActive = card.classList.contains('is-active');

            // clear current state
            cards.forEach(c => c.classList.remove('is-active'));
            hideAllPanels();

            //clear all text boxes
            document.getElementById('vibe-text').value = '';
            document.getElementById('genre-text').value = '';
            document.getElementById('bpm-input').value = '';
            document.getElementById('similar-song').value = '';

            //uncheck checkbox + hide number
            document.getElementById("check").checked = false;
            document.getElementById('input-number').value = '';
            document.getElementById('number-selection').style.display = 'none';

            if (!wasActive) {
                // activate clicked card and show its panel
                card.classList.add('is-active');
                const panelId = panelMap[card.id];
                if (panelId) {
                    const panel = document.getElementById(panelId);
                    if (panel) {
                        panel.style.display = 'flex';
                        panel.classList.add('is-active');
                    }
                }
                // show/hide the checkbox spacer depending on the selected card
                if (checkboxSpacer) {
                    if (card.id === 'random-card') {
                        checkboxSpacer.style.display = 'none';
                    } else {
                        checkboxSpacer.style.display = '';
                    }
                }
                if (recommendationSection) recommendationSection.style.display = 'grid';
            } else {
                // user clicked the active card -> hide the whole recommendation section
                if (recommendationSection) recommendationSection.style.display = 'none';
            } 
        });
    });
})();

//checkbox logic to show/hide number input
const checkbox = document.getElementById('check');
const numberSelection = document.getElementById('number-selection');
const numberInput = document.getElementById('input-number');

//make sure number input gets reset on load
if (numberInput) {
    numberInput.style.display = '';
}

if (checkbox) {
    checkbox.addEventListener('change', () => {
        if (checkbox.checked) {
            if (numberSelection) numberSelection.style.display = 'flex';
            if (numberInput) {
                numberInput.style.display = '';
                numberInput.focus();
            }
        } else {
            if (numberSelection) numberSelection.style.display = 'none';
            if (numberInput) {
                numberInput.value = '';
                numberInput.style.display = '';
            }
        }
    });
} 

