// app/routes/recommendation.tsx
import { useLocation } from "@remix-run/react";
import Header from "~/components/Header";
import Footer from "~/components/Footer";
import ProductCard from "~/components/ShopItem";
import MarqueeHeader from "~/components/MarqueeHeader";
import CommonCategoryTop from "~/components/CommonCategoryTop";
import { ResponsiveGrid, GridItem } from "~/components/ResponsiveGrid";
import { useIsMobile } from "~/hooks/useIsMobile";
import { useUniversalFluid } from "~/hooks/useUniversalFluid";
import supabaseShops from "~/supabase";

import React, { useEffect, useState } from "react";

type Shop = {
  id: string;
  name: string;
  category_id: string;
  category: string;
  description: string;
  address: string;
  image_url: string;
  love_count: number;
  review_count: number;
  near_station: string;
  map_embed: string;
  other_images: string[];               // <-- now a real array
  opening_hours: string;
};

export default function Recommendation() {
  const location = useLocation();               // works because file is a route
  const [topShops, setTopShops] = useState<Shop[]>([]);
  const [shopsLoading, setShopsLoading] = useState(true);
  const [shopsError, setShopsError] = useState<string | null>(null);
  const { fs, fsm } = useUniversalFluid();
  const { isMobile } = useIsMobile();

  useEffect(() => {
    window.dispatchEvent(new Event("resize"));
  }, [location]);
  useEffect(() => {
    const fetchTopShops = async () => {
      try {
        setShopsLoading(true);
        setShopsError(null);

        // 1. Active recommendations
        const { data: recs, error: recErr } = await supabaseShops
          .from("recommendations")
          .select("shop_id, priority")
          .eq("is_active", true)
          .order("priority", { ascending: true });

        if (recErr) throw recErr;
        if (!recs?.length) {
          setShopsError("No active recommendations found.");
          return;
        }

        const shopIds = recs.map((r) => r.shop_id);

        // 2. Shops for those IDs
        const { data: shops, error: shopErr } = await supabaseShops
          .from("shops")
          .select("*")
          .in("id", shopIds);

        if (shopErr) throw shopErr;

        // Preserve recommendation order
        const sorted: Shop[] = recs
          .map((rec) => {
            const shop = shops.find((s) => s.id === rec.shop_id);
            if (!shop) return null;
            return {
              ...shop,
              // Normalise other_images to an array
              other_images: Array.isArray(shop.other_images)
                ? shop.other_images
                : [],
            };
          })
          .filter((s): s is Shop => s !== null);

        setTopShops(sorted);
      } catch (err) {
        const msg =
          err instanceof Error ? err.message : "Unknown error";
        setShopsError(msg);
        console.error(err);
      } finally {
        setShopsLoading(false);
      }
    };

    fetchTopShops();
  }, []);

  if (shopsError) {
    return (
      <div className="container mx-auto p-4 text-red-600">
        Error: {shopsError}
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header />

      <CommonCategoryTop
        title="RECOMMENDATION"
        subtitle="推奨"
        imageSrc="/src/food.png"
        imageAlt="Food and Drink Image"
      />

      <MarqueeHeader
        text="Welcome to Sugamo! Pick your faves! "
        backgroundColor="#FFFFFF"
        textColor="#000000"
        animationDuration="90s"
        marginBottom={120}
        marginTop={98}
      />

      {shopsLoading ? (
        <div className="container mx-auto p-4">Loading shops…</div>
      ) : (
        <ResponsiveGrid
          columns={isMobile ? "1fr 1fr" : "1fr 1fr 1fr"}
          rows="auto"
          className="flex justify-center"
          style={{
            gap: isMobile ? fsm(19) : fs(32),
            marginTop: isMobile ? fsm(0) : fsm(120),
            marginLeft: isMobile ? fsm(20) : fs(161),
            marginRight: isMobile ? fsm(20) : fs(161),
          }}
        >
          {topShops.map((shop, idx) => {
            const col = isMobile ? (idx % 2) + 1 : (idx % 3) + 1;
            const row = isMobile
              ? Math.floor(idx / 2) + 1
              : Math.floor(idx / 3) + 1;

            return (
              <GridItem
                key={shop.id}
                column={col}
                row={row}
                columnSpan={1}
                rowSpan={1}
                style={{
                  minHeight: "auto",
                  height: "auto",
                  marginTop: isMobile ? fsm(0) : fs(8),
                }}
                className="w-full"
              >
                <ProductCard
                  id={shop.id}
                  title={shop.name}
                  imageUrl={shop.image_url || "/src/shop.png"}
                  description={shop.description || "No description available"}
                  likes={shop.love_count ?? 0}
                  views={shop.review_count ?? 0}
                  category={shop.category ?? "shop"}
                  category_id={shop.category_id}
                  type="shop"
                  opening_hours={shop.opening_hours ?? "Not specified"}
                  near_station={shop.near_station ?? "Not specified"}
                  address={shop.address ?? "Not specified"}
                  map_embed={shop.map_embed ?? ""}
                  other_images={shop.other_images}
                />
              </GridItem>
            );
          })}
        </ResponsiveGrid>
      )}

      <Footer marginTop={64} />
    </div>
  );
}