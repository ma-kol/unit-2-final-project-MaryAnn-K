import boxingVideo from '/videos/boxing-video.mp4';
import { Link } from 'react-router-dom';
import Button from '../layout/Button';

const Hero = () => {
    return (
        <main>
            <section className="hero">
                <video
                    className="hero-video"
                    autoPlay
                    muted
                    loop
                    playsInline
                >
                    <source src={boxingVideo} type="video/mp4" alt="Two boxers sparring in a boxing ring" />
                </video>
                <div className="hero-overlay">
                    <h2>Where Champions Are Made</h2>
                    <p className="hero-message">consistency | dedication | passion</p>
                    <Link to="/contactus">
                        <Button
                            label='Learn More'
                            className='learn-more-button'
                        />
                    </Link>
                </div>
            </section>
        </main>
    )
}

export default Hero;