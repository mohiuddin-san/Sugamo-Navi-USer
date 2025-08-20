import { json, LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import supabase from "~/supabase";
import BlogDetail from "~/components/BlogDetail";

export async function loader({ params }: LoaderFunctionArgs) {
  const { id } = params; // Extract the blog ID from the URL

  // Fetch blog post data from Supabase
  const { data: blog, error } = await supabase
    .from("blogs")
    .select("id, title, details, status, category_id, top_image, publish_date")
    .eq("id", id)
    .eq("status", "publish")
    .single(); // Use .single() since we expect one blog post

  if (error || !blog) {
    throw new Response("Blog post not found", { status: 404 });
  }

  // Fetch category name if category_id exists
  let categoryName = "General";
  if (blog.category_id) {
    const { data: category, error: categoryError } = await supabase
      .from("categories")
      .select("name")
      .eq("id", blog.category_id)
      .single();

    if (!categoryError && category) {
      categoryName = category.name;
    }
  }

  return json({ blog, categoryName });
}

export default function BlogDetailRoute() {
  const { blog, categoryName } = useLoaderData<typeof loader>();

  return <BlogDetail blog={blog} categoryName={categoryName} />;
}