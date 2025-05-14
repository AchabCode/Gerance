import { createClient } from 'npm:@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { record } = await req.json();

    if (!record?.id || !record?.username) {
      throw new Error('Missing required data');
    }

    const { data: userData, error: userError } = await supabase.auth.admin.getUserById(record.id);
    if (userError) throw userError;

    const email = userData.user.email;
    if (!email) throw new Error('User email not found');

    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('RESEND_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'noreply@gerance.resend.dev',
        to: email,
        subject: 'Modification de votre pseudo',
        html: `
          <h2>Modification de votre pseudo</h2>
          <p>Votre pseudo a été modifié avec succès.</p>
          <p>Nouveau pseudo : <strong>${record.username}</strong></p>
          <p>Si vous n'êtes pas à l'origine de cette modification, veuillez nous contacter immédiatement.</p>
        `,
      }),
    });

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    });
  }
});