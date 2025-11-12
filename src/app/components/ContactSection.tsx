import { FaGithub, FaEnvelope } from 'react-icons/fa';

export default function ContactSection() {
  const socialLinks = [
    { href: 'https://github.com/rumcajzzzz', icon: <FaGithub /> },
    { href: 'mailto:rumcajzdev@gmail.com', icon: <FaEnvelope /> },
  ];

  return (
    <section
      id="contact"
      className="relative py-24 px-6 w-full h-[100vh] flex flex-col items-center justify-center text-center fade-in-on-scroll"
    >
      <div
        className="absolute inset-0 -z-10 pointer-events-none"
        style={{
          maskImage:
            'linear-gradient(to bottom, transparent, white 40%, white 60%, transparent)',
          WebkitMaskImage:
            'linear-gradient(to bottom, transparent, white 40%, white 60%, transparent)',
        }}
      />

      <h2 className="text-3xl md:text-5xl font-bold mb-6">Skontaktuj się ze mną</h2>
      <p className="text-neutral-400 mb-8 max-w-xl fade-in-on-scroll-soft">
        Masz pomysł na projekt lub chcesz o coś zapytać? <br /> Napisz śmiało odpowiem jak najszybciej.
      </p>

      <a
        href="mailto:rumcajzdev@gmail.com"
        className="fade-in-on-scroll mb-4 inline-block bg-white text-black px-6 py-3 rounded-xl font-semibold social-button"
      >
        Napisz wiadomość @
      </a>

      {/* Ikony sociali */}
      <div className="flex gap-6 text-2xl text-white z-9999">
        {socialLinks.map((social, index) => (
          <a
            key={index}
            href={social.href}
            target="_blank"
            rel="noopener noreferrer"
            className="fade-in-on-scroll-soft social-icon z-9999"
          >
            {social.icon}
          </a>
        ))}
      </div>
      
    </section>
  );
}
