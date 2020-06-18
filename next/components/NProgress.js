import React, { useEffect, useRef, useState } from 'react'
import NProgress from 'nprogress'
import Router from 'next/router'
import PropTypes from 'prop-types'

export default function NextProgress({ startPosition, stopDelayMs, color, height, isLoading, options }) {
  const timer = useRef(null)
  const [isActive, setActive] = useState(false)

  const routeChangeStart = () => {
    setActive(true)
  }

  const routeChangeEnd = () => {
    timer.current = setTimeout(() => {
      setActive(false)
    }, stopDelayMs)
  }

  useEffect(() => {
    if (options) NProgress.configure(options)

    Router.events.on('routeChangeStart', routeChangeStart)
    Router.events.on('routeChangeComplete', routeChangeEnd)
    Router.events.on('routeChangeError', routeChangeEnd)

    return () => {
      clearTimeout(timer.current)
    }
  }, [])

  useEffect(() => {
    if (isActive || isLoading) {
      NProgress.set(startPosition)
      NProgress.start()
    } else {
      NProgress.done(true)
    }
  }, [isActive, isLoading])

  return (
    <style jsx global>{/* CSS */`
      /* Make clicks pass-through */
      #nprogress {
        pointer-events: none;
      }
      
      #nprogress .bar {
        background: ${color};
      
        position: fixed;
        z-index: 1031;
        top: 0;
        left: 0;
      
        width: 100%;
        height: ${height}px;
      }
      
      /* Fancy blur effect */
      #nprogress .peg {
        display: block;
        position: absolute;
        right: 0px;
        width: 100px;
        height: 100%;
        box-shadow: 0 0 10px ${color}, 0 0 5px ${color};
        opacity: 1.0;
      
        -webkit-transform: rotate(3deg) translate(0px, -4px);
            -ms-transform: rotate(3deg) translate(0px, -4px);
                transform: rotate(3deg) translate(0px, -4px);
      }
      
      /* Remove these to get rid of the spinner */
      #nprogress .spinner {
        display: block;
        position: fixed;
        z-index: 1031;
        top: 15px;
        right: 15px;
      }
      
      #nprogress .spinner-icon {
        width: 18px;
        height: 18px;
        box-sizing: border-box;
      
        border: solid 2px transparent;
        border-top-color: ${color};
        border-left-color: ${color};
        border-radius: 50%;
      
        -webkit-animation: nprogress-spinner 400ms linear infinite;
                animation: nprogress-spinner 400ms linear infinite;
      }
      
      .nprogress-custom-parent {
        overflow: hidden;
        position: relative;
      }
      
      .nprogress-custom-parent #nprogress .spinner,
      .nprogress-custom-parent #nprogress .bar {
        position: absolute;
      }
      
      @-webkit-keyframes nprogress-spinner {
        0%   { -webkit-transform: rotate(0deg); }
        100% { -webkit-transform: rotate(360deg); }
      }
      @keyframes nprogress-spinner {
        0%   { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    `}</style>)
}


NextProgress.propTypes = {
  startPosition: PropTypes.number,
  stopDelayMs: PropTypes.number,
  color: PropTypes.string,
  height: PropTypes.number,
  isLoading: PropTypes.bool,
  options: PropTypes.object
}

NextProgress.defaultProps = {
  startPosition: 0.3,
  stopDelayMs: 200,
  color: '#29d',
  height: 3
}
