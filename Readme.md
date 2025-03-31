## DID Authentication Demo
This project demonstrates how to implement Decentralized Identity (DID) authentication in a web application, allowing users to authenticate using their DID credentials.

### Overview
The DID Authentication Demo is a client-side web application that integrates with a DID authentication server to provide:

- User authentication via DID
- Retrieval and display of user profile information
- Session management
- Secure authentication flow with CSRF protection

### Getting Started
#### Prerequisites
- A web server to host the static files
- Client registration with the DID Auth Server
#### Setup Instructions
1. Register your client with the DID Auth Server
Use the following cURL command to register your client:
```cURL
curl -X POST https://did-green.vercel.app/api/auth/clients \
  -H "Content-Type: application/json" \
  -d '{
    "name": "DID Demo Client",
    "redirectUris": ["http://localhost:5500/callback.html"],
    "description": "A demo client for testing DID authentication"
  }'
```
You'll receive a `client_id` and `client_secret` in the response.

2. Configure your application
Update the `config.js` file with your credentials:
```
const CONFIG = {
  AUTH_SERVER: 'https://did-green.vercel.app',
  CLIENT_ID: 'your_client_id_here', 
  CLIENT_SECRET: 'your_client_secret_here',
  REDIRECT_URI: 'http://localhost:5500/callback.html'
};
```
Make sure your `REDIRECT_URI` matches one of the URIs you registered.

3. Host your application
Serve the files using a local development server (like Live Server in VS Code) or deploy to your hosting provider.

#### Authentication Flow
1. User Initiates Login
- User clicks "Sign in with DID" button on the `index.html` page
- The application generates a state parameter for CSRF protection
- The user is redirected to the DID Auth Server
2. DID Authentication
- User authenticates with their DID on the auth server
- Upon successful authentication, the server redirects back to the `callback.html` page with an authorization code
3. Token Exchange
- The callback page exchanges the authorization code for an access token
- The token and its expiry time are stored in local storage
4. User Profile Retrieval
- The application uses the token to fetch the user's profile information
- User information (name, email, DID, address) is displayed on the main page
#### File Structure
- `index.html` - Main application page with login interface
- `callback.html` - OAuth callback handler
- `config.js` - Application configuration
- `auth.js` - Authentication logic
#### Security Considerations
The demo implements several security best practices:

- CSRF protection using state parameters
- Token expiration handling
- Secure storage of credentials
- Error handling for authentication failures

#### Troubleshooting
If you encounter authentication issues:

1. Check that your `client_id` and `redirect_uri` are correctly configured
2. Verify that your client is properly registered with the auth server
3. Check the browser console for detailed error messages
4. Use the debug panel to inspect the current authentication state

#### Next Steps
This demo provides a basic implementation of DID authentication. Our Future considerations are:

- Adding additional security measures
- Implementing token refresh logic
- Creating a more robust error handling system
- Adding additional user profile management features