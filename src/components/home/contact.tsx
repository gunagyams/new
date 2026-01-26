import React from 'react';

const Contact: React.FC = () => {
  return (
    <section id="contact" className="py-24 bg-cream border-t border-charcoal/5">
      <div className="max-w-3xl mx-auto px-6 md:px-12">
        <div className="text-center mb-16">
          <h2 className="font-serif italic text-5xl text-charcoal mb-4">Inquire</h2>
          <p className="font-sans text-charcoal/70">For the wildly in love. Tell us your story.</p>
        </div>

        <div className="overflow-hidden -mx-6 md:-mx-12" style={{ maxHeight: '750px' }}>
          <iframe
            src="https://deepskyblue-cormorant-766129.hostingersite.com/"
            className="w-full border-0 bg-transparent"
            style={{
              height: '900px',
              background: 'transparent',
              marginTop: '-2rem',
              marginBottom: '-150px'
            }}
            title="Contact Form"
            allowTransparency={true}
          />
        </div>
      </div>
    </section>
  );
};

export default Contact;