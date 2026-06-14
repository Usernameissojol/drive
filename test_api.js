async function test() {
  const driveId = '1weG-ycvbYqVfSdGpXLh7hQp2kSzHFIvw';
  const apiKey = '2328a4b69080a0475f1dfac6e00437e9';
  
  const urls = [
    `http://new.drivecloud.cc/api/v1/${apiKey}/${driveId}`,
    `https://new.drivecloud.cc/api/v1/${apiKey}/${driveId}`,
  ];

  for (const url of urls) {
    console.log(`\nFetching: ${url}`);
    try {
      const resp = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
      console.log(`Status: ${resp.status}`);
      const text = await resp.text();
      console.log(`Response (first 500 chars):`);
      console.log(text.slice(0, 500));
    } catch (err) {
      console.error(`Error:`, err.message);
    }
  }
}

test();
