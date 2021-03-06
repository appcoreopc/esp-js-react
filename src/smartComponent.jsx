// notice_start
/*
 * Copyright 2015 Dev Shop Limited
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
// notice_end

import * as esp from 'esp-js';
import * as React from 'react';
import { createViewForModel } from './viewBindingDecorator';

export default class SmartComponent extends React.Component {
    static propTypes = {
        modelId: React.PropTypes.string.isRequired,
        view: React.PropTypes.func,
        viewContext: React.PropTypes.string,
    }
    static contextTypes = {
        router: React.PropTypes.instanceOf(esp.Router).isRequired
    }
    constructor() {
        super();
        this._isObservingModel = false;
        this._observationSubscription = null;
        this._view = null;
        this.state = {

        };
    }
    componentWillReceiveProps() {
        this._tryObserveModel();
    }
    componentWillMount() {
        this._tryObserveModel();
    }
    componentWillUnmount() {
        if(this._observationSubscription) {
            this._observationSubscription.dispose();
        }
    }
    _tryObserveModel() {
        let modelId = this.props.modelId;
        if (!this._isObservingModel && modelId) {
            this._isObservingModel = true;
            this._observationSubscription = this.context.router.getModelObservable(modelId).subscribe(model => {
                this.setState({model: model});
            });
        }
    }
    render() {
        if(this.state.model) {
            if(this.props.view) {
                return React.createElement(this.props.view, this._getChildProps());
            } else if (this.state.model) {
                return createViewForModel(this.state.model, this._getChildProps(), this.props.viewContext);
            }
        }
        return null; // this (in react 15) will render a 'comment node' rather than any actual html
    }
    _getChildProps() {
        // 'consume' the props we own, pass the rest down
        let {modelId, viewContext, view, ...other} = this.props;
        let newProps = {
            model: this.state.model,
            router: this.context.router
        };
        return Object.assign({}, newProps, other)
    }
}