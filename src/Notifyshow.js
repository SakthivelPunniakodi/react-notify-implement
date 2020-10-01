import React, { Component } from 'react'

export class Notifyshow extends Component {
    static propTypes = {
        
    }

    render() {
        return (
            <div>
                <h1>{this.props.match.params.id}</h1>
            </div>
        )
    }
}

export default Notifyshow
