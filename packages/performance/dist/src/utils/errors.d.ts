/**
 * @license
 * Copyright 2019 Google Inc.
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
import { ErrorFactory } from '@firebase/util';
export declare const enum ErrorCode {
    TRACE_STARTED_BEFORE = "trace started",
    TRACE_STOPPED_BEFORE = "trace stopped",
    NO_WINDOW = "no window",
    NO_APP_ID = "no app id",
    NO_PROJECT_ID = "no project id",
    NO_API_KEY = "no api key",
    INVALID_CC_LOG = "invalid cc log",
    FB_NOT_DEFAULT = "FB not default",
    RC_NOT_OK = "RC response not ok"
}
interface ErrorParams {
    [ErrorCode.TRACE_STARTED_BEFORE]: {
        traceName: string;
    };
    [ErrorCode.TRACE_STOPPED_BEFORE]: {
        traceName: string;
    };
}
export declare const ERROR_FACTORY: ErrorFactory<ErrorCode, ErrorParams>;
export {};
