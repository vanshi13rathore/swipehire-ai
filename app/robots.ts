import { MetadataRoute } from 'next'
 
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/dashboard/', '/career-copilot/', '/mock-interview/', '/resume-builder/', '/saved-jobs/', '/applications/'],
    },
    sitemap: 'https://swipehire.com/sitemap.xml',
  }
}
