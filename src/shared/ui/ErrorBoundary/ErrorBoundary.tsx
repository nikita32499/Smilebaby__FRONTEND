"use client"
import { Component, ErrorInfo, ReactNode } from 'react'

interface ErrorBoundaryProps {
    children: ReactNode
}

type ErrorBoundaryState = {
    hasError: false
} | {
    hasError: true
    error: Error
}

interface IPropsErrorWidget {
    error: Error
}

const ErrorWidget: FC<IPropsErrorWidget> = (props) => {
    const { error } = props
    return <div>
        Ошибка {error.message}
    </div>
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
    constructor(props: ErrorBoundaryProps) {
        super(props)
        this.state = { hasError: false }
    }

    static getDerivedStateFromError(error: Error): ErrorBoundaryState {
        // Обновить состояние так, чтобы следующий рендер показал запасной UI
        return { hasError: true, error }
    }

    override componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        // Вы можете также сохранить информацию об ошибке в системе логирования
        console.error('Uncaught error:', error, errorInfo)
    }

    override render() {


        return <>
            {this.state.hasError && <ErrorWidget error={this.state.error} />}
            {this.props.children}
        </>
    }
}

export default ErrorBoundary
