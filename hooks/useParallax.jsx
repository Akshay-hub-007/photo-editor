import React, { useEffect, useState } from 'react'

function useParallax() {


    const [scrollY, setScrollY] = useState(0);

    useEffect(() => {
        const handleScroll = () => setScrollY(window.scrollY)
        window.addEventListener("scroll", handleScroll)

        return ()=>window.removeEventListener("scroll",handleScroll)
    })

    return scrollY
}

export default useParallax
