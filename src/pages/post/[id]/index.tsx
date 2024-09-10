import React, { useEffect } from "react";
import { useRouter } from "next/router";
import { useState } from "react";
import MainLayout from "@/layouts/MainLayout";
import styles from "@/../styles/post.module.css";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import remarkBreaks from "remark-breaks";
import rehypeRaw from "rehype-raw";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github.css";
import Link from "next/link";
import { GrNext } from "react-icons/gr";
import { GrPrevious } from "react-icons/gr";
import Loading from "@/components/Loading";
import { MdEditor } from "md-editor-rt";
import "md-editor-rt/lib/style.css";
import styles2 from "@/../../styles/addPost.module.css";
import AlertTitle from "@mui/material/AlertTitle";
import Alert from "@mui/material/Alert";
import Head from "next/head";

////// interface Blog for blogdata state
interface Blog {
  id: number;
  title: string;
  auther: string;
  subtitle: string;
  category: string;
  content: string;
  date:string;
}

///// type alertcolor for severity alert component
type AlertColor = 'error' | 'info' | 'success' | 'warning';
///// interface alertdata for alertdata state
interface AlertData {
  message: string;
  status: AlertColor;
}

function Post() {
  const router = useRouter();
  const [id, setId] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [blogdata, setBlogdata] = useState<Blog | undefined>(undefined);
  const [notFound, setNotFound] = useState(false);
  const [postLength, setPostLength] = useState<number | undefined>(undefined);

  const [editPost, setEditPost] = useState(false);
  const [content, setContent] = useState('');
  const [title, setTitle] = useState("");
  const [auther, setAuther] = useState("");
  const [category, setCategory] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [alert, setAlert] = useState(false);
  const [alertData,setAlertData] = useState<AlertData>({ message: "Please Enter All Information", status: 'error' })


///// get id post from router.query and postsLength
  useEffect(() => {
    if (router.isReady && router.query.id) {
      setId(router.query.id as string);
      const lengthValue = router.query.postLength;
      if (typeof lengthValue === 'string') {
        const numericLength = parseInt(lengthValue, 10); 
        setPostLength(isNaN(numericLength) ? undefined : numericLength); 
      }
      if (Array.isArray(lengthValue)) {
        const numericLength = parseInt(lengthValue[0], 10);
        setPostLength(isNaN(numericLength) ? undefined : numericLength);
      }
///// get data post
      axios.get(`/api/posts?id=${router.query.id}`).then((res) => {
        setBlogdata(res.data);
        if (res.data.variant == "error") {
          setNotFound(true);
        }
        setLoading(false);
      });
    }
///// get seenBlogs on localstotrage . and add id on seenBlogs 
    const seenBlogs = localStorage.getItem("seenBlogs");
    if (seenBlogs && id) {
      let seenblogsJson = JSON.parse(seenBlogs);
      if (!seenblogsJson.includes(id)) {
        seenblogsJson.push(id);
      }
      localStorage.setItem("seenBlogs", JSON.stringify(seenblogsJson));
    }
    if (!seenBlogs && id) {
      localStorage.setItem("seenBlogs", JSON.stringify([id]));
    }
  }, [router.isReady, router.query.id, id]);


///// Hide the alert after 3s showing it
  useEffect(() => {
    setTimeout(() => {
      setAlert(false);
    }, 3000);
  }, [alert]);


///// delete post and show alert for success and return to home page
  function DeletePost() {
    axios.delete(`/api/posts?id=${id}`).then((res) => {
    setAlertData({message:'Delete Post is Success',status:'success'})
    setAlert(true)
      window.location.href = "/";
    });
  }


///// if all information is ready update posts and show alert success
  function UpdatePost() {
    if (!title || !auther || !subtitle || !category || !content) {
        setAlertData({message:'Please Enter All Information',status:'error'})
      return setAlert(true);
    }
    const newPost = {
      id,
      title,
      auther,
      category,
      subtitle,
      content,
    };
    axios.put("/api/posts", newPost).then((res) => {
      setBlogdata(res.data);
      setAlertData({message:'Update Data is Success',status:'success'})
      setAlert(true)
    });
    setEditPost(false);
  }

  return (
    <div className={styles.main}>
      <Head>
        {/* title */}
        {blogdata && blogdata?.title ? (<title>{blogdata.title}</title>):<></>}
      </Head>
      <div className={` ${editPost ? styles.editpost : styles.active}`}>
        {/* when click on edit post */}
        <div className={styles2.main}>
          <div className={styles2.title}>
            <input
              onChange={(e) => setTitle(e.target.value)}
              value={title}
              type="text"
              placeholder="title blog"
            />
            <input
              onChange={(e) => setAuther(e.target.value)}
              value={auther}
              type="text"
              placeholder="your name "
            />
            <input
              onChange={(e) => setCategory(e.target.value)}
              value={category}
              type="text"
              placeholder="category"
            />
          </div>
          <input
            onChange={(e) => setSubtitle(e.target.value)}
            value={subtitle}
            className={styles2.subtitle}
            type="text"
            placeholder="sub title for preview"
          />
          <div className={styles2.markdown}>
            <MdEditor
              language="en-US"
              modelValue={content}
              onChange={setContent}
            />
          </div>
            <div style={{width:'100%' , textAlign:'center'}}>
            <button
            onClick={() => {
              UpdatePost();
            }}
            className={styles2.button}
          >
            update blog
          </button>
          <button className={styles2.button} onClick={()=>setEditPost(false)} style={{color:'red',}}>cancel</button>
            </div>
          
        </div>
      </div>
      <MainLayout>
        {/* /////alert */}
        {alert ? (
          <Alert className={styles.alert} style={{ zIndex: "20" }} severity={alertData.status}>
            <AlertTitle>{alertData.status}</AlertTitle>
            {alertData.message}
          </Alert>
        ) : (
          <></>
        )}
        {loading ? (
          <div className={styles.post}>
            {/* loading */}
            <Loading />
          </div>
        ) : notFound ? (
          ///////// If the post does not exist
          <div className={styles.post} >
            <h1>This Page Not Found</h1>
            <h3>return to the first blog</h3>
            <Link
              href={`/post/${1}`}
              onClick={() => {
                setLoading(true);
                setNotFound(false);
              }}
              className={styles.buttonFirstBlog}
            >
              <GrPrevious />
              first blog
            </Link>
          </div>
        ) : (
          ///// show post data
          <div className={styles.post} >
            {blogdata &&(
              <>
              <div className={styles.info}>
              <h1>{blogdata.title}</h1>
              <h5>auther : {blogdata.auther}</h5>
              <h5>create on : {blogdata.date.split("T")[0]}</h5>
            </div>
            <div className={styles.infoButton}>
              <button onClick={() => DeletePost()} style={{color:'red'}}>Delete Post</button>
              <button style={{color:'green'}}
                onClick={() => {
                  setEditPost(true);
                  setContent(JSON.parse(blogdata.content));
                  setTitle(blogdata.title);
                  setAuther(blogdata.auther);
                  setCategory(blogdata.category);
                  setSubtitle(blogdata.subtitle);
                }}
              >
                Edit Post
              </button>
            </div>
            <hr />
            <div className={styles.content}>
              <ReactMarkdown
                children={JSON.parse(blogdata.content)}
                skipHtml={false}
                remarkPlugins={[remarkBreaks]}
                rehypePlugins={[rehypeRaw, rehypeHighlight]}
              />
            </div>
            {/* button next and prev post */}
            <div className={styles.pagination}>
              {blogdata.id !== 1 ? (
                <Link
                  href={{
                    pathname: `/post/${blogdata.id - 1}`,
                    query: { postLength },
                  }}
                  style={{ left: "0" }}
                >
                  <GrPrevious />
                  prev blog
                </Link>
              ) : (
                <></>
              )}
              {blogdata.id == postLength ? (
                <></>
              ) : (
                <Link
                  href={{
                    pathname: `/post/${blogdata.id + 1}`,
                    query: { postLength },
                  }}
                  style={{ right: "0" }}
                >
                  next blog
                  <GrNext />
                </Link>
              )}
            </div>
              </>
            )}
            
          </div>
        )}
      </MainLayout>
    </div>
  );
}

export default Post;
