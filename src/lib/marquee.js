import MarqueeModule from 'react-fast-marquee';

// react-fast-marquee ships CommonJS (`exports.default = Marquee`). Vite's dev pre-bundler
// returns the whole exports object as the default import, while the production build
// returns the component itself — unwrap so both behave the same.
const Marquee = MarqueeModule?.default ?? MarqueeModule;

export default Marquee;
