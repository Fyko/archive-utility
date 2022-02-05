/* eslint-disable */
import { GraphQLClient } from 'graphql-request';
import * as Dom from 'graphql-request/dist/types.dom';
import gql from 'graphql-tag';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  timestamptz: any;
  uuid: string;
};

/** Boolean expression to compare columns of type "Int". All fields are combined with logical 'AND'. */
export type Int_Comparison_Exp = {
  _eq?: InputMaybe<Scalars['Int']>;
  _gt?: InputMaybe<Scalars['Int']>;
  _gte?: InputMaybe<Scalars['Int']>;
  _in?: InputMaybe<Array<Scalars['Int']>>;
  _is_null?: InputMaybe<Scalars['Boolean']>;
  _lt?: InputMaybe<Scalars['Int']>;
  _lte?: InputMaybe<Scalars['Int']>;
  _neq?: InputMaybe<Scalars['Int']>;
  _nin?: InputMaybe<Array<Scalars['Int']>>;
};

/** Boolean expression to compare columns of type "String". All fields are combined with logical 'AND'. */
export type String_Comparison_Exp = {
  _eq?: InputMaybe<Scalars['String']>;
  _gt?: InputMaybe<Scalars['String']>;
  _gte?: InputMaybe<Scalars['String']>;
  /** does the column match the given case-insensitive pattern */
  _ilike?: InputMaybe<Scalars['String']>;
  _in?: InputMaybe<Array<Scalars['String']>>;
  /** does the column match the given POSIX regular expression, case insensitive */
  _iregex?: InputMaybe<Scalars['String']>;
  _is_null?: InputMaybe<Scalars['Boolean']>;
  /** does the column match the given pattern */
  _like?: InputMaybe<Scalars['String']>;
  _lt?: InputMaybe<Scalars['String']>;
  _lte?: InputMaybe<Scalars['String']>;
  _neq?: InputMaybe<Scalars['String']>;
  /** does the column NOT match the given case-insensitive pattern */
  _nilike?: InputMaybe<Scalars['String']>;
  _nin?: InputMaybe<Array<Scalars['String']>>;
  /** does the column NOT match the given POSIX regular expression, case insensitive */
  _niregex?: InputMaybe<Scalars['String']>;
  /** does the column NOT match the given pattern */
  _nlike?: InputMaybe<Scalars['String']>;
  /** does the column NOT match the given POSIX regular expression, case sensitive */
  _nregex?: InputMaybe<Scalars['String']>;
  /** does the column NOT match the given SQL regular expression */
  _nsimilar?: InputMaybe<Scalars['String']>;
  /** does the column match the given POSIX regular expression, case sensitive */
  _regex?: InputMaybe<Scalars['String']>;
  /** does the column match the given SQL regular expression */
  _similar?: InputMaybe<Scalars['String']>;
};

/** columns and relationships of "archive_utility.archive" */
export type Archive_Utility_Archive = {
  __typename?: 'archive_utility_archive';
  channel_id: Scalars['String'];
  channel_name: Scalars['String'];
  created_at: Scalars['timestamptz'];
  id: Scalars['uuid'];
  message_count?: Maybe<Scalars['Int']>;
  performed_by: Scalars['String'];
  /** An object relationship */
  server: Archive_Utility_Server;
  server_id: Scalars['String'];
  updated_at: Scalars['timestamptz'];
};

/** aggregated selection of "archive_utility.archive" */
export type Archive_Utility_Archive_Aggregate = {
  __typename?: 'archive_utility_archive_aggregate';
  aggregate?: Maybe<Archive_Utility_Archive_Aggregate_Fields>;
  nodes: Array<Archive_Utility_Archive>;
};

/** aggregate fields of "archive_utility.archive" */
export type Archive_Utility_Archive_Aggregate_Fields = {
  __typename?: 'archive_utility_archive_aggregate_fields';
  avg?: Maybe<Archive_Utility_Archive_Avg_Fields>;
  count: Scalars['Int'];
  max?: Maybe<Archive_Utility_Archive_Max_Fields>;
  min?: Maybe<Archive_Utility_Archive_Min_Fields>;
  stddev?: Maybe<Archive_Utility_Archive_Stddev_Fields>;
  stddev_pop?: Maybe<Archive_Utility_Archive_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Archive_Utility_Archive_Stddev_Samp_Fields>;
  sum?: Maybe<Archive_Utility_Archive_Sum_Fields>;
  var_pop?: Maybe<Archive_Utility_Archive_Var_Pop_Fields>;
  var_samp?: Maybe<Archive_Utility_Archive_Var_Samp_Fields>;
  variance?: Maybe<Archive_Utility_Archive_Variance_Fields>;
};


/** aggregate fields of "archive_utility.archive" */
export type Archive_Utility_Archive_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Archive_Utility_Archive_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']>;
};

/** order by aggregate values of table "archive_utility.archive" */
export type Archive_Utility_Archive_Aggregate_Order_By = {
  avg?: InputMaybe<Archive_Utility_Archive_Avg_Order_By>;
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<Archive_Utility_Archive_Max_Order_By>;
  min?: InputMaybe<Archive_Utility_Archive_Min_Order_By>;
  stddev?: InputMaybe<Archive_Utility_Archive_Stddev_Order_By>;
  stddev_pop?: InputMaybe<Archive_Utility_Archive_Stddev_Pop_Order_By>;
  stddev_samp?: InputMaybe<Archive_Utility_Archive_Stddev_Samp_Order_By>;
  sum?: InputMaybe<Archive_Utility_Archive_Sum_Order_By>;
  var_pop?: InputMaybe<Archive_Utility_Archive_Var_Pop_Order_By>;
  var_samp?: InputMaybe<Archive_Utility_Archive_Var_Samp_Order_By>;
  variance?: InputMaybe<Archive_Utility_Archive_Variance_Order_By>;
};

/** input type for inserting array relation for remote table "archive_utility.archive" */
export type Archive_Utility_Archive_Arr_Rel_Insert_Input = {
  data: Array<Archive_Utility_Archive_Insert_Input>;
  /** on conflict condition */
  on_conflict?: InputMaybe<Archive_Utility_Archive_On_Conflict>;
};

/** aggregate avg on columns */
export type Archive_Utility_Archive_Avg_Fields = {
  __typename?: 'archive_utility_archive_avg_fields';
  message_count?: Maybe<Scalars['Float']>;
};

/** order by avg() on columns of table "archive_utility.archive" */
export type Archive_Utility_Archive_Avg_Order_By = {
  message_count?: InputMaybe<Order_By>;
};

/** Boolean expression to filter rows from the table "archive_utility.archive". All fields are combined with a logical 'AND'. */
export type Archive_Utility_Archive_Bool_Exp = {
  _and?: InputMaybe<Array<Archive_Utility_Archive_Bool_Exp>>;
  _not?: InputMaybe<Archive_Utility_Archive_Bool_Exp>;
  _or?: InputMaybe<Array<Archive_Utility_Archive_Bool_Exp>>;
  channel_id?: InputMaybe<String_Comparison_Exp>;
  channel_name?: InputMaybe<String_Comparison_Exp>;
  created_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  id?: InputMaybe<Uuid_Comparison_Exp>;
  message_count?: InputMaybe<Int_Comparison_Exp>;
  performed_by?: InputMaybe<String_Comparison_Exp>;
  server?: InputMaybe<Archive_Utility_Server_Bool_Exp>;
  server_id?: InputMaybe<String_Comparison_Exp>;
  updated_at?: InputMaybe<Timestamptz_Comparison_Exp>;
};

/** unique or primary key constraints on table "archive_utility.archive" */
export enum Archive_Utility_Archive_Constraint {
  /** unique or primary key constraint */
  ArchivePkey = 'archive_pkey'
}

/** input type for incrementing numeric columns in table "archive_utility.archive" */
export type Archive_Utility_Archive_Inc_Input = {
  message_count?: InputMaybe<Scalars['Int']>;
};

/** input type for inserting data into table "archive_utility.archive" */
export type Archive_Utility_Archive_Insert_Input = {
  channel_id?: InputMaybe<Scalars['String']>;
  channel_name?: InputMaybe<Scalars['String']>;
  created_at?: InputMaybe<Scalars['timestamptz']>;
  id?: InputMaybe<Scalars['uuid']>;
  message_count?: InputMaybe<Scalars['Int']>;
  performed_by?: InputMaybe<Scalars['String']>;
  server?: InputMaybe<Archive_Utility_Server_Obj_Rel_Insert_Input>;
  server_id?: InputMaybe<Scalars['String']>;
  updated_at?: InputMaybe<Scalars['timestamptz']>;
};

/** aggregate max on columns */
export type Archive_Utility_Archive_Max_Fields = {
  __typename?: 'archive_utility_archive_max_fields';
  channel_id?: Maybe<Scalars['String']>;
  channel_name?: Maybe<Scalars['String']>;
  created_at?: Maybe<Scalars['timestamptz']>;
  id?: Maybe<Scalars['uuid']>;
  message_count?: Maybe<Scalars['Int']>;
  performed_by?: Maybe<Scalars['String']>;
  server_id?: Maybe<Scalars['String']>;
  updated_at?: Maybe<Scalars['timestamptz']>;
};

/** order by max() on columns of table "archive_utility.archive" */
export type Archive_Utility_Archive_Max_Order_By = {
  channel_id?: InputMaybe<Order_By>;
  channel_name?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  message_count?: InputMaybe<Order_By>;
  performed_by?: InputMaybe<Order_By>;
  server_id?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** aggregate min on columns */
export type Archive_Utility_Archive_Min_Fields = {
  __typename?: 'archive_utility_archive_min_fields';
  channel_id?: Maybe<Scalars['String']>;
  channel_name?: Maybe<Scalars['String']>;
  created_at?: Maybe<Scalars['timestamptz']>;
  id?: Maybe<Scalars['uuid']>;
  message_count?: Maybe<Scalars['Int']>;
  performed_by?: Maybe<Scalars['String']>;
  server_id?: Maybe<Scalars['String']>;
  updated_at?: Maybe<Scalars['timestamptz']>;
};

/** order by min() on columns of table "archive_utility.archive" */
export type Archive_Utility_Archive_Min_Order_By = {
  channel_id?: InputMaybe<Order_By>;
  channel_name?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  message_count?: InputMaybe<Order_By>;
  performed_by?: InputMaybe<Order_By>;
  server_id?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** response of any mutation on the table "archive_utility.archive" */
export type Archive_Utility_Archive_Mutation_Response = {
  __typename?: 'archive_utility_archive_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int'];
  /** data from the rows affected by the mutation */
  returning: Array<Archive_Utility_Archive>;
};

/** on conflict condition type for table "archive_utility.archive" */
export type Archive_Utility_Archive_On_Conflict = {
  constraint: Archive_Utility_Archive_Constraint;
  update_columns?: Array<Archive_Utility_Archive_Update_Column>;
  where?: InputMaybe<Archive_Utility_Archive_Bool_Exp>;
};

/** Ordering options when selecting data from "archive_utility.archive". */
export type Archive_Utility_Archive_Order_By = {
  channel_id?: InputMaybe<Order_By>;
  channel_name?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  message_count?: InputMaybe<Order_By>;
  performed_by?: InputMaybe<Order_By>;
  server?: InputMaybe<Archive_Utility_Server_Order_By>;
  server_id?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** primary key columns input for table: archive_utility_archive */
export type Archive_Utility_Archive_Pk_Columns_Input = {
  id: Scalars['uuid'];
};

/** select columns of table "archive_utility.archive" */
export enum Archive_Utility_Archive_Select_Column {
  /** column name */
  ChannelId = 'channel_id',
  /** column name */
  ChannelName = 'channel_name',
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  Id = 'id',
  /** column name */
  MessageCount = 'message_count',
  /** column name */
  PerformedBy = 'performed_by',
  /** column name */
  ServerId = 'server_id',
  /** column name */
  UpdatedAt = 'updated_at'
}

/** input type for updating data in table "archive_utility.archive" */
export type Archive_Utility_Archive_Set_Input = {
  channel_id?: InputMaybe<Scalars['String']>;
  channel_name?: InputMaybe<Scalars['String']>;
  created_at?: InputMaybe<Scalars['timestamptz']>;
  id?: InputMaybe<Scalars['uuid']>;
  message_count?: InputMaybe<Scalars['Int']>;
  performed_by?: InputMaybe<Scalars['String']>;
  server_id?: InputMaybe<Scalars['String']>;
  updated_at?: InputMaybe<Scalars['timestamptz']>;
};

/** aggregate stddev on columns */
export type Archive_Utility_Archive_Stddev_Fields = {
  __typename?: 'archive_utility_archive_stddev_fields';
  message_count?: Maybe<Scalars['Float']>;
};

/** order by stddev() on columns of table "archive_utility.archive" */
export type Archive_Utility_Archive_Stddev_Order_By = {
  message_count?: InputMaybe<Order_By>;
};

/** aggregate stddev_pop on columns */
export type Archive_Utility_Archive_Stddev_Pop_Fields = {
  __typename?: 'archive_utility_archive_stddev_pop_fields';
  message_count?: Maybe<Scalars['Float']>;
};

/** order by stddev_pop() on columns of table "archive_utility.archive" */
export type Archive_Utility_Archive_Stddev_Pop_Order_By = {
  message_count?: InputMaybe<Order_By>;
};

/** aggregate stddev_samp on columns */
export type Archive_Utility_Archive_Stddev_Samp_Fields = {
  __typename?: 'archive_utility_archive_stddev_samp_fields';
  message_count?: Maybe<Scalars['Float']>;
};

/** order by stddev_samp() on columns of table "archive_utility.archive" */
export type Archive_Utility_Archive_Stddev_Samp_Order_By = {
  message_count?: InputMaybe<Order_By>;
};

/** aggregate sum on columns */
export type Archive_Utility_Archive_Sum_Fields = {
  __typename?: 'archive_utility_archive_sum_fields';
  message_count?: Maybe<Scalars['Int']>;
};

/** order by sum() on columns of table "archive_utility.archive" */
export type Archive_Utility_Archive_Sum_Order_By = {
  message_count?: InputMaybe<Order_By>;
};

/** update columns of table "archive_utility.archive" */
export enum Archive_Utility_Archive_Update_Column {
  /** column name */
  ChannelId = 'channel_id',
  /** column name */
  ChannelName = 'channel_name',
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  Id = 'id',
  /** column name */
  MessageCount = 'message_count',
  /** column name */
  PerformedBy = 'performed_by',
  /** column name */
  ServerId = 'server_id',
  /** column name */
  UpdatedAt = 'updated_at'
}

/** aggregate var_pop on columns */
export type Archive_Utility_Archive_Var_Pop_Fields = {
  __typename?: 'archive_utility_archive_var_pop_fields';
  message_count?: Maybe<Scalars['Float']>;
};

/** order by var_pop() on columns of table "archive_utility.archive" */
export type Archive_Utility_Archive_Var_Pop_Order_By = {
  message_count?: InputMaybe<Order_By>;
};

/** aggregate var_samp on columns */
export type Archive_Utility_Archive_Var_Samp_Fields = {
  __typename?: 'archive_utility_archive_var_samp_fields';
  message_count?: Maybe<Scalars['Float']>;
};

/** order by var_samp() on columns of table "archive_utility.archive" */
export type Archive_Utility_Archive_Var_Samp_Order_By = {
  message_count?: InputMaybe<Order_By>;
};

/** aggregate variance on columns */
export type Archive_Utility_Archive_Variance_Fields = {
  __typename?: 'archive_utility_archive_variance_fields';
  message_count?: Maybe<Scalars['Float']>;
};

/** order by variance() on columns of table "archive_utility.archive" */
export type Archive_Utility_Archive_Variance_Order_By = {
  message_count?: InputMaybe<Order_By>;
};

/** columns and relationships of "archive_utility.server" */
export type Archive_Utility_Server = {
  __typename?: 'archive_utility_server';
  archive_channel?: Maybe<Scalars['String']>;
  /** An array relationship */
  archives: Array<Archive_Utility_Archive>;
  /** An aggregate relationship */
  archives_aggregate: Archive_Utility_Archive_Aggregate;
  created_at: Scalars['timestamptz'];
  id: Scalars['String'];
  updated_at: Scalars['timestamptz'];
};


/** columns and relationships of "archive_utility.server" */
export type Archive_Utility_ServerArchivesArgs = {
  distinct_on?: InputMaybe<Array<Archive_Utility_Archive_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Archive_Utility_Archive_Order_By>>;
  where?: InputMaybe<Archive_Utility_Archive_Bool_Exp>;
};


/** columns and relationships of "archive_utility.server" */
export type Archive_Utility_ServerArchives_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Archive_Utility_Archive_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Archive_Utility_Archive_Order_By>>;
  where?: InputMaybe<Archive_Utility_Archive_Bool_Exp>;
};

/** aggregated selection of "archive_utility.server" */
export type Archive_Utility_Server_Aggregate = {
  __typename?: 'archive_utility_server_aggregate';
  aggregate?: Maybe<Archive_Utility_Server_Aggregate_Fields>;
  nodes: Array<Archive_Utility_Server>;
};

/** aggregate fields of "archive_utility.server" */
export type Archive_Utility_Server_Aggregate_Fields = {
  __typename?: 'archive_utility_server_aggregate_fields';
  count: Scalars['Int'];
  max?: Maybe<Archive_Utility_Server_Max_Fields>;
  min?: Maybe<Archive_Utility_Server_Min_Fields>;
};


/** aggregate fields of "archive_utility.server" */
export type Archive_Utility_Server_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Archive_Utility_Server_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']>;
};

/** Boolean expression to filter rows from the table "archive_utility.server". All fields are combined with a logical 'AND'. */
export type Archive_Utility_Server_Bool_Exp = {
  _and?: InputMaybe<Array<Archive_Utility_Server_Bool_Exp>>;
  _not?: InputMaybe<Archive_Utility_Server_Bool_Exp>;
  _or?: InputMaybe<Array<Archive_Utility_Server_Bool_Exp>>;
  archive_channel?: InputMaybe<String_Comparison_Exp>;
  archives?: InputMaybe<Archive_Utility_Archive_Bool_Exp>;
  created_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  id?: InputMaybe<String_Comparison_Exp>;
  updated_at?: InputMaybe<Timestamptz_Comparison_Exp>;
};

/** unique or primary key constraints on table "archive_utility.server" */
export enum Archive_Utility_Server_Constraint {
  /** unique or primary key constraint */
  ServerPkey = 'server_pkey'
}

/** input type for inserting data into table "archive_utility.server" */
export type Archive_Utility_Server_Insert_Input = {
  archive_channel?: InputMaybe<Scalars['String']>;
  archives?: InputMaybe<Archive_Utility_Archive_Arr_Rel_Insert_Input>;
  created_at?: InputMaybe<Scalars['timestamptz']>;
  id?: InputMaybe<Scalars['String']>;
  updated_at?: InputMaybe<Scalars['timestamptz']>;
};

/** aggregate max on columns */
export type Archive_Utility_Server_Max_Fields = {
  __typename?: 'archive_utility_server_max_fields';
  archive_channel?: Maybe<Scalars['String']>;
  created_at?: Maybe<Scalars['timestamptz']>;
  id?: Maybe<Scalars['String']>;
  updated_at?: Maybe<Scalars['timestamptz']>;
};

/** aggregate min on columns */
export type Archive_Utility_Server_Min_Fields = {
  __typename?: 'archive_utility_server_min_fields';
  archive_channel?: Maybe<Scalars['String']>;
  created_at?: Maybe<Scalars['timestamptz']>;
  id?: Maybe<Scalars['String']>;
  updated_at?: Maybe<Scalars['timestamptz']>;
};

/** response of any mutation on the table "archive_utility.server" */
export type Archive_Utility_Server_Mutation_Response = {
  __typename?: 'archive_utility_server_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int'];
  /** data from the rows affected by the mutation */
  returning: Array<Archive_Utility_Server>;
};

/** input type for inserting object relation for remote table "archive_utility.server" */
export type Archive_Utility_Server_Obj_Rel_Insert_Input = {
  data: Archive_Utility_Server_Insert_Input;
  /** on conflict condition */
  on_conflict?: InputMaybe<Archive_Utility_Server_On_Conflict>;
};

/** on conflict condition type for table "archive_utility.server" */
export type Archive_Utility_Server_On_Conflict = {
  constraint: Archive_Utility_Server_Constraint;
  update_columns?: Array<Archive_Utility_Server_Update_Column>;
  where?: InputMaybe<Archive_Utility_Server_Bool_Exp>;
};

/** Ordering options when selecting data from "archive_utility.server". */
export type Archive_Utility_Server_Order_By = {
  archive_channel?: InputMaybe<Order_By>;
  archives_aggregate?: InputMaybe<Archive_Utility_Archive_Aggregate_Order_By>;
  created_at?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** primary key columns input for table: archive_utility_server */
export type Archive_Utility_Server_Pk_Columns_Input = {
  id: Scalars['String'];
};

/** select columns of table "archive_utility.server" */
export enum Archive_Utility_Server_Select_Column {
  /** column name */
  ArchiveChannel = 'archive_channel',
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  Id = 'id',
  /** column name */
  UpdatedAt = 'updated_at'
}

/** input type for updating data in table "archive_utility.server" */
export type Archive_Utility_Server_Set_Input = {
  archive_channel?: InputMaybe<Scalars['String']>;
  created_at?: InputMaybe<Scalars['timestamptz']>;
  id?: InputMaybe<Scalars['String']>;
  updated_at?: InputMaybe<Scalars['timestamptz']>;
};

/** update columns of table "archive_utility.server" */
export enum Archive_Utility_Server_Update_Column {
  /** column name */
  ArchiveChannel = 'archive_channel',
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  Id = 'id',
  /** column name */
  UpdatedAt = 'updated_at'
}

/** mutation root */
export type Mutation_Root = {
  __typename?: 'mutation_root';
  /** delete data from the table: "archive_utility.archive" */
  delete_archive_utility_archive?: Maybe<Archive_Utility_Archive_Mutation_Response>;
  /** delete single row from the table: "archive_utility.archive" */
  delete_archive_utility_archive_by_pk?: Maybe<Archive_Utility_Archive>;
  /** delete data from the table: "archive_utility.server" */
  delete_archive_utility_server?: Maybe<Archive_Utility_Server_Mutation_Response>;
  /** delete single row from the table: "archive_utility.server" */
  delete_archive_utility_server_by_pk?: Maybe<Archive_Utility_Server>;
  /** insert data into the table: "archive_utility.archive" */
  insert_archive_utility_archive?: Maybe<Archive_Utility_Archive_Mutation_Response>;
  /** insert a single row into the table: "archive_utility.archive" */
  insert_archive_utility_archive_one?: Maybe<Archive_Utility_Archive>;
  /** insert data into the table: "archive_utility.server" */
  insert_archive_utility_server?: Maybe<Archive_Utility_Server_Mutation_Response>;
  /** insert a single row into the table: "archive_utility.server" */
  insert_archive_utility_server_one?: Maybe<Archive_Utility_Server>;
  /** update data of the table: "archive_utility.archive" */
  update_archive_utility_archive?: Maybe<Archive_Utility_Archive_Mutation_Response>;
  /** update single row of the table: "archive_utility.archive" */
  update_archive_utility_archive_by_pk?: Maybe<Archive_Utility_Archive>;
  /** update data of the table: "archive_utility.server" */
  update_archive_utility_server?: Maybe<Archive_Utility_Server_Mutation_Response>;
  /** update single row of the table: "archive_utility.server" */
  update_archive_utility_server_by_pk?: Maybe<Archive_Utility_Server>;
};


/** mutation root */
export type Mutation_RootDelete_Archive_Utility_ArchiveArgs = {
  where: Archive_Utility_Archive_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Archive_Utility_Archive_By_PkArgs = {
  id: Scalars['uuid'];
};


/** mutation root */
export type Mutation_RootDelete_Archive_Utility_ServerArgs = {
  where: Archive_Utility_Server_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Archive_Utility_Server_By_PkArgs = {
  id: Scalars['String'];
};


/** mutation root */
export type Mutation_RootInsert_Archive_Utility_ArchiveArgs = {
  objects: Array<Archive_Utility_Archive_Insert_Input>;
  on_conflict?: InputMaybe<Archive_Utility_Archive_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Archive_Utility_Archive_OneArgs = {
  object: Archive_Utility_Archive_Insert_Input;
  on_conflict?: InputMaybe<Archive_Utility_Archive_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Archive_Utility_ServerArgs = {
  objects: Array<Archive_Utility_Server_Insert_Input>;
  on_conflict?: InputMaybe<Archive_Utility_Server_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Archive_Utility_Server_OneArgs = {
  object: Archive_Utility_Server_Insert_Input;
  on_conflict?: InputMaybe<Archive_Utility_Server_On_Conflict>;
};


/** mutation root */
export type Mutation_RootUpdate_Archive_Utility_ArchiveArgs = {
  _inc?: InputMaybe<Archive_Utility_Archive_Inc_Input>;
  _set?: InputMaybe<Archive_Utility_Archive_Set_Input>;
  where: Archive_Utility_Archive_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Archive_Utility_Archive_By_PkArgs = {
  _inc?: InputMaybe<Archive_Utility_Archive_Inc_Input>;
  _set?: InputMaybe<Archive_Utility_Archive_Set_Input>;
  pk_columns: Archive_Utility_Archive_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Archive_Utility_ServerArgs = {
  _set?: InputMaybe<Archive_Utility_Server_Set_Input>;
  where: Archive_Utility_Server_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Archive_Utility_Server_By_PkArgs = {
  _set?: InputMaybe<Archive_Utility_Server_Set_Input>;
  pk_columns: Archive_Utility_Server_Pk_Columns_Input;
};

/** column ordering options */
export enum Order_By {
  /** in ascending order, nulls last */
  Asc = 'asc',
  /** in ascending order, nulls first */
  AscNullsFirst = 'asc_nulls_first',
  /** in ascending order, nulls last */
  AscNullsLast = 'asc_nulls_last',
  /** in descending order, nulls first */
  Desc = 'desc',
  /** in descending order, nulls first */
  DescNullsFirst = 'desc_nulls_first',
  /** in descending order, nulls last */
  DescNullsLast = 'desc_nulls_last'
}

export type Query_Root = {
  __typename?: 'query_root';
  /** fetch data from the table: "archive_utility.archive" */
  archive_utility_archive: Array<Archive_Utility_Archive>;
  /** fetch aggregated fields from the table: "archive_utility.archive" */
  archive_utility_archive_aggregate: Archive_Utility_Archive_Aggregate;
  /** fetch data from the table: "archive_utility.archive" using primary key columns */
  archive_utility_archive_by_pk?: Maybe<Archive_Utility_Archive>;
  /** fetch data from the table: "archive_utility.server" */
  archive_utility_server: Array<Archive_Utility_Server>;
  /** fetch aggregated fields from the table: "archive_utility.server" */
  archive_utility_server_aggregate: Archive_Utility_Server_Aggregate;
  /** fetch data from the table: "archive_utility.server" using primary key columns */
  archive_utility_server_by_pk?: Maybe<Archive_Utility_Server>;
};


export type Query_RootArchive_Utility_ArchiveArgs = {
  distinct_on?: InputMaybe<Array<Archive_Utility_Archive_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Archive_Utility_Archive_Order_By>>;
  where?: InputMaybe<Archive_Utility_Archive_Bool_Exp>;
};


export type Query_RootArchive_Utility_Archive_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Archive_Utility_Archive_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Archive_Utility_Archive_Order_By>>;
  where?: InputMaybe<Archive_Utility_Archive_Bool_Exp>;
};


export type Query_RootArchive_Utility_Archive_By_PkArgs = {
  id: Scalars['uuid'];
};


export type Query_RootArchive_Utility_ServerArgs = {
  distinct_on?: InputMaybe<Array<Archive_Utility_Server_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Archive_Utility_Server_Order_By>>;
  where?: InputMaybe<Archive_Utility_Server_Bool_Exp>;
};


export type Query_RootArchive_Utility_Server_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Archive_Utility_Server_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Archive_Utility_Server_Order_By>>;
  where?: InputMaybe<Archive_Utility_Server_Bool_Exp>;
};


export type Query_RootArchive_Utility_Server_By_PkArgs = {
  id: Scalars['String'];
};

export type Subscription_Root = {
  __typename?: 'subscription_root';
  /** fetch data from the table: "archive_utility.archive" */
  archive_utility_archive: Array<Archive_Utility_Archive>;
  /** fetch aggregated fields from the table: "archive_utility.archive" */
  archive_utility_archive_aggregate: Archive_Utility_Archive_Aggregate;
  /** fetch data from the table: "archive_utility.archive" using primary key columns */
  archive_utility_archive_by_pk?: Maybe<Archive_Utility_Archive>;
  /** fetch data from the table: "archive_utility.server" */
  archive_utility_server: Array<Archive_Utility_Server>;
  /** fetch aggregated fields from the table: "archive_utility.server" */
  archive_utility_server_aggregate: Archive_Utility_Server_Aggregate;
  /** fetch data from the table: "archive_utility.server" using primary key columns */
  archive_utility_server_by_pk?: Maybe<Archive_Utility_Server>;
};


export type Subscription_RootArchive_Utility_ArchiveArgs = {
  distinct_on?: InputMaybe<Array<Archive_Utility_Archive_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Archive_Utility_Archive_Order_By>>;
  where?: InputMaybe<Archive_Utility_Archive_Bool_Exp>;
};


export type Subscription_RootArchive_Utility_Archive_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Archive_Utility_Archive_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Archive_Utility_Archive_Order_By>>;
  where?: InputMaybe<Archive_Utility_Archive_Bool_Exp>;
};


export type Subscription_RootArchive_Utility_Archive_By_PkArgs = {
  id: Scalars['uuid'];
};


export type Subscription_RootArchive_Utility_ServerArgs = {
  distinct_on?: InputMaybe<Array<Archive_Utility_Server_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Archive_Utility_Server_Order_By>>;
  where?: InputMaybe<Archive_Utility_Server_Bool_Exp>;
};


export type Subscription_RootArchive_Utility_Server_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Archive_Utility_Server_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Archive_Utility_Server_Order_By>>;
  where?: InputMaybe<Archive_Utility_Server_Bool_Exp>;
};


export type Subscription_RootArchive_Utility_Server_By_PkArgs = {
  id: Scalars['String'];
};

/** Boolean expression to compare columns of type "timestamptz". All fields are combined with logical 'AND'. */
export type Timestamptz_Comparison_Exp = {
  _eq?: InputMaybe<Scalars['timestamptz']>;
  _gt?: InputMaybe<Scalars['timestamptz']>;
  _gte?: InputMaybe<Scalars['timestamptz']>;
  _in?: InputMaybe<Array<Scalars['timestamptz']>>;
  _is_null?: InputMaybe<Scalars['Boolean']>;
  _lt?: InputMaybe<Scalars['timestamptz']>;
  _lte?: InputMaybe<Scalars['timestamptz']>;
  _neq?: InputMaybe<Scalars['timestamptz']>;
  _nin?: InputMaybe<Array<Scalars['timestamptz']>>;
};

/** Boolean expression to compare columns of type "uuid". All fields are combined with logical 'AND'. */
export type Uuid_Comparison_Exp = {
  _eq?: InputMaybe<Scalars['uuid']>;
  _gt?: InputMaybe<Scalars['uuid']>;
  _gte?: InputMaybe<Scalars['uuid']>;
  _in?: InputMaybe<Array<Scalars['uuid']>>;
  _is_null?: InputMaybe<Scalars['Boolean']>;
  _lt?: InputMaybe<Scalars['uuid']>;
  _lte?: InputMaybe<Scalars['uuid']>;
  _neq?: InputMaybe<Scalars['uuid']>;
  _nin?: InputMaybe<Array<Scalars['uuid']>>;
};

export type CreateArchiveMutationVariables = Exact<{
  options: Archive_Utility_Archive_Insert_Input;
}>;


export type CreateArchiveMutation = { __typename?: 'mutation_root', insert_archive_utility_archive_one?: { __typename?: 'archive_utility_archive', id: string, performed_by: string, channel_name: string, channel_id: string, created_at: any, server_id: string } | null | undefined };

export type CreateServerMutationVariables = Exact<{
  id: Scalars['String'];
}>;


export type CreateServerMutation = { __typename?: 'mutation_root', insert_archive_utility_server_one?: { __typename?: 'archive_utility_server', id: string, created_at: any, archive_channel?: string | null | undefined } | null | undefined };

export type UpdateArchiveChannelMutationVariables = Exact<{
  server_id: Scalars['String'];
  archive_id?: InputMaybe<Scalars['String']>;
}>;


export type UpdateArchiveChannelMutation = { __typename?: 'mutation_root', update_archive_utility_server_by_pk?: { __typename?: 'archive_utility_server', id: string, archive_channel?: string | null | undefined, updated_at: any } | null | undefined };

export type UpsertServerMutationVariables = Exact<{
  id: Scalars['String'];
}>;


export type UpsertServerMutation = { __typename?: 'mutation_root', insert_archive_utility_server?: { __typename?: 'archive_utility_server_mutation_response', returning: Array<{ __typename?: 'archive_utility_server', id: string, archive_channel?: string | null | undefined, created_at: any, updated_at: any }> } | null | undefined };

export type GetServerByPkQueryVariables = Exact<{
  id: Scalars['String'];
}>;


export type GetServerByPkQuery = { __typename?: 'query_root', archive_utility_server_by_pk?: { __typename?: 'archive_utility_server', id: string, created_at: any, updated_at: any, archive_channel?: string | null | undefined } | null | undefined };


export const CreateArchiveDocument = gql`
    mutation CreateArchive($options: archive_utility_archive_insert_input!) {
  insert_archive_utility_archive_one(object: $options) {
    id
    performed_by
    channel_name
    channel_id
    created_at
    server_id
  }
}
    `;
export const CreateServerDocument = gql`
    mutation CreateServer($id: String!) {
  insert_archive_utility_server_one(object: {id: $id}) {
    id
    created_at
    archive_channel
  }
}
    `;
export const UpdateArchiveChannelDocument = gql`
    mutation UpdateArchiveChannel($server_id: String!, $archive_id: String) {
  update_archive_utility_server_by_pk(
    pk_columns: {id: $server_id}
    _set: {archive_channel: $archive_id}
  ) {
    id
    archive_channel
    updated_at
  }
}
    `;
export const UpsertServerDocument = gql`
    mutation UpsertServer($id: String!) {
  insert_archive_utility_server(
    objects: {id: $id}
    on_conflict: {constraint: server_pkey, update_columns: [updated_at]}
  ) {
    returning {
      id
      archive_channel
      created_at
      updated_at
    }
  }
}
    `;
export const GetServerByPkDocument = gql`
    query GetServerByPk($id: String!) {
  archive_utility_server_by_pk(id: $id) {
    id
    created_at
    updated_at
    archive_channel
  }
}
    `;

export type SdkFunctionWrapper = <T>(action: (requestHeaders?:Record<string, string>) => Promise<T>, operationName: string) => Promise<T>;


const defaultWrapper: SdkFunctionWrapper = (action, _operationName) => action();

export function getSdk(client: GraphQLClient, withWrapper: SdkFunctionWrapper = defaultWrapper) {
  return {
    CreateArchive(variables: CreateArchiveMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<CreateArchiveMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<CreateArchiveMutation>(CreateArchiveDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'CreateArchive');
    },
    CreateServer(variables: CreateServerMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<CreateServerMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<CreateServerMutation>(CreateServerDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'CreateServer');
    },
    UpdateArchiveChannel(variables: UpdateArchiveChannelMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<UpdateArchiveChannelMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<UpdateArchiveChannelMutation>(UpdateArchiveChannelDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'UpdateArchiveChannel');
    },
    UpsertServer(variables: UpsertServerMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<UpsertServerMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<UpsertServerMutation>(UpsertServerDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'UpsertServer');
    },
    GetServerByPk(variables: GetServerByPkQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<GetServerByPkQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<GetServerByPkQuery>(GetServerByPkDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'GetServerByPk');
    }
  };
}
export type Sdk = ReturnType<typeof getSdk>;