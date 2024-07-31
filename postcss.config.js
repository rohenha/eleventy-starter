// /* ──────────────────────────────────────────────────────────
// ►►► Post CSS Config
// ────────────────────────────────────────────────────────── */

import autoprefixer from 'autoprefixer'
import inlinesvg from 'postcss-inline-svg'
import purgecss from '@fullhuman/postcss-purgecss'
import sortmedias from 'postcss-sort-media-queries'
import combinemedias from 'postcss-combine-media-query'

export default {
  plugins: [
    inlinesvg(),
    autoprefixer(),
    sortmedias({
      sort: 'mobile-first',
    }),
    combinemedias(),
    purgecss({
      content: [
        './**/*.html',
      ],
    }),
  ],
}
