import { ResponsiveGrid, GridItem } from "~/components/ResponsiveGrid.tsx";
import { useMediaQuery } from "react-responsive";

export default function ShimmerLayout() {
  const isMobile = useMediaQuery({ maxWidth: 767 });

  // Define shimmer animation with Tailwind CSS
  const shimmerCard = (
    <GridItem
      className="rounded-xl overflow-hidden shadow-md bg-white"
      column={1}
      row={1}
      columnSpan={1}
      rowSpan={1}
    >
      {/* Header Section */}
      <div className="px-6 py-4 bg-gradient-to-r from-gray-50 to-white flex items-center justify-between">
        <div className="h-4 w-1/3 bg-gray-200 rounded animate-pulse"></div>
        <div className="h-5 w-5 bg-gray-200 rounded-full animate-pulse"></div>
      </div>

      {/* Image Placeholder */}
      <div className="h-48 w-full bg-gray-200 animate-pulse"></div>

      {/* Content Section */}
      <div className="p-6 space-y-3">
        <div className="h-6 w-3/4 bg-gray-200 rounded animate-pulse"></div>
        <div className="space-y-2">
          <div className="h-4 w-full bg-gray-200 rounded animate-pulse"></div>
          <div className="h-4 w-5/6 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-4 w-4/5 bg-gray-200 rounded animate-pulse"></div>
        </div>
        <div className="flex justify-end">
          <div className="h-4 w-12 bg-gray-200 rounded animate-pulse"></div>
        </div>
      </div>
    </GridItem>
  );

  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-extrabold text-center text-gray-900 mb-12">
        Latest <span className="text-indigo-600">Articles</span>
      </h1>

      <ResponsiveGrid
        columns={isMobile ? "1fr" : "1fr 1fr"}
        rows="auto"
        gap={32}
        isMobile={isMobile}
        className="w-full"
      >
        {/* Render multiple shimmer cards to simulate loading multiple blog posts */}
        {Array.from({ length: isMobile ? 3 : 4 }).map((_, index) => (
          <GridItem
            key={index}
            column={isMobile ? 1 : (index % 2) + 1}
            row={isMobile ? index + 1 : Math.floor(index / 2) + 1}
            columnSpan={1}
            rowSpan={1}
          >
            {shimmerCard}
          </GridItem>
        ))}
      </ResponsiveGrid>
    </div>
  );
}