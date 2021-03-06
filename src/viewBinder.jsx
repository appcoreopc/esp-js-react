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

export default class ViewBinder extends React.Component {
    static propTypes = {
        model: React.PropTypes.object,
        viewContext: React.PropTypes.string,
    };

    static contextTypes = {
        router: React.PropTypes.instanceOf(esp.Router).isRequired
    };

    render() {
        if(this.props.model) {
            let {model, viewContext, ...other} = this.props;
            let newProps = Object.assign({}, { model: this.props.model, router:this.context.router }, other);
            return createViewForModel(
                this.props.model,
                newProps,
                this.props.viewContext
            );
        }
        return null;
    }
}