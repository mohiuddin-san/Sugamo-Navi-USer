import { Link } from "@remix-run/react";
import { useUniversalFluid } from '../hooks/useUniversalFluid';
import { useMediaQuery } from "react-responsive";

export default function ModelCourseItem({ title, details, categories, itemNumber, imageUrl }) {
    const { fs, fsm, fsVw, fluidStyle, fluidClass } = useUniversalFluid();
    const isMobile = useMediaQuery({ maxWidth: 767 });
    return (
        <div className="flex flex-col items-center justify-center" style={{ paddingTop: isMobile ? fsm(21) : fs(38), paddingLeft: isMobile ? fsm(22) : fs(43), paddingRight: isMobile ? fsm(21) : fs(43) }}>
            <div className="w-full bg-white overflow-hidden">
                <div className="flex flex-col justify-between">
                    <div className="flex space-x-3 justify-between">
                        <span className="flex items-center " style={{ gap: isMobile ? fsm(16) : fs(16) }}>
                            <p className="italic font-bold font-cairo" style={{ fontSize: isMobile ? fsm(25) : fs(25), color: "#111827" }}>
                                COURSE
                            </p>
                            <img src="/src/bookmark.svg" alt="Bookmark" style={{ width: isMobile ? fsm(18) : fs(18), height: isMobile ? fsm(24) : fs(24) }} />
                            <img src="/src/love.svg" alt="Love" style={{ width: isMobile ? fsm(26) : fs(26), height: isMobile ? fsm(22) : fs(22) }} />

                        </span>
                        <p className="italic font-bold font-cousine pr-2" style={{ fontSize: isMobile ? fsm(31) : fs(31), color: "#111827" }}>
                            #{itemNumber}
                        </p>
                    </div>
                    <img
                        src={imageUrl}
                        alt="Course Image"
                        className="w-full object-cover rounded-lg"
                    />
                </div>
                <div className="w-full text-center md:text-start" style={{ paddingTop: isMobile ? fsm(12) : fs(16) }}>
                    <h1 className="font-semibold font-cairo" style={{ fontSize: isMobile ? fsm(25) : fs(39), color: "#313131", paddingLeft: fs(25), fontWeight: fs(600) }}>
                        {title}
                    </h1>
                    {!isMobile && (
                        <div className="flex flex-row" style={{gap: fs(24)}}>
                           
                            <div
                                className="flex flex-col text-start "
                                style={{ marginTop: fs(10), width: "58%", paddingLeft: fs(25) }}
                            >
                                <p
                                    className="text-lg font-cairo leading-loose"
                                    style={{
                                        fontSize: isMobile ? fsm(16) : fs(16),
                                        color: "#313131",
                                        fontWeight: fs(400),
                                    }}
                                >
                                    {details}
                                </p>

                                <div
                                    className="flex flex-wrap justify-start gap-2 "
                                    style={{ marginTop: fs(20) }}
                                >
                                    {categories.map((category, index) => (
                                        <button
                                            key={index}
                                            className="bg-red-500 text-white rounded-full italic font-cousine font-bold"
                                            style={{
                                                width: fs(90),
                                                height: fs(24),
                                                padding: `0 ${fs(5)}`,
                                                fontSize: fs(12),
                                            }}
                                        >
                                            #{category}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div className="flex flex-col justify-end">
                                <img
                                    className="w-full"
                                    src="./src/lets_go.png"
                                    style={{ width: fs(205) }}
                                    alt="Lets Image"
                                />
                            </div>
                        </div>

                    )}
                    {isMobile && (
                        <div className="flex flex-col " style={{paddingLeft: fsm(21),
                                        paddingRight: fsm(21),paddingBottom: fsm(24),paddingTop: fsm(12)}}>
                            <p
                                    className="text-lg font-cairo text-start"
                                    style={{
                                        fontSize:fsm(16),
                                        color: "#313131",
                                        fontWeight: fsm(400),
                                        letterSpacing: 0
                                    }}
                                >
                                    {details}
                                </p>
                            <div className="flex flex-row text-start" style={{ marginTop: fsm(32) }}>
                                <div className="flex flex-col justify-start ">
                                    {categories.map((category, index) => (
                                        <button
                                            key={index}
                                            className="bg-red-500 text-white rounded-full italic font-cairo"
                                            style={{
                                                width: fsm(90),
                                                height: fsm(22),
                                                padding: `0 ${fs(5)}`,
                                                fontSize: fsm(12),
                                                marginTop: fsm(8)
                                            }}
                                        >
                                            #{category}
                                        </button>
                                    ))}
                                </div>
                                <div className="flex flex-col justify-end" style={{ width: fsm(225),height:fsm(100), marginLeft: fsm(38)}}>
                                    <img
                                        className="w-full h-auto"
                                        src="./src/lets_go.png"
                                        alt="Lets Image"
                                    />
                                </div>
                            </div>

                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}