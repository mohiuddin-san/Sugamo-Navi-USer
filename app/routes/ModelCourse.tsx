import { json, type LoaderFunctionArgs } from '@remix-run/node';
import { useLoaderData, useLocation } from '@remix-run/react';
import Header from '~/components/Header';
import React, { useEffect, useState, useRef } from 'react';
import { useUniversalFluid } from '../hooks/useUniversalFluid';
import MarqueeHeader from '~/components/MarqueeHeader';
import CommonCategoryTop from '~/components/CommonCategoryTop';
import Footer from '../components/Footer';
import { useIsMobile } from '~/hooks/useIsMobile';
import ModelCourseDetailsItem from '../components/ModelCourseDetailsItem';
import ShopItem from '~/components/ShopItem';
import MapSVG from '~/components/MapSVG';
export async function loader({ }: LoaderFunctionArgs) {
  return json({
    modelCourses: [
      {
        id: 1,
        title: "食べ歩きとお守り巡り",
        subtitle: "王道（巣鴨地蔵通り商店街）コース",
        imageUrl: "/src/model-course-1.jpg",
        svgPath: "/src/map-pin.svg",
        stops: [
          {
            id: 1,
            title: '眞性寺',
            description: '<p><br></p><p><span style="color: rgb(0, 0, 0);">江戸六地蔵尊 眞性寺</span></p><p><span style="color: rgb(0, 0, 0);">巣鴨地蔵通りの入り口にある【眞性寺】。 ここには江戸六地蔵尊のひとつが祀られています。1714年に造立された高さ2.7mもの大地蔵は、旅人の安全と人々の無病息災を願って建立されたもの。 今も商店街のシンボルとして、参拝客をやさしく見守っています。</span></p>',
            image: '/src/step-m-1.jpg',
          },
          {
            id: 2,
            title: '地蔵通り',
            description: '<p><span style="color: rgb(0, 0, 0);">とげぬき地蔵尊 高岩寺</span></p><p><span style="color: rgb(0, 0, 0);">巣鴨といえば「とげぬき地蔵尊」こと【高岩寺】。 病気平癒・延命にご利益があるとされ、江戸時代から多くの人に信仰されてきたお寺です。 境内で人気なのは「洗い観音」。 自分の体の悪い部分と同じ場所を洗うと治るといわれ、いつも行列ができるほど。</span></p>',
            image: '/src/step-m-2.jpg',
          },
          {
            id: 3,
            title: '山年園',
            description: '<p><span style="color: rgb(0, 0, 0);">古奈屋</span></p><p><span style="color: rgb(0, 0, 0);">巣鴨の名物カレーうどんといえば【古奈屋】 1983年創業、まろやかでクリーミーなカレー出汁にコシのあるうどんが絡む唯一無二の味。 一番人気は"天使のえび天カレーうどん"サクッと揚がった海老天と濃厚なカレースープの相性は間違いなし！</span></p>',
            image: '/src/step-m-3.jpg',
          },
          {
            id: 4,
            title: '高岩寺',
            description: '<p><span style="color: rgb(0, 0, 0);">雪菓 高岩寺すぐ脇のかき氷屋さん【雪菓】 夏は連日かなりのウェイティングも。 人気メニューはピスタチオミルクや抹茶無双。 季節によって様々なフレーバーも楽しめます。</span></p>',
            image: '/src/step-m-4.jpg',
          },
          {
            id: 5,
            title: 'かき氷工房 雪菓',
            description: '<p><span style="color: rgb(0, 0, 0);">マルジ 毎月２日のマルジの日にはすがもんが店先に登場</span></p><p><span style="color: rgb(0, 0, 0);"> 創業は昭和27年（1952年）で、地元密着の老舗店。「赤パンツの元祖」「日本一の赤パンツ」といったキャッチコピーを掲げ、"赤"を通じて健康・長寿を願う商品を展開している。</span></p>',
            image: '/src/step-m-5.jpg',
          },
          {
            id: 6,
            title: '古奈屋 巣鴨本店',
            description: '<p><span style="color: rgb(0, 0, 0);">山年園 創業70年余りの老舗茶屋店【山年園】 参拝客や地元住民に親しまれてきた店！ 参拝茶などお土産や記念にぴったの商品も。</span></p>',
            image: '/src/step-m-6.jpg',
          },
          {
            id: 7,
            title: 'マルジ',
            description: '<p><span style="color: rgb(0, 0, 0);">山年園 創業70年余りの老舗茶屋店【山年園】 参拝客や地元住民に親しまれてきた店！ 参拝茶などお土産や記念にぴったの商品も。</span></p>',
            image: '/src/step-m-7.jpg',
          }
        ],
        products: [
          { id: "1", title: "古奈屋", imageUrl: "/src/konaya.jpg", description: "天使のえび天カレーうどん", likes: 2800, views: 5200, category_id: "2", category: "food", type: "shop" as const },
          { id: "2", title: "雪菓", imageUrl: "/src/yukimi.jpg", description: "ピスタチオミルクかき氷", likes: 3100, views: 6100, category_id: "3", category: "dessert", type: "shop" as const },
          { id: "3", title: "マルジ", imageUrl: "/src/maruji.jpg", description: "赤パンツ（健康長寿祈願）", likes: 1800, views: 3400, category_id: "4", category: "goods", type: "shop" as const },
          { id: "4", title: "山年園", imageUrl: "/src/sanen.jpg", description: "巣鴨参拝茶ギフト", likes: 1400, views: 2800, category_id: "5", category: "tea", type: "shop" as const },
          { id: "5", title: "みずの", imageUrl: "/src/mizuno.jpg", description: "塩大福（当日分完売注意）", likes: 2600, views: 4900, category_id: "3", category: "dessert", type: "shop" as const },
          { id: "6", title: "とげぬき地蔵尊売店", imageUrl: "/src/omamori.jpg", description: "お守り・御朱印帳", likes: 900, views: 2100, category_id: "6", category: "omamori", type: "shop" as const },
          { id: "7", title: "巣鴨あんぱん", imageUrl: "/src/anpan.jpg", description: "地蔵あんぱん（限定）", likes: 1300, views: 2500, category_id: "1", category: "bakery", type: "shop" as const },
          { id: "8", title: "すがもんショップ", imageUrl: "/src/sugamon.jpg", description: "すがもんグッズ", likes: 700, views: 1600, category_id: "7", category: "souvenir", type: "shop" as const },
        ],
      },
      {
        id: 2,
        title: "巣鴨スイーツ巡り",
        subtitle: "甘党のための至福のコース",
        imageUrl: "/src/model-course-2.jpg",
        svgPath: "/src/model_course-2.svg",
        stops: [
          { id: 1, title: "麺や　いま村", description: `<p><span style="white-space:pre-wrap;">麺や　いま村<br>巣鴨駅すぐの人気ラーメン店【麺や いま村】。看板は、無添加仕込みの鶏白湯に煮干しを合わせた&ldquo;鶏煮干しラーメン&rdquo;。まろやかで奥深いスープに、炭火焼きの鶏チャーシューが香ばしくマッチ！鶏チャーシューはお土産にもオススメ。</span></p>`, image: "/src/step-10.jpg" },
          { id: 2, title: "六義園", description: `<p>六義園<br>巣鴨からも散策範囲！駒込に広がる都内屈指の日本庭園【六義園】。五代将軍・徳川綱吉の側用人、柳沢吉保が1702年に造った&ldquo;回遊式築山泉水庭園&rdquo;です。四季折々の景色が楽しめ、春のしだれ桜や秋の紅葉は特に絶景！</p>`, image: "/src/step-m-2.jpg" },
          { id: 3, title: "L’esprit", description: `<p>L&rsquo;esprit<br>巣鴨・六義園あたりに新しくできた香りのアトリエ【L&rsquo;esprit（レスプリ）】。空間芳香を手掛ける会社のショップ。10種類の天然香料から、自分だけのアロマサシェや香水を&ldquo;調香体験&rdquo;できる場所。</p>`, image: "/src/step-9.jpg" },
          { id: 4, title: "フレンチパウンドハウス", description: `<p><span style="white-space:pre-wrap;">フレンチパウンドハウス<br>巣鴨の名店【FRENCH POUND HOUSE】&ldquo;日本一のショートケーキ&rdquo;と称される絶品ケーキが！口どけなめらかな生クリームと瑞々しい苺のバランスが絶妙な「ブラン」。芳醇な洋酒の香りが広がる大人味の「ルージュ」。2種類のショートケーキは、どちらも特別な時間を約束してくれる逸品です。</span></p>`, image: "/src/step-m-4.jpg" },
        ],
        products: [
          { id: "9", title: "雪菓", imageUrl: "/src/pistachio.jpg", description: "ピスタチオミルク", likes: 3300, views: 6800, category_id: "3", category: "dessert", type: "shop" as const },
          { id: "10", title: "みずの", imageUrl: "/src/shio-daifuku.jpg", description: "塩大福", likes: 2900, views: 5400, category_id: "3", category: "dessert", type: "shop" as const },
          { id: "11", title: "パティスリー ヨーコ", imageUrl: "/src/montblanc.jpg", description: "和栗モンブラン", likes: 2100, views: 4100, category_id: "3", category: "dessert", type: "shop" as const },
          { id: "12", title: "巣鴨あんぱん本舗", imageUrl: "/src/jizo-anpan.jpg", description: "地蔵あんぱん", likes: 1700, views: 3200, category_id: "1", category: "bakery", type: "shop" as const },
          { id: "13", title: "茶の間", imageUrl: "/src/matcha-parfait.jpg", description: "抹茶パフェ", likes: 2400, views: 4600, category_id: "3", category: "dessert", type: "shop" as const },
          { id: "14", title: "巣鴨プリン", imageUrl: "/src/pudding.jpg", description: "昔ながらの固めプリン", likes: 1600, views: 3100, category_id: "3", category: "dessert", type: "shop" as const },
          { id: "15", title: "甘味処 さくら", imageUrl: "/src/zunda.jpg", description: "ずんだ白玉", likes: 1300, views: 2700, category_id: "3", category: "dessert", type: "shop" as const },
          { id: "16", title: "巣鴨ドーナツ", imageUrl: "/src/donut.jpg", description: "揚げたてドーナツ", likes: 1100, views: 2200, category_id: "1", category: "bakery", type: "shop" as const },
        ],
      },
      {
        id: 3,
        title: "巣鴨スイーツ巡り",
        subtitle: "甘党のための至福のコース",
        imageUrl: "/src/model-course-1.jpg",
        svgPath: "/src/model_course3.svg",
        stops: [
          { id: 1, title: "眞性寺", description: `<p>江戸六地蔵尊 眞性寺<br>巣鴨地蔵通りの入り口にある【眞性寺】。ここには江戸六地蔵尊のひとつが祀られています。1714年に造立された高さ2.7mもの大地蔵は、旅人の安全と人々の無病息災を願って建立されたもの。今も商店街のシンボルとして、参拝客をやさしく見守っています。</p>`, image: "/src/step-m-1.jpg" },
          { id: 2, title: "高岩寺", description: `<p>とげぬき地蔵尊 高岩寺</p><p>巣鴨といえば「とげぬき地蔵尊」こと【高岩寺】。 病気平癒・延命にご利益があるとされ、江戸時代から多くの人に信仰されてきたお寺です。 境内で人気なのは「洗い観音」。 自分の体の悪い部分と同じ場所を洗うと治るといわれ、いつも行列ができるほど。</p>`, image: "/src/step-m-2.jpg" },
          { id: 3, title: "洋食　小林", description: `洋食　小林
巣鴨地蔵通りの路地裏に佇む洋食屋 洋食 小林 。名物は とろ〜り半熟スコッチエッグ。揚げたてサクサクの衣の向こうから黄身がじゅわっと広がる逸品。クラシックで落ち着いた店内には、グランメゾン出身シェフの技が光る！スコッチエッグに添えられたトマトジャムも秀逸。`, image: "/src/step-11.jpg" },
          { id: 4, title: "巣鴨庚申塚", description: `<p>巣鴨庚申塚</p><p>巣鴨の隠れたパワースポット【庚申塚】 中山道の宿場町として栄えた江戸時代、旅人が道中の安全を祈った場所です。 今は「猿田彦大神」が祀られ、道をひらき、人々を正しい方向へ導いてくれる神さまとして信仰されています。</p>`, image: "/src/step-15.jpg" },
        { id: 5, title: "いっぷく亭", description: `<p>いっぷく亭</p><p>巣鴨・庚申塚駅すぐの甘味処【いっぷく亭】 駅ホームから徒歩3歩、都電散策や地蔵通り散歩の合間にぴったりな場所。 名物は 手作りおはぎ と 焼きそば の「こだわりセット」。あんこ5種（あずき・抹茶・白あん・きな粉・黒ごま）も選べるのが魅力。 線路を眺めながら、ノスタルジックな空間でちょっと一息。</p>`, image: "/src/step-14.jpg" },
        { id: 6, title: "えがお老眼鏡", description: `えがお老眼鏡
巣鴨に誕生した“老眼鏡のセレクトショップ”【えがお老眼鏡】老眼鏡＝必需品、から、老眼鏡＝ファッションアイテムへ。50代以上の女性に向けた、大人の“魅せるメガネ”を提案するお店。洗練されたフレームがずらりと並び、リーズナブルな価格で選べる＋見た目も素敵。`, image: "/src/step-13.jpg" },
        { id: 7, title: "千成もなか", description: `千成もなか　
巣鴨駅すぐの老舗和菓子店【千成もなか本舗】店名由来は豊臣秀吉の馬印「千成瓢箪（ひょうたん）」、縁起を込めた最中が看板商品です。名物はひょうたん形の最中（五色あん）と、人気のあんバターどら焼き。あんバターどら焼きはブラックペッパーと合わせていただくのもオススメ。“和風パンケーキ”（どら焼きの皮だけ）も評判。`, image: "/src/step-12.jpg" },
        
        ],
        products: [
          { id: "9", title: "雪菓", imageUrl: "/src/pistachio.jpg", description: "ピスタチオミルク", likes: 3300, views: 6800, category_id: "3", category: "dessert", type: "shop" as const },
          { id: "10", title: "みずの", imageUrl: "/src/shio-daifuku.jpg", description: "塩大福", likes: 2900, views: 5400, category_id: "3", category: "dessert", type: "shop" as const },
          { id: "11", title: "パティスリー ヨーコ", imageUrl: "/src/montblanc.jpg", description: "和栗モンブラン", likes: 2100, views: 4100, category_id: "3", category: "dessert", type: "shop" as const },
          { id: "12", title: "巣鴨あんぱん本舗", imageUrl: "/src/jizo-anpan.jpg", description: "地蔵あんぱん", likes: 1700, views: 3200, category_id: "1", category: "bakery", type: "shop" as const },
          { id: "13", title: "茶の間", imageUrl: "/src/matcha-parfait.jpg", description: "抹茶パフェ", likes: 2400, views: 4600, category_id: "3", category: "dessert", type: "shop" as const },
          { id: "14", title: "巣鴨プリン", imageUrl: "/src/pudding.jpg", description: "昔ながらの固めプリン", likes: 1600, views: 3100, category_id: "3", category: "dessert", type: "shop" as const },
          { id: "15", title: "甘味処 さくら", imageUrl: "/src/zunda.jpg", description: "ずんだ白玉", likes: 1300, views: 2700, category_id: "3", category: "dessert", type: "shop" as const },
          { id: "16", title: "巣鴨ドーナツ", imageUrl: "/src/donut.jpg", description: "揚げたてドーナツ", likes: 1100, views: 2200, category_id: "1", category: "bakery", type: "shop" as const },
        ],
      }
    ],
  });
}

export default function ModelCourse() {
  const data = useLoaderData<typeof loader>();
  const location = useLocation();
  if (!data?.modelCourses?.length) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-2xl font-bold text-gray-700">Loading courses...</p>
      </div>
    );
  }

  const { modelCourses } = data;
  const [selectedCourse, setSelectedCourse] = useState(modelCourses[0]);
  const { isMobile } = useIsMobile();
  const { fs, fsm } = useUniversalFluid();
  const autoSize = (size: number) => (isMobile ? fsm(size) : fs(size));

  const [currentIndexM, setCurrentIndexM] = useState(modelCourses.length);
  const [isTransitioning, setIsTransitioning] = useState(true);
  const infiniteItems = [...modelCourses, ...modelCourses, ...modelCourses];

  const [currentIndex, setCurrentIndex] = useState(1);
  const [selectedStop, setSelectedStop] = useState<typeof selectedCourse.stops[0] | null>(null);
  const [selectedTitle, setSelectedTitle] = useState<string | null>(null);
  const [hasSvgAnimated, setHasSvgAnimated] = useState(false);
  const mapRef = useRef<HTMLDivElement>(null);
  const stopsRef = useRef<(HTMLDivElement | null)[]>([]);
  const handleCourseClick = (course: typeof modelCourses[0]) => {
    setSelectedCourse(course);
    setSelectedStop(null);
    setSelectedTitle(null);
    setHasSvgAnimated(false);
    stopsRef.current = [];
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  const itemWidth = isMobile ? 70 : 33.33;

  const handleNextM = () => {
    setIsTransitioning(true);
    setCurrentIndexM(prev => prev + 1);
  };

  const handlePrevM = () => {
    setIsTransitioning(true);
    setCurrentIndexM(prev => prev - 1);
  };

  const handleTransitionEnd = () => {
    const length = modelCourses.length;
    if (currentIndexM >= length * 2) {
      setIsTransitioning(false);
      setCurrentIndexM(currentIndexM - length);
    } else if (currentIndexM < length) {
      setIsTransitioning(false);
      setCurrentIndexM(currentIndexM + length);
    }
  };

  useEffect(() => {
    if (!isTransitioning) {
      setTimeout(() => setIsTransitioning(true), 50);
    }
  }, [isTransitioning]);
  const handlePinClick = (title: string) => {
    setSelectedTitle(title);
    const stop = selectedCourse.stops.find(s => s.title.trim() === title.trim());
    if (stop) {
      setSelectedStop(stop);
      const idx = selectedCourse.stops.indexOf(stop);
      stopsRef.current[idx]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    } else {
      setSelectedStop(null);
    }
  };
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasSvgAnimated) {
          setHasSvgAnimated(true);
        }
      },
      { threshold: 0.1 }
    );
    if (mapRef.current) observer.observe(mapRef.current);
    return () => observer.disconnect();
  }, [hasSvgAnimated, selectedCourse]);
  const handleNext = () => {
    const maxIndex = Math.max(0, selectedCourse.products.length - (isMobile ? 1 : 3));
    setCurrentIndex(prev => Math.min(prev + 1, maxIndex));
  };

  const handlePrev = () => {
    setCurrentIndex(prev => Math.max(prev - 1, 0));
  };
  const visibleItems = isMobile ? 1 : 3;
  const translateX = currentIndex * (100 / visibleItems);

  useEffect(() => {
    window.dispatchEvent(new Event('resize'));
  }, [location]);

  return (
    <div className="min-h-screen">
      <Header />
      <CommonCategoryTop
        title="MODEL COURSE"
        subtitle="モデルコース"
        imageSrc="/src/food.png"
        imageAlt="Food"
      />

      <MarqueeHeader
        text="Welcome to Sugamo! Pick your faves! Welcome to Sugamo! Pick your faves! Welcome to Sugamo! Pick your faves! Welcome to Sugamo! Pick your faves! Welcome to Sugamo! Pick your faves!"
        backgroundColor="#FFFFFF"
        textColor="#000000"
        animationDuration="90s"
        marginBottom={43}
        marginTop={98}
      />
      <div
        className="relative border-2 border-black rounded-[30px]"
        style={{
          marginLeft: isMobile ? fsm(20) : fs(90),
          marginRight: isMobile ? fsm(20) : fs(90),
          paddingTop: isMobile ? fsm(61) : fs(25),
        }}
      >
        <div className="rounded-lg overflow-hidden">
          <div
            className="flex ease-in-out"
            style={{
              transform: `translateX(-${currentIndexM * itemWidth}%)`,
              transition: isTransitioning ? 'transform 300ms ease-in-out' : 'none',
            }}
            onTransitionEnd={handleTransitionEnd}
          >
            {infiniteItems.map((course, idx) => (
              <div
                key={idx}
                className="flex-shrink-0 flex flex-row"
                style={{
                  width: `${itemWidth}%`,
                  paddingLeft: isMobile ? fsm(16) : fs(42)
                }}
              >
                <div
                  onClick={() => handleCourseClick(course)}
                  className="cursor-pointer w-full"
                >
                  <ModelCourseDetailsItem
                    title={course.title}
                    imageUrl={course.imageUrl}
                    itemNumber={course.id}
                  />
                </div>
                {idx !== infiniteItems.length - 1 && (
                  <div
                    className="w-[2px] h-full bg-black"
                    style={{ marginLeft: isMobile ? fsm(16) : fs(42) }}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
        <div
          className="flex justify-between"
          style={{
            height: isMobile ? fsm(61) : fs(68),
            paddingLeft: isMobile ? fsm(20) : fs(23),
            paddingRight: isMobile ? fsm(20) : fs(23),
          }}
        >
          <button onClick={handlePrevM} className="text-4xl">
            ←
          </button>
          <button onClick={handleNextM} className="text-4xl">
            →
          </button>
        </div>
      </div>

      {/* COURSE DETAILS */}
      <div
        className="relative border-black border-2 rounded-[30px] overflow-hidden"
        style={{
          marginLeft: isMobile ? fsm(20) : fs(90),
          marginRight: isMobile ? fsm(20) : fs(90),
          marginTop: isMobile ? fsm(88) : fs(101),
        }}
      >
        <div className="bg-white overflow-hidden">
          <div
            className="flex flex-col justify-between"
            style={{
              marginLeft: isMobile ? fsm(20) : fs(33),
              marginRight: isMobile ? fsm(20) : fs(33)
            }}
          >
            <div className="flex items-center justify-between">
              <span className="flex items-center">
                <p
                  className="font-bold font-cousine text-black"
                  style={{ fontSize: isMobile ? fsm(48) : fs(61) }}
                >
                  COURSE
                </p>
                {!isMobile && (
                  <div className="flex flex-row items-center">
                    <div className="border-l-2 border-black h-10 mx-4"></div>
                    <p
                      className="font-semibold font-cairo"
                      style={{
                        fontSize: isMobile ? fsm(25) : fs(25),
                        color: '#111827',
                      }}
                    >
                      {selectedCourse.subtitle}
                    </p>
                  </div>
                )}
              </span>
              <span
                className="font-cousine font-bold italic"
                style={{
                  fontSize: isMobile ? fsm(21) : fs(31),
                  color: '#000000',
                }}
              >
                #{selectedCourse.id}
              </span>
            </div>
          </div>

          <div
            className="border-t-2 border-black"
            style={{
              marginBottom: isMobile ? fsm(33) : fs(33),
              marginRight: isMobile ? fsm(20) : fs(33),
              marginLeft: isMobile ? fsm(20) : fs(33)
            }}
          ></div>

          <div
            className="border-l-2 border-r-2 border-black rounded-lg overflow-hidden"
            style={{
              marginLeft: isMobile ? fsm(20) : fs(33),
              marginRight: isMobile ? fsm(20) : fs(33)
            }}
          >
            <MarqueeHeader
              text="Welcome to Sugamo! Pick your faves! Welcome to Sugamo! Pick your faves! Welcome to Sugamo! Pick your faves! Welcome to Sugamo! Pick your faves! Welcome to Sugamo! Pick your faves!"
              backgroundColor="#FFFFFF"
              textColor="#000000"
              animationDuration="90s"
              marginBottom={0}
              marginTop={0}
            />
            <div style={{ position: 'relative' }} ref={mapRef}>
              <MapSVG
                svgPath={selectedCourse.svgPath}
                onPinClick={handlePinClick}
                startAnimation={hasSvgAnimated}
              />
            </div>
            <MarqueeHeader
              text="Welcome to Sugamo! Pick your faves! Welcome to Sugamo! Pick your faves! Welcome to Sugamo! Pick your faves! Welcome to Sugamo! Pick your faves! Welcome to Sugamo! Pick your faves!"
              backgroundColor="#FFFFFF"
              textColor="#000000"
              animationDuration="90s"
              marginBottom={0}
              marginTop={0}
            />
          </div>

          <div
            className="border-t-2 border-black"
            style={{
              marginTop: isMobile ? fsm(16) : fs(26),
              marginRight: isMobile ? fsm(20) : fs(33),
              marginLeft: isMobile ? fsm(20) : fs(33)
            }}
          ></div>

          <div
            className="h-auto"
            style={{
              marginTop: isMobile ? fsm(33) : fs(33),
              paddingBottom: isMobile ? fsm(33) : fs(33),
            }}
          >
            <div className="mx-auto flex flex-col md:flex-row">
              <div
                className="w-full md:w-2/3"
                style={{ paddingRight: isMobile ? fsm(0) : fs(36) }}
              >
                {selectedStop ? (
                  <div
                    className="w-full"
                    style={{
                      paddingLeft: isMobile ? fsm(21) : fs(28),
                      paddingTop: isMobile ? fsm(0) : fs(58),
                      paddingRight: isMobile ? fsm(21) : fs(0),
                    }}
                  >
                    <div
                      className="text-start flex-1"
                      style={{
                        marginLeft: isMobile ? fsm(16) : fs(16),
                        marginRight: isMobile ? fsm(16) : fs(16),
                      }}
                    >
                      <p
                        className="font-cairo font-semibold text-black"
                        style={{ fontSize: isMobile ? fsm(24) : fs(26) }}
                      >
                        {selectedCourse.subtitle}
                      </p>
                      <div
                        className="font-cairo text-gray-700"
                        style={{
                          fontSize: isMobile ? fsm(16) : fs(16),
                          marginTop: isMobile ? fsm(6) : fs(8),
                          marginBottom: "50px",
                          lineHeight: '40px',
                        }}
                        dangerouslySetInnerHTML={{ __html: selectedStop.description }}
                      />
                    </div>

                    <div className="w-full border-t-2 border-black mb-4"></div>

                    <div className="w-full flex flex-row items-center gap-4 mb-4">
                      <div
                        className="bg-gray-300 flex items-center justify-center text-gray-600"
                        style={{
                          backgroundImage: `url(${selectedStop.image})`,
                          backgroundSize: 'cover',
                          backgroundPosition: 'center',
                          backgroundRepeat: 'no-repeat',
                          width: isMobile ? fsm(150) : fs(150),
                          height: isMobile ? fsm(170) : fs(170),
                          borderRadius: '0',
                          marginTop: '32px',
                          marginRight: '20px',
                          marginBottom: '20px',
                        }}
                      >
                        {selectedStop.image.includes('placeholder') && `Img ${selectedStop.id}`}
                      </div>
                     
                      <div className="flex-1">
                        <p
                          className="font-cairo text-black font-semibold"
                          style={{
                            fontSize: isMobile ? fsm(16) : fs(20),
                            marginTop: isMobile ? fsm(0) : fs(37),
                            lineHeight: '100%',
                          }}
                        >
                          {selectedStop.title}
                        </p>
                        <p
                           className="font-cairo "
                          style={{
                            fontSize: isMobile ? fsm(16) : fs(18),
                            color: '#313131',
                            lineHeight: '40px',
                          }}
                        >
                          OPEN 10:00 〜 22:00 <br />
                          TEL: 03-5944-5737 <br />
                          JR巣鴨駅より徒歩5分
                        </p>
                      </div>
                    </div>
                  <div 
                      className="w-full text-left py-4"
                      style={{
                        fontSize: isMobile ? fsm(16) : fs(16),
                      }}
                    >
                      <p className="font-cairo text-gray-500" style={{ lineHeight: '40px' }}>
                        巣鴨地蔵通りの入り口にある【眞性寺】。<br />
                        ここには江戸六地蔵尊のひとつが祀られています。1714年に造立された高さ2.7mもの大地蔵は、旅人の安全と人々の無病息災を願って建立されたもの。<br />
                        今も商店街のシンボルとして、参拝客をやさしく見守っています。
                      </p>
                    </div>
                  </div>
                ) : (
                  <p
                    className="w-full text-black text-start leading-[40px] font-cairo font-normal"
                    style={{
                      fontSize: isMobile ? fsm(16) : fs(16),
                      paddingLeft: isMobile ? fsm(21) : fs(28),
                      paddingTop: isMobile ? fsm(0) : fs(58),
                      paddingRight: isMobile ? fsm(21) : fs(0),
                    }}
                  >
                    このコースは、巣鴨の歴史と文化、そしてグルメをバランスよく楽しめる、まさに「王道」と呼ぶにふさわしい内容です。
                    <br />
                    コースの始まりは、江戸六地蔵のひとつである眞性寺。旅の安全を願って造られた歴史的なお地蔵様を拝んだら、巣鴨のメインストリート、地蔵通り商店街へ。
                    <br />
                    商店街の中ほどにあるとげぬき地蔵尊 高岩寺では、お年寄りから「とげぬき地蔵」として親しまれているお地蔵様にお参りできます。「洗い観音」に水をかけて清める体験も、巣鴨ならではです。
                    <br />
                    <br />
                    お参りを終えたら、お待ちかねのグルメタイム。「カレーうどん」で有名な古奈屋で食事をしたり、行列のできるかき氷店雪菓で休憩したりと、人気の味を堪能できます。また、マルジでは「赤いパンツ」をはじめとするユニークな商品が並び、巣鴨らしい活気を感じられます。さらに、お茶の老舗山年園や、名物の「塩大福」が人気のみずのに立ち寄れば、お土産探しも完璧です。
                    <br />
                    <br />
                    <br />
                    歴史的なお寺を巡り、おいしいものを味わい、活気あふれる商店街で買い物を楽しむ。このコースは、巣鴨の魅力をぎゅっと凝縮した、初めての方にもリピーターにもおすすめのコースです。
                  </p>
                )}
              </div>

              <div
                className="w-auto md:w-[2px] bg-black h-[2px] md:h-auto"
                style={{
                  marginRight: isMobile ? fsm(20) : fs(36),
                  marginLeft: isMobile ? fsm(20) : 0,
                  marginTop: isMobile ? fsm(48) : 0
                }}
              ></div>

              <div className="w-auto md:w-1/3 flex flex-col items-center"
                style={{
                  marginLeft: isMobile ? fsm(20) : 0,
                  marginRight: isMobile ? fsm(20) : fs(4)
                }}
              >
                <div className="text-start w-full">
                  <h2
                    className="text-start font-cousine font-bold italic text-black"
                    style={{
                      fontSize: isMobile ? fsm(31) : fs(31),
                      paddingTop: isMobile ? fsm(48) : fs(14),
                    }}
                  >
                    START!
                  </h2>
                </div>
                <div
                  className="w-full"
                  style={{
                    height: isMobile ? 'auto' : fs(645),
                    overflowY: isMobile ? 'visible' : 'scroll',
                  }}
                >
                  {selectedCourse.stops.map((stop, index) => (
                    <div
                      key={stop.id}
                      ref={(el) => (stopsRef.current[index] = el)}
                      className={`flex flex-col items-center`}
                      style={{
                        height: isMobile ? fsm(115) : fs(115),
                        marginBottom: isMobile ? fsm(16) : fs(16),
                      }}
                    >
                      <div
                        className={`border-2 border-black rounded-[10px] w-full flex overflow-hidden ${selectedTitle === stop.title ? 'bg-[#ED4548]' : 'bg-[#FFFFFF]'
                          }`}
                      >
                        <div
                          className="bg-gray-300 flex items-center justify-center text-gray-600"
                          style={{
                            backgroundImage: `url(${stop.image})`,
                            backgroundSize: 'cover',
                            width: isMobile ? fsm(113) : fs(113),
                            height: isMobile ? fsm(113) : fs(113),
                          }}
                        >
                          {stop.image.includes('placeholder') && `Image ${stop.id}`}
                        </div>
                        <div
                          className="text-start"
                          style={{ marginLeft: isMobile ? fsm(16) : fs(16) }}
                        >
                          <h3
                            className={`italic font-bold font-cousine ${selectedTitle === stop.title ? 'text-[#FFFFFF]' : 'text-[#000000]'
                              }`}
                            style={{
                              fontSize: isMobile ? fsm(16) : fs(16),
                              marginTop: isMobile ? fsm(7) : fs(7),
                            }}
                          >
                            STOP.{stop.id}
                          </h3>
                          <p
                            className={`font-cairo font-semibold ${selectedTitle === stop.title ? 'text-[#FFFFFF]' : 'text-[#000000]'
                              }`}
                            style={{ fontSize: isMobile ? fsm(20) : fs(20) }}
                          >
                            {stop.title}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="w-full text-end pr-2">
                  <h2
                    className="font-bold text-black font-cousine italic"
                    style={{
                      fontSize: isMobile ? fsm(31) : fs(31),
                      marginTop: isMobile ? fsm(16) : fs(26),
                    }}
                  >
                    FINISH!
                  </h2>
                </div>
              </div>

              {!isMobile && (
                <div className="mx-auto h-full" style={{ marginTop: fs(73) }}>
                  <img
                    src="/src/union.svg"
                    alt="Description"
                    style={{ height: fs(311) }}
                  />
                  <img
                    src="/src/union.svg"
                    alt="Description"
                    style={{ marginTop: fs(18) }}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* COURSE SHOPS */}
      <div
        className="relative"
        style={{
          marginTop: isMobile ? fsm(117) : fs(207),
          paddingLeft: isMobile ? fsm(20) : fs(90),
          paddingRight: isMobile ? fsm(20) : fs(90),
          marginBottom: isMobile ? fsm(144) : fs(130),
        }}
      >
        <div
          className="border-2 border-black rounded-[10px] overflow-visible relative"
          style={{ paddingTop: isMobile ? fsm(76) : fs(76) }}
        >
          <div
            className="absolute top-0 -translate-y-1/2 left-1/2 -translate-x-1/2 bg-white text-center font-bold italic font-cousine inline-block text-wrap"
            style={{
              paddingLeft: isMobile ? fsm(2) : fs(14),
              paddingRight: isMobile ? fsm(2) : fs(14),
              fontSize: autoSize(31),
            }}
          >
            COURSE SHOPS
          </div>
          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-300 ease-in-out px-[25%]"
              style={{
                transform: `translateX(-${currentIndex * 25}%)`,
                width: `${selectedCourse.products.length * 25}%`,
              }}
            >
              {selectedCourse.products.map((product, i) => (
                <div key={i} className="flex-shrink-0 p-2" style={{ width: isMobile ? fsm(210) : fs(350), height: isMobile ? fsm(301) : fs(496) }}>
                  <ShopItem {...product} imageUrl={product.imageUrl} />
                </div>
              ))}
            </div>
          </div>
          <div
            className="flex justify-between px-4"
            style={{ height: autoSize(76) }}
          >
            <button
              onClick={handlePrev}
              className="text-4xl disabled:opacity-30"
              disabled={currentIndex === 0}
            >
              ←
            </button>
            <button
              onClick={handleNext}
              className="text-4xl disabled:opacity-30"
              disabled={currentIndex >= selectedCourse.products.length - 4}
            >
              →
            </button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}