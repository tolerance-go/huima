import { StyledTextSegmentType } from '@huima/common'
import { expect, test } from 'vitest'
import { groupTextSegmentsByNewline } from '../src/renderStaticNode/groupTextSegmentsByNewline'

test('groupTextSegmentsByNewline correctly groups segments with no newlines', () => {
   const segments = [{ characters: 'Hello' }, { characters: 'world' }]

   const result = groupTextSegmentsByNewline(segments as StyledTextSegmentType)

   expect(result).toEqual([[{ characters: 'Hello' }, { characters: 'world' }]])
})

test('groupTextSegmentsByNewline correctly splits segments with newlines', () => {
   const segments = [{ characters: 'Hello\n' }, { characters: 'world' }]

   const result = groupTextSegmentsByNewline(segments as StyledTextSegmentType)

   expect(result).toEqual([
      [{ characters: 'Hello' }],
      [{ characters: 'world' }],
   ])
})

test('groupTextSegmentsByNewline correctly splits segments with newlines', () => {
   const segments = [{ characters: 'Hello\n\n\n' }, { characters: 'world' }]

   const result = groupTextSegmentsByNewline(segments as StyledTextSegmentType)

   expect(result).toEqual([
      [{ characters: 'Hello' }],
      [],
      [],
      [{ characters: 'world' }],
   ])
})

test('groupTextSegmentsByNewline correctly splits segments with multiple newlines', () => {
   const segments = [
      { characters: 'Hello\nworld\n' },
      { characters: 'How are you?' },
   ]

   const result = groupTextSegmentsByNewline(segments as StyledTextSegmentType)

   expect(result).toEqual([
      [{ characters: 'Hello' }],
      [{ characters: 'world' }],
      [{ characters: 'How are you?' }],
   ])
})

test('groupTextSegmentsByNewline correctly splits segments with multiple newlines', () => {
   const segments = [
      { characters: 'Hi' },
      { characters: 'Hello\nworld\n' },
      { characters: 'How are you?' },
   ]

   const result = groupTextSegmentsByNewline(segments as StyledTextSegmentType)

   expect(result).toEqual([
      [{ characters: 'Hi' }, { characters: 'Hello' }],
      [{ characters: 'world' }],
      [{ characters: 'How are you?' }],
   ])
})
