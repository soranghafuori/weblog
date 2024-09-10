import React, { useEffect, useState } from "react";
import styles from "@/../styles/mainPage.module.css";
import Link from "next/link";


///// interface post for post get from query
interface Post {
  id: number;
  title: string;
  auther: string;
  subtitle: string;
  category: string;
  content: string;
  date:string;
}



function BlogPost({ post,postLength }:{post:Post; postLength:number}) {
  const [seensBlogsJson,setSeensBlogsJson] = useState<string[]>([])
  const [loading,setLoading] = useState(true)


///// get seenblogs from localstorage and parse to Json
  useEffect(()=>{
    const seensBlogs = localStorage.getItem('seenBlogs')
    if (seensBlogs) {
      const parsedSeensBlogs = JSON.parse(seensBlogs);
      setSeensBlogsJson(parsedSeensBlogs);
      setLoading(false)
    } else {
      setSeensBlogsJson([]); 
      setLoading(false)
    }
    
  },[])
  return (
    <>
    {loading?<></>:(
      <div className={styles.post}>
      <Link href={{ pathname: `/post/${post.id}`, query: { postLength } }} >
      {/* If there is a post ID in the presentation, the color of the post will change */}
        <div  className={seensBlogsJson.includes(String(post.id))?styles.active:styles.aactive}>
          <h3>{post.title}</h3>
          <h5>category : {post.category}</h5>
          <p>auther : {post.auther}</p>
        </div>
        <div  className={seensBlogsJson.includes(String(post.id))?styles.active:styles.aactive}>
          <p className={styles.subtitle}> {post.subtitle}</p>
        </div>
      </Link>
    </div>
    )}
      
    </>
  );
}

export default BlogPost;
