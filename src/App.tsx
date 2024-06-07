import React, { useState, useRef, useEffect } from 'react';
import right from './assets/right-2-svgrepo-com.svg'
import left from './assets/left-2-svgrepo-com.svg'

const images = [
  "https://picsum.photos/seed/0007/200/300",
  "https://picsum.photos/seed/0002/200/300",
  "https://picsum.photos/seed/0003/200/300",
  "https://picsum.photos/seed/0004/200/300",
  "https://picsum.photos/seed/0005/200/300",
  "https://picsum.photos/seed/0006/200/300",
]


const fetchImage = async (url: string) => {
  try {
    const response = await fetch(url);
    const blob = await response.blob();
    const imageUrl = URL.createObjectURL(blob)

    return imageUrl
  } catch (error) {
    console.error('There was a problem with the operation', error)

    return null;
  }
}

const App: React.FC = () => {
  const [showScrollLeft, setShowScrollLeft] = useState(false);
  const [showScrollRight, setShowScrollRight] = useState(true);

  const [imagesState, setImageState] = useState(images);

  const imageStripRef = useRef<HTMLDivElement>(null);

  const checkScrollButtons = () => {
    if (imageStripRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = imageStripRef.current;
      setShowScrollLeft(scrollLeft > 0);
      setShowScrollRight(scrollLeft + clientWidth < scrollWidth - 10);
    }
  };

  const addImage = async () => {
    const imageSeed = Math.floor(1000 + Math.random() * 9000);
    const imgSrc = `https://picsum.photos/seed/${imageSeed}/200/300`;

    const imgUrl: any = await fetchImage(imgSrc)
    setImageState((prevState) => [...prevState, imgUrl])
    if (imageStripRef.current && imgUrl) {
      const lastElementChild = imageStripRef.current.lastElementChild as HTMLElement
      if(lastElementChild) {
        lastElementChild.scrollIntoView({ behavior: 'smooth'});
        checkScrollButtons()
      }
    }
  }

  const removeImage = () => {
    const randomIndex = Math.floor(Math.random() * images.length);
    
    const elementID = `${imagesState[randomIndex]}-${randomIndex}`

    document.getElementById(elementID)?.scrollIntoView()

    setImageState((prevState) => {
      return prevState.filter((_, index) => index !== randomIndex)
    })
    checkScrollButtons()
  }

  const scrollLeft = () => {
    if (imageStripRef.current) {    
      const scrollWidth = imageStripRef.current.scrollWidth;
      const clientWidth = imageStripRef.current.clientWidth;
      const scrollDistance = (scrollWidth / (clientWidth * 0.5)) + 200;
      imageStripRef.current.scrollBy({ left: -scrollDistance, behavior: 'smooth' });
    }
  }

  const scrollRight = () => {
    if (imageStripRef.current) {
      const scrollWidth = imageStripRef.current.scrollWidth;
      const clientWidth = imageStripRef.current.clientWidth;
      const scrollDistance = (scrollWidth / (clientWidth * 0.5)) + 200;
      imageStripRef.current.scrollBy({ left: scrollDistance, behavior: 'smooth' })
    }
  }

  useEffect(() => {
    const handleScroll = () => {
      checkScrollButtons();
    };

    const scrollContainer = imageStripRef.current;
    if (scrollContainer) {
      scrollContainer.addEventListener('scroll', handleScroll);
    }

    return () => {
      if (scrollContainer) {
        scrollContainer.removeEventListener('scroll', handleScroll);
      }
    };
  }, [])


  return (
    <div className="root-container">
      <div className="slider">
        {showScrollLeft && (
          <button className="scroll-button arrow-left" onClick={scrollLeft}>
            <img src={left} />
          </button>
        )
        }
        <div className="image-strip" ref={imageStripRef}>
          {imagesState && imagesState.map((src, index) => (
            <div className="slider-image">
              <img src={src} key={`${src}-${index}`} id={`${src}-${index}`} alt=".." />
            </div>
          ))}
        </div>
        {showScrollRight && (
          <button className="scroll-button arrow-right" onClick={scrollRight}>
            <img src={right} />
          </button>
        )}
      </div>
      <div className="controls">
        <button onClick={addImage}>Add</button>
        <button onClick={removeImage} disabled={imagesState.length === 0}>Remove</button>
      </div>
    </div>
  )
}

export default App;
