import assert from 'node:assert/strict'
import test from 'node:test'

import { createRevealMotionStyle, staggerDelay } from '../lib/motion.ts'

test('staggered reveal delays stay responsive and bounded', () => {
  assert.equal(staggerDelay(0), 0)
  assert.equal(staggerDelay(3), 210)
  assert.equal(staggerDelay(30), 700)
  assert.equal(staggerDelay(-2), 0)
})

test('reveal styles expose a CSS custom property without hiding content', () => {
  assert.deepEqual(createRevealMotionStyle(245), {
    '--reveal-delay': '245ms',
  })
  assert.deepEqual(createRevealMotionStyle(2_000), {
    '--reveal-delay': '900ms',
  })
})
