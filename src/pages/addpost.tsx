import React, { useEffect, useState } from "react";
import styles from "@/../../styles/addPost.module.css";
import MainLayout from "@/layouts/MainLayout";
import { MdEditor } from "md-editor-rt";
import "md-editor-rt/lib/style.css";
import axios from "axios";
import AlertTitle from "@mui/material/AlertTitle";
import Alert from "@mui/material/Alert";

///// all data for severity on Alert Component
type AlertColor = 'error' | 'info' | 'success' | 'warning';

///// interface AlertData for alertData state
interface AlertData {
  message: string;
  status: AlertColor;
}

function AddPost() {
  const [content, setContent] = useState('');
  const [title, setTitle] = useState("");
  const [auther, setAuther] = useState("");
  const [category, setCategory] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [alert, setAlert] = useState(false);
  const [alertData, setAlertData] = useState<AlertData>({ message: "Please Enter All Information", status: 'error' });


///// send a new post
  function sendPost() {

///// If one of the inputs is empty
    if (!title || !auther || !subtitle || !category || !content) {
      setAlertData({
        message: "Please Enter All Information",
        status: 'error',
      });
      return setAlert(true);
    }
///// save state on newPost and post with axios then show alert and empty all of state for send new post
    const newPost = {
      title,
      auther,
      category,
      subtitle,
      content,
    };
    axios.post("/api/posts", newPost).then(() => {
      setAlertData({ message: "Update Data is Success", status: 'success' });
      setAlert(true);
      setTitle("");
      setAuther("");
      setCategory("");
      setSubtitle("");
      setContent('')
    });
  }

///// Hide the alert after 3s showing it
  useEffect(() => {
    setTimeout(() => {
      setAlert(false);
    }, 3000);
  }, [alert]);


  return (
    <MainLayout>
      {/* show alert after post data */}
      {alert ? (
        <Alert className={styles.alert} severity={alertData.status}>
          <AlertTitle>{alertData.status}</AlertTitle>
          {alertData.message}
        </Alert>
      ) : (
        <></>
      )}
      <div className={styles.main}>
        <div className={styles.title}>
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
        <div className={styles.subtitleBox}>
          <input
            ///// subtitle must be less than 120 characters  otherwise input color change to red and stop of typeing
            onChange={(e) => {
              if (e.target.value.length < 120) {
                setSubtitle(e.target.value);
              }
            }}
            value={subtitle}
            className={styles.subtitle}
            type="text"
            placeholder="sub title for preview"
            style={{ color: subtitle.length > 118 ? "red" : "black" }}
          />
          {/* This tag is displayed only when the subtitle.lengh is more than 120 characters */}
          <p style={{ display: subtitle.length > 118 ? "block" : "none" }}>
            The subtitle must be less than 120 characters
          </p>
        </div>

        <div className={styles.markdown}>
          <MdEditor
            language="en-US"
            modelValue={content} ///// for show MarkDown
            onChange={setContent} //// fro edit MarkDown
          />
        </div>

        <button onClick={() => sendPost()} className={styles.button}>
          add blog
        </button>
      </div>
    </MainLayout>
  );
}

export default AddPost;
