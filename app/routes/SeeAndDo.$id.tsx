// app/routes/SeeAndDo.$id.tsx
import { json, type LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { MetaFunction } from "@remix-run/react";
import supabase from "~/supabase";
import ProductCard from "~/components/ShopItem";

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const { id } = params;
  const { data, error } = await supabase
    .from("tourist_places")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !data) {
    throw new Response("Place not found", { status: 404 });
  }

  return json({ place: data });
};

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  if (!data?.place) {
    return [
      { title: "場所が見つかりません | Sugamo Navi" },
      { name: "description", content: "お探しの観光スポットは存在しません。" },
    ];
  }

  const { place } = data;
  const description = place.description?.slice(0, 150) + "..." || "";

  return [
    { title: `${place.name} | 見る・遊ぶ - Sugamo Navi` },
    { name: "description", content: description },
    { property: "og:title", content: `${place.name} | 見る・遊ぶ` },
    { property: "og:description", content: description },
    { property: "og:image", content: place.image_url || "https://sugamo-navi.com/src/see-do.jpg" },
    { property: "og:url", content: `https://sugamo-navi.com/SeeAndDo/${place.id}` },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ];
};

export default function PlaceDetail() {
  const { place } = useLoaderData<typeof loader>();

  return (
    <div className="max-w-4xl mx-auto p-4">
      <ProductCard
        id={place.id}
        title={place.name}
        imageUrl={place.image_url}
        description={place.description}
        likes={place.love_count || 0}
        views={place.review_count || 0}
        type="place"
        category={place.category || "観光スポット"}
        category_id={place.category_id}
        opening_hours={place.opening_hours}
        near_station={place.near_station}
        address={place.address}
        map_embed={place.map_embed}
        other_images={place.other_images ? [JSON.stringify(place.other_images)] : []}
      />
    </div>
  );
}