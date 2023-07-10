
import { Inter } from 'next/font/google'
import { useState , useEffect } from 'react'
import axios from 'axios';
import Typing from '@/components/Typing';


const inter = Inter({ subsets: ['latin'] })

export default function Home() {

  const [inputValue, setInputValue] = useState('');

  // chatLog is a array to hold all conversations
  const [chatLog , setChatLog] = useState([]);
  // when waiting for API response
  const[isLoading , setIsLoading] = useState(false);


  // sending prompt
  const handleSubmit=(e)=>{
    e.preventDefault();
    // console.log(inputValue);

    setChatLog((prevChatLog)=> [...prevChatLog , {type:'user' , message:inputValue}]);

    sendMessage(inputValue);
    setInputValue("");
    // console.log(process.env.API_KEY);
  }


  // getting data from OpenAI
  const sendMessage = (message)=>{
    const url = '/api/chat';
    // const headers = {
    //   'Content-type' : 'application/json',
    //   'Authorization' : `Bearer ${process.env.NEXT_PUBLIC_API_KEY}`,
    // };
    const data = {
      // model : "gpt-3.5-turbo",
      model: "gpt-3.5-turbo",
    messages: [{"role": "user", "content": message}]
    };

    setIsLoading(true);

    // sending POST request
    
      axios.post(url , data 
        // , {headers:headers}
        ).then((response)=>{
      console.log(response);
      setChatLog((prevChatLog)=>[...prevChatLog ,{"type" : "bot" , message : response.data.choices[0].message.content}]);
    setIsLoading(false);
    }).catch((error)=>{
      console.log(error);
      setIsLoading(false);
    })


  }

  return (
    <>
   <div className="container mx-auto max-w-[700px]">
      <div className="flex flex-col h-screen bg-gray-900">
        <h1 className="bg-gradient-to-r from-blue-500 to-purple-500 text-transparent bg-clip-text text-center py-3 font-bold text-6xl">GPT-Clone</h1>
        <div className="flex-grow p-6">
          <div className="flex flex-col space-y-4">
          {
        chatLog.map((message, index) => (
          <div key={index} className={`flex ${
            message.type === 'user' ? 'justify-end' : 'justify-start'
            }`}>
            <div className={`${
              message.type === 'user' ?"chat-start" : 'chat-end'
            } rounded-lg p-4 text-white max-w-sm "chat `}>
            <div className="chat-header font-semibold text-blue-400">{message.type}</div>
           <div className="chat-bubble ">{message.message}</div> 
            </div>
            </div>
        ))
            }
            {
              isLoading &&
              <div key={chatLog.length} className="flex justify-start">
                  <div className="bg-gray-800 rounded-lg p-4 text-white max-w-sm">
                    <Typing/>
                  </div>
              </div>
            }
      </div>
        </div>
        <form onSubmit={handleSubmit} className="flex-none p-6">
          <div className="flex rounded-lg border border-gray-700 bg-gray-800">  
        <input type="text" className="flex-grow px-4 py-2 bg-transparent text-white focus:outline-none" placeholder="Type your message..." value={inputValue} onChange={(e) => setInputValue(e.target.value)} />
            <button type="submit" className="bg-purple-500 rounded-lg px-4 py-2 text-white font-semibold focus:outline-none hover:bg-purple-600 transition-colors duration-300">Send</button>
            </div>
        </form>
        </div>
    </div>
    </>
  )
}
