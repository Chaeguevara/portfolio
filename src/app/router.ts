export type Route = 'home' | 'works' | 'about';

function pathToRoute(pathname: string): Route {
  const base = import.meta.env.BASE_URL; // e.g. '/portfolio/'
  // Strip the base prefix to get the relative path segment
  const rel = pathname.startsWith(base)
    ? '/' + pathname.slice(base.length)
    : pathname;
  const path = rel.replace(/\/$/, '') || '/';
  if (path === '/') return 'home';
  if (path.startsWith('/works')) return 'works';
  if (path.startsWith('/about')) return 'about';
  return 'home';
}

export function initRouter(
  onEnter: (r: Route, viaHistory: boolean) => void,
): { go(r: Route): void } {
  const base = import.meta.env.BASE_URL;

  window.addEventListener('popstate', () => {
    onEnter(pathToRoute(window.location.pathname), true);
  });

  // Fire initial route
  onEnter(pathToRoute(window.location.pathname), true);

  return {
    go(r: Route) {
      const path = r === 'home' ? base : `${base}${r}`;
      history.pushState(null, '', path);
      onEnter(r, false);
    },
  };
}
