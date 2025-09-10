import { Link } from "@remix-run/react";
import { useUniversalFluid } from '../hooks/useUniversalFluid';

export default function ModelCourseItem({ title , itemNumber, imageUrl}) {
    const { fs,fsm,fsVw,fluidStyle,fluidClass } = useUniversalFluid();
    return (
        <div className="bg-white flex flex-col items-center justify-center px-7">
            <div className="w-full bg-white overflow-hidden">
                <div className="flex flex-col justify-between">
                    <div className="flex space-x-3 justify-between">
                        <span className="flex items-center space-x-3">
                            <p className="font-bold font-cairo" style={{ fontSize: fs(20), color: "#111827" }}>
                                COURSE
                            </p>
                            <img src="/src/love.svg" alt="Love" style={{ width: fs(20), height: fs(20) }} />
                            <span className="flex items-center">
                                <img src="/src/bookmark.svg" alt="Bookmark" style={{ width: fs(20), height: fs(20) }} />
                            </span>
                        </span>
                        <span className="ml-1" style={{ fontSize: fs(20), color: "#000000" }}>#{itemNumber}</span>
                    </div>
                    <img
                        src={imageUrl}
                        alt="Course Image"
                        className="w-full object-cover rounded-lg"
                    />
                </div>
                <div className="p-4 text-start">
                    <h1 className="font-semibold" style={{ fontSize: fs(20), color: "#313131", fontFamily: "Cairo" }}>
                        {title}
                    </h1>
                </div>
            </div>
        </div>
    );
}