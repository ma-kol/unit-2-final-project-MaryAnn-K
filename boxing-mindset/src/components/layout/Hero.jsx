import boxingVideo from '/videos/boxing-video.mp4';

const Hero = () => {
    return (
        <main>
            <section className="hero">
                <video
                    className="hero-video"
                    autoPlay
                    muted
                    playsInline
                >
                    <source src={boxingVideo} type="video/mp4" />
                </video>
                <div className="hero-overlay">
                    <h1>Where Champions Are Made</h1>
                    <button>Learn More</button>
                </div>
            </section>
        </main>
    )
}

export default Hero;