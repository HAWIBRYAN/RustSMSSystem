use diesel::prelude::*;
use serde::{Deserialize, Serialize};
use crate::schema::sms;

#[derive(Queryable, Serialize)]
pub struct Sms {
    pub id: i32,
    pub recipient: String,
    pub content: String,
    pub created_at: chrono::NaiveDateTime,
}

#[derive(Insertable, Deserialize)]
#[diesel(table_name = sms)]
pub struct NewSms {
    pub recipient: String,
    pub content: String,
}
