# Login
The entry point of the frontend should be the `/login` endpoint. Here there will be a classical login form, with the addition (button) 
of using the TLS Client Auth.

# Home
The `/home` endpoint should show the user information after the login.

There should be a button for requesting a certificate if the user doesn't have one already.

There should be a button for revoking all the user certs.

There should be a button (maybe hidden from regular users) to show the admin panel

# Certificate
`/certificate` for issuing and downloading a PKCS12 certificate (maybe an endpoint for this is like overkill)

# Revoke
`/revoke` maybe for revoking the cert. Again an endpoint is maybe too much

# Admin
`/admin` panel to show number of issued certs, number of revoked certs and current serial. Client certificate is requested to this end.