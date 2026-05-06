/** Short excerpt for cards — prefers the line after BRIEF */
export function getProductBlurb(description = '', maxLen = 180) {
  if (!description) return ''
  const lines = description.split('\n').map((l) => l.trim()).filter(Boolean)
  const briefIdx = lines.findIndex((l) => /^BRIEF\b/i.test(l))
  let text =
    briefIdx >= 0
      ? lines[briefIdx].replace(/^BRIEF\s+/i, '').trim()
      : lines[0] || ''
  if (!text && lines.length) text = lines[0]
  if (text.length > maxLen) {
    const cut = text.slice(0, maxLen - 1)
    const lastSpace = cut.lastIndexOf(' ')
    text = (lastSpace > 40 ? cut.slice(0, lastSpace) : cut).trimEnd() + '…'
  }
  return text
}
