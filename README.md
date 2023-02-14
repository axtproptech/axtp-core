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

## Initial setup

Just run `yarn` and you are up

## Running Locally

Each app comes with its own `.env.example` file.
Copy to `.env` or `.env.local` and adjust accordingly.

All apps can be locally started using `yarn dev`

# Deployment

As all is integrated on Vercel, deployements are triggered by pushes to the branches,
i.e. at this time of writing to `main` means production, `development` means staging
