CREATE TABLE isadmin (
    uid varchar(64),
    isadmin bool not null default 0,
    FOREIGN KEY (uid) REFERENCES users(uid),
    PRIMARY KEY (uid))
    ENGINE=MyISAM DEFAULT CHARSET=latin1;

CREATE TABLE certificates (
    serial INTEGER ,
    uid varchar(64),
    pem_encoding varchar(32768) not null,
    revoked bool not null default 0,
    FOREIGN KEY (uid) REFERENCES users(uid),
    PRIMARY KEY (serial))
    ENGINE=MyISAM DEFAULT CHARSET=latin1;

create user certmanager@172.27.0.2 identified by 'SniaVj5YQnKSXXVu';
create user dbackup@localhost identified by 'HpDMDF2dQexqGZQcag8D';
grant insert on imovies.users to certmanager@172.27.0.2;
grant insert on imovies.isadmin to certmanager@172.27.0.2;
grant insert on imovies.certificates to certmanager@172.27.0.2;
grant update on imovies.users to certmanager@172.27.0.2;
grant update on imovies.isadmin to certmanager@172.27.0.2;
grant update on imovies.certificates to certmanager@172.27.0.2;
grant select on imovies.users to certmanager@172.27.0.2;
grant select on imovies.isadmin to certmanager@172.27.0.2;
grant select on imovies.certificates to certmanager@172.27.0.2;
grant select on imovies.users to dbackup@localhost;
grant select on imovies.isadmin to dbackup@localhost;
grant select on imovies.certificates to dbackup@localhost;
grant lock tables on *.* to dbackup@localhost;
grant trigger on *.* to dbackup@localhost;
grant process on *.* to dbackup@localhost;
flush privileges;

insert into isadmin select uid,0 from users;
update isadmin SET isadmin=1 WHERE uid="ps";

delimiter |
CREATE TRIGGER isadminInsert AFTER INSERT ON users
    FOR EACH ROW
BEGIN
    INSERT INTO isadmin values (new.uid, 0);
END; |
delimiter ;

