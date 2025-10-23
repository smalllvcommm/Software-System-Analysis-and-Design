// src/pages/Home/components/Banner.tsx
import '../css/Banner.css';

export default function Banner() {
	return (
		<section className="hero-banner">
			<div className="banner-content">
				<h1 className="banner-title">静默</h1>
				<p className="banner-quote">欢迎来到Smallv的空间，一个基于React的轻量级前端框架。</p>
			</div>
		</section>
	);
}