import React from "react";
import { compile, match } from "path-to-regexp";
let allRoutes = {};
let mainRoutes;
let history;
let error404Page;
export function initializeRoutes(routes, routeHistory, config) {
  config = config || {};
  error404Page = config.error404Page;
  mainRoutes = routes;
  history = routeHistory;
  return constructRoutes(routes, undefined, undefined, undefined, config);
}

/**
 * Constructs a route based on route data and parent Route URL
 */
export const constructRoutes = (
  routeObjects,
  routeUrl,
  parentKey,
  parentProps,
  config
) => {
  routeObjects = routeObjects || {};
  const routeKeys = Object.keys(routeObjects);
  routeUrl = routeUrl || "";
  if (!routeKeys || !Array.isArray(routeKeys) || routeKeys.length <= 0) {
    return null;
  }

  let output = routeKeys.map((routeKey, index) => {
    let route = routeObjects[routeKey];
    const routeProps = route.routeProps || {};

    let props = {
      key: index,
      /**
       * Create HOC to pass route props
       * disable createContainer to disable the creation of default div with class route-container
       * @param componentProps
       * @returns {*}
       */
      component: !route.to
        ? (componentProps) => {
            componentProps = {
              ...componentProps,
              ...(config.getExtraProps instanceof Function
                ? config.getExtraProps(componentProps)
                : {}),
            };
            return route.createContainer === false ? (
              <route.component {...componentProps} {...routeProps} />
            ) : (
              <div className={"route-container page"}>
                <route.component {...componentProps} {...routeProps} />
              </div>
            );
          }
        : undefined,
    };
    if (route.url !== "") {
      if (route.url === "/" && routeUrl === "") {
        props.path = "/";
      } else {
        props.path = routeUrl + "/" + route.url;
      }
    } else {
      props.path = routeUrl;
    }
    props = {
      ...props,
      ...routeProps,
    };
    if (typeof parentProps != "undefined") {
      props.header = parentProps.header || props.header;
    }
    props.routeKey = parentKey ? parentKey + "." + routeKey : routeKey;
    const routeObj = /*
      route.url && route.url !== ''
        ? {
            ...props,
            routes: constructRoutes(
              route.children,
              props.path,
              routeKey,
              routeProps,
              config
            ),
          }
        : */ {
      ...props,
      exact: Object.keys(route.children || {}).length > 0 ? false : true,
      routes: constructRoutes(
        route.children,
        props.path,
        routeKey,
        routeProps,
        config
      ),
    };
    allRoutes[props.path] = routeObj;
    return routeObj;
  });
  return output;
};

export const getRouteByPath = (path) => {
  return (
    allRoutes[path] ||
    Object.values(allRoutes).find(({ path: routePath }) => {
      const fn = match(routePath, { decode: decodeURIComponent });
      return fn(path);
    })
  );
};

/**
 * Returns the route link url for a given route key
 * @param key
 * @returns {*}
 */
export function getRouteUrl(key, params) {
  if (!key) {
    return null;
  }
  let links = (key || "").split(".");
  let url = "";
  let routes = getAllRoutes();
  if (!routes[links[0]]) {
    return null;
  }
  links.map((link) => {
    if (routes[link]) {
      if (url === "/") {
        url = url + routes[link].url;
      } else {
        url = url + "/" + routes[link].url;
      }
      //getLinkUrl(routes[link].url);
      routes = routes[link].children || {};
    } else {
      console.log(
        "No such route key present " + link + " while parsing routeKey - " + key
      );
    }
  });
  url = url.replace("//", "/");
  if (params) {
    return compile(url)(params);
  } else {
    return url;
  }
}

export function getLinkUrl(url) {
  let parts = url.split("(");
  if (parts.length > 1) {
    return parts[0];
  }
  parts = url.split(":");
  if (parts.length > 1) {
    return parts[0];
  }
  return url;
}

/**
 * Returns the route Object route key
 * @param key
 * @returns {*}
 */
export function getRoute(key) {
  if (!key) {
    return null;
  }
  let links = (key || "").split(".");
  let route = null;
  let routes = getAllRoutes();
  if (!routes[links[0]]) {
    return null;
  }
  links.map((link) => {
    if (routes[link]) {
      route = routes[link];
      routes = routes[link].children || {};
    } else {
      console.log(
        "No such route key present " + link + " while parsing routeKey - " + key
      );
      route = null;
    }
  });
  return route;
}

/**
 * Goes to a specific route
 * @param route
 * @param config - Config for Browser History
 */
export function goToRoute(route, config) {
  config = config || {};
  let url = getRouteUrl(route, config.routeParams || {});
  if (url && url != "") {
    if (config.forceRefresh) {
      window.location.pathname = url;
      if (config.search) {
        window.location.search = config.search;
      }
    } else {
      history.push({
        pathname: url,
        search: "",
        ...config,
      });
    }
  } else {
    //404 Handling
    config.defaultRoute && goToRoute(config.defaultRoute);
  }
}

/**
 * Goes to a specific route url
 * @param route
 * @param config - Config for Browser History
 */
 export function goToRouteUrl(url, config){
  history.push({
    pathname : url,
    ...config
  })
}

/**
 * Go Back
 */
export function goBack() {
  history.goBack();
}

/**
 * Add Listener to route change
 * it is the responsibility of the
 * component which adds listener to remove
 * listener using unlisten method that is
 * returned
 * @param listener
 * @returns {*}
 */
export function addOnRouteChange(listener) {
  if (history && listener) {
    return history.listen((action, location) => {
      /**
       * This is done because the current route in
       * react-redux-router prop routes in component is
       * not updated in time
       */
      setTimeout(listener.bind(this, action, location));
    });
  }
}

export function getCurrentRoute() {
  return (
    getRouteByPath(
      window.location.pathname === "/"
        ? window.location.pathname
        : window.location.pathname.toLowerCase().replace(/\/$/, "")
    ) || getRouteByPath(error404Page)
  );
}

export function getAllRoutes() {
  return mainRoutes;
}

/**
 * todo : might not work for nested urls
 */
export function getRouteUrls() {
  return Object.keys(allRoutes);
}
