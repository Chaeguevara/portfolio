export interface Work {
  title: string;
  body: string;
  href: string;
}

export interface ContentData {
  about: string[];
  works: Work[];
  links: { label: string; href: string }[];
}

export function readContent(): ContentData {
  if (typeof document === 'undefined') return { about: [], works: [], links: [] };

  const about: string[] = [];
  document.querySelectorAll('#about-content p').forEach((el) => {
    const t = el.textContent?.trim();
    if (t) about.push(t);
  });

  const works: Work[] = [];
  document.querySelectorAll('#works-content li').forEach((li) => {
    const a = li.querySelector('a');
    const h3 = li.querySelector('h3');
    const p = li.querySelector('p');
    if (a && h3 && p) {
      works.push({
        title: h3.textContent?.trim() ?? '',
        body: p.textContent?.trim() ?? '',
        href: a.getAttribute('href') ?? '#',
      });
    }
  });

  const links: { label: string; href: string }[] = [];
  document.querySelectorAll('#content nav a').forEach((a) => {
    const label = a.textContent?.trim();
    const href = a.getAttribute('href');
    if (label && href) links.push({ label, href });
  });

  return { about, works, links };
}
