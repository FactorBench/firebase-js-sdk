/**
 * @license
 * Copyright 2017 Google Inc.
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
import * as firestore from '@firebase/firestore-types';
import { FirebaseApp } from '@firebase/app-types';
import { FirebaseService } from '@firebase/app-types/private';
import { DatabaseId } from '../core/database_info';
import { FirestoreClient } from '../core/firestore_client';
import { Query as InternalQuery } from '../core/query';
import { Transaction as InternalTransaction } from '../core/transaction';
import { ViewSnapshot } from '../core/view_snapshot';
import { Document } from '../model/document';
import { DocumentKey } from '../model/document_key';
import { ResourcePath } from '../model/path';
import { AsyncQueue } from '../util/async_queue';
import { FieldPath as ExternalFieldPath } from './field_path';
import { CompleteFn, ErrorFn, NextFn, PartialObserver, Unsubscribe } from './observer';
import { UserDataConverter } from './user_data_converter';
/**
 * Constant used to indicate the LRU garbage collection should be disabled.
 * Set this value as the `cacheSizeBytes` on the settings passed to the
 * `Firestore` instance.
 */
export declare const CACHE_SIZE_UNLIMITED = -1;
/**
 * Options that can be provided in the Firestore constructor when not using
 * Firebase (aka standalone mode).
 */
export interface FirestoreDatabase {
    projectId: string;
    database?: string;
}
/**
 * The root reference to the database.
 */
export declare class Firestore implements firestore.FirebaseFirestore, FirebaseService {
    private readonly _config;
    readonly _databaseId: DatabaseId;
    private _firestoreClient;
    readonly _queue: AsyncQueue;
    _dataConverter: UserDataConverter;
    constructor(databaseIdOrApp: FirestoreDatabase | FirebaseApp);
    settings(settingsLiteral: firestore.Settings): void;
    enableNetwork(): Promise<void>;
    disableNetwork(): Promise<void>;
    enablePersistence(settings?: firestore.PersistenceSettings): Promise<void>;
    clearPersistence(): Promise<void>;
    /**
     * Shuts down this Firestore instance.
     *
     * After shutdown only the `clearPersistence()` method may be used. Any other method
     * will throw a `FirestoreError`.
     *
     * To restart after shutdown, simply create a new instance of FirebaseFirestore with
     * `firebase.firestore()`.
     *
     * Shutdown does not cancel any pending writes and any promises that are awaiting a response
     * from the server will not be resolved. If you have persistence enabled, the next time you
     * start this instance, it will resume attempting to send these writes to the server.
     *
     * Note: Under normal circumstances, calling `shutdown()` is not required. This
     * method is useful only when you want to force this instance to release all of its resources or
     * in combination with `clearPersistence()` to ensure that all local state is destroyed
     * between test runs.
     *
     * @return A promise that is resolved when the instance has been successfully shut down.
     */
    _shutdown(): Promise<void>;
    readonly _isShutdown: boolean;
    ensureClientConfigured(): FirestoreClient;
    private makeDatabaseInfo;
    private configureClient;
    private static databaseIdFromApp;
    readonly app: FirebaseApp;
    INTERNAL: {
        delete: () => Promise<void>;
    };
    collection(pathString: string): firestore.CollectionReference;
    doc(pathString: string): firestore.DocumentReference;
    collectionGroup(collectionId: string): firestore.Query;
    runTransaction<T>(updateFunction: (transaction: firestore.Transaction) => Promise<T>): Promise<T>;
    batch(): firestore.WriteBatch;
    static readonly logLevel: firestore.LogLevel;
    static setLogLevel(level: firestore.LogLevel): void;
    _areTimestampsInSnapshotsEnabled(): boolean;
}
/**
 * A reference to a transaction.
 */
export declare class Transaction implements firestore.Transaction {
    private _firestore;
    private _transaction;
    constructor(_firestore: Firestore, _transaction: InternalTransaction);
    get(documentRef: firestore.DocumentReference): Promise<firestore.DocumentSnapshot>;
    set(documentRef: firestore.DocumentReference, value: firestore.DocumentData, options?: firestore.SetOptions): Transaction;
    update(documentRef: firestore.DocumentReference, value: firestore.UpdateData): Transaction;
    update(documentRef: firestore.DocumentReference, field: string | ExternalFieldPath, value: unknown, ...moreFieldsAndValues: unknown[]): Transaction;
    delete(documentRef: firestore.DocumentReference): Transaction;
}
export declare class WriteBatch implements firestore.WriteBatch {
    private _firestore;
    private _mutations;
    private _committed;
    constructor(_firestore: Firestore);
    set(documentRef: firestore.DocumentReference, value: firestore.DocumentData, options?: firestore.SetOptions): WriteBatch;
    update(documentRef: firestore.DocumentReference, value: firestore.UpdateData): WriteBatch;
    update(documentRef: firestore.DocumentReference, field: string | ExternalFieldPath, value: unknown, ...moreFieldsAndValues: unknown[]): WriteBatch;
    delete(documentRef: firestore.DocumentReference): WriteBatch;
    commit(): Promise<void>;
    private verifyNotCommitted;
}
/**
 * A reference to a particular document in a collection in the database.
 */
export declare class DocumentReference implements firestore.DocumentReference {
    _key: DocumentKey;
    readonly firestore: Firestore;
    private _firestoreClient;
    constructor(_key: DocumentKey, firestore: Firestore);
    static forPath(path: ResourcePath, firestore: Firestore): DocumentReference;
    readonly id: string;
    readonly parent: firestore.CollectionReference;
    readonly path: string;
    collection(pathString: string): firestore.CollectionReference;
    isEqual(other: firestore.DocumentReference): boolean;
    set(value: firestore.DocumentData, options?: firestore.SetOptions): Promise<void>;
    update(value: firestore.UpdateData): Promise<void>;
    update(field: string | ExternalFieldPath, value: unknown, ...moreFieldsAndValues: unknown[]): Promise<void>;
    delete(): Promise<void>;
    onSnapshot(observer: PartialObserver<firestore.DocumentSnapshot>): Unsubscribe;
    onSnapshot(options: firestore.SnapshotListenOptions, observer: PartialObserver<firestore.DocumentSnapshot>): Unsubscribe;
    onSnapshot(onNext: NextFn<firestore.DocumentSnapshot>, onError?: ErrorFn, onCompletion?: CompleteFn): Unsubscribe;
    onSnapshot(options: firestore.SnapshotListenOptions, onNext: NextFn<firestore.DocumentSnapshot>, onError?: ErrorFn, onCompletion?: CompleteFn): Unsubscribe;
    private onSnapshotInternal;
    get(options?: firestore.GetOptions): Promise<firestore.DocumentSnapshot>;
    private getViaSnapshotListener;
}
/**
 * Options interface that can be provided to configure the deserialization of
 * DocumentSnapshots.
 */
export interface SnapshotOptions extends firestore.SnapshotOptions {
}
export declare class DocumentSnapshot implements firestore.DocumentSnapshot {
    private _firestore;
    private _key;
    _document: Document | null;
    private _fromCache;
    private _hasPendingWrites;
    constructor(_firestore: Firestore, _key: DocumentKey, _document: Document | null, _fromCache: boolean, _hasPendingWrites: boolean);
    data(options?: firestore.SnapshotOptions): firestore.DocumentData | undefined;
    get(fieldPath: string | ExternalFieldPath, options?: firestore.SnapshotOptions): unknown;
    readonly id: string;
    readonly ref: firestore.DocumentReference;
    readonly exists: boolean;
    readonly metadata: firestore.SnapshotMetadata;
    isEqual(other: firestore.DocumentSnapshot): boolean;
    private convertObject;
    private convertValue;
    private convertArray;
}
export declare class QueryDocumentSnapshot extends DocumentSnapshot implements firestore.QueryDocumentSnapshot {
    data(options?: SnapshotOptions): firestore.DocumentData;
}
export declare class Query implements firestore.Query {
    _query: InternalQuery;
    readonly firestore: Firestore;
    constructor(_query: InternalQuery, firestore: Firestore);
    where(field: string | ExternalFieldPath, opStr: firestore.WhereFilterOp, value: unknown): firestore.Query;
    orderBy(field: string | ExternalFieldPath, directionStr?: firestore.OrderByDirection): firestore.Query;
    limit(n: number): firestore.Query;
    startAt(docOrField: unknown | firestore.DocumentSnapshot, ...fields: unknown[]): firestore.Query;
    startAfter(docOrField: unknown | firestore.DocumentSnapshot, ...fields: unknown[]): firestore.Query;
    endBefore(docOrField: unknown | firestore.DocumentSnapshot, ...fields: unknown[]): firestore.Query;
    endAt(docOrField: unknown | firestore.DocumentSnapshot, ...fields: unknown[]): firestore.Query;
    isEqual(other: firestore.Query): boolean;
    /** Helper function to create a bound from a document or fields */
    private boundFromDocOrFields;
    /**
     * Create a Bound from a query and a document.
     *
     * Note that the Bound will always include the key of the document
     * and so only the provided document will compare equal to the returned
     * position.
     *
     * Will throw if the document does not contain all fields of the order by
     * of the query or if any of the fields in the order by are an uncommitted
     * server timestamp.
     */
    private boundFromDocument;
    /**
     * Converts a list of field values to a Bound for the given query.
     */
    private boundFromFields;
    onSnapshot(observer: PartialObserver<firestore.QuerySnapshot>): Unsubscribe;
    onSnapshot(options: firestore.SnapshotListenOptions, observer: PartialObserver<firestore.QuerySnapshot>): Unsubscribe;
    onSnapshot(onNext: NextFn<firestore.QuerySnapshot>, onError?: ErrorFn, onCompletion?: CompleteFn): Unsubscribe;
    onSnapshot(options: firestore.SnapshotListenOptions, onNext: NextFn<firestore.QuerySnapshot>, onError?: ErrorFn, onCompletion?: CompleteFn): Unsubscribe;
    private onSnapshotInternal;
    get(options?: firestore.GetOptions): Promise<firestore.QuerySnapshot>;
    private getViaSnapshotListener;
    /**
     * Parses the given documentIdValue into a ReferenceValue, throwing
     * appropriate errors if the value is anything other than a DocumentReference
     * or String, or if the string is malformed.
     */
    private parseDocumentIdValue;
    /**
     * Validates that the value passed into a disjunctrive filter satisfies all
     * array requirements.
     */
    private validateDisjunctiveFilterElements;
    private validateNewFilter;
    private validateNewOrderBy;
    private validateOrderByAndInequalityMatch;
}
export declare class QuerySnapshot implements firestore.QuerySnapshot {
    private _firestore;
    private _originalQuery;
    private _snapshot;
    private _cachedChanges;
    private _cachedChangesIncludeMetadataChanges;
    readonly metadata: firestore.SnapshotMetadata;
    constructor(_firestore: Firestore, _originalQuery: InternalQuery, _snapshot: ViewSnapshot);
    readonly docs: firestore.QueryDocumentSnapshot[];
    readonly empty: boolean;
    readonly size: number;
    forEach(callback: (result: firestore.QueryDocumentSnapshot) => void, thisArg?: unknown): void;
    readonly query: firestore.Query;
    docChanges(options?: firestore.SnapshotListenOptions): firestore.DocumentChange[];
    /** Check the equality. The call can be very expensive. */
    isEqual(other: firestore.QuerySnapshot): boolean;
    private convertToDocumentImpl;
}
export declare class CollectionReference extends Query implements firestore.CollectionReference {
    constructor(path: ResourcePath, firestore: Firestore);
    readonly id: string;
    readonly parent: firestore.DocumentReference | null;
    readonly path: string;
    doc(pathString?: string): firestore.DocumentReference;
    add(value: firestore.DocumentData): Promise<firestore.DocumentReference>;
}
/**
 * Calculates the array of firestore.DocumentChange's for a given ViewSnapshot.
 *
 * Exported for testing.
 */
export declare function changesFromSnapshot(firestore: Firestore, includeMetadataChanges: boolean, snapshot: ViewSnapshot): firestore.DocumentChange[];
export declare const PublicFirestore: typeof Firestore;
export declare const PublicTransaction: typeof Transaction;
export declare const PublicWriteBatch: typeof WriteBatch;
export declare const PublicDocumentReference: typeof DocumentReference;
export declare const PublicDocumentSnapshot: typeof DocumentSnapshot;
export declare const PublicQueryDocumentSnapshot: typeof QueryDocumentSnapshot;
export declare const PublicQuery: typeof Query;
export declare const PublicQuerySnapshot: typeof QuerySnapshot;
export declare const PublicCollectionReference: typeof CollectionReference;
