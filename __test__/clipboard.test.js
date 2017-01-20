import React from 'react';
import renderer from 'react-test-renderer';
import { shallow } from 'enzyme';

import ClipboardButton from '../index';
import CustomComponent from './CustomComponent';

describe('ClipboardButton Spec', () => {
  
  it('should render', () => {
    const Component = shallow(<ClipboardButton />);
    expect(Component.is('button')).toEqual(true);
  });
  
  it('should attach a click handler', () => {
    const Component = shallow(<ClipboardButton />);
    expect(Component.prop('onClick')).toBeDefined();
  });

  it('should pass data-* props to the button', () => {
    const Component = shallow(<ClipboardButton data-clipboard-text="test" data-anything />);
    expect(Component.prop('data-clipboard-text')).toEqual('test');
    expect(Component.prop('data-anything')).toBe(true);
  });

  it('should not pass options prop to the button', () => {
    const Component = shallow(<ClipboardButton options={{text() {}, target() {}}} />);
    expect(Component.prop('options')).toBeUndefined();
    // expect(Component.prop('option-text')).toBeUndefined();
  });

  it('should pass other props to the button', () => {
    const title = 'Click Me';
    const style = { color: 'white' };
    const Component = shallow(<ClipboardButton disabled title={title} style={style} />);
    expect(Component.prop('disabled')).toBe(true);
    expect(Component.prop('title')).toBe(title);
    expect(Component.prop('style')).toBe(style);
  });

  it('should render button with children', () => {
    const children = <span>Test</span>;
    const Component = shallow(<ClipboardButton>{ children }</ClipboardButton>);
    expect(Component.contains(children)).toBe(true);
  });  

  it('should render button with specific className', () => {
    const className = 'test';
    const Component = shallow(<ClipboardButton className={ className } />);
    expect(Component.hasClass(className)).toBe(true);
  });

  it('can be rendered as another HTML component', () => {
    const Anchor = shallow(<ClipboardButton component='a' />);
    const Input = shallow(<ClipboardButton component='input' />);

    expect(Anchor.is('a')).toEqual(true);    
    expect(Input.is('input')).toEqual(true);
  });

  it('can be rendered as React component', () => {
    const Component = shallow(<ClipboardButton component={CustomComponent} />);
    expect(Component.is('CustomComponent')).toBe(true);    
  });
});