import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { useAppContext } from "../context/AppContext";

function getRouteMessage(pathname) {
  if (pathname.startsWith("/transactions")) {
    return "Loading transaction activity...";
  }

  if (pathname.startsWith("/statements")) {
    return "Preparing statements workspace...";
  }

  if (pathname.startsWith("/cards")) {
    return "Loading card controls...";
  }

  if (pathname.startsWith("/help")) {
    return "Opening help centre tools...";
  }

  if (pathname.startsWith("/transfers")) {
    return "Loading payments workspace...";
  }

  if (pathname.startsWith("/dashboard")) {
    return "Loading account summary...";
  }

  return "Loading page...";
}

function RouteDelayController() {
  const location = useLocation();
  const previousPathRef = useRef(null);
  const timeoutRef = useRef(null);
  const {
    clearLoadingOverlay,
    getPerformanceDelayMs,
    showLoadingOverlay,
  } = useAppContext();

  useEffect(() => {
    const currentPath = `${location.pathname}${location.search}`;

    if (previousPathRef.current === null) {
      previousPathRef.current = currentPath;
      return undefined;
    }

    if (previousPathRef.current === currentPath) {
      return undefined;
    }

    previousPathRef.current = currentPath;
    const delayMs = getPerformanceDelayMs();

    if (delayMs <= 0) {
      clearLoadingOverlay();
      return undefined;
    }

    showLoadingOverlay(getRouteMessage(location.pathname));
    timeoutRef.current = window.setTimeout(() => {
      clearLoadingOverlay();
      timeoutRef.current = null;
    }, delayMs);

    return () => {
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, [
    clearLoadingOverlay,
    getPerformanceDelayMs,
    location.pathname,
    location.search,
    showLoadingOverlay,
  ]);

  useEffect(
    () => () => {
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
      }
    },
    []
  );

  return null;
}

export default RouteDelayController;
