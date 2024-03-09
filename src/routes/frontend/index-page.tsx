import { Hono } from 'hono'
import { Navbar } from './component/navbar';
import { UserTimeline } from './user-timeline-page';
import { html } from 'hono/html';
import { getUser, userDTO } from 'src/repositories/user-repository';
import { HTTPException } from 'hono/http-exception';
import { customHonoLogger } from 'src/middleware/logging-middleware';
import { Timeline } from './component/timeline';
import { getAllMessages } from 'src/utility/rpc-util';
declare module "hono" {
	interface ContextRenderer {
		(content: string | Promise<string>, head:siteBaseLayoutProps): Response | Promise<Response>;
	}
}

type siteBaseLayoutProps = {
  title?:string
}


const app = new Hono()

app.onError(async (err,c) => {
  if (err instanceof HTTPException) {
		customHonoLogger(`HTTP Exception(frontend): ${err.status} ${err.message}`);
		return c.render("", {
			title: `${err.status} - ${err.message}`,
		});
	}
	customHonoLogger(err.message);
	return c.render("", { title: "500 - Something went wrong" });
})
app.use('*', async (c, next) => {
  c.setRenderer((content, head) => {
    const title = head.title
    const docstring = html`<!doctype html>`

    return c.html(
  <>
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
        </div>
        <footer>MiniTwizzy — A Flask Application</footer>
      </body>
    </html>
  </>
    )
  })
  await next()
})


app.get('/', async (c) => {
  const messages = await getAllMessages(32,0)
  return c.render(<>
    <Timeline messages={messages} />
    </>
  ,{title:"All Twizzies"})
})


app.get('/:username', async (c) => {
  const usernameParam = c.req.param("username")
  const loggedInUser:userDTO = {userId:0,username:""}
  if(!loggedInUser) return c.redirect("/register")
  const user = await getUser({username:usernameParam})

  if(!user) throw new HTTPException(404,{message:"User not found!"})

  return c.render(<UserTimeline loggedInUser={loggedInUser} pageUserInformation={user} isMyTimeline={loggedInUser.userId === user.userId}/>,{})
})
export default app;