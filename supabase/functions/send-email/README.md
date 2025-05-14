# Send Email Function

This Edge Function sends email notifications when a user's username is changed.

## Environment Variables Required

- `SUPABASE_URL`: Your Supabase project URL
- `SUPABASE_SERVICE_ROLE_KEY`: Your Supabase service role key
- `RESEND_API_KEY`: Your Resend API key

## Usage

The function is triggered via a database webhook when a profile's username is updated.

## Setup

1. Create a Resend account and get your API key
2. Set up the environment variables in your Supabase project
3. Deploy the function
4. Create a database webhook in Supabase that triggers this function on profile updates