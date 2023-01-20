import React, { useCallback } from 'react';
import { getRouteUrl } from '../../react-router5';
import { toQueryString } from '../../helpers/web';
import './styles.scss';
import { Link } from 'react-router-dom';


const Index = (props) => {

  const getRoute = useCallback(
    () => {
      const { routeKey, routeParams, queryParams } = props;
      if (routeKey) {
        const route =
          getRouteUrl(routeKey, routeParams) +
          (queryParams ? toQueryString(queryParams) : '');
        return route;
      }
      return;
    },
    [],
  )

  const getLinkProps = useCallback(
    () => {
      let newProps = {
        ...props,
      };
      /**
       * If route key exists take it as application route else
       * use it as a normal Link
       */
      //delete newProps.to;
      delete newProps.routeKey;
      delete newProps.routeParams;
      delete newProps.queryParams;
      return newProps;
    },
    [],
  )


  const link = getRoute();
  const newProps = getLinkProps();
  return !link ? (
    <a rel="noreferrer" target="_blank" {...newProps} />
  ) : (
    <Link to={link} {...newProps} />
  );
}

export default Index