"use client"

import "./VideoHero.css"

export default function VideoHero() {
    return (
        <section className="video-hero color-background-2">
            <video
                className="video-hero__bg"
                autoPlay
                muted
                loop
                playsInline
            >
                <source src="https://www.pexels.com/download/video/13023865/" type="video/mp4" />
            </video>

            <div className="video-hero__overlay">
                <div className="video-hero__content">
                    <div className="hero-row">
                        <div className="hero-text">
                            <span className="hero-eyebrow">
                                TIMELESS ARTISTRY IN EVERY PIECE
                            </span>

                            <h1 className="hero-title">
                                Handcrafted Wooden <br /> Collection
                            </h1>
                        </div>

                        <a href="/shop" className="btn hero-btn">
                            <span>Shop now</span>
                            <i className="zmdi zmdi-long-arrow-right"></i>
                        </a>
                    </div>

                    <span className="hero-divider" />
                </div>
            </div>
        </section>
    )
}
