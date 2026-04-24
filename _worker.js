const LNURL_MAP = {
  jorgenclaw: 'enchanting-crocodile-1',
  scott: 'clever-otter-52',
};

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const match = url.pathname.match(/^\/.well-known\/lnurlp\/(.+)$/);

    if (match) {
      const user = match[1].toLowerCase();
      const rizfulUser = LNURL_MAP[user];
      if (rizfulUser) {
        const upstream = `https://rizful.com/.well-known/lnurlp/${rizfulUser}${url.search}`;
        const res = await fetch(upstream, { headers: { Accept: 'application/json' } });
        return new Response(res.body, {
          status: res.status,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
          },
        });
      }
    }

    // Trailing-slash redirect for directory paths (replaces _redirects behavior)
    if (!url.pathname.endsWith('/') && !url.pathname.includes('.')) {
      url.pathname += '/';
      return Response.redirect(url.toString(), 301);
    }

    return env.ASSETS.fetch(request);
  },
};
