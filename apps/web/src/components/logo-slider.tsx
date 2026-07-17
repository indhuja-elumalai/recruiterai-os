import "./logo-slider.css";

const platforms = [
  { name: "LinkedIn", color: "#0A66C2", mark: "Li" },
  { name: "Naukri", color: "#2E3192", mark: "N" },
  { name: "Indeed", color: "#2164F3", mark: "In" },
  { name: "Wellfound", color: "#FA4C59", mark: "W" },
  { name: "Glassdoor", color: "#0CAA41", mark: "G" },
  { name: "Monster", color: "#6E489D", mark: "M" },
  { name: "AngelOne", color: "#FF7D00", mark: "A" },
  { name: "Instahyre", color: "#4F46E5", mark: "I" },
  { name: "IIMJobs", color: "#E31E24", mark: "IJ" },
  { name: "Cutshort", color: "#FB923C", mark: "C" },
];

export function LogoSlider() {
  return (
    <section className="platform-section" aria-labelledby="platform-heading">
      <div className="platform-section__heading">
        <span className="platform-section__eyebrow">One-click distribution</span>
        <h2 id="platform-heading">Post Once, Reach Everywhere</h2>
        <p>Publish roles across the channels candidates already trust.</p>
      </div>

      <div className="platform-grid">
        {platforms.map((platform) => (
          <div className="platform-card" key={platform.name}>
            <span className="platform-card__icon" style={{ backgroundColor: platform.color }}>
              {platform.mark}
            </span>
            <span className="platform-card__name">{platform.name}</span>
            <span className="platform-card__status">Connected</span>
          </div>
        ))}
      </div>
    </section>
  );
}
