# AXT Prop Tech

A mono repository for all related development

# Apps

Our applications

At current state, there are

- Backoffice: The administration app for internal operations
- Wallet: The PWA wallet for the customers
- Landing: The landing/home page

# Packages

Reusable and commonly shared units among the apps

- db: All the database (primsa/planetscale) stuff
- core: A lib to be used amonng the apps

# Smart Contracts

Signum SmartC Contracts

# Development

## Initial Development Setup

- On root directory, execute `yarn build`
- On root directory, Install dependencies by executing `yarn`
- On any `app` directory, execute `yarn dev` in order run development enviroment

## Running Locally

Each app comes with its own `.env.example` file.
Copy to `.env` or `.env.local` and adjust accordingly.

All apps can be locally started using `yarn dev`

# Deployment

As all is integrated on Vercel, deployements are triggered by pushes to the branches,
i.e. at this time of writing to `main` means production, `development` means staging
