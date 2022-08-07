import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { marked } from "marked";
import invariant from "tiny-invariant";
import { getPostItem } from "~/models/post.server";

export const loader = async ({ params }: LoaderArgs) => {
  const {slug} = params;
  invariant(slug, "This should be impossible")

  const post = await getPostItem(slug);
  invariant(post, "Post not found")

  const html  = marked(post.markdown)
  return json({
    title: post.title,
    html,
  });
};

export default function Posts() {
  const { title, html } = useLoaderData<typeof loader>();
  return (
    <main>
      <main className="mx-auto max-w-4xl">
        <h1 className="my-6 border-b-2 text-center text-3xl">{title}</h1>
        <p dangerouslySetInnerHTML={{__html: html}}></p>
      </main>
    </main>
  );
}
