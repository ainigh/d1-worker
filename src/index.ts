import { renderHtml } from "./renderHtml";




export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const db = env.DB;

    if (url.pathname === '/api/maps' && request.method === 'GET') {
      const r = await db.prepare('SELECT * FROM maps ORDER BY updated_at DESC').all();
      return Response.json(r.results);
    }

    if (url.pathname === '/api/maps' && request.method === 'PUT') {
      const { id, name, data, settings } = await request.json();
      await db.prepare(
        'INSERT OR REPLACE INTO maps (id,name,data,settings,updated_at) VALUES (?,?,?,?,?)'
      ).bind(id, name, data, settings, Date.now()).run();
      return Response.json({ ok: true });
    }

    if (url.pathname.startsWith('/api/maps/') && request.method === 'DELETE') {
      const id = url.pathname.split('/').pop();
      await db.prepare('DELETE FROM maps WHERE id=?').bind(id).run();
      return Response.json({ ok: true });
    }
    if (url.pathname.startsWith('/') && request.method === 'DELETE') {
 return new Response(renderHtml(JSON.stringify(results, null, 2)), {
			headers: {
				"content-type": "text/html",
			},
		});
    }
    return new Response('Not found', { status: 404 });
  }
} satisfies ExportedHandler<Env>;
