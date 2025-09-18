// @generated automatically by Diesel CLI.

diesel::table! {
    sms (id) {
        id -> Int4,
        recipient -> Text,
        content -> Text,
        created_at -> Timestamp,
    }
}

diesel::table! {
    sms_logs (id) {
        id -> Int4,
        recipient -> Varchar,
        message -> Text,
        status -> Varchar,
        created_at -> Timestamp,
    }
}

diesel::allow_tables_to_appear_in_same_query!(sms, sms_logs,);
