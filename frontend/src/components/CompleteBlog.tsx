import { Blog } from "@/hooks"
import { Appbar } from "./Appbar"
import { Avatar } from "./BlogCard"
import clap from "@/assets/clapping.png"
import filledCap from "@/assets/filledclapping(1).png"
import comment from  "@/assets/bubble-chat.png"
import { useState, useEffect } from "react";
import axios from "axios";
import { BACKEND_URL } from "@/config";

export const CompleteBlog = ({ blog }: { blog: Blog }) => {
  const formatDate = (isoDateString: string): string => {
    const date = new Date(isoDateString);
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    };
    return date.toLocaleString(undefined, options);
  };

  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState<number>(0); // State to hold the like count
  const [toggleComponent,setIsToggleComponent]= useState(false); // State  to manage state section visibility 
  const OntoggleComment = () => {
    setIsToggleComponent(!toggleComponent);
  }

  useEffect(() => {
    const token = localStorage.getItem('token'); // Retrieve JWT token from localStorage
      if (!token) {
        throw new Error('Authentication token not found');
      }
    // Fetch the like count when the component mounts
    const fetchLikeCount = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}/api/v1/${blog.id}/likeCount`,{
          headers :{
            Authorization: token,
          }
        });
        setLikeCount(response.data.likeCount);
      } catch (error) {
        console.error('Error fetching like count:', error);
      }
    };

    fetchLikeCount();
  }, [blog.id]); // Fetch like count when blog id changes

  const handleClick = async (event: { stopPropagation: () => void; preventDefault: () => void; }) => {
    event.stopPropagation(); // Prevent link navigation from bubbling up
    event.preventDefault();
    setIsLiked(!isLiked);
    try {
      const token = localStorage.getItem('token'); // Retrieve JWT token from localStorage
      if (!token) {
        throw new Error('Authentication token not found');
      }
      if (!isLiked) {
        await axios.post(
          `${BACKEND_URL}/api/v1/${blog.id}/like`,
          null,
          {
            headers: {
              Authorization: token,
            }
          }
        );
        setLikeCount(likeCount + 1); // Update like count
      } else {
        const token = localStorage.getItem('token');
        await axios.delete(
          `${BACKEND_URL}/api/v1/dislike/${blog.id}`,
          {
            headers: {
              Authorization: token,
            }
          }
        );
        setLikeCount(likeCount - 1); // Update like count
      }
    } catch (error) {
      console.error('Error handling like:', error);
    }
  }
  // const transformValue = toggleComponent ? 'translateX(0)' : 'translateX(-100%)';
  return (
    <div >
      <div className={`${toggleComponent ? 'opacity-50 ' : ''}`} >
      <Appbar onSearch={() => { }}  />
      </div>
      <div className={`flex justify-center `}>
        <div className="grid grid-cols-12 px-10 w-full pt-200 max-w-screen-xl pt-12">
          <div className="col-span-8 mr-4">
            <div className={`${toggleComponent ? 'opacity-50 ' : ''}`}>
            <div className="text-5xl font-extrabold">
              {blog.title}
            d</div>
            <div className="text-slate-500 pt-2">
              {`post on ${blog.publishedDate ? formatDate(blog.publishedDate.toLocaleString()) : "2 March 2024"}`}
            </div>
            <div className="pt-4 mb-6" dangerouslySetInnerHTML={{ __html: blog.content }} />
            <div className="flex gap-8">
              {/* Like section  */}
            <div className="like mb-10 flex gap-2 cursor-pointer" onClick={handleClick}>
              <img src={isLiked ? filledCap : clap} alt="" className="w-7 h-auto cursoer-pointer" />
              <div className="text-slate-500 hover:text-slate-600">{likeCount} {likeCount > 1 ? 'claps' : 'clap'} </div>
            </div>
            {/* Comment section */}
            <div className="comment mb-10 flex gap-2 cursor-pointer" onClick={OntoggleComment}>
              <img src={comment} alt="comment" className="w-7 h-auto cursoer-pointer"/>
              <div className="text-slate-500 hover:text-slate-600">4</div>
            </div>
            </div>
            </div>


      {toggleComponent && (
        <div className={`fixed top-0 right-0 h-full box-border overflow-auto bg-white p-8 flex flex-col justify-start transition-transform duration-100 ${toggleComponent ? 'transform translate-x-0' : 'transform -translate-x-full'}`} style={{zIndex:540,width:412 ,boxShadow: 'rgba(0, 0, 0, 0.25) 0px 54px 55px, rgba(0, 0, 0, 0.12) 0px -12px 30px, rgba(0, 0, 0, 0.12) 0px 4px 6px, rgba(0, 0, 0, 0.17) 0px 12px 13px, rgba(0, 0, 0, 0.09) 0px -3px 5px'  }}>
          {/* Your comment section UI */}
          <div className="mb-10">
            <h1>Response:</h1>
          </div>
          <textarea
            placeholder="Write your comment here..."
            className="w-full h-32 border border-gray-300 rounded p-2"
          />
          <button className="mt-2 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">
            Post Comment
          </button>
        </div>
      )}
          </div>
          {/* Hide when comment card is open */}
         { !toggleComponent &&  (<div className="col-span-4 ml-14" >
            <div className="text-slate-600 text-lg" >
              Author
            </div>
            <div className="flex w-full">
              <div className="pr-4 flex flex-col justify-center">
                <Avatar name={blog.author.name || "Anonymous"} />
              </div>
              <div>
                <div className="text-xl font-bold">
                  {blog.author.name || "Anonymous"}
                </div>
                <div className="pt-2 text-slate-500">
                  Random catch phrase about the author's ability to grab the user's attention
                </div>
              </div>
            </div>
          </div>)}
        </div>
      </div>
    </div>
  );
};

