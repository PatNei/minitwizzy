import { messageDTO } from "src/repositories/message-repository"
import { msgRPCDTO } from "src/utility/rpc-util"

export const Timeline = ({messages}:{messages:msgRPCDTO}) => {
return (<>
<ul className="messages">
        {messages.length > 0 ? (
          messages.map((message) => (
            <li key={message.messageId}>
              <img src={`https://www.gravatar.com/avatar/${message.email}?s=48`} alt="" />
              <p>
                <strong>
                  <a href={`/user_timeline/${message.username}`}>{message.username}</a>
                </strong>
                {message.text}
                <small>— {new Date(message.pubDate ?? 0).toLocaleString()}</small>
              </p>
            </li>
          ))
        ) : (
          <li>
            <em>There's no message so far.</em>
          </li>
        )}
      </ul>

</>)

}