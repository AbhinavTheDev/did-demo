## For Registration of Client on Auth Server


```
curl -X POST http://localhost:3000/api/auth/clients 
    -H "Content-Type: application/json" 
    -d "{"name":"DID Demo Client",
    "redirectUris":["http://localhost:5500/callback.html"],
    "description":"A demo client for testing DID authentication"
    }"
```

### Send this request and you will get Client ID and Client Server in response
- Use your preferred API Tool - cURL or Postman
- Add those config secrets in your config.js file