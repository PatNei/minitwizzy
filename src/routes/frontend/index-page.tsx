import { Hono } from 'hono'
import { Navbar } from './component/navbar';
import { UserTimeline } from './user-timeline-page';
import { html } from 'hono/html';

declare module "hono" {
	interface ContextRenderer {
		(content: string | Promise<string>, head: { title?: string }): Response | Promise<Response>;
	}
}


const app = new Hono()


app.use('*', async (c, next) => {
  c.setRenderer((content, head) => {
    const title = head.title
    const docstring = html`<!doctype html>`
    return c.html(<>
      {docstring}
      <html lang='en'>
        <head>
          <title>{title ? `${title} | ` : "" }Minitwizzy </title>
        </head>
        <body style={""}>
          <div style="max-width: 400px; margin: auto; padding:0 10px;">
          <Navbar />
          {title && <header style={"min-width:full; text-align:center; margin: 0 auto;"}><h1>{title}</h1></header>}
          <div>
            {content}
          </div>
          <footer style={"position: absolute; bottom: 0px; margin: 0 auto; height:2.5rem ;"}>MiniTwizzy — A Flask Application</footer>
          </div>
        </body>
      </html>
      </>
    )
  })
  await next()
})


app.get('/', (c) => {
  return c.render(<h1>Front Page</h1>,{title:"Frontpage"})
})
app.get('/:username', (c) => {
  const username = c.req.param("username")
  return c.render(<UserTimeline username={`${username}`}/>,{})
})
export default app;