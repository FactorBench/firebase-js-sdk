/**
 * @license
 * Copyright 2018 Google Inc.
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
import * as firebase from 'firebase';
export { database, firestore } from 'firebase';
export declare function apps(): firebase.app.App[];
export declare type AppOptions = {
    databaseName?: string;
    projectId?: string;
    auth?: object;
};
/** Construct an App authenticated with options.auth. */
export declare function initializeTestApp(options: AppOptions): firebase.app.App;
export declare type AdminAppOptions = {
    databaseName?: string;
    projectId?: string;
};
/** Construct an App authenticated as an admin user. */
export declare function initializeAdminApp(options: AdminAppOptions): firebase.app.App;
export declare type LoadDatabaseRulesOptions = {
    databaseName: string;
    rules: string;
};
export declare function loadDatabaseRules(options: LoadDatabaseRulesOptions): Promise<void>;
export declare type LoadFirestoreRulesOptions = {
    projectId: string;
    rules: string;
};
export declare function loadFirestoreRules(options: LoadFirestoreRulesOptions): Promise<void>;
export declare type ClearFirestoreDataOptions = {
    projectId: string;
};
export declare function clearFirestoreData(options: ClearFirestoreDataOptions): Promise<void>;
export declare function assertFails(pr: Promise<any>): any;
export declare function assertSucceeds(pr: Promise<any>): any;
