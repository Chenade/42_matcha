import { useEffect } from 'react';
import './imgSlideshow.css';

const showSlides = (n: number) => {
    let i;
    const slides = document.getElementsByClassName("mySlides");
    const dots = document.getElementsByClassName("dot");

    if (slides.length === 0 || dots.length === 0) return;

    if (n > slides.length) { slideIndex = 1 }
    if (n < 1) { slideIndex = slides.length }

    for (i = 0; i < slides.length; i++) {
        (slides[i] as HTMLElement).style.display = "none";
    }

    for (i = 0; i < dots.length; i++) {
        dots[i].classList.remove("active");
    }

    if (slides[slideIndex - 1]) {
        (slides[slideIndex - 1] as HTMLElement).style.display = "block";
    }

    if (dots[slideIndex - 1]) {
        dots[slideIndex - 1].classList.add("active");
    }
}

const plusSlides = (n: number) => {
    showSlides(slideIndex += n);
}

const currentSlide = (n: number) => {
    showSlides(slideIndex = n);
}

let slideIndex = 1;

export const ImgSlideshow = ({
    img,
}: {
    img: string[];
}) => {
    useEffect(() => {
        if (img && img.length > 0) {
            slideIndex = 1;
            showSlides(slideIndex);
        }
    }, [img]); 

    return (

        <>
            <div className="slideshow-container">

                {img && img.length > 0 && img.map((img, index) => (
                    <div className="mySlides fade" key={index}>
                        <div className="img-container">
                            <img src={img} alt="user" />
                        </div>
                    </div>
                )) }

                <div className="prev" onClick={() => plusSlides(-1)}>&#10094;</div>
                <div className="next" onClick={() => plusSlides(1)}>&#10095;</div>
            </div>
            <br />

            <div className="dot-container">
                {img && img.length > 0 && img.map((_, i) => (
                    <span className="dot" key={i} onClick={() => currentSlide(i + 1)}></span>
                ))}
            </div>
        </>
    );
};
