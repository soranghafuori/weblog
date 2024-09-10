import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {

/////////////////////// POST 
  try {
    if (req.method === "POST") {
      //////  If one of the inputs is empty return error
      const { title, auther, subtitle, category, content } = req.body;
      if (!title || !auther || !subtitle || !category || !content) {
        return res
          .status(400)
          .json({ message: "Please Post all Data", variant: "error" });
      }

      ///// create post and return success message
      const newpost = await prisma.post.create({
        data: {
          title,
          auther,
          subtitle,
          category,
          content:JSON.stringify(content)
        },
      });

      return res
        .status(200)
        .json({ message: "Add post is success", variant: "success" });
    }



///////////////////////  PUT
    if (req.method === "PUT") {
      //////  If one of the inputs is empty return error
      const { title, auther, subtitle, category, content, id } = req.body;
      if (!title || !auther || !subtitle || !category || !content || !id) {
        return res
          .status(400)
          .json({ message: "Please Send id and post data", variant: "error" });
      }


      ///// update post and return new post
      const updatePost = await prisma.post.update({
        where: { id: Number(id) },
        data: { 
            title,
            auther,
            subtitle,
            category,
            content:JSON.stringify(content) },
      });
      return res
        .status(200)
        .json(updatePost);
    }



/////////////////////// DELETE 
    if (req.method === "DELETE") {
      const { id } = req.query;
      ////// if id is empty
      if (!id) {
        return res
          .status(400)
          .json({ message: "Please Send id", variant: "error" });
      }
      ////// find post and If the post does not exist show error
      const FindPost = await prisma.post.findFirst({
        where: { id: Number(id) },
      });
      if(!FindPost){
        return res.status(400).json({message:'cant found post',variant:'error'})
      }

      ///// delete post and return success message
      const post = await prisma.post.delete({
        where: { id: Number(id) },
      });
      return res
        .status(200)
        .json({ message: "delete post is success", variant: "success" });
    }



///////////////////////  GET
    if (req.method === "GET") {
      const { id } = req.query;
      ///// get id from req.query if id is exist return one post 
      if (id) {
        const post = await prisma.post.findFirst({
          where: { id: Number(id) },
        });

        ////// if id dose not exist return all posts
        if (!post) {
          return res.status(200).json({
            message: "The post you are looking for was not found",
            variant: "error",
          });
        }
        return res.status(200).json(post);
      }else{
        const posts = await prisma.post.findMany();
        return res.status(200).json(posts)
      }
    }
  } catch (error) {
    console.log("error on file src/api/posts.ts", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}
