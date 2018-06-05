import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { camelize, noop } from './utils';

const createEntity = (
  type,
  evtNames = [],
  updatablePropertyNames = [],
) => props => {
  const propTypes = {
    entityRef: PropTypes.func,
  };

  const defaultProps = {
    entityRef: noop,
  };

  class Entity extends Component {
    constructor(props) {
      super(props);

      this.listeners = {};

      this.createEntity();
    }

    componentWillUnmount() {
      if (this.entity) {
        this.entity.setMap(null);
      }

      Object.keys(this.listeners).forEach(evtName => {
        this.listeners[evtName].remove();
      });
    }

    componentDidUpdate(prevProps) {
      updatablePropertyNames.forEach(name => {
        if (this.props[name] !== prevProps[name]) {
          const func = camelize(`set_${name}`);

          if (typeof this.entity[func] === 'function') {
            this.entity[func](this.props[name]);
          } else {
            throw Error(`There is no method named ${func}!`);
          }
        }
      });
    }

    createEntity = () => {
      const { googleMaps, map, entityRef, options, ...rest } = this.props;

      this.entity = new googleMaps[type]({
        ...options,
        ...rest,
      });

      evtNames.forEach(evtName => {
        this.listeners[evtName] = this.entity.addListener(
          evtName,
          this.handleEvent(evtName),
        );
      });

      this.entity.setMap(map);

      entityRef(this.entity);
    };

    handleEvent = evtName => event => {
      const handlerName = camelize(`on_${evtName}`);
      if (this.props[handlerName]) {
        this.props[handlerName](this.entity, this.props.map, event);
      }
    };

    render() {
      return null;
    }
  }

  Entity.displayName = type;
  Entity.propTypes = propTypes;
  Entity.defaultProps = defaultProps;

  return <Entity {...props} />;
};

export default createEntity;
