const GradientBackground = ({ opacity = 0.1 }) => (
  <div className="absolute h-full inset-0 top-0 left-0 flex items-center justify-center overflow-hidden -z-10">
    <img
      className="w-full"
      style={{ opacity }}
      src="assets/exclusive/landingPageBackground.svg"
    />
  </div>
);

export default GradientBackground;
