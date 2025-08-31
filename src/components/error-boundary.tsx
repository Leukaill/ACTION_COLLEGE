"use client";

import React, { Component, ErrorInfo, ReactNode } from "react";
import { Button } from "./ui/button";
import { ServerCrash } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "./ui/card";
import { Icons } from "./ui/icons";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // In a real application, you would log this to an error reporting service
    // like Sentry, LogRocket, etc.
    console.error("Uncaught error:", error, errorInfo);
  }

  private handleReset = () => {
    // Attempt to recover by reloading the page
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="flex items-center justify-center min-h-screen bg-background p-4">
            <Card className="max-w-lg w-full text-center shadow-2xl">
                <CardHeader>
                    <div className="mx-auto bg-destructive/10 p-4 rounded-full w-fit">
                         <ServerCrash className="h-10 w-10 text-destructive" />
                    </div>
                    <CardTitle className="text-3xl font-headline mt-4">Oops! Something Went Wrong</CardTitle>
                    <CardDescription className="text-lg">
                        We've encountered an unexpected error. Please try refreshing the page.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Button size="lg" onClick={this.handleReset}>
                        Reload Page
                    </Button>
                     {process.env.NODE_ENV !== 'production' && this.state.error && (
                        <details className="mt-6 p-4 bg-muted/50 rounded-lg text-left text-xs">
                            <summary className="cursor-pointer font-semibold mb-2">Error Details (Development Only)</summary>
                            <pre className="whitespace-pre-wrap break-words">
                                {this.state.error.stack}
                            </pre>
                        </details>
                    )}
                </CardContent>
            </Card>
        </div>
      );
    }

    return this.props.children;
  }
}
