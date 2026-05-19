const fs = require('fs');
fetch('https://mbvvsdlixtabnwvikqom.supabase.co/rest/v1/instagram_posts?select=*&limit=3', {
    headers: {
        'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1idnZzZGxpeHRhYm53dmlrcW9tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMyMjkxNzAsImV4cCI6MjA4ODgwNTE3MH0.jZnEufOCcvFBRynIT2CFsk8PwLq05txZzZ6e9aSAEHc',
        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1idnZzZGxpeHRhYm53dmlrcW9tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMyMjkxNzAsImV4cCI6MjA4ODgwNTE3MH0.jZnEufOCcvFBRynIT2CFsk8PwLq05txZzZ6e9aSAEHc'
    }
})
    .then(r => r.json())
    .then(data => {
        fs.writeFileSync('db_posts_snapshot.json', JSON.stringify(data, null, 2));
        console.log("WROTE DB JSON");
    })
    .catch(console.error);
