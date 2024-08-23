import Clock from "react-live-clock";
import React from "react";



export const LocalTime = () => {
    return (
        <div
            className="md:text-md lg:text-md text-xs flex flex-row justify-between md:space-x-2 space-x-1">
            <p> [ GB | </p>
            <Clock
                timezone={"GB"}
                format={"H:mm:ss"}
                ticking={true}
            />
            <p> ] </p>
        </div>
    )
}