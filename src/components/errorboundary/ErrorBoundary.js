import React from "react"

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error : "", errorInfo : "" };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // You can also log the error to an error reporting service

    //logErrorToMyService(error, errorInfo);
    this.setState({
        error,
        errorInfo,
        hasError:true
    })
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (<>
      
      <div className="error-boundary-div">
            <center><h1>Something went wrong</h1></center>
            <p>
                {this.state.error.toString()}
            </p>
            <p>
                {JSON.stringify(this.state.errorInfo)}
            </p>
      </div>
      
      </>)
    }

    return this.props.children; 
  }
}
export default ErrorBoundary