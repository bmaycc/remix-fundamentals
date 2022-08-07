// 🐨 implement the action function here.
// 1. accept the request object
// 2. get the formData from the request
// 3. get the title, slug, and markdown from the formData
// 4. call the createPost function from your post.model.ts
// 5. redirect to "/posts/admin".

import { Form, useActionData } from "@remix-run/react";
import type { ActionArgs } from "@remix-run/server-runtime";
import { json, redirect } from "@remix-run/node";
import invariant from "tiny-invariant";
import { createPost } from "~/models/post.server";

const inputClassName = `w-full rounded border border-gray-500 px-2 py-1 text-lg`;
type ActionResult = {
  title?: string;
  slug?: string;
  markdown?: string;
};
export async function action({ request, params }: ActionArgs) {
  const formData = await request.formData(); // <-- 📜 learn more https://mdn.io/formData

  const errorObj: ActionResult = {};

  const title = formData.get("title");
  invariant(typeof title === "string", "Title is not a string");
  errorObj["title"] = !title ? "Title is required" : undefined;

  const slug = formData.get("slug");
  invariant(typeof slug === "string", "Slug is not a string");
  if (!slug) {
    errorObj["slug"] = "Slug is required";
  } else if (/\s/.test(slug)) {
    errorObj["slug"] = "Slug must have no whitespace";
  }

  const markdown = formData.get("markdown");
  invariant(typeof markdown === "string", "Markdown is not a string");
  errorObj["markdown"] = !markdown ? "Markdown is required" : undefined;

  if (Object.values(errorObj).filter((item) => !!item).length) {
    return json(errorObj);
  }

  const newPost = await createPost({
    title,
    slug,
    markdown,
  });
  return redirect(`/posts/admin/${newPost.slug}`);
}

export default function NewPost() {
  const errors = useActionData<typeof action>();
  return (
    // 🐨 change this to a <Form /> component from @remix-run/react
    // 🐨 and add method="post" to the form.
    <Form method="post">
      <p>
        <label>
          Post Title:{" "}
          <input type="text" name="title" className={inputClassName} />
          {errors?.title}
        </label>
      </p>
      <p>
        <label>
          Post Slug:{" "}
          <input type="text" name="slug" className={inputClassName} />
          {errors?.slug}
        </label>
      </p>
      <p>
        <label htmlFor="markdown">Markdown: </label>
        <br />
        <textarea
          id="markdown"
          rows={8}
          name="markdown"
          className={`${inputClassName} font-mono`}
        />
        {errors?.markdown}
      </p>
      <p className="text-right">
        <button
          type="submit"
          className="rounded bg-blue-500 py-2 px-4 text-white hover:bg-blue-600 focus:bg-blue-400 disabled:bg-blue-300"
        >
          Create Post
        </button>
      </p>
    </Form>
  );
}
