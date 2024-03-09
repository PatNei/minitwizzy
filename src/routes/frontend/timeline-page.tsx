import type { FC } from 'hono/jsx'


function Timeline({ request, g, profile_user, messages }) {
  let title;
  if (request.endpoint === 'public_timeline') {
    title = 'Public Timeline';
  } else if (request.endpoint === 'user_timeline') {
    title = `${profile_user.username}'s Timeline`;
  } else {
    title = 'My Timeline';
  }

  return (
    <div>
      <h2>{title}</h2>
      {g.user && (
        <>
          {request.endpoint === 'user_timeline' && (
            <div className="followstatus">
              {g.user.user_id === profile_user.user_id ? (
                'This is you!'
              ) : followed ? (
                <>
                  You are currently following this user.
                  <Link className="unfollow" to={`/unfollow_user/${profile_user.username}`}>
                    Unfollow user
                  </Link>
                </>
              ) : (
                <>
                  You are not yet following this user.
                  <Link className="follow" to={`/follow_user/${profile_user.username}`}>
                    Follow user
                  </Link>
                </>
              )}
            </div>
          )}
          {request.endpoint === 'timeline' && (
            <div className="twitbox">
              <h3>What's on your mind {g.user.username}?</h3>
              <form action="/add_message" method="post">
                <p>
                  <input type="text" name="text" size="60" />
                  <input type="submit" value="Share" />
                </p>
              </form>
            </div>
          )}
        </>
      )}
      <ul className="messages">
        {messages.length > 0 ? (
          messages.map((message) => (
            <li key={message.id}>
              <img src={`https://www.gravatar.com/avatar/${message.email}?s=48`} alt="" />
              <p>
                <strong>
                  <Link to={`/user_timeline/${message.username}`}>{message.username}</Link>
                </strong>
                {message.text}
                <small>— {new Date(message.pub_date).toLocaleString()}</small>
              </p>
            </li>
          ))
        ) : (
          <li>
            <em>There's no message so far.</em>
          </li>
        )}
      </ul>
    </div>
  );
}

export default Timeline;
