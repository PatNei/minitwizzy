import type { FC } from 'hono/jsx'
interface TimelineProps {
  username?:string
}


export const UserTimeline: FC<TimelineProps> = ({username}:TimelineProps) => {
  const currentLoggedInUser = ""
  const isFollowing = false
  const isMyTimeline = username === currentLoggedInUser
  const title = isMyTimeline ? "My Timeline" : `${username}'s Timeline`
  const messages:{id:number,email:string,username:string,text:string,pub_date:number}[] = []
  return (
    <div>
      <h2>{title}</h2>
      {currentLoggedInUser &&
        <div>
          {!isMyTimeline && <div>
            {isFollowing ? 
            <div>
            You are currently following this user.
            <span onMouseDown={() => {
              console.log("Unfollowed user")}}>Unfollow {`${username}`}</span>
            </div> 
            : 
            <div>
              You are not yet following this user.
              <span onMouseDown={() => {
                console.log("Unfollowed user")}}>follow {`${username}`}</span>
            </div> 
            }
          </div>
          }
          {isMyTimeline && (
          <div className="twitbox">
              <h3>What's on your mind {username}?</h3>
              <form action="/add_message" method="post">

                <p>
                  <input type="text" name="text" size={60} />
                  <input type="submit" value="Share" />
                </p>
              </form>
            </div>
            )}
        </div>
      }
      <ul className="messages">
        {messages.length > 0 ? (
          messages.map((message) => (
            <li key={message.id}>
              <img src={`https://www.gravatar.com/avatar/${message.email}?s=48`} alt="" />
              <p>
                <strong>
                  <a href={`/user_timeline/${message.username}`}>{message.username}</a>
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
};


