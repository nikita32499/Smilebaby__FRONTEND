/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ['./src/**/*.{html,js,jsx,ts,tsx}'],
    theme: {
        extend: {
            fontFamily: {
                rubik: ['var(--font-rubik)'],
                inter: ['var(--font-inter)'],
            },
            boxShadow: {
                boxShadowFilter: '0 4px 10px  rgba(0, 0, 0, 0.25)',
            },
        },
    },
    variants: {},
    plugins: [
        function ({ addUtilities }) {
            const newUtilities = {
                '.bg-gradient-custom': {
                    backgroundImage: 'linear-gradient(to right, #3b82f6, #10b981)',
                },
            };

            addUtilities(newUtilities, ['responsive', 'hover']);
        },
        function ({ addUtilities, theme, e }) {
            const newUtilities = {};

            // Динамическое создание классов для grid-template-rows
            for (let i = 1; i <= 12; i++) {
                newUtilities[`.grid-rows-${i}-max`] = {
                    'grid-template-rows': `repeat(${i}, max-content)`,
                };
            }

            addUtilities(newUtilities, ['responsive']);
        },
    ],
};
