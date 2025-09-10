// TravelsTipsItem.tsx
import { useUniversalFluid } from "../hooks/useUniversalFluid";
import { useMediaQuery } from "react-responsive";

export default function TravelsTipsItem({ categories }) {
  const { fs, fsm } = useUniversalFluid();
  const isMobile = useMediaQuery({ maxWidth: 767 });
  const autoSize = (size: number) => (isMobile ? fsm(size) : fs(size));

  return (
    <div
      className="flex flex-row border-2 border-black rounded-lg w-full overflow-hidden"
    >
      <img
        className="object-cover m-0"
        style={{
          width: autoSize(113),
        }}
        src="./src/tips-1.png"
        alt="Spices"
      />

      <div
        className="flex flex-col justify-between"
        style={{
          marginLeft: autoSize(16),
          paddingRight: autoSize(18),
          paddingBottom: autoSize(9),
          paddingTop: autoSize(9)
        }}
      >
        <div>
          <p
            className="italic font-cousine text-black"
            style={{
              width: isMobile? fsm(77):fs (77),
              fontSize: autoSize(12),
              lineHeight: autoSize(30),
              fontWeight: autoSize(400)
            }}
          >
            2025.08.15
          </p>
          <h2
            className="font-semibold text-[#313131] font-cairo"
            style={{ fontSize: autoSize(16) }}
          >
            テキスが入ります
          </h2>
        </div>

        {/* Categories */}
        <div className="flex space-x-2" style={{ marginTop: autoSize(12) }}>
          <div className="flex" style={{ gap: autoSize(8) }}>
            {categories.map((category, index) => (
              <span
                key={index}
                className="border border-red-500 text-red-500 rounded-full italic text-center bg-white font-cousine px-2"
                style={{
                  fontSize: autoSize(12),
                  lineHeight: autoSize(17),
                }}
              >
                #{category}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
