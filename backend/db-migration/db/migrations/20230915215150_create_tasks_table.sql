-- migrate:up
CREATE TABLE tasks (
    id integer primary key autoincrement, 
    title varchar(100) not null,
    detail varchar(255),
    priority varchar(50),
    due_at datetime,
    created_at datetime default current_timestamp
);


-- migrate:down
DROP TABLE IF EXISTS tasks;
