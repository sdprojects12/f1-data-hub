(async () => {
  try {
    const url = 'https://api.openf1.org/v1/sessions?year=2026&session_type=Race';
    const res = await fetch(url);
    console.log('status', res.status);
    console.log('content-type', res.headers.get('content-type'));
    const txt = await res.text();
    console.log('body preview:', txt.slice(0, 800));
  } catch (err) {
    console.error('fetch error', err && err.message ? err.message : err);
  }
})();
