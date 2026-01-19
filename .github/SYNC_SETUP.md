# Public Repo Sync Setup

This workflow automatically syncs sanitized code from this private repo to a public repo.

## Setup Steps

### 1. Create the public repository

Create an empty public repo on GitHub (e.g., `hypermem`).

### 2. Generate SSH deploy key

```bash
ssh-keygen -t ed25519 -C "sync-public" -f ./deploy_key -N ""
```

This creates:
- `deploy_key` (private key)
- `deploy_key.pub` (public key)

### 3. Add public key to PUBLIC repo

Go to **public repo** → Settings → Deploy keys → Add deploy key
- Title: `sync-from-private`
- Key: contents of `deploy_key.pub`
- Check "Allow write access"

### 4. Add private key to PRIVATE repo

Go to **private repo** → Settings → Secrets and variables → Actions → New repository secret
- Name: `PUBLIC_REPO_DEPLOY_KEY`
- Value: contents of `deploy_key`

### 5. Add repository variables to PRIVATE repo

Go to **private repo** → Settings → Secrets and variables → Actions → Variables tab

Add these variables:
- `PUBLIC_REPO_OWNER` - GitHub username or org (e.g., `andrewlyjew`)
- `PUBLIC_REPO_NAME` - Public repo name (e.g., `hypermem`)
- `GIT_USER_EMAIL` - Your git email
- `GIT_USER_NAME` - Your git name

### 6. Delete the key files

```bash
rm deploy_key deploy_key.pub
```

## How It Works

1. Push to `main` branch triggers the workflow
2. Workflow checks out code
3. Removes files/folders listed in `.public-ignore`
4. Pushes remaining code to public repo

## Manual Trigger

You can also trigger sync manually:
- Go to Actions → Sync to Public → Run workflow

## Customizing Exclusions

Edit `.public-ignore` to add/remove files from public repo.

```
# Example patterns
internal/           # folder
scripts/seed.ts     # specific file
*.draft             # glob pattern
```
