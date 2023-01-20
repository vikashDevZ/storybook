function getUrl(name) {
  return name.replace(/\s+/g, '-').toLowerCase();
}

function getRouteProps(routeProps) {
  return {
    public: true, // If public is not defined then make it default public
    ...routeProps,
  };
}

export default function (obj, options) {
  options = options || {};
  const { context, fileRequire, parentRouteProps, wrapComponent } = options;
  const EmptyComponent =
    wrapComponent instanceof Function
      ? wrapComponent(({ children }) => children)
      : ({ children }) => children;
  const createRoutes = (r) => {
    r.keys()
      .map((r) => {
        if (r !== './index.js' && r.endsWith('/index.js')) {
          let name = r.replace('.js', '');
          const file = fileRequire(`${name}`).default;
          if (file && !file.notRoute) {
            return name;
          }
        }
      })
      .filter((item) => {
        if (!item) {
          return false;
        }
        if (options.filter instanceof Function) {
          return !!options.filter(item);
        }
        return true;
      })
      .sort((a, b) => a.length - b.length)
      .forEach((name) => {
        const file = fileRequire(`${name}`).default;
        const routeObj = {
          component:
            wrapComponent instanceof Function ? wrapComponent(file) : file,
          children: {},
          routeProps: {
            ...parentRouteProps,
            ...file.routeProps,
          },
        };
        name = name.replace('/index', '').replace('./', '');
        const parts = name.split('/');
        file.displayName = parts.join('-');
        let route = obj;
        if (parts.length === 1) {
          obj[name] = routeObj;
          obj[name].routeProps = getRouteProps(obj[name].routeProps);
          obj[name].url = getUrl(file.url === undefined ? parts[0] : file.url);
        } else if (parts.length > 1) {
          parts.slice(0, parts.length - 1).forEach((part, index) => {
            if (index === 0) {
              if (!route[part]) {
                route[part] = {
                  url: getUrl(part),
                  children: {},
                  component: EmptyComponent,
                  routeProps: getRouteProps(route.routeProps),
                };
              }
              route = route[part];
            } else {
              if (!route.children[part] && index < parts.length - 1) {
                route.children[part] = {
                  url: getUrl(part),
                  children: {},
                  component: EmptyComponent,
                  routeProps: getRouteProps(route.routeProps),
                };
              }
              route = route.children[part];
            }
          });
          route.children[parts[parts.length - 1]] = {
            ...routeObj,
            routeProps: getRouteProps({
              ...route.routeProps,
              ...routeObj.routeProps,
            }),
            url: getUrl(
              file.url !== undefined ? file.url : parts[parts.length - 1]
            ),
          };
        } else {
          return;
        }
      });
  };
  createRoutes(context);
}
