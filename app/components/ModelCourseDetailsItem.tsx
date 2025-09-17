import { Link } from "@remix-run/react";
import { useUniversalFluid } from '../hooks/useUniversalFluid';
import { useMediaQuery } from "react-responsive";

export default function ModelCourseItem({ title , itemNumber, imageUrl}) {
    const { fs,fsm,fsVw,fluidStyle,fluidClass } = useUniversalFluid();
    const isMobile = useMediaQuery({ maxWidth: 768 });
    return (
        <div className="bg-white flex flex-col items-center justify-center">
            <div className="w-full bg-white overflow-hidden" style={{paddingTop: isMobile? fsm(10): fs(40)}}>
                <div className="flex flex-col justify-between">
                    <div className="flex bg-white justify-between">
                        <span className="flex items-center " style={{gap: fs(15)}}>
                            <p className="font-bold italic font-cousine text-black" style={{ fontSize: isMobile ? fsm(25) : fs(25)}}>
                                COURSE
                            </p>
                            {!isMobile && (
                                <>
                                    <img src="/src/bookmark.svg" alt="Bookmark" style={{ width: fs(18), height: fs(24) }} />
                                    <img src="/src/love.svg" alt="Love" style={{ width: fs(25), height: fs(22) }} />
                                </>
                            )}
                        </span>
                        <span className="font-bold font-cousine italic" style={{ fontSize: isMobile ? fsm(31) : fs(31), color: "#000000",paddingRight: isMobile ? fsm(5) : fs(5) }}>#{itemNumber}</span>
                    </div>
                    <img
                        src={imageUrl}
                        alt="Course Image"
                        className="object-cover rounded-[30px]"
                        style={{width: isMobile?fsm(256):fs(331), height: isMobile ? fsm(181) : fs(235) }}
                    />
                </div>
                <div className="text-start" style={{marginTop: isMobile ? fsm(8): fs(33)}}>
                    <h1 className="font-semibold" style={{ fontSize: isMobile ? fsm(20) : fs(25), color: "#313131", fontFamily: "Cairo" }}>
                        {title}
                    </h1>
                </div>
            </div>
        </div>
    );
}