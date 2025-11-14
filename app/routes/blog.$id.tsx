import { json, LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import supabase from "~/supabase_blog";
import BlogDetail from "~/components/BlogDetail";
import type { MetaFunction } from "@remix-run/react";

interface Blog {
  id: string;
  title: string;
  details: string;
  status: string;
  category_id: string;
  top_image: string;
  publish_date: string;
}

interface BlogDetailData {
  id: string;
  title: string;
  details: string;
  top_image?: string;
  publish_date: string;
}

interface Category {
  name: string;
}
export const meta: MetaFunction<typeof loader> = ({ data }) => {
  if (!data || !data.blog) {
    return [
      { title: "ブログが見つかりません | Sugamo Navi" },
      { name: "description", content: "お探しのブログ記事は存在しません。" },
    ];
  }

  const { blog, categoryName } = data;
  const plainText = blog.details.replace(/<[^>]*>/g, '').replace(/\n/g, ' ').trim();
  const description = plainText.slice(0, 155) + (plainText.length > 155 ? "..." : "");

  return [
    { title: `${blog.title} | ${categoryName} - Sugamo Navi` },
    { name: "description", content: description },
    { property: "og:title", content: blog.title },
    { property: "og:description", content: description },
    { property: "og:image", content: blog.top_image ? `https://sugamo-navi.com${blog.top_image}` : "https://sugamo-navi.com/src/sugamo-navi.webp" },
    { property: "og:url", content: `https://sugamo-navi.com/blog/${blog.id}` },
    { property: "og:type", content: "article" },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: blog.title },
    { name: "twitter:description", content: description },
    { name: "twitter:image", content: blog.top_image ? `https://sugamo-navi.com${blog.top_image}` : "https://sugamo-navi.com/src/sugamo-navi.webp" },
  ];
};
export async function loader({ params }: LoaderFunctionArgs) {
  const { id } = params; // Extract the blog ID from the URL

  try {
    // Fetch blog post data from Supabase
    const { data: blog, error } = await supabase
      .from("blogs")
      .select("id, title, details, status, category_id, top_image, publish_date")
      .eq("id", id)
      .eq("status", "publish")
      .single(); // Use .single() since we expect one blog post

    if (error) {
      console.error("Blog fetch error:", error);
      
      // Check if it's a table not found error - use fallback data
      if (error.message && error.message.includes('table')) {
        console.warn("Database tables not found, using fallback data for blog", id);
        
        // Mock blog data based on ID
        const mockBlogs: Record<string, Blog> = {
          "1": {
            id: "1",
            title: "巣鴨地蔵通り商店街の魅力",
            details: `# 巣鴨地蔵通り商店街の魅力

巣鴨地蔵通り商店街は、「おばあちゃんの原宿」として親しまれている東京の人気観光スポットです。

## 歴史と背景

江戸時代から続く歴史ある商店街で、とげぬき地蔵として知られる高岩寺を中心に、約200店舗が軒を連ねています。

## 特色ある店舗

商店街では、お年寄りに優しい商品やサービスが充実しており、以下のような個性的なお店が楽しめます：

- **マルジ**: 赤いパンツで有名な下着店
- **みずの**: 塩大福で人気の和菓子店  
- **千成もなか**: 手作りもなかの老舗

## 縁日の賑わい

毎月4、14、24日の縁日には多くの参拝客で賑わい、地元グルメや伝統的な和菓子を味わうことができます。

地蔵通り商店街は、伝統と現代が融合した、東京でも稀有な商店街として多くの人々に愛され続けています。`,
            status: "publish",
            category_id: "1",
            top_image: "/src/sugamo-street.jpg",
            publish_date: new Date().toISOString()
          },
          "2": {
            id: "2", 
            title: "とげぬき地蔵のご利益と参拝方法",
            details: `# とげぬき地蔵のご利益と参拝方法

高岩寺のとげぬき地蔵は、正式には「延命地蔵菩薩」と呼ばれ、多くの参拝者に愛され続けています。

## ご利益について

- **病気平癒**: 体の不調を癒す
- **延命長寿**: 長生きのご利益
- **厄除け**: 災いから身を守る

## 参拝の作法

1. **本堂でのお参り**: まず本堂で延命地蔵菩薩にお参りします
2. **洗い観音**: 清水をかけて自分の体の痛いところと同じ部分を洗います
3. **御影の授与**: 縁日には境内で御影（おみかげ）というお札が配布されます

## 御影の効能

御影を飲み込むと病気が治るという言い伝えがあり、多くの人々が健康を願って訪れます。

とげぬき地蔵は、巣鴨を代表するパワースポットとして、今日も多くの人々の心の支えとなっています。`,
            status: "publish", 
            category_id: "2",
            top_image: "/src/jizo-temple.jpg",
            publish_date: new Date(Date.now() - 86400000).toISOString()
          },
          "3": {
            id: "3",
            title: "巣鴨グルメガイド - 名物料理とおすすめスイーツ",
            details: `# 巣鴨グルメガイド

巣鴨には歴史ある老舗から現代的なカフェまで、多様なグルメスポットが点在しています。

## 老舗の名店

### 古奈屋
- **名物**: カレーうどん
- **特徴**: コクのあるカレースープが自慢
- **創業**: 明治時代から続く老舗

### みずの  
- **名物**: 塩大福
- **特徴**: 塩大福発祥の店として有名
- **味**: 甘さ控えめで上品な味わい

### 千成もなか
- **名物**: 手作りもなか
- **特徴**: あんこの上品な甘さが人気
- **こだわり**: 毎日手作りの温かいもなか

## カフェ・喫茶店

巣鴨には昔ながらの喫茶店も多く、お年寄りに優しいメニューを提供するお店が数多くあります。

## おすすめの食べ歩き

縁日の日には露店も並び、たい焼きやお団子などの和スイーツを楽しむことができます。

巣鴨のグルメは、訪れる人の心も体も温めてくれる、そんな優しい味わいが特徴です。`,
            status: "publish",
            category_id: "3", 
            top_image: "/src/sugamo-food.jpg",
            publish_date: new Date(Date.now() - 172800000).toISOString()
          }
        };
        
        const mockBlog = mockBlogs[id || "1"];
        if (!mockBlog) {
          throw new Response("Blog post not found", { status: 404 });
        }
        
        const mockBlogData: BlogDetailData = {
          id: mockBlog.id,
          title: mockBlog.title,
          details: mockBlog.details,
          top_image: mockBlog.top_image || undefined,
          publish_date: mockBlog.publish_date,
        };
        
        return json({ 
          blog: mockBlogData, 
          categoryName: mockBlog.category_id === "1" ? "観光スポット" : 
                       mockBlog.category_id === "2" ? "寺社・パワースポット" : "グルメ・食事"
        });
      }
      
      throw new Response("Blog post not found", { status: 404 });
    }

    if (!blog) {
      throw new Response("Blog post not found", { status: 404 });
    }

    // Fetch category name if category_id exists
    let categoryName = "General";
    if (blog.category_id) {
      try {
        const { data: category, error: categoryError } = await supabase
          .from("categories")
          .select("name")
          .eq("id", blog.category_id)
          .single();

        if (!categoryError && category) {
          categoryName = category.name;
        }
      } catch (categoryErr) {
        console.warn("Could not fetch category, using default");
        categoryName = "General";
      }
    }

    // Transform blog data to match BlogDetail interface
    const blogData: BlogDetailData = {
      id: blog.id,
      title: blog.title,
      details: blog.details,
      top_image: blog.top_image || undefined,
      publish_date: blog.publish_date,
    };

    return json({ blog: blogData, categoryName });
    
  } catch (error) {
    console.error("Loader error:", error);
    throw new Response("Blog post not found", { status: 404 });
  }
}

export default function BlogDetailRoute() {
  const { blog, categoryName } = useLoaderData<typeof loader>();

  return <BlogDetail blog={blog} categoryName={categoryName} />;
}