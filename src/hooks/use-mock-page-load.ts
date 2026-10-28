"use client";

import * as React from "react";

interface UseMockPageLoadOptions {
  delay?: number;
}

interface UseMockPageLoadResult {
  isLoading: boolean;
  isError: boolean;
  retry: () => void;
  simulateError: boolean;
  setSimulateError: (value: boolean) => void;
}

export function useMockPageLoad({
  delay = 650,
}: UseMockPageLoadOptions = {}): UseMockPageLoadResult {
  const [isLoading, setIsLoading] = React.useState(true);
  const [isError, setIsError] = React.useState(false);
  const [simulateError, setSimulateError] = React.useState(false);
  const [reloadToken, setReloadToken] = React.useState(0);

  React.useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsError(simulateError);
      setIsLoading(false);
    }, delay);
    return () => clearTimeout(timer);
  }, [reloadToken, delay, simulateError]);

  const retry = React.useCallback(() => {
    setIsError(false);
    setReloadToken((token) => token + 1);
  }, []);

  const setSimulateErrorToggle = React.useCallback((value: boolean) => {
    setSimulateError(value);
  }, []);

  return {
    isLoading,
    isError,
    retry,
    simulateError,
    setSimulateError: setSimulateErrorToggle,
  };
}
