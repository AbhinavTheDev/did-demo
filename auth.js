// Auth management

// DOM elements
const loginButton = document.getElementById('login-button');
const logoutButton = document.getElementById('logout-button');
const preAuthSection = document.getElementById('pre-auth');
const postAuthSection = document.getElementById('post-auth');
const loadingOverlay = document.getElementById('loading');
const authStatusDiv = document.getElementById('auth-status');
const userNameElement = document.getElementById('user-name');
const userEmailElement = document.getElementById('user-email');
const userDidElement = document.getElementById('user-did');
const userAddressElement = document.getElementById('user-address');

// State management
let authState = null;

// Helper functions
function generateState() {
    return Math.random().toString(36).substring(2, 15) + 
           Math.random().toString(36).substring(2, 15);
}

function showLoading(show = true) {
    loadingOverlay.classList.toggle('hidden', !show);
}

function updateAuthStatus() {
    const token = localStorage.getItem('did_auth_token');
    
    if (token) {
        // Load user data
        const expiry = localStorage.getItem('did_auth_expiry');
        const isExpired = expiry && new Date(parseInt(expiry)) < new Date();
        
        if (isExpired) {
            // Token expired, clear it
            clearAuthData();
            preAuthSection.classList.remove('hidden');
            postAuthSection.classList.add('hidden');
            authStatusDiv.innerHTML = `
                <span class="text-red-500">Session expired</span>
            `;
            return;
        }
        
        // Show authenticated UI
        preAuthSection.classList.add('hidden');
        postAuthSection.classList.remove('hidden');
        authStatusDiv.innerHTML = `
            <span class="text-green-600 mr-2">Authenticated</span>
            <div class="w-2 h-2 rounded-full bg-green-500"></div>
        `;
        
        // Try to load user profile if we don't have it
        if (!userNameElement.textContent || userNameElement.textContent === 'Loading...') {
            loadUserProfile();
        }
    } else {
        // Show unauthenticated UI
        preAuthSection.classList.remove('hidden');
        postAuthSection.classList.add('hidden');
        authStatusDiv.innerHTML = `
            <span class="text-gray-500">Not authenticated</span>
        `;
    }
}

function saveAuthData(token, expirySeconds) {
    const expiryTimestamp = Date.now() + (expirySeconds * 1000);
    localStorage.setItem('did_auth_token', token);
    localStorage.setItem('did_auth_expiry', expiryTimestamp.toString());
}

function clearAuthData() {
    localStorage.removeItem('did_auth_token');
    localStorage.removeItem('did_auth_expiry');
    
    // Clear profile data
    userNameElement.textContent = 'Loading...';
    userEmailElement.textContent = 'Loading...';
    userDidElement.textContent = 'Loading...';
    userAddressElement.textContent = 'Loading...';
}

async function loadUserProfile() {
    const token = localStorage.getItem('did_auth_token');
    if (!token) return;
    
    try {
        const response = await fetch(`${CONFIG.AUTH_SERVER}/api/auth/userinfo`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        if (!response.ok) {
            throw new Error('Failed to load profile');
        }
        
        const userData = await response.json();
        
        // Update the UI with user data
        userNameElement.textContent = userData.name || 'Not provided';
        userEmailElement.textContent = userData.email || 'Not provided';
        userDidElement.textContent = userData.did || 'Not available';
        userAddressElement.textContent = userData.address || 'Not available';
    } catch (error) {
        console.error('Error loading profile:', error);
        
        // If unauthorized, clear the auth data
        if (error.message.includes('401')) {
            clearAuthData();
            updateAuthStatus();
        }
    }
}

// Event listeners
loginButton.addEventListener('click', function() {
    // Generate and store state for CSRF protection
    authState = generateState();
    localStorage.setItem('did_auth_state', authState);
    
    // Create authorization URL
    const authUrl = new URL(`${CONFIG.AUTH_SERVER}/api/auth/authorize`);
    authUrl.searchParams.append('client_id', CONFIG.CLIENT_ID);
    authUrl.searchParams.append('redirect_uri', CONFIG.REDIRECT_URI);
    authUrl.searchParams.append('state', authState);
    
    // Redirect to DID auth server
    window.location.href = authUrl.toString();
});

logoutButton.addEventListener('click', function() {
    clearAuthData();
    updateAuthStatus();
});

// Initialize the UI
updateAuthStatus();