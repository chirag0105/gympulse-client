import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import './Landing.css';

function Landing() {
    const featuresRef = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                    }
                });
            },
            { threshold: 0.1 }
        );

        const elements = document.querySelectorAll('.scroll-reveal');
        elements.forEach((el) => observer.observe(el));

        return () => observer.disconnect();
    }, []);

    return (
        <div className="landing">
            {/* Header */}
            <header className="landing-header">
                <div className="landing-nav">
                    <span className="landing-logo">💪 GymPulse</span>
                    <nav className="landing-links">
                        <a href="#features">Features</a>
                        <a href="#how-it-works">How It Works</a>
                    </nav>
                    <div className="landing-actions">
                        <Link to="/login" className="nav-link-btn">Sign In</Link>
                        <Link to="/register" className="nav-cta-btn">Get Started</Link>
                    </div>
                </div>
            </header>

            {/* Hero */}
            <section className="hero">
                <div className="hero-bg">
                    <div className="hero-orb hero-orb-1"></div>
                    <div className="hero-orb hero-orb-2"></div>
                    <div className="hero-orb hero-orb-3"></div>
                </div>
                <div className="hero-content">
                    <h1 className="hero-title">
                        Train Smarter.<br />
                        <span className="hero-gradient">Track Progress.</span><br />
                        Transform Lives.
                    </h1>
                    <p className="hero-subtitle">
                        The all-in-one platform for personal trainers and their clients.
                        Build workouts, track performance, and watch transformations happen.
                    </p>
                    <div className="hero-buttons">
                        <Link to="/register" className="hero-cta-primary">Get Started Free</Link>
                        <a href="#features" className="hero-cta-secondary">Learn More ↓</a>
                    </div>
                    <div className="hero-stats">
                        <div className="hero-stat">
                            <span className="hero-stat-value">100+</span>
                            <span className="hero-stat-label">Exercises</span>
                        </div>
                        <div className="hero-stat-divider"></div>
                        <div className="hero-stat">
                            <span className="hero-stat-value">3</span>
                            <span className="hero-stat-label">User Roles</span>
                        </div>
                        <div className="hero-stat-divider"></div>
                        <div className="hero-stat">
                            <span className="hero-stat-value">∞</span>
                            <span className="hero-stat-label">Potential</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features */}
            <section id="features" className="features" ref={featuresRef}>
                <div className="section-container">
                    <h2 className="section-title scroll-reveal">Everything You Need</h2>
                    <p className="section-subtitle scroll-reveal">Powerful tools for trainers. Simple experience for clients.</p>

                    <div className="features-grid">
                        <div className="feature-card scroll-reveal" style={{ animationDelay: '0.1s' }}>
                            <div className="feature-icon">🏋️</div>
                            <h3>Custom Workouts</h3>
                            <p>Build personalized workout plans with exercises, sets, reps, weight, and RPE targets.</p>
                        </div>
                        <div className="feature-card scroll-reveal" style={{ animationDelay: '0.2s' }}>
                            <div className="feature-icon">📅</div>
                            <h3>Weekly Calendar</h3>
                            <p>Clients see their schedule at a glance. Navigate past and future weeks with ease.</p>
                        </div>
                        <div className="feature-card scroll-reveal" style={{ animationDelay: '0.3s' }}>
                            <div className="feature-icon">📊</div>
                            <h3>Progress Tracking</h3>
                            <p>Monitor body measurements and workout performance over time with beautiful charts.</p>
                        </div>
                        <div className="feature-card scroll-reveal" style={{ animationDelay: '0.4s' }}>
                            <div className="feature-icon">⚡</div>
                            <h3>Real-time Insights</h3>
                            <p>Fun stats like total weight lifted per session. See every rep count toward your goals.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* How It Works */}
            <section id="how-it-works" className="how-it-works">
                <div className="section-container">
                    <h2 className="section-title scroll-reveal">How It Works</h2>
                    <p className="section-subtitle scroll-reveal">Three simple steps to transform your training</p>

                    <div className="steps">
                        <div className="step scroll-reveal" style={{ animationDelay: '0.1s' }}>
                            <div className="step-number">01</div>
                            <h3>Sign Up as a Personal Trainer</h3>
                            <p>Create your account and set up your profile in minutes.</p>
                        </div>
                        <div className="step-connector scroll-reveal"></div>
                        <div className="step scroll-reveal" style={{ animationDelay: '0.2s' }}>
                            <div className="step-number">02</div>
                            <h3>Add Clients & Build Plans</h3>
                            <p>Invite clients by email and create custom workout programs.</p>
                        </div>
                        <div className="step-connector scroll-reveal"></div>
                        <div className="step scroll-reveal" style={{ animationDelay: '0.3s' }}>
                            <div className="step-number">03</div>
                            <h3>Clients Train & Transform</h3>
                            <p>Clients follow workouts, log performance, and track their journey.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="cta-section">
                <div className="section-container">
                    <div className="cta-card scroll-reveal">
                        <h2>Ready to Transform Your Training?</h2>
                        <p>Join GymPulse and start building better workouts today.</p>
                        <Link to="/register" className="hero-cta-primary">Get Started Free</Link>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="landing-footer">
                <div className="footer-content">
                    <span className="landing-logo">💪 GymPulse</span>
                    <p>&copy; 2026 GymPulse. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
}

export default Landing;
