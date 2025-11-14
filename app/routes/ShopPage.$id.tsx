// app/routes/FoodAndDrink.$id.tsx
import { json, type LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { MetaFunction } from "@remix-run/react";
import supabaseShops from "~/supabase"; // তোমার shop এর supabase
import ProductCard from "~/components/ShopItem";

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const { id } = params;
  const { data, error } = await supabaseShops
    .from("shops")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !data) {
    throw new Response("Shop not found", { status: 404 });
  }

  return json({ shop: data });
};

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  if (!data?.shop) {
    return [
      { title: "お店が見つかりません | Sugamo Navi" },
      { name: "description", content: "お探しのお店は存在しません。" },
    ];
  }

  const { shop } = data;
  const description = shop.description?.slice(0, 150) + "..." || "";

  return [
    { title: `${shop.name} | 食べる - Sugamo Navi` },
    { name: "description", content: description },
    { property: "og:title", content: `${shop.name} | 食べる` },
    { property: "og:description", content: description },
    { property: "og:image", content: shop.image_url || "https://sugamo-navi.com/src/food.png" },
    { property: "og:url", content: `https://sugamo-navi.com/FoodAndDrink/${shop.id}` },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ];
};

export default function ShopDetail() {
  const { shop } = useLoaderData<typeof loader>();

  return (
    <div className="max-w-4xl mx-auto p-4">
      <ProductCard
        id={shop.id}
        title={shop.name}
        imageUrl={shop.image_url}
        description={shop.description}
        likes={shop.love_count || 0}
        views={shop.review_count || 0}
        type="shop"
        category={shop.category || "グルメ"}
        category_id={shop.category_id}
        opening_hours={shop.opening_hours}
        near_station={shop.near_station}
        address={shop.address}
        map_embed={shop.map_embed}
        other_images={shop.other_images ? [JSON.stringify(shop.other_images)] : []}
      />
    </div>
  );
}