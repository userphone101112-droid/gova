# Deploy Key Setup Guide - gova

## Public Key (Add this to GitHub)

Go to: `Settings > Deploy keys > Add deploy key`

Direct link: https://github.com/userphone101112-droid/gova/settings/keys

Add the following public key:

```
ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIDf2V5QqX1MlNsLR+mas0J/bLMVhIf2x4/EUFQBB1EO2 hesham@DESKTOP-UA52GFH
```

**Make sure to enable "Allow write access"** to allow push operations.

---

## Setup Steps

### 1. Run the automated setup script:

```powershell
.\setup-deploy-key.ps1 -Setup
```

### 2. Update git remote to use the deploy key (done automatically by the script):

```powershell
# Set remote to SSH alias
git remote set-url origin "git@github.com-gova:userphone101112-droid/gova.git"

# Revert back to HTTPS if needed
git remote set-url origin "https://github.com/userphone101112-droid/gova.git"
```

### 3. Test the connection:

```powershell
.\setup-deploy-key.ps1 -Test
# Or directly:
ssh -T git@github.com-gova
```

---

## Files Used

- `.git_deploy_key` — Private key (keep secret, never share)
- `.git_deploy_key.pub` — Public key (add to GitHub)
- `.ssh_config` — Local SSH host configuration

---

## Security Notes

- Keys are stored locally within the project directory
- No global Windows SSH configuration required
- Project is portable — copy keys to any machine and it works
- Private key `.git_deploy_key` is already listed in `.gitignore`
- Never commit or share the private key file
