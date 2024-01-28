# email-tracker
A browser extension that tracks the status of each email you send

## Setup
To deploy infrastructure to AWS using Terraform, we need to set some environment variables. First, rename `.env.example` to `.env` using `mv .env.example .env` and replace the comments with your own data. These includes:
1. AWS_ACCESS_KEY_ID: your AWS user key ID
2. AWS_SECRET_ACCESS_KEY: your AWS user secret access key
3. TF_VAR_AWS_REGION: the region you want your infrastructure to be deployed
4. TF_VAR_AWS_ACCOUNT_ID: your AWS account ID
5. TF_VAR_ENV: your environment (e.g., dev or prod)

After `.env` is configured, export all environment variables for Terraform by running:
```bash
. setup.sh
```
