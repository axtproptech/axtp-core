# AUTH0 Setup

This document explains the configuration for Auth0.
Auth0 is used as access for the Backoffice and the Exclusive Area of the Landing Page.

## Tenants and Connections

Each environment has its own tenant on Auth0, i.e. production and dev/staging environment are hard separated tiers.
Each tenant uses different connections for either Backoffice, and Landing Page Exclusive Area.
Each connection stands for a Authentication Database managed ny Auth0

- [Create Tenants](https://auth0.com/docs/get-started/auth0-overview/create-tenants)

## Backoffice

The backoffice can only be accessed by AXTPeers. It's highly restricted to authorized personnel only.
User Creation is done manually in Auth0.

### Application Configuration

**_Application URIs_**

<u>Application Login URI</u>

`https://backoffice-staging.axtp.com.br/admin`

> This is needed to give the new customer a direct link to the Exclusive Area page within the Passwort Setup.

<u>Allowed Callback URLs</u>

```
http://localhost:3000/admin, // just used for dev
http://localhost:3000/api/auth/callback/auth0, // just used for dev
https://backoffice-staging.axtp.com.br/admin,
https://backoffice-staging.axtp.com.br/api/auth/callback/auth0
```

<u>Allowed Callback URLs</u>

```
https://backoffice-staging.axtp.com.br/
```

<u>Allowed Web Origins</u>

```
https://backoffice-staging.axtp.com.br,
http://localhost:3000 // just used for dev
```

### Connection Configuration

Under `Authentication > Database` set the following:

Settings:

- Disable "Requires Username"
- Disable "Sign Ups" - because Users are not allowed to sign up by themselves. Access is granted exclusively!!

Password Policy:
According the desired requirements

Applications:
Activate for

- Backoffice Page Application
- Auth0 Management API Application

### User Creation for Exclusive Area

When verifying a customer in the backoffice, a new Auth0 user gets created in the Exclusive Area and the customer
gets a Welcome Email including a link to set/change a password for the Exclusive Area. For this flow a specific configuration is necessary.

#### Environment Variables

```
#######################################
  The Auth0 Configuration
#######################################

# APPLICATION BACKOFFICE
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=<secret>
NEXT_SERVER_AUTH0_CLIENT_ID=<id>
NEXT_SERVER_AUTH0_CLIENT_SECRET=<secret>
NEXT_SERVER_AUTH0_ISSUER=<issuer>
NEXT_SERVER_AUTH0_CONNECTION=<connection>

# APPLICATION MACHINE-2-MACHINE Application to allow remote user creation
NEXT_SERVER_AUTH0_API_CLIENT_ID=<machine-to-machine-client-id>
NEXT_SERVER_AUTH0_API_CLIENT_SECRET=<machine-to-machine-client-secret>

# APPLICATION LANDING PAGE
NEXT_SERVER_AUTH0_LANDING_CONNECTION=<landing-page-connection>
NEXT_SERVER_AUTH0_LANDING_CLIENT_ID=<landing-page-client-id>
```

The configuration is organized in Auth0 Applications. This means three Applications need to be created.

> The examples are related to the staging environment... but production environment has to be configured analogously

##### Application Backoffice

This section is for the authorized personnel of the Backoffice.
So, set the basic information in Auth0 according your needs, i.e. name, logo, etc

<u>Application URIs</u>

The following settings are required

- Application Login URI: _can be empty_

##### Application Machine-2-Machine

This section is about setting an M2M Application to use the Auth0 Management API

The application basic Settings don't need specific settings, but the APIs scopes must be set.
The application needs to be connected to the Landing Page Connection (`Authentication > Database`)!

Set APIs to `Auth0 Management API` and activate the following permissions (scopes):

- `update:users`
- `read:users`
- `create:users`
- `create:user_tickets`

##### Application Landing Page

This section is for verified customers, which gain access to the exclusive area on the landing page.
So, set the basic information in Auth0 according your needs, i.e. name, logo, etc

**_Application URIs_**

<u>Application Login URI</u>

`https://staging.axtp.com.br/exclusive`

> This is needed to give the new customer a direct link to the Exclusive Area page within the Passwort Setup.

<u>Allowed Callback URLs</u>

```
https://staging.axtp.com.br/exclusive,
https://staging.axtp.com.br/api/auth/callback/auth0,
http://localhost:3000/admin, // just used for dev
http://localhost:3000/api/auth/callback/auth0 // just used for dev
```

<u>Allowed Callback URLs</u>

```
https://staging.axtp.com.br/
```

<u>Allowed Web Origins</u>

```
https://staging.axtp.com.br,
http://localhost:3000 // just used for dev
```

Further Settings can be kept with default values.

## Exclusive Area

The Landing Page's Exclusive Area

### Application Configuration

See [Application Landing Page](#Application-Landing-Page)

### Connection Configuration

Under `Authentication > Database` set the following:

Settings:

- Disable "Requires Username"
- Disable "Sign Ups" - because Users are not allowed to sign up by themselves. Access is granted exclusively!!

Password Policy:
According the desired requirements

Applications:
Activate for

- Landing Page Application
- Auth0 Management API Application

### Branding Configuration

#### In Branding > Email Templates:

- Disable `Verification Email (Using Link)`
- Disable `Welcome Emeil`

For other templates customize accordingly. Email sender is `support@axtp.com.br`

> A custom Email Provider must be configured: https://auth0.com/docs/customize/email/smtp-email-providers

#### In Branding > Email Provider

Select generic `SMTP Provider` and fill out the settings:

- From: `support@axtp.com.br`
- Host: `smtp.gmail.com`
- Port: `587`
- Username and Password using ["Less Secure"](https://support.google.com/accounts/answer/6010255?hl=en#zippy=%2Cif-less-secure-app-access-is-off-for-your-account) settings in gmail.

## Action Flow Configuration

In the _Login_ Flow we need to create a custom action that adds the customer id (`cuid`) to user meta data.
The action needs to be added after `User Logged In`

The code is:

```js
/**
 * Handler that will be called during the execution of a PostLogin flow.
 *
 * @param {Event} event - Details about the user and the context in which they are logging in.
 * @param {PostLoginAPI} api - Interface whose methods can be used to change the behavior of the login.
 */
exports.onExecutePostLogin = async (event, api) => {
  const namespace = "axtp.com.br";
  const { cuid } = event.user.user_metadata;

  if (event.authorization && cuid) {
    // Set claims
    api.idToken.setCustomClaim(`${namespace}/cuid`, cuid);
  }
};
```
