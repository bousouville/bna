import adapter from '@sveltejs/adapter-static';

/** @type {import('@sveltejs/kit').Config} */
const base = process.env.PAGES_BASE || '';
	
const config = {
	kit: {
		paths: { base, relative: false },
		adapter: adapter({
			pages: 'build',
			assets: 'build',
			fallback: undefined,
			precompress: false,
			strict: true
		}),
		alias: {
			$data: 'src/lib/data'
		}
	}
};

export default config;
