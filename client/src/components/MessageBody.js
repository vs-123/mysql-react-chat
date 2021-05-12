import React from 'react';

const MessageBody = ({messageList}) => {
  return (
    <div className="messageBody">
      <ul id="messagesList">
        {
          messageList.map(message => {
            return <li className="messages">{message}</li>
          });
        }
      </ul>
    </div>
  );
}

export default MessageBody;