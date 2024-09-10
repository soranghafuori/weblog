import React, { useEffect, useState } from "react";
import MainLayout from "@/layouts/MainLayout";
import BlogPost from "@/components/BlogPost";
import axios from "axios";
import Pagination from "@mui/material/Pagination";
import Loading from "@/components/Loading";
import type { Metadata } from "next";
import Head from "next/head";

////// meta data
export const metadata: Metadata = {
  title: "weblog",
  description: "desc ",
};

////// interface for Blog Data state
interface Blog {
  id: number;
  title: string;
  auther: string;
  subtitle: string;
  category: string;
  content: string;
  date:string
}

function Home() {
  const [blogdata, setBlogdata] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [postsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentPosts, setCurrentPosts] = useState<Blog[]>([]);


////// get all posts when page loading
  useEffect(() => {
    axios.get("/api/posts").then((res) => {
      setBlogdata(res.data);
      setLoading(false);
    });
  }, [loading]);

////// set pagination
  useEffect(() => {
    if (blogdata) {
      const indexOfLastPost = currentPage * postsPerPage;
      const indexOfFirstPost = indexOfLastPost - postsPerPage;
      const slicedPosts = blogdata.slice(indexOfFirstPost, indexOfLastPost);
      const reversedPosts = slicedPosts.reverse();
      setCurrentPosts(reversedPosts);
    }
  }, [blogdata, currentPage, postsPerPage]);

////// when click on pagination change post
  const handleChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setCurrentPage(value);
  };

  return (
    <MainLayout>
      {/* head and title for SEO and webpage on browser */}
      <Head>
        <title>weblog</title>
        <meta charSet="UTF-8" />
        <meta name="keywords" content="HTML , CSS , JAVASCRIPT" />
        <meta name="description" content="test weblog " />
        <meta name="auther" content="soran ghafoori" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta lang="en" />
      </Head>
      {loading ? (
        <Loading />
      ) : (
        <>
          <h1>welcome to my blog</h1>

          {/* map on currentPosts and show all post on Component BlogPost */}
          {currentPosts.map((post) => (
            <BlogPost post={post} postLength={blogdata?.length || 0} key={post.id} />
          ))}
          {/* Pagination */}
          <Pagination
            color="standard"
            className="pagination"
            count={Math.ceil(blogdata.length / postsPerPage)}
            page={currentPage}
            onChange={handleChange}
          />
        </>
      )}
    </MainLayout>
  );
}

export default Home;
