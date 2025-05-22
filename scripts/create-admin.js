
// This is a helper script to create an admin user
// To use this:
// 1. Replace the email and password with your desired admin credentials
// 2. Run with Node.js: node scripts/create-admin.js

const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = "https://ftwsksupzbjbxsvfcbpl.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ0d3Nrc3VwemJqYnhzdmZjYnBsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc5MzQ3MjQsImV4cCI6MjA2MzUxMDcyNH0.h4JTnqgAZpfJIFJZfOS4urRTN0l9-MkFb-V25ozN74k";

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function createAdminUser() {
  // Change these values to your desired admin credentials
  const adminEmail = "admin@example.com";
  const adminPassword = "admin123";  // Use a strong password in production!
  
  try {
    // Step 1: Create the user
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: adminEmail,
      password: adminPassword,
    });
    
    if (authError) throw authError;
    
    console.log('User created:', authData.user.id);
    
    // Step 2: Update the user's role to admin in the profiles table
    const { error: updateError } = await supabase
      .from('profiles')
      .update({ role: 'admin' })
      .eq('id', authData.user.id);
    
    if (updateError) throw updateError;
    
    console.log('User role updated to admin');
    console.log('Admin creation successful!');
    console.log(`Email: ${adminEmail}`);
    console.log(`Password: ${adminPassword}`);
    
  } catch (error) {
    console.error('Error creating admin user:', error);
  }
}

createAdminUser();
