import { Component } from "react";
import ErrorMessage from "../errorMessage/ErrorMessage";

class ErrorBoundary extends Component {
    state = {
        error: false,
    }

    componentDidCatch(error, errorInfo) {
        console.log('error:', error);
        console.log('errorInfo:', errorInfo);
        this.setState({
            error: true,
        })
    }

    render() {
        if (this.state.error) {
            return (
                <>
                    <h2>Something went wrong...</h2>
                    <ErrorMessage />
                </>
            )
        }
        
        return this.props.children;
    }
}

export default ErrorBoundary;