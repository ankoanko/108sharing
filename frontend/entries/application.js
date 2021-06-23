/* eslint-disable */
import { BREAKPOINT_TABLET_LARGE } from '../constants/constants';

var componentRequireContext = require.context("components", true, /^(?!.*(\.test|__tests__)).*$/);
var ReactRailsUJS = require("react_ujs");
ReactRailsUJS.useContext(componentRequireContext);

(function () {
  const getWindowInnerHeight = () => {
    return Math.max(document.documentElement.clientHeight, window.innerHeight || 0)
  }

  const setInnerHeight = (val) => {
    window.document.documentElement.style.setProperty(
      '--inner-height',
      val,
    )
  }

  const isSP = /iPhone|iPod|iPad|Android/i.test(navigator.userAgent)
  if (isSP) {
    window.document.addEventListener('DOMContentLoaded', () => {
      setInnerHeight(getWindowInnerHeight() + 'px')
    })
  }

  const mql = window.matchMedia(`(max-width: ${BREAKPOINT_TABLET_LARGE}px)`)
  mql.addListener((mql => {
    mql.matches ? setInnerHeight(getWindowInnerHeight() + 'px') : setInnerHeight('100vh')
  }))
})();

