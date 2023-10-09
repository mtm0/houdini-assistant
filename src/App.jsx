import { useState } from 'react'
import './App.css'
import'@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
import { MainContainer, ChatContainer, MessageList, Message, MessageInput, TypingIndicator } from "@chatscope/chat-ui-kit-react"

const API_KEY = "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";


function App() {
  const [typing, setTyping] = useState(false);
  const [messages, setMessages] = useState([
    {
      message: "Yep, my name is Houdini how can I help you today?",
      sender: "Houdini"
    }
  

  ]) // []


  const handleSend = async (message) => {
    const newMessage = {
      message: message,
      sender: "user",
      direction: "outgoing"
    }


    const newMessages = [...messages, newMessage]; // old message + new messages being generated via response


    // update our messages state
    setMessages(newMessages);


    //set a typing indicator for Houdini ex. Houdini ...
    setTyping(true);



    // process message to Houdini
    await processMessageToHoudini(newMessages);



  }

  async function processMessageToHoudini(chatMessages) {

    let apiMessages = chatMessages.map((messageObject) => {
      let role = "";
      if(messageObject.sender === "Houdini") {
        role = "assistant"
      } else {
        role = "user"
      }
      return { role: role, content: messageObject.message}
    });


    const systemMessage = {
      role: "system",
      content: "Your name is now Houdini. Talk casually, make wise cracks every once in a while, while also remaining useful to the user. "
    }



    const apiRequestBody = {
      "model": "gpt-4",
      "messages": [
        systemMessage, 
        ...apiMessages
      ]
    }

    await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": "Bearer " + API_KEY,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(apiRequestBody)
    }).then((data) => {
      return data.json();
    }).then((data) => {
      console.log(data);
      console.log(data.choices[0].message.content);
      setMessages(
        [...chatMessages, {
          message: data.choices[0].message.content,
          sender: "Houdini"
        }]
      );
      setTyping(false);
    });
  }
  

  return (
      <div className="App">
        <div style={{position: "relative", height: "800px", width: "700px"}}>
        <MainContainer>
            <ChatContainer>
              <MessageList
              scrollBehavior='smooth'
              typingIndicator={typing ?<TypingIndicator content="Houdini is typing"/> : null}
              >
                {messages.map((message, i) => {
                  return <Message key={i} model={message} />
                })}
              </MessageList>
                
              <MessageInput placeholder='Type message here' onSend={handleSend}/>
            </ChatContainer>
          </MainContainer>

        </div>
      </div>
      
    
  )
}


export default App
