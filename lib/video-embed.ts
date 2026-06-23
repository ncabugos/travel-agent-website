// Shared video-embed resolver for the cruise/yacht film sections.
// Supports Vimeo and YouTube (cruise lines publish brand films on YouTube).
// Returns an autoplay embed URL, or null if the URL isn't recognised.
export function getVideoEmbed(url: string): { src: string } | null {
  if (!url) return null

  const vimeo = url.match(/(?:vimeo\.com\/(?:video\/)?)(\d+)/)
  if (vimeo) {
    return { src: `https://player.vimeo.com/video/${vimeo[1]}?autoplay=1&title=0&byline=0&portrait=0&dnt=1` }
  }

  // youtube.com/watch?v=ID · youtu.be/ID · youtube.com/embed/ID · youtube.com/shorts/ID
  const yt = url.match(/(?:youtube(?:-nocookie)?\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([\w-]{11})/)
  if (yt) {
    return { src: `https://www.youtube-nocookie.com/embed/${yt[1]}?autoplay=1&rel=0&modestbranding=1` }
  }

  return null
}
