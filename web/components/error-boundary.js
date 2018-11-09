import React from "react"

export default class ErrorBoundary extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            hasError: false,
            error: null,
            info: null
        }
    }

    componentDidCatch(error, info) {
        this.setState({
            error, info, hasError: true
        })
    }

    render() {
        if(this.state.hasError){
            return this.props.alternate || <div>Fel vid inladdning</div>
        }

        return this.props.children
    }
}