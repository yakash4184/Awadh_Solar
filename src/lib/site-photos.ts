/** Local, licensed Indian photography. The full-size files are 3840px wide. */
export const sitePhotos = [
  {
    src: '/images/india/indian-solar-farm.webp',
    title: 'Solar panels in India',
    alt: 'Rows of solar panels beside a rural service road in India',
    location: 'India',
    author: 'Manjunatha G, WELL Labs',
    source: 'https://commons.wikimedia.org/wiki/File:Solar_panels_in_India.jpg',
    license: 'CC BY-SA 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0/',
    width: 3840, height: 2160, position: 'center 60%',
  },
  {
    src: '/images/india/chitrakoot-village.webp',
    title: 'Village scene in Mau, Chitrakoot',
    alt: 'A tiled-roof village home under trees in Mau, Chitrakoot, Uttar Pradesh',
    location: 'Chitrakoot, Uttar Pradesh',
    author: 'Biswarup Ganguly',
    source: 'https://commons.wikimedia.org/wiki/File:Village_Scene_-_Mau_-_Chitrakoot_-_Uttar_Pradesh_-_2014-07-04_5689.JPG',
    license: 'CC BY 3.0',
    licenseUrl: 'https://creativecommons.org/licenses/by/3.0/',
    width: 3840, height: 2553, position: 'center 56%',
  },
  {
    src: '/images/india/etawah-school.webp',
    title: 'Sarangpur village school',
    alt: 'Primary school in Sarangpur village, Etawah, Uttar Pradesh',
    location: 'Etawah, Uttar Pradesh',
    author: 'Bull-well',
    source: 'https://commons.wikimedia.org/wiki/File:Sarangpur_village_etawah.jpg',
    license: 'CC BY 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by/4.0/',
    width: 3840, height: 2880, position: 'center 58%',
  },
  {
    src: '/images/india/indian-solar-rooftops.webp',
    title: 'Rooftop solar on Indian homes',
    alt: 'Solar panels on brick and concrete homes in Mehsana, Gujarat, India',
    location: 'Mehsana, Gujarat',
    author: 'Nizil Shah',
    source: 'https://commons.wikimedia.org/wiki/File:Rooftop_Solar_panels_on_homes_in_Mehsana,_Gujarat,_India.jpg',
    license: 'CC BY-SA 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0/',
    width: 3840, height: 2891, position: 'center 85%',
  },
] as const

export function getSitePhoto(src: string) {
  return sitePhotos.find(photo => photo.src === src)
}

export function photoSrcSet(src: string) {
  return [640, 1280, 1920, 3840]
    .map(width => `${width === 3840 ? src : src.replace('.webp', `-${width}.webp`)} ${width}w`)
    .join(', ')
}
