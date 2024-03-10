import { useState, type FC } from 'hono/jsx'
import { Timeline } from './component/timeline';
import {  getMessagesByUserId } from 'src/repositories/message-repository';
import { userDTO } from 'src/repositories/user-repository';
import { doesUserFollowUserId, followUserId, unfollowUserId } from 'src/repositories/follower-repository';
interface TimelineProps {
  loggedInUser: userDTO
  pageUserInformation: userDTO,
  isMyTimeline: boolean
}


export const UserTimeline: FC<TimelineProps> = async ({loggedInUser,pageUserInformation, isMyTimeline}:TimelineProps) => {
  const [currentPage,setCurrentPage] = useState(0) 
  const [isFollowing,setIsFollowing] = useState(await doesUserFollowUserId({whoId:loggedInUser.userId,whomId:pageUserInformation.userId}) !== undefined)
  const title = isMyTimeline ? "My Timeline" : `${pageUserInformation.username}'s Timeline`
  const [messages,setMessages] = useState(await getMessagesByUserId({userId:pageUserInformation.userId},100,currentPage))

  return (
    <div>
      <h2>{title}</h2>
        <div>
          {!isMyTimeline && <div>
            {isFollowing ? 
            <div>
            You are currently following this user.
            <span onMouseDown={async () => {
              await unfollowUserId({whoId: loggedInUser.userId,whomId:pageUserInformation.userId})
              setIsFollowing(false)
            }}
              >Unfollow {`${pageUserInformation.username}`}</span>
            </div> 
            : 
            <div>
              You are not yet following this user.
              <span onMouseDown={async () => {
              await followUserId({whoId: loggedInUser.userId,whomId:pageUserInformation.userId})
              setIsFollowing(true)
              }}>follow {`${pageUserInformation.username}`}</span>
            </div> 
            }
          </div>
          }
          {isMyTimeline && (
          <div className="twitbox">
              <h3>What's on your mind {pageUserInformation.username}?</h3>
              <form action="/add_message" method="post">
                <p>
                  <input type="text" name="text" size={60} />
                  <input type="submit" value="Share" />
                </p>
              </form>
            </div>
            )}
        </div>
      <Timeline messages={messages}/>
      <div>{`Page ${currentPage}`}</div>
      <button type='button' onClick={async () => {
        const tempCurrentPage =  currentPage + 32
        setCurrentPage(tempCurrentPage)
        const newMess = await getMessagesByUserId({userId:pageUserInformation.userId},32,tempCurrentPage)
        setMessages((current) => [...current,...newMess]) 
      }}>
        load more
      </button>
    </div>
  );
};


