import React from 'react';
import ReactDOM from 'react-dom';

export default class ClipboardButton extends React.Component {
  static propTypes = {
    options: React.PropTypes.object,   
    className: React.PropTypes.string,
    style: React.PropTypes.object,
    component: React.PropTypes.oneOfType([
      React.PropTypes.string,
      React.PropTypes.func,
    ]),
    children: React.PropTypes.oneOfType([
      React.PropTypes.element,
      React.PropTypes.string,
      React.PropTypes.number,
      React.PropTypes.object,
    ]),
  }

  static defaultProps = {
    component: 'button',
    onClick: function() {},
  }

  /* Returns a object with all props that fulfill a certain naming pattern
   *
   * @param {RegExp} regexp - Regular expression representing which pattern
   *                          you'll be searching for.
   * @param {Boolean} remove - Determines if the regular expression should be
   *                           removed when transmitting the key from the props
   *                           to the new object.
   *
   * e.g:
   *
   * // Considering:
   * // this.props = {option-foo: 1, onBar: 2, data-foobar: 3 data-baz: 4};
   *
   * // *RegExps not using // so that this comment doesn't break up
   * this.propsWith(option-*, true); // returns {foo: 1}
   * this.propsWith(on*, true); // returns {Bar: 2}
   * this.propsWith(data-*); // returns {data-foobar: 1, data-baz: 4}
   */
  propsWith(regexp, remove=false) {
    const object = {};

    Object.keys(this.props).forEach(function(key) {
      if (key.search(regexp) !== -1) {
        const objectKey = remove ? key.replace(regexp, '') : key;
        object[objectKey] = this.props[key];
      }
    }, this);

    return object;
  }

  componentWillUnmount() {
    this.clipboard && this.clipboard.destroy();
  }

  componentDidMount() {
    // Support old API by trying to assign this.props.options first;
    const options = this.props.options || this.propsWith(/^option-/, true);
    let element = React.version.match(/0\.13(.*)/)
        ? this.refs.element.getDOMNode() : this.refs.element;
            
    element = ReactDOM.findDOMNode(element);
    const Clipboard = require('clipboard');
    this.clipboard = new Clipboard(element, options);

    const callbacks = this.propsWith(/^on/, true);
    Object.keys(callbacks).forEach(function(callback) {
      this.clipboard.on(callback.toLowerCase(), this.props['on' + callback]);
    }, this);
  }

  render() {
    const pprops = Object.assign({}, this.props);
    delete pprops.options;
    delete pprops.component;
    delete pprops.children;
    delete pprops.onSuccess;
    delete pprops.onError;
    delete pprops['option-text'];

    /* eslint-disable */
    const { children, component: Component } = this.props;
    /* eslint-enable */
    
    const buttonProps = this.propsWith(/^button-/, true);
    
    return (
      <Component ref="element" { ...pprops } { ...buttonProps }>
        {children}
      </Component>
    );    
  }
}
